"use client";

// A very small shopping cart that lives in the browser (and is remembered in localStorage).
// No accounts and no database: this is a demo store, nothing is really bought.
//
// `useSyncExternalStore` is React's built-in way to read data that lives outside React.
// We keep the cart in a plain variable and tell React whenever it changes.
import { useMemo, useSyncExternalStore } from "react";

export type CartItem = {
  id: string; // Contentful entry ID of the product
  slug: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
};

const STORAGE_KEY = "contentful-app-cart";
const NO_ITEMS: CartItem[] = []; // what the server (and the first render) sees

let items: CartItem[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function loadFromStorage() {
  if (loaded) return;
  loaded = true;
  try {
    items = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    items = []; // storage blocked or broken JSON: start with an empty cart
  }
}

function update(next: CartItem[]) {
  items = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // private mode etc.: the cart still works until the page closes
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  loadFromStorage();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  loadFromStorage();
  return items;
}

// ---------- actions (call these from buttons) ----------
export function addToCart(item: Omit<CartItem, "quantity">, quantity = 1) {
  const existing = items.find((i) => i.id === item.id);
  if (existing) {
    update(items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i)));
  } else {
    update([...items, { ...item, quantity }]);
  }
}

export function setQuantity(id: string, quantity: number) {
  if (quantity <= 0) return removeFromCart(id);
  update(items.map((i) => (i.id === id ? { ...i, quantity } : i)));
}

export function removeFromCart(id: string) {
  update(items.filter((i) => i.id !== id));
}

export function clearCart() {
  update([]);
}

// ---------- hook (read the cart inside a component) ----------
export function useCart() {
  const current = useSyncExternalStore(subscribe, getSnapshot, () => NO_ITEMS);
  return useMemo(
    () => ({
      items: current,
      count: current.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: current.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    [current]
  );
}
