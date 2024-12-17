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
}

const PurchasedContext = createContext<PurchasedContextType>({
  purchasedItems: [],
  addPurchasedItems: () => {},
  isPurchased: () => false,
});

export const PurchasedProvider = ({ children }: { children: React.ReactNode }) => {
  const [purchasedItems, setPurchasedItems] = useState<PurchasedItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load purchased items from localStorage
    const savedItems = localStorage.getItem("purchasedItems");
    if (savedItems) {
      setPurchasedItems(JSON.parse(savedItems));
    }
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

  return (
    <PurchasedContext.Provider
      value={{
        purchasedItems,
        addPurchasedItems,
        isPurchased,
      }}
    >
      {children}
    </PurchasedContext.Provider>
  );
};

export const usePurchased = () => useContext(PurchasedContext);
