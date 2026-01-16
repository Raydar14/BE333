
import React, { createContext, useContext } from 'react';

// Mock types since we avoid importing from 'react-native-purchases'
type PurchasesOffering = any;
type CustomerInfo = any;
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
    loading: false,
    offerings: null,
    purchasePackage: async () => { },
    restorePurchases: async () => { },
});

export const usePurchase = () => useContext(PurchaseContext);

export function PurchaseProvider({ children }: { children: React.ReactNode }) {
    // RevenueCat is disabled on web to prevent crashes with the React Native SDK.
    // For web payments, you would typically use Stripe or a web-compatible RevenueCat SDK (purchases-js).
    // Here we defaults to 'free' tier.

    return (
        <PurchaseContext.Provider value={{
            tier: 'free',
            isPro: false,
            loading: false, // Not loading, ready immediately
            offerings: null,
            purchasePackage: async (pkg) => console.log('Purchase not supported on web stub'),
            restorePurchases: async () => console.log('Restore not supported on web stub')
        }}>
            {children}
        </PurchaseContext.Provider>
    );
}
