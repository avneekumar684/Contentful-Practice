"use client";

import Link from "next/link";
import { useState } from "react";
import { clearCart, useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

// Demo checkout: it collects nothing real and charges nothing. It only shows the last step of a shop.
export default function CheckoutForm() {
  const { items, subtotal } = useCart();
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  if (orderNumber) {
    return (
      <div className="empty">
        <h2>Thank you! 🎉</h2>
        <p>
          Order <strong>{orderNumber}</strong> is placed. This is a demo store, so nothing will be shipped or charged.
        </p>
        <Link href="/shop" className="button">
          Keep shopping
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty">
        <h2>Nothing to check out</h2>
        <Link href="/shop" className="button">
          Go to the shop
        </Link>
      </div>
    );
  }

  function placeOrder(e: React.FormEvent) {
    e.preventDefault();
    setOrderNumber(`DEMO-${Math.floor(10000 + Math.random() * 90000)}`);
    clearCart();
  }

  return (
    <form className="checkout" onSubmit={placeOrder}>
      <div className="checkout__fields">
        <h2>Delivery details</h2>
        <label>
          Full name
          <input required name="name" autoComplete="name" />
        </label>
        <label>
          Email
          <input required type="email" name="email" autoComplete="email" />
        </label>
        <label>
          Address
          <input required name="address" autoComplete="street-address" />
        </label>
        <p className="checkout__note">Demo only: do not enter real personal or card details.</p>
      </div>

      <aside className="cart__summary">
        <h2>Your order</h2>
        <ul>
          {items.map((i) => (
            <li key={i.id}>
              {i.quantity} × {i.name}
              <span>{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="cart__total-line">
          Total <strong>{formatPrice(subtotal)}</strong>
        </p>
        <button className="button button--block" type="submit">
          Place demo order
        </button>
      </aside>
    </form>
  );
}
