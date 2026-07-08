import { z } from "zod";

export const CART_COOKIE = "cart";
export const CART_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  qty: z.number().int().min(1).max(99),
});

export const cartSchema = z.array(cartItemSchema);

export type CartItem = z.infer<typeof cartItemSchema>;
export type Cart = CartItem[];

export function cartCount(cart: Cart): number {
  return cart.reduce((sum, i) => sum + i.qty, 0);
}
