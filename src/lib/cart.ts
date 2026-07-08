import { cookies } from "next/headers";
import {
  CART_COOKIE,
  CART_MAX_AGE,
  cartSchema,
  type Cart,
  type CartItem,
} from "@/lib/cart/shared";

export { CART_COOKIE, CART_MAX_AGE, cartSchema };
export type { Cart, CartItem };

export async function getCart(): Promise<Cart> {
  const store = await cookies();
  const raw = store.get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    return cartSchema.parse(JSON.parse(raw));
  } catch {
    return [];
  }
}

export async function setCart(cart: Cart): Promise<void> {
  const store = await cookies();
  store.set(CART_COOKIE, JSON.stringify(cart), {
    maxAge: CART_MAX_AGE,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
  });
}

export async function addToCart(productId: string, qty = 1): Promise<Cart> {
  const cart = await getCart();
  const existing = cart.find((i) => i.productId === productId);
  if (existing) {
    existing.qty = Math.min(99, existing.qty + qty);
  } else {
    cart.push({ productId, qty });
  }
  await setCart(cart);
  return cart;
}

export async function removeFromCart(productId: string): Promise<Cart> {
  const cart = await getCart().then((c) => c.filter((i) => i.productId !== productId));
  await setCart(cart);
  return cart;
}

export async function clearCart(): Promise<void> {
  await setCart([]);
}

export { cartCount } from "@/lib/cart/shared";
