import React, { createContext, useContext, useState, useEffect } from 'react';
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

    // Initialize RevenueCat
    useEffect(() => {
        initializePurchases();
    }, []);

    // Update user when auth changes
    useEffect(() => {
        if (!isConfigured) return; // Guard: Wait for init

        if (user) {
            Purchases.logIn(user.uid).then(() => loadCustomerInfo());
        } else {
            Purchases.logOut().then(() => setTier('free'));
        }
    }, [user, isConfigured]);

    async function initializePurchases() {
        if (Platform.OS === 'web') {
            // RevenueCat React Native SDK does not support Web.
            // We disable it for web previews.
            console.log('RevenueCat disabled on Web');
            setLoading(false);
            return;
        }

        try {
            // TODO: Replace with your actual RevenueCat API keys
            // TODO: REPLACE THESE WITH YOUR ACTUAL REVENUECAT API KEYS
            const apiKey = Platform.select({
                ios: 'appl_...', // Put your iOS RevenueCat API key here
                android: 'goog_...', // Find this in RevenueCat Dashboard > Project Settings > API Keys
            });

            if (!apiKey || apiKey.includes('...')) {
                console.error('RevenueCat API Key not set! Please update contexts/PurchaseContext.tsx');
                setLoading(false);
                return;
            }

            await Purchases.configure({ apiKey });
            setIsConfigured(true);

            // Load offerings
            const offerings = await Purchases.getOfferings();
            if (offerings.current) {
                setOfferings(offerings.current);
            }

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
        // Check which entitlement is active
        if (customerInfo.entitlements.active['therapist']) {
            setTier('therapist');
        } else if (customerInfo.entitlements.active['user']) {
            setTier('user');
        } else {
            setTier('free');
        }
        setLoading(false);
    }

    async function purchasePackage(packageId: string) {
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
        } catch (e: any) {
            if (!e.userCancelled) {
                console.error('Error making purchase:', e);
            }
        }
    }

    async function restorePurchases() {
        if (!isConfigured) return;
        try {
            const customerInfo = await Purchases.restorePurchases();
            updateTierFromCustomerInfo(customerInfo);
        } catch (e) {
            console.error('Error restoring purchases:', e);
        }
    }

    const isPro = tier === 'user' || tier === 'therapist';

    return (
        <PurchaseContext.Provider value={{ tier, isPro, loading, offerings, purchasePackage, restorePurchases }}>
            {children}
        </PurchaseContext.Provider>
    );
}
