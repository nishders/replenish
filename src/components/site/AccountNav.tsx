'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ds/Button';
import { Icon } from '@/components/ds/Icon';
import { IconButton } from '@/components/ds/IconButton';
import { Quip } from '@/components/ds/interaction';
import { getBrowserSupabase } from '@/lib/supabase-browser';
import { useAuth } from '@/lib/useAuth';
import { LOGIN_HREF, ORDERS_HREF } from './content';
import s from './site.module.css';

// Nav account slot: "log in" when signed out; email pill (desktop) or account button (phone) with a menu when signed in.
export function AccountNav({ compact = false, quip }: { compact?: boolean; quip?: string }) {
  const { user, ready } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pillHover, setPillHover] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  // Close the menu on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) {
    return (
      <span className={s.loginSlot} style={{ visibility: ready ? 'visible' : 'hidden' }}>
        <Button variant="text" size="sm" quip={quip} onClick={() => router.push(LOGIN_HREF)}>
          log in
        </Button>
      </span>
    );
  }

  const email = user.email ?? 'you';
  const logOut = async () => {
    setOpen(false);
    await getBrowserSupabase().auth.signOut();
    router.refresh();
  };

  return (
    <div ref={wrap} className={s.account}>
      {compact ? (
        <IconButton icon="user" label="account menu" size={40} quip={false} aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)} />
      ) : (
        <>
          <button
            type="button"
            className={s.pill}
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            onMouseEnter={() => setPillHover(true)}
            onMouseLeave={() => setPillHover(false)}
          >
            <Icon name="user" size={20} />
            <span className={s.pillEmail}>{email}</span>
            <Icon name="chevron-down" size={18} />
          </button>
          <Quip show={pillHover && !open}>it&apos;s you. hi. again.</Quip>
        </>
      )}
      {open && (
        <div role="menu" className={compact ? `${s.menu} ${s.menuPhone}` : s.menu}>
          <div className={s.menuHead}>
            <span className={s.menuLabel}>signed in as</span>
            <span className={s.menuEmail}>{email}</span>
            <span className={s.menuAside}>you keep coming back. it&apos;s a lot.</span>
          </div>
          <a role="menuitem" href={ORDERS_HREF} className={s.menuItem}>
            <Icon name="package" size={20} />
            <span>my orders</span>
          </a>
          <button type="button" role="menuitem" className={s.menuItem} onClick={logOut}>
            <Icon name="log-out" size={20} />
            <span>log out</span>
          </button>
        </div>
      )}
    </div>
  );
}
