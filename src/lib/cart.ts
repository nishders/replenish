'use client';

import { useSyncExternalStore } from 'react';

// The cart lives in this browser's localStorage as { [product slug]: quantity }. No login needed.

export type Cart = Record<string, number>;

export const MAX_QTY = 10;
const KEY = 'replenish-cart';
const CHANGE = 'replenish:cart';
const EMPTY: Cart = {};

let cached: { raw: string | null; cart: Cart } = { raw: null, cart: EMPTY };

function read(): Cart {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {
    return EMPTY; // storage blocked (private mode etc.)
  }
  if (raw === cached.raw) return cached.cart;
  let cart: Cart = EMPTY;
  try {
    const parsed = raw ? JSON.parse(raw) : {};
    cart = Object.fromEntries(
      Object.entries(parsed)
        .filter(([, q]) => Number.isInteger(q) && (q as number) > 0)
        .map(([k, q]) => [k, Math.min(q as number, MAX_QTY)]),
    );
  } catch {
    cart = EMPTY;
  }
  cached = { raw, cart };
  return cart;
}

function write(cart: Cart) {
  try {
    localStorage.setItem(KEY, JSON.stringify(cart));
  } catch {
    // storage blocked: the cart just won't survive a refresh
  }
  window.dispatchEvent(new Event(CHANGE));
}

function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => e.key === KEY && onChange(); // other tabs
  window.addEventListener(CHANGE, onChange);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(CHANGE, onChange);
    window.removeEventListener('storage', onStorage);
  };
}

// Current cart. On the server (and the first browser render) it's empty; `ready` turns true once the saved cart is read.
export function useCart() {
  const cart = useSyncExternalStore(subscribe, read, () => EMPTY);
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const count = Object.values(cart).reduce((n, q) => n + q, 0);
  return { cart, count, ready };
}

export const cartActions = {
  // Adds one, up to the max. Returns false when already at the max. `toast: false` skips the "added to cart" toast.
  add(slug: string, { toast = true } = {}) {
    const cart = read();
    const q = cart[slug] ?? 0;
    if (q >= MAX_QTY) return false;
    write({ ...cart, [slug]: q + 1 });
    window.dispatchEvent(new CustomEvent('nish:cart-bump')); // nav bag jiggles
    if (toast) window.dispatchEvent(new CustomEvent('replenish:cart-added', { detail: slug }));
    return true;
  },
  setQty(slug: string, qty: number) {
    write({ ...read(), [slug]: Math.max(1, Math.min(MAX_QTY, qty)) });
  },
  remove(slug: string) {
    const rest = { ...read() };
    delete rest[slug];
    write(rest);
  },
  clear() {
    write({});
  },
  restore(slug: string, qty: number) {
    write({ ...read(), [slug]: Math.min(MAX_QTY, qty) });
  },
};

export const badgeText = (count: number) => (count >= MAX_QTY ? `${MAX_QTY}+` : count);
