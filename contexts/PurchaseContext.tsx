import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

// Web has no RevenueCat/Stripe SDK: importing 'react-native-purchases' here
// would pull in @revenuecat/purchases-js, which injects a Stripe.js <script>
// as a module-load-time side effect (fires on import, independent of whether
// Purchases.configure() is ever called). That external script then mutates
// document.body (fraud-detection iframe) with real network latency, racing
// React's hydration of the static-exported HTML and causing hydration
// mismatches (#418/#422) in production. Web entitlement is coupon-only.

type SubscriptionTier = 'free' | 'user' | 'therapist';

type PurchasesOffering = never;

type PurchaseContextType = {
    tier: SubscriptionTier;
    isPro: boolean;
    loading: boolean;
    offerings: PurchasesOffering | null;
    purchasePackage: (packageId: string) => Promise<void>;
    restorePurchases: () => Promise<void>;
};

const PurchaseContext = createContext<PurchaseContextType>({
    tier: 'free',
    isPro: false,
    loading: true,
    offerings: null,
    purchasePackage: async () => { },
    restorePurchases: async () => { },
});

export const usePurchase = () => useContext(PurchaseContext);

export function PurchaseProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [couponTier, setCouponTier] = useState<SubscriptionTier>('free');

    // Watch the user doc for coupon-based entitlement (set by useCoupon.redeem).
    // Coupon is the only source of paid entitlement on web.
    useEffect(() => {
        if (!user) { setCouponTier('free'); return; }
        const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
            const raw = snap.data()?.couponEntitlement;
            if (raw === 'user' || raw === 'therapist') setCouponTier(raw);
            else setCouponTier('free');
        }, () => setCouponTier('free'));
        return () => unsub();
    }, [user]);

    const purchasePackage = useCallback(async () => {
        console.warn('Purchases are not available on web.');
    }, []);

    const restorePurchases = useCallback(async () => {
        console.warn('Purchases are not available on web.');
    }, []);

    const isPro = couponTier === 'user' || couponTier === 'therapist';

    const value = useMemo(
        () => ({ tier: couponTier, isPro, loading: false, offerings: null, purchasePackage, restorePurchases }),
        [couponTier, isPro, purchasePackage, restorePurchases]
    );

    return (
        <PurchaseContext.Provider value={value}>
            {children}
        </PurchaseContext.Provider>
    );
}
