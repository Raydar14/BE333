import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Platform } from 'react-native';
import Purchases, { PurchasesOffering, CustomerInfo } from 'react-native-purchases';
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
    const [loading, setLoading] = useState(true);
    const [offerings, setOfferings] = useState<PurchasesOffering | null>(null);
    const [isConfigured, setIsConfigured] = useState(false);

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

    const isPro = tier === 'user' || tier === 'therapist';

    const value = useMemo(
        () => ({ tier, isPro, loading, offerings, purchasePackage, restorePurchases }),
        [tier, isPro, loading, offerings, purchasePackage, restorePurchases]
    );

    return (
        <PurchaseContext.Provider value={value}>
            {children}
        </PurchaseContext.Provider>
    );
}
