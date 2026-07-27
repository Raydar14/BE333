import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Platform } from 'react-native';
import Purchases, { PurchasesOffering, CustomerInfo } from 'react-native-purchases';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

type SubscriptionTier = 'free' | 'user' | 'therapist';

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
    const [tier, setTier] = useState<SubscriptionTier>('free');
    const [couponTier, setCouponTier] = useState<SubscriptionTier>('free');
    const [loading, setLoading] = useState(true);
    const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
    const [isConfigured, setIsConfigured] = useState(false);

    // Watch the user doc for coupon-based entitlement (set by useCoupon.redeem).
    // Coupon acts as an override until RevenueCat mirrors real subscription state.
    useEffect(() => {
        if (!user) { setCouponTier('free'); return; }
        const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
            const raw = snap.data()?.couponEntitlement;
            if (raw === 'user' || raw === 'therapist') setCouponTier(raw);
            else setCouponTier('free');
        }, () => setCouponTier('free'));
        return () => unsub();
    }, [user]);

    useEffect(() => {
        initializePurchases();
    }, []);

    useEffect(() => {
        if (!isConfigured) return;

        if (user) {
            Purchases.logIn(user.uid)
                .then(() => loadCustomerInfo())
                .catch(e => console.warn('RevenueCat logIn error:', e));
        } else {
            Purchases.logOut()
                .then(() => setTier('free'))
                .catch(e => console.warn('RevenueCat logOut error:', e));
        }
    }, [user, isConfigured]);

    async function initializePurchases() {
        if (Platform.OS === 'web') {
            setLoading(false);
            return;
        }

        try {
            // TODO: Replace with your actual RevenueCat API keys from https://app.revenuecat.com
            const apiKey = Platform.select({
                ios: 'YOUR_IOS_API_KEY',
                android: 'YOUR_ANDROID_API_KEY',
            });

            if (!apiKey || apiKey.startsWith('YOUR_')) {
                console.warn('RevenueCat: API key not configured. In-app purchases disabled.');
                setLoading(false);
                return;
            }

            await Purchases.configure({ apiKey });
            setIsConfigured(true);

            const result = await Purchases.getOfferings();
            if (result.current) setOfferings(result.current);

            await loadCustomerInfo();
        } catch (e) {
            console.error('Error initializing purchases:', e);
        } finally {
            setLoading(false);
        }
    }

    async function loadCustomerInfo() {
        if (!isConfigured) return;
        try {
            const customerInfo = await Purchases.getCustomerInfo();
            updateTierFromCustomerInfo(customerInfo);
        } catch (e) {
            console.error('Error loading customer info:', e);
            setLoading(false);
        }
    }

    function updateTierFromCustomerInfo(customerInfo: CustomerInfo) {
        const active = customerInfo.entitlements?.active ?? {};
        if (active['therapist']) {
            setTier('therapist');
        } else if (active['user']) {
            setTier('user');
        } else {
            setTier('free');
        }
        setLoading(false);
    }

    const purchasePackage = useCallback(async (packageId: string) => {
        if (!isConfigured) {
            console.warn('Purchases not configured');
            return;
        }
        try {
            if (!offerings) return;

            const packageToPurchase = offerings.availablePackages.find(
                pkg => pkg.identifier === packageId
            );

            if (!packageToPurchase) {
                console.error('Package not found:', packageId);
                return;
            }

            const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
            updateTierFromCustomerInfo(customerInfo);
        } catch (e: unknown) {
            const err = e as { userCancelled?: boolean };
            if (!err.userCancelled) {
                console.error('Error making purchase:', e);
            }
        }
    }, [isConfigured, offerings]);

    const restorePurchases = useCallback(async () => {
        if (!isConfigured) return;
        try {
            const customerInfo = await Purchases.restorePurchases();
            updateTierFromCustomerInfo(customerInfo);
        } catch (e) {
            console.error('Error restoring purchases:', e);
        }
    }, [isConfigured]);

    // Effective tier = whichever of RevenueCat tier or coupon-granted tier is
    // higher. Therapist > user > free. Coupons never revoke a paid subscription.
    const rankOf = (t: SubscriptionTier) => (t === 'therapist' ? 2 : t === 'user' ? 1 : 0);
    const effectiveTier: SubscriptionTier =
        rankOf(couponTier) > rankOf(tier) ? couponTier : tier;
    const isPro = effectiveTier === 'user' || effectiveTier === 'therapist';

    const value = useMemo(
        () => ({ tier: effectiveTier, isPro, loading, offerings, purchasePackage, restorePurchases }),
        [effectiveTier, isPro, loading, offerings, purchasePackage, restorePurchases]
    );

    return (
        <PurchaseContext.Provider value={value}>
            {children}
        </PurchaseContext.Provider>
    );
}
