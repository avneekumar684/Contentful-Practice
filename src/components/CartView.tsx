"use client";

import Link from "next/link";
import Image from "next/image";
import { removeFromCart, setQuantity, useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";

const FREE_SHIPPING_FROM = 50;

export default function CartView() {
  const { items, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="empty">
        <h2>Your cart is empty</h2>
        <p>Add something from the shop and it will show up here.</p>
        <Link href="/shop" className="button">
          Go to the shop
        </Link>
      </div>
    );
  }

  const shipping = subtotal >= FREE_SHIPPING_FROM ? 0 : 6;
  const missing = FREE_SHIPPING_FROM - subtotal;

  return (
    <div className="cart">
      <ul className="cart__items">
        {items.map((item) => (
          <li key={item.id} className="cart__row">
            <Link href={`/product/${item.slug}`} className="cart__thumb">
              {item.imageUrl && <Image src={item.imageUrl} alt="" width={160} height={160} />}
            </Link>
            <div className="cart__name">
              <Link href={`/product/${item.slug}`}>{item.name}</Link>
              <button type="button" className="link-button" onClick={() => removeFromCart(item.id)}>
                Remove
              </button>
            </div>
            <label className="quantity">
              <span className="sr-only">Quantity</span>
              <button type="button" onClick={() => setQuantity(item.id, item.quantity - 1)} aria-label="Fewer">
                −
              </button>
              <span>{item.quantity}</span>
              <button type="button" onClick={() => setQuantity(item.id, item.quantity + 1)} aria-label="More">
                +
              </button>
            </label>
            <strong className="cart__line">{formatPrice(item.price * item.quantity)}</strong>
          </li>
        ))}
      </ul>

      <aside className="cart__summary">
        <h2>Order summary</h2>
        {missing > 0 && <p className="cart__hint">Add {formatPrice(missing)} more for free shipping.</p>}
        <dl>
          <div>
            <dt>Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div>
            <dt>Shipping</dt>
            <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
          </div>
          <div className="cart__total">
            <dt>Total</dt>
            <dd>{formatPrice(subtotal + shipping)}</dd>
          </div>
        </dl>
        <Link href="/checkout" className="button button--block">
          Checkout
        </Link>
      </aside>
    </div>
  );
}
