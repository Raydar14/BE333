import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Image, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput } from 'react-native';
import { Link, useRouter, useLocalSearchParams } from 'expo-router';
import { stashPendingInvite } from '../../hooks/usePendingInvite';
import { Mail, Lock, User, Award, ShieldCheck } from 'lucide-react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { Colors } from '../../constants/Colors';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useProtectedRoute } from '../../hooks/useProtectedRoute';

export default function Signup() {
    useProtectedRoute();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'user' | 'therapist'>('user');
    const [loading, setLoading] = useState(false);
    // Therapist-only fields (see Manual Part 3 · Therapist Layer)
    const [licenseInfo, setLicenseInfo] = useState('');
    const [hipaaAgreed, setHipaaAgreed] = useState(false);
    const router = useRouter();
    const params = useLocalSearchParams();

    // If the user arrived from a BE Guide's invite link (e.g. /signup?invite=AB2CDE9F),
    // stash the code so it can be consumed after signup completes.
    useEffect(() => {
        const raw = (params.invite ?? params.code);
        const code = Array.isArray(raw) ? raw[0] : raw;
        if (code) stashPendingInvite(String(code));
    }, [params.invite, params.code]);

    async function signUpWithEmail() {
        if (role === 'therapist' && !hipaaAgreed) {
            Alert.alert(
                'One thing left',
                'Please confirm the data-handling acknowledgment before creating your BE Guide account.'
            );
            return;
        }
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await updateProfile(user, { displayName: name });

            const { doc, setDoc } = await import('firebase/firestore');
            const { db } = await import('../../lib/firebase');

            const baseDoc: Record<string, unknown> = {
                uid: user.uid,
                email: user.email,
                displayName: name,
                createdAt: new Date().toISOString(),
                provider: 'email',
                role: role,
                isPremium: false,
            };

            if (role === 'therapist') {
                baseDoc.licenseInfo = licenseInfo.trim() || null;
                baseDoc.hipaaAgreedAt = new Date().toISOString();
                // Free tier by default; upgrading to Pro through PaywallModal
                baseDoc.purchaseTier = 'free';
            }

            await setDoc(doc(db, 'users', user.uid), baseDoc);

            Alert.alert('Success', 'Account created! Signing you in...');
            router.replace('/');
        } catch (error: unknown) {
            console.error("Signup Error:", error);
            Alert.alert('Error', error instanceof Error ? error.message : 'Sign up failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Image
                        source={require('../../assets/images/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.form}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join the BE333 Community</Text>

                    <View style={styles.roleContainer}>
                        <Text style={styles.label}>I am a:</Text>
                        <View style={styles.roleButtons}>
                            <TouchableOpacity
                                style={[styles.roleBtn, role === 'user' && styles.roleBtnActive]}
                                onPress={() => setRole('user')}
                            >
                                <Text style={[styles.roleText, role === 'user' && styles.roleTextActive]}>Member</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.roleBtn, role === 'therapist' && styles.roleBtnActive]}
                                onPress={() => setRole('therapist')}
                            >
                                <Text style={[styles.roleText, role === 'therapist' && styles.roleTextActive]}>Therapist</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Input
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                        icon={User}
                    />
                    <Input
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        icon={Mail}
                    />
                    <Input
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        icon={Lock}
                    />

                    {role === 'therapist' && (
                        <View style={styles.therapistBlock}>
                            <Text style={styles.therapistBlockTitle}>BE Guide details</Text>
                            <Text style={styles.therapistBlockHint}>
                                Shown to clients when they choose to link. Self-attested; not verified by BE333.
                            </Text>

                            <Input
                                placeholder="License / registration # (LMFT, LCSW, intern, etc.)"
                                value={licenseInfo}
                                onChangeText={setLicenseInfo}
                                autoCapitalize="characters"
                                icon={Award}
                            />
                            <Text style={styles.therapistBlockHint}>
                                Any number a client can look you up by — LMFT/LCSW license,
                                registered intern number, associate social worker number, board
                                registration, etc. Your name works too, but it's less specific.
                            </Text>

                            <TouchableOpacity
                                style={styles.hipaaRow}
                                onPress={() => setHipaaAgreed(!hipaaAgreed)}
                                activeOpacity={0.7}
                            >
                                <View style={[styles.checkbox, hipaaAgreed && styles.checkboxOn]}>
                                    {hipaaAgreed && <ShieldCheck size={14} color={Colors.primary} />}
                                </View>
                                <Text style={styles.hipaaText}>
                                    I understand BE333 is a wellness-tracking tool, not a HIPAA-covered service.
                                    Client data I view here is practice-cadence summary, not clinical
                                    documentation. I will treat client identifiers with the same care as any
                                    other client record.
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <Button
                        title="Sign Up"
                        onPress={signUpWithEmail}
                        loading={loading}
                        style={styles.button}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Link href="/(auth)/login" asChild>
                            <TouchableOpacity>
                                <Text style={styles.link}>Sign In</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 150,
        height: 90,
        marginBottom: 10,
    },
    form: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
        color: Colors.text,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        marginTop: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
    link: {
        color: Colors.secondary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    roleContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 8,
        marginLeft: 4,
    },
    roleButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    roleBtn: {
        flex: 1,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        backgroundColor: Colors.surface,
        alignItems: 'center',
    },
    roleBtnActive: {
        borderColor: Colors.secondary,
        backgroundColor: 'rgba(255, 215, 0, 0.1)', // Gold tint
    },
    roleText: {
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    roleTextActive: {
        color: Colors.secondary,
        fontWeight: 'bold',
    },
    therapistBlock: {
        marginTop: 6,
        marginBottom: 10,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(225,183,37,0.35)',
        backgroundColor: 'rgba(26,67,49,0.4)',
        gap: 6,
    },
    therapistBlockTitle: {
        color: Colors.secondary,
        fontWeight: '700',
        fontSize: 13,
        letterSpacing: 0.4,
        textTransform: 'uppercase',
    },
    therapistBlockHint: {
        color: Colors.textSecondary,
        fontSize: 12,
        lineHeight: 17,
        marginBottom: 4,
    },
    hipaaRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10,
        padding: 8,
        marginTop: 4,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: Colors.secondary,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 1,
    },
    checkboxOn: {
        backgroundColor: 'rgba(225,183,37,0.25)',
    },
    hipaaText: {
        flex: 1,
        color: Colors.text,
        fontSize: 12,
        lineHeight: 17,
    },
});
