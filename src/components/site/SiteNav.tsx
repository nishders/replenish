'use client';

import { useRouter } from 'next/navigation';
import { NavBar } from '@/components/ds/NavBar';
import { useCart } from '@/lib/cart';
import { AccountNav } from './AccountNav';
import { CartToast } from './CartToast';
import { CART_HREF, NAV_LINKS } from './content';
import s from './site.module.css';

// Sticky nav (desktop + phone) with the live cart count, plus the "added to cart" toast.
export function SiteNav({ active, accountQuip }: { active?: string; accountQuip?: string }) {
  const router = useRouter();
  const { count } = useCart();
  const toCart = () => router.push(CART_HREF);
  return (
    <>
      <header className={s.nav}>
        <div className={s.desk}>
          <NavBar links={NAV_LINKS} active={active} cartCount={count} onCart={toCart} account={<AccountNav quip={accountQuip} />} />
        </div>
        <div className={s.phone}>
          <NavBar compact cartCount={count} onCart={toCart} account={<AccountNav compact quip={accountQuip} />} />
        </div>
      </header>
      <CartToast />
    </>
  );
}
