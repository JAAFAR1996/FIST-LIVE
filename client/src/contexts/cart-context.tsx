import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Product } from "@/types";
import { useAuth } from "./auth-context";
import { toast } from "@/hooks/use-toast";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  slug: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "fish-web-cart-v2";

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from LocalStorage on mount (for guest)
  useEffect(() => {
    if (!user && !isInitialized) {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        try {
          setItems(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse cart", e);
        }
      }
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  // Sync with Server on Login
  useEffect(() => {
    if (user) {
      // 1. Fetch server cart
      fetch("/api/cart", { credentials: "include" })
        .then((res) => res.json())
        .then((serverItems) => {
          if (Array.isArray(serverItems)) {
            // Transform server items to match CartItem interface
            const mappedItems = serverItems.map((item: any) => ({
              id: item.product.id,
              name: item.product.name,
              price: Number(item.product.price),
              quantity: item.quantity,
              image: item.product.thumbnail || item.product.images?.[0] || '',
              slug: item.product.slug,
            }));

            // Merge logic could go here, for now simpler to just use server state
            // or if we have local items, push them to server?
            // Let's implement a simple "Push local to server" if we have local items just after login
            // But to avoid complexity loops, let's just trust server source of truth for logged in users
            // unless the server cart is empty and local is not.

            setItems(mappedItems);
          }
        })
        .catch((err) => console.error("Failed to fetch cart", err));
    }
  }, [user]);

  // Persist changes
  const saveCart = async (newItems: CartItem[]) => {
    setItems(newItems);

    if (user) {
      // If logged in, we should ideally sync each change. 
      // But passing the whole cart on every change is heavy.
      // The API is granular (add/remove). 
      // So this state-based save is tricky without a diff.
      // We will rely on the add/remove functions to call API directly.
    } else {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
      window.dispatchEvent(new StorageEvent('storage', {
        key: CART_STORAGE_KEY,
        newValue: JSON.stringify(newItems),
      }));
    }
  };

  const addItem = async (product: Product) => {
    if (user) {
      // Server Side
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ productId: product.id, quantity: 1 }),
        });
        if (res.ok) {
          const newItem = await res.json();
          const cartRes = await fetch("/api/cart", { credentials: "include" });
          const serverItems = await cartRes.json();
          const mappedItems = serverItems.map((item: any) => ({
            id: item.product.id,
            name: item.product.name,
            price: Number(item.product.price),
            quantity: item.quantity,
            image: item.product.thumbnail || item.product.images?.[0] || '',
            slug: item.product.slug,
          }));
          setItems(mappedItems);
        } else {
          try {
            // Fallback to update client side if server fails? No, better warn.
            if (res.status === 401) {
              toast({
                title: "جلسة منتهية",
                description: "يرجى تسجيل الدخول مرة أخرى لإضافة المنتجات.",
                variant: "destructive",
              });
            } else {
              throw new Error("Server responded with " + res.status);
            }
          } catch (e) {
            throw e; // goes to outer catch
          }
        }
      } catch (err) {
        console.error("Failed to add to server cart", err);
        toast({
          title: "أوبس! 🦐",
          description: "الجمبري أكل الكيبل! حاول مرة ثانية.",
          variant: "destructive",
        });
      }
    } else {
      // Client Side
      const existingItem = items.find((item) => item.id === product.id);
      let newItems;
      if (existingItem) {
        newItems = items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: product.id,
          name: product.name,
          price: Number(product.price),
          quantity: 1,
          image: product.thumbnail || product.image || product.images?.[0] || '',
          slug: product.slug,
        };
        newItems = [...items, newItem];
      }
      saveCart(newItems);
    }
  };

  const removeItem = async (id: string) => {
    if (user) {
      try {
        await fetch(`/api/cart/${id}`, { method: "DELETE", credentials: "include" });
        setItems(items.filter((item) => item.id !== id));
      } catch (err) {
        console.error("Failed to remove from server cart", err);
      }
    } else {
      const newItems = items.filter((item) => item.id !== id);
      saveCart(newItems);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    if (user) {
      try {
        await fetch(`/api/cart/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ quantity }),
        });
        // Optimistic update
        setItems(items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ));
      } catch (err) {
        console.error("Failed to update server cart", err);
      }
    } else {
      const newItems = items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      );
      saveCart(newItems);
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await fetch("/api/cart", { method: "DELETE", credentials: "include" });
        setItems([]);
      } catch (err) {
        console.error("Failed to clear server cart", err);
      }
    } else {
      saveCart([]);
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
