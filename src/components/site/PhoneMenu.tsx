'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Icon } from '@/components/ds/Icon';
import { useCart } from '@/lib/cart';
import { getBrowserSupabase } from '@/lib/supabase-browser';
import { useAuth } from '@/lib/useAuth';
import { CART_HREF, NAV_LINKS, ORDERS_HREF } from './content';
import s from './site.module.css';

const ICONS: Record<string, string> = { shop: 'shopping-bag', about: 'sparkles' };

// Phone nav menu (opened by the ☰ button): the desktop nav links, the cart, and the account when signed in.
export function PhoneMenu({ onClose }: { onClose: () => void }) {
  const { count } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const here = usePathname() === ORDERS_HREF;
  const logOut = async () => {
    onClose();
    await getBrowserSupabase().auth.signOut();
    router.refresh();
  };
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      if (!panel.current?.contains(t) && !t.closest('[aria-label="menu"]')) onClose();
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    panel.current?.querySelector('a')?.focus();
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div ref={panel} role="menu" aria-label="site menu" className={`${s.menu} ${s.siteMenu}`}>
      {NAV_LINKS.map((l) => (
        <a key={l.id} role="menuitem" href={l.href} className={s.menuItem} onClick={onClose}>
          <Icon name={ICONS[l.id] ?? 'arrow-right'} size={20} />
          <span>{l.label}</span>
        </a>
      ))}
      <a role="menuitem" href={CART_HREF} className={s.menuItem} onClick={onClose}>
        <Icon name="shopping-bag" size={20} />
        <span>cart{count ? ` (${count})` : ''}</span>
      </a>
      {user && (
        <>
          <div className={s.menuHead} style={{ marginTop: 4, marginBottom: 0, borderTop: 'var(--rule)', borderBottom: 0 }}>
            <span className={s.menuLabel}>signed in as</span>
            <span className={s.menuEmail}>{user.email}</span>
          </div>
          <a role="menuitem" href={ORDERS_HREF} aria-current={here ? 'page' : undefined} className={here ? `${s.menuItem} ${s.menuHere}` : s.menuItem} onClick={onClose}>
            <Icon name="package" size={20} />
            <span className={s.menuGrow}>my orders</span>
            {here && <span className={s.hereTag}>you&apos;re here</span>}
          </a>
          <button type="button" role="menuitem" className={s.menuItem} onClick={logOut}>
            <Icon name="log-out" size={20} />
            <span>log out</span>
          </button>
        </>
      )}
    </div>
  );
}
