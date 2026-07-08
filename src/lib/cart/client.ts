"use client";

import { CART_COOKIE, type CartItem } from "@/lib/cart/shared";

function readCart(): CartItem[] {
  try {
    const raw = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${CART_COOKIE}=`))
      ?.split("=")[1];
    if (!raw) return [];
    return JSON.parse(decodeURIComponent(raw)) as CartItem[];
  } catch {
    return [];
  }
}

function writeCart(cart: CartItem[]) {
  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `${CART_COOKIE}=${encodeURIComponent(JSON.stringify(cart))}; path=/; max-age=${maxAge}; samesite=lax`;
  window.dispatchEvent(new Event("cart:updated"));
}

export async function addToCart(productId: string, qty = 1): Promise<void> {
  const cart = readCart();
  const existing = cart.find((i) => i.productId === productId);
  if (existing) existing.qty = Math.min(99, existing.qty + qty);
  else cart.push({ productId, qty });
  writeCart(cart);
}

export async function removeFromCart(productId: string): Promise<void> {
  writeCart(readCart().filter((i) => i.productId !== productId));
}

export async function updateQty(productId: string, qty: number): Promise<void> {
  const cart = readCart();
  const item = cart.find((i) => i.productId === productId);
  if (item) item.qty = Math.max(1, Math.min(99, qty));
  writeCart(cart);
}
