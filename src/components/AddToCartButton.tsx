"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { addToCart } from "@/lib/cart/client";

export function AddToCartButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handle() {
    setLoading(true);
    try {
      await addToCart(productId);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
      window.dispatchEvent(new Event("cart:updated"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handle} disabled={loading} className="btn btn-primary w-full sm:w-auto">
      {added ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
      {added ? "Đã thêm vào giỏ" : "Thêm vào giỏ / Đặt giữ máy"}
    </button>
  );
}
