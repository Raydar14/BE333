import { useState, useCallback } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';

// Day 1 launch coupon redemption.
//
// Coupon docs live at `coupons/{CODE}` (upper-cased). Fields:
//   type: 'user' | 'therapist'      — entitlement granted
//   active: boolean                  — set false to disable a code
//   used: boolean                    — flipped true on first redemption
//   usedByUid?: string
//   usedAt?: serverTimestamp
//   expiresAt?: number (ms)          — optional per-code expiry (Firestore Number)
//   note?: string                    — human context (e.g. "Launch week")
//
// Redemption is client-side: we set `couponEntitlement` + `couponRedeemedAt`
// on the user's own doc. PurchaseContext respects the field and treats it
// as an override until RevenueCat mirrors real subscription state.
//
// One-use coupons: `used` is checked before writing; a second attempt on
// the same code returns { ok: false, message: 'Already redeemed.' }.

export type CouponType = 'user' | 'therapist';

export function useCoupon() {
    const { user } = useAuth();
    const [pending, setPending] = useState(false);

    const redeem = useCallback(
        async (rawCode: string): Promise<{ ok: boolean; message: string; type?: CouponType }> => {
            if (!user) return { ok: false, message: 'Sign in first.' };
            const code = rawCode.trim().toUpperCase();
            if (!code) return { ok: false, message: 'Enter a code.' };
            setPending(true);
            try {
                const snap = await getDoc(doc(db, 'coupons', code));
                if (!snap.exists()) {
                    return { ok: false, message: 'That code is not recognized.' };
                }
                const data = snap.data();
                if (data.active === false) {
                    return { ok: false, message: 'That code is no longer active.' };
                }
                if (data.used === true) {
                    // Allow the same user to re-apply their own code (idempotent).
                    if (data.usedByUid && data.usedByUid !== user.uid) {
                        return { ok: false, message: 'That code has already been redeemed.' };
                    }
                }
                if (typeof data.expiresAt === 'number' && Date.now() > data.expiresAt) {
                    return { ok: false, message: 'That code has expired.' };
                }
                const type = data.type as CouponType;
                if (type !== 'user' && type !== 'therapist') {
                    return { ok: false, message: 'That code is misconfigured. Please contact support.' };
                }

                await updateDoc(snap.ref, {
                    used: true,
                    usedByUid: user.uid,
                    usedAt: serverTimestamp(),
                });
                await updateDoc(doc(db, 'users', user.uid), {
                    couponEntitlement: type,
                    couponRedeemedAt: serverTimestamp(),
                    couponCode: code,
                });

                return {
                    ok: true,
                    type,
                    message: type === 'therapist'
                        ? 'Therapist Pro unlocked. Welcome, Guide.'
                        : 'Pro unlocked. Enjoy the practice.',
                };
            } catch (e) {
                console.warn('useCoupon.redeem error:', e);
                return { ok: false, message: 'Something went wrong. Try again.' };
            } finally {
                setPending(false);
            }
        },
        [user],
    );

    return { redeem, pending };
}
