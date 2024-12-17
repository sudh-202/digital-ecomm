"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface PurchasedItem {
  id: string;
  name: string;
  description: string;
  downloadUrl: string;
  purchaseDate: string;
}

interface PurchasedContextType {
  purchasedItems: PurchasedItem[];
  addPurchasedItems: (items: PurchasedItem[]) => void;
  isPurchased: (itemId: string) => boolean;
  resetPurchasedItems: () => void;
}

const PurchasedContext = createContext<PurchasedContextType>({
  purchasedItems: [],
  addPurchasedItems: () => {},
  isPurchased: () => false,
  resetPurchasedItems: () => {},
});

export const PurchasedProvider = ({ children }: { children: React.ReactNode }) => {
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load purchased items from localStorage only if not already loaded
    const savedItems = localStorage.getItem("purchasedItems");
    if (savedItems && purchasedItems.length === 0) {
      setPurchasedItems(JSON.parse(savedItems));
    }
    // Reset purchased items when component unmounts
    return () => {
      setPurchasedItems([]);
      localStorage.removeItem("purchasedItems");
    };
  }, []);

  useEffect(() => {
    if (mounted) {
      // Save purchased items to localStorage whenever they change
      localStorage.setItem("purchasedItems", JSON.stringify(purchasedItems));
    }
  }, [purchasedItems, mounted]);

  const addPurchasedItems = (items: PurchasedItem[]) => {
    setPurchasedItems(prev => [...prev, ...items]);
  };

  const isPurchased = (itemId: string) => {
    return purchasedItems.some(item => item.id === itemId);
  };

  const resetPurchasedItems = () => {
    setPurchasedItems([]);
    localStorage.removeItem("purchasedItems");
  };

  return (
    <PurchasedContext.Provider value={{ 
      purchasedItems, 
      addPurchasedItems, 
      isPurchased,
      resetPurchasedItems
    }}>
      {children}
    </PurchasedContext.Provider>
  );
};

export const usePurchased = () => {
  const context = useContext(PurchasedContext);
  if (!context) {
    throw new Error("usePurchased must be used within a PurchasedProvider");
  }
  return context;
};
