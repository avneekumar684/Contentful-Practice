"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart-store";

type Props = {
  product: { id: string; slug: string; name: string; price: number; imageUrl?: string };
  disabled?: boolean;
  showQuantity?: boolean; // the big product page has a quantity box, the small card does not
};

export default function AddToCartButton({ product, disabled, showQuantity }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500); // show "Added" for a moment
  }

  return (
    <div className="add-to-cart">
      {showQuantity && (
        <label className="quantity">
          <span className="sr-only">Quantity</span>
          <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Fewer">
            −
          </button>
          <span>{quantity}</span>
          <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="More">
            +
          </button>
        </label>
      )}
      <button type="button" className="button button--block" onClick={handleAdd} disabled={disabled}>
        {disabled ? "Out of stock" : justAdded ? "Added ✓" : "Add to cart"}
      </button>
    </div>
  );
}
