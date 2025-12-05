import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Product } from "@/types";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  slug: string;
  brand: string;
  rating: number;
  category: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = "fish-web-wishlist";

function loadWishlistFromStorage(): WishlistItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Failed to load wishlist from localStorage:", error);
  }
  return [];
}

function saveWishlistToStorage(items: WishlistItem[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    // Dispatch a custom event to notify other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key: WISHLIST_STORAGE_KEY,
      newValue: JSON.stringify(items),
    }));
  } catch (error) {
    console.error("Failed to save wishlist to localStorage:", error);
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(loadWishlistFromStorage);

  const handleStorageChange = useCallback((event: StorageEvent) => {
    if (event.key === WISHLIST_STORAGE_KEY && event.newValue) {
      try {
        const newItems = JSON.parse(event.newValue);
        setItems(newItems);
      } catch (error) {
        console.error("Failed to parse wishlist data from storage event:", error);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [handleStorageChange]);

  const syncAndSetItems = (newItems: WishlistItem[] | ((prevItems: WishlistItem[]) => WishlistItem[])) => {
    const updatedItems = typeof newItems === 'function' ? newItems(items) : newItems;
    setItems(updatedItems);
    saveWishlistToStorage(updatedItems);
  };

  const addItem = (product: Product) => {
    syncAndSetItems((currentItems) => {
      // Check if item already exists
      const existingItem = currentItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Item already in wishlist, don't add duplicate
        return currentItems;
      }

      const newItem: WishlistItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        slug: product.slug,
        brand: product.brand,
        rating: product.rating,
        category: product.category,
      };
      return [...currentItems, newItem];
    });
  };

  const removeItem = (id: string) => {
    syncAndSetItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const isInWishlist = (id: string): boolean => {
    return items.some((item) => item.id === id);
  };

  const clearWishlist = () => {
    syncAndSetItems([]);
  };

  const totalItems = items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        isInWishlist,
        clearWishlist,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
