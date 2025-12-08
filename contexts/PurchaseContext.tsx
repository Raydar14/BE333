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

    // Initialize RevenueCat
    useEffect(() => {
        initializePurchases();
    }, []);

    // Update user when auth changes
    useEffect(() => {
        if (user) {
            Purchases.logIn(user.uid);
            loadCustomerInfo();
        } else {
            Purchases.logOut();
            setTier('free');
        }
    }, [user]);

    async function initializePurchases() {
        try {
            // TODO: Replace with your actual RevenueCat API keys
            const apiKey = Platform.select({
                ios: 'YOUR_IOS_API_KEY',
                android: 'test_wqHEDBDuKdaCOMDOrvtsceuIsDh',
            });

            if (!apiKey) return;

            Purchases.configure({ apiKey });

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
