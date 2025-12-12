/**
 * 🛒 useCartCount Hook
 * Tracks the number of items in the shopping cart
 * Connects to the existing cart context
 */

'use client';

import { useCart } from '@/contexts/cart-context';

export function useCartCount(): number {
  const { items } = useCart();

  // Calculate total quantity (sum of all item quantities)
  const totalCount = items.reduce((total, item) => total + item.quantity, 0);

  return totalCount;
}
