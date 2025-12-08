import {
    doc,
    onSnapshot,
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    serverTimestamp,
    limit
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePurchase } from '../contexts/PurchaseContext';
import { db } from '../lib/firebase';
import { Alert } from 'react-native';

export interface BuddyChallengeState {
    active: boolean;
    buddyUid?: string;
    buddyName?: string;
    myMissedSessions: number;
    buddyMissedSessions: number;
    status: 'ongoing' | 'won' | 'lost';
}

export interface BuddyRequest {
    id: string;
    fromUid: string;
    fromName: string;
    fromEmail: string;
    createdAt: any;
}

export function useBeBuddy() {
    const { user } = useAuth();
    const [buddyState, setBuddyState] = useState<BuddyChallengeState | null>(null);
    const [incomingRequests, setIncomingRequests] = useState<BuddyRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [buddyStats, setBuddyStats] = useState<{ bloomDays: number } | null>(null);
    const { isPro } = usePurchase();
    const [userRole, setUserRole] = useState<'user' | 'therapist'>('user');

    // 1. Listen to My User Doc for Buddy State & Incoming Requests & Role
    useEffect(() => {
        if (!user) {
            setLoading(false);
            return;
        }

        const userRef = doc(db, 'users', user.uid);
        const unsubUser = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setBuddyState(data.buddyChallenge || null);
                setUserRole(data.role || 'user');
            }
        });

        const requestsRef = collection(db, 'buddy_requests');
        const q = query(
            requestsRef,
            where('toUid', '==', user.uid),
            where('status', '==', 'pending')
        );

        const unsubRequests = onSnapshot(q, (snapshot) => {
            const reqs: BuddyRequest[] = [];
            snapshot.forEach(doc => {
                reqs.push({ id: doc.id, ...doc.data() } as BuddyRequest);
            });
            setIncomingRequests(reqs);
            setLoading(false);
        });

        return () => {
            unsubUser();
            unsubRequests();
        };
    }, [user]);

    // 2. Listen to Active Buddy's Stats
    useEffect(() => {
        if (!buddyState || !buddyState.active || !buddyState.buddyUid) {
            setBuddyStats(null);
            return;
        }

        const buddyRef = doc(db, 'users', buddyState.buddyUid);
        const unsubBuddy = onSnapshot(buddyRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setBuddyStats({
                    bloomDays: data.bePractice?.bloomDays || 0
                });
            }
        });

        return () => unsubBuddy();
    }, [buddyState]);

    const sendBuddyInvite = async (email: string) => {
        if (!user) return;

        // Limit Checks
        if (!isPro) {
            if (userRole === 'therapist') {
                // Placeholder for therapist limits
            } else {
                if (buddyState && buddyState.active) {
                    Alert.alert('Limit Reached', 'You already have an active buddy. Finish this challenge first.');
                    return;
                }
            }
        }

        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', email.toLowerCase().trim()), limit(1));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                Alert.alert('User not found', 'No user found with that email address.');
                return;
            }

            const targetUserDoc = querySnapshot.docs[0];
            const targetUid = targetUserDoc.id;
            const targetData = targetUserDoc.data();

            if (targetUid === user.uid) {
                Alert.alert('Error', 'You cannot invite yourself.');
                return;
            }

            await addDoc(collection(db, 'buddy_requests'), {
                fromUid: user.uid,
                fromName: user.displayName || 'Friend',
                fromEmail: user.email,
                toUid: targetUid,
                status: 'pending',
                createdAt: serverTimestamp()
            });

            Alert.alert('Success', `Invitation sent to ${targetData.displayName || email}!`);

        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', 'Failed to send invite. ' + error.message);
        }
    };

    const acceptBuddyRequest = async (request: BuddyRequest) => {
        if (!user) return;

        try {
            const myRef = doc(db, 'users', user.uid);
            const myChallengeState: BuddyChallengeState = {
                active: true,
                buddyUid: request.fromUid,
                buddyName: request.fromName,
                myMissedSessions: 0,
                buddyMissedSessions: 0,
                status: 'ongoing'
            };

            const senderRef = doc(db, 'users', request.fromUid);
            const senderChallengeState: BuddyChallengeState = {
                active: true,
                buddyUid: user.uid,
                buddyName: user.displayName || 'Friend',
                myMissedSessions: 0,
                buddyMissedSessions: 0,
                status: 'ongoing'
            };

            await Promise.all([
                updateDoc(myRef, { buddyChallenge: myChallengeState }),
                updateDoc(senderRef, { buddyChallenge: senderChallengeState }),
                updateDoc(doc(db, 'buddy_requests', request.id), { status: 'accepted' })
            ]);

            Alert.alert('Connected!', 'You are now BE Buddies!');

        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', 'Failed to accept invite.');
        }
    };

    return {
        buddyState,
        buddyStats,
        incomingRequests,
        loading,
        sendBuddyInvite,
        acceptBuddyRequest
    };
}
