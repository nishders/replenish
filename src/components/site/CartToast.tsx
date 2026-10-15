'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ds/Icon';
import { CART_HREF } from './content';
import s from './site.module.css';

const SHOW_MS = 3200;

// "added to cart" toast: bottom right on desktop, bottom of the screen on phones. Each new add restarts the timer.
export function CartToast() {
  const [shown, setShown] = useState(0); // bumps on every add so the pop-in replays

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const onAdd = () => {
      setShown((n) => n + 1);
      clearTimeout(t);
      t = setTimeout(() => setShown(0), SHOW_MS);
    };
    window.addEventListener('replenish:cart-added', onAdd);
    return () => {
      clearTimeout(t);
      window.removeEventListener('replenish:cart-added', onAdd);
    };
  }, []);

  if (!shown) return null;
  return (
    <div key={shown} role="status" className={s.toast}>
      <span className={s.toastTick}>
        <Icon name="check" size={20} />
      </span>
      <span className={s.toastText}>added to cart. still 0g protein.</span>
      <a href={CART_HREF} className={s.toastLink}>
        view cart
      </a>
    </div>
  );
}
