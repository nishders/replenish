'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ds/Button';
import { QuantityStepper } from '@/components/ds/QuantityStepper';
import { cartActions, MAX_QTY, useCart } from '@/lib/cart';
import s from './shop.module.css';

const ADDED_MS = 1200;

// Squash-and-settle bounce from the cart design.
function bounce(el: HTMLElement | null) {
  if (!el?.animate || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(1.1, .84) rotate(-3deg)', offset: 0.25 },
      { transform: 'scale(.95, 1.08) rotate(2deg)', offset: 0.55 },
      { transform: 'scale(1)' },
    ],
    { duration: 520, easing: 'cubic-bezier(.34,1.56,.64,1)' },
  );
}

// "add to cart" until the flavour is in the cart; then a − n + stepper beside an "add more?" button.
// Taking the stepper down past 1 removes the flavour and brings "add to cart" back.
export function AddToCartButton({ slug, name }: { slug: string; name: string }) {
  const { cart } = useCart();
  const qty = cart[slug] ?? 0;
  const full = qty >= MAX_QTY;
  const [added, setAdded] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const more = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const flashAdded = () => {
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), ADDED_MS);
  };

  const addFirst = () => {
    if (!cartActions.add(slug)) return;
    bounce(wrap.current);
  };

  const addMore = () => {
    if (!cartActions.add(slug)) return;
    bounce(more.current);
    flashAdded();
  };

  const step = (v: number) => {
    if (v > qty) cartActions.add(slug, { toast: false });
    else if (v <= 0) cartActions.remove(slug);
    else cartActions.setQty(slug, v);
  };

  if (qty === 0) {
    return (
      <div ref={wrap}>
        <Button size="sm" icon="plus" fullWidth quip="it's free. go wild." onClick={addFirst} aria-label={`add ${name} to cart`}>
          add to cart
        </Button>
      </div>
    );
  }

  return (
    <div ref={wrap} className={s.split}>
      <QuantityStepper value={qty} min={0} max={MAX_QTY} onChange={step} label={`${name} in cart`} style={{ height: 'var(--step-h, 38px)' }} />
      <span ref={more} className={s.more}>
        <Button
          size="sm"
          icon={added ? 'check' : full ? 'lock' : 'plus'}
          fullWidth
          disabled={full && !added}
          quip={full ? 'max 10. we only have so much nothing.' : 'go on, have another'}
          onClick={addMore}
          aria-label={full ? `${name}: max ${MAX_QTY} in cart` : `add one more ${name}`}
        >
          {added ? 'added!' : full ? `max ${MAX_QTY}` : 'add more?'}
        </Button>
      </span>
    </div>
  );
}
