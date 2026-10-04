'use client';

import { useState, type CSSProperties, type ReactNode } from 'react';
import { IconButton } from './IconButton';
import { Logo } from './Logo';
import { Quip } from './interaction';

export type NavItem = { label: string; id: string; href: string; quip?: string };

function NavLink({ children, href, active, quip, onClick }: { children: ReactNode; href: string; active?: boolean; quip?: string; onClick?: () => void }) {
  const [h, setH] = useState(false);
  return (
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <a
        href={href}
        onClick={onClick}
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          fontWeight: active ? 700 : 500,
          color: 'var(--ink-900)',
          textDecoration: 'underline',
          textDecorationStyle: h ? 'wavy' : 'solid',
          textDecorationThickness: active || h ? 2 : 1,
          textUnderlineOffset: h ? 6 : 4,
          transition: 'text-underline-offset var(--dur-base) var(--ease-squish)',
        }}
      >
        {children}
      </a>
      <Quip show={h}>{quip}</Quip>
    </span>
  );
}

const LINKS: NavItem[] = [
  { label: 'shop', id: 'shop', href: '/shop', quip: "it's all free" },
  { label: 'what is this?', id: 'about', href: '/#about', quip: 'good question' },
];

type NavBarProps = {
  links?: NavItem[];
  active?: string;
  cartCount?: number;
  loggedIn?: boolean;
  compact?: boolean;
  logoHref?: string;
  onNavigate?: (id: string) => void;
  onCart?: () => void;
  onAccount?: () => void;
  onMenu?: () => void;
  transparent?: boolean;
  style?: CSSProperties;
};

// Centred wordmark nav: underlined text links left, doodle icon buttons right. compact = phone (menu · logo · cart).
export function NavBar({
  links = LINKS,
  active,
  cartCount = 0,
  loggedIn = false,
  compact = false,
  logoHref = '/',
  onNavigate,
  onCart,
  onAccount,
  onMenu,
  transparent = false,
  style,
}: NavBarProps) {
  const bar: CSSProperties = {
    height: 'var(--nav-h)',
    display: 'grid',
    gridTemplateColumns: '1fr auto 1fr',
    alignItems: 'center',
    gap: 16,
    padding: '0 var(--gutter)',
    background: transparent ? 'transparent' : 'var(--surface-page)',
    borderBottom: transparent ? 0 : 'var(--rule)',
    position: 'relative',
    zIndex: 5,
    ...style,
  };
  const logo = (
    <a href={logoHref} aria-label="replenish home" onClick={() => onNavigate?.('home')} style={{ textDecoration: 'none', justifySelf: 'center' }}>
      <Logo size={compact ? 28 : 36} />
    </a>
  );
  const cart = (
    <IconButton
      icon="shopping-bag"
      label="cart"
      size={compact ? 40 : 44}
      badge={cartCount}
      cartTarget
      onClick={onCart}
      quip={cartCount ? `${cartCount} × nothing` : undefined}
    />
  );

  if (compact) {
    return (
      <nav style={{ ...bar, height: 60 }}>
        <div>
          <IconButton icon="menu" label="menu" size={40} onClick={onMenu} />
        </div>
        {logo}
        <div style={{ justifySelf: 'end' }}>{cart}</div>
      </nav>
    );
  }
  return (
    <nav style={bar}>
      <div style={{ display: 'flex', gap: 22 }}>
        {links.map((l) => (
          <NavLink key={l.id} href={l.href} active={active === l.id} quip={l.quip} onClick={() => onNavigate?.(l.id)}>
            {l.label}
          </NavLink>
        ))}
      </div>
      {logo}
      <div style={{ display: 'flex', gap: 12, justifySelf: 'end', alignItems: 'center' }}>
        <IconButton
          icon="user"
          label={loggedIn ? 'my orders' : 'log in'}
          quip={loggedIn ? 'your orders of nothing' : undefined}
          onClick={onAccount}
        />
        {cart}
      </div>
    </nav>
  );
}
