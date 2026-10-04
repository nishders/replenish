'use client';

import { useEffect, useState, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';
import { Icon, QUIPS } from './Icon';
import { BUBBLES } from './icon-data';
import { Quip, usePress } from './interaction';

/** Scribble-filled doodle circle used behind sketch icons. */
export function DoodleBubble({
  size = 44,
  seed = 0,
  hatch = 'var(--zest-500)',
  ink = 'var(--ink-900)',
  style,
}: {
  size?: number;
  seed?: number;
  hatch?: string;
  ink?: string;
  style?: CSSProperties;
}) {
  const b = BUBBLES[seed % BUBBLES.length];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'visible', ...style }}>
      <circle cx="32" cy="32" r="28" fill="var(--cream-50)" />
      <path d={b.hatch} fill="none" stroke={hatch} strokeWidth="1.4" strokeLinecap="round" />
      <path d={b.outline} fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> & {
  icon: string;
  label: string;
  quip?: ReactNode | false;
  size?: number;
  variant?: 'sketch' | 'filled' | 'outline';
  badge?: number | null;
  rattle?: boolean;
  cartTarget?: boolean;
  seed?: number;
  style?: CSSProperties;
};

// Icon in a hand-drawn doodle bubble. Hover tilts the bubble, boils the icon and shows a quip. Empty bags rattle.
export function IconButton({
  icon,
  label,
  quip,
  size = 44,
  variant = 'sketch',
  badge,
  rattle,
  cartTarget = false,
  disabled = false,
  seed,
  onClick,
  style,
  ...rest
}: IconButtonProps) {
  const { hover, press, bind } = usePress(disabled);
  const [bump, setBump] = useState(0);
  useEffect(() => {
    if (!cartTarget) return;
    const on = () => setBump((b) => b + 1);
    window.addEventListener('nish:cart-bump', on);
    return () => window.removeEventListener('nish:cart-bump', on);
  }, [cartTarget]);

  const empty = icon === 'shopping-bag' && (badge == null || badge === 0);
  const doRattle = rattle ?? empty;
  const text = quip === false ? null : quip || (empty ? '*rattle* … nothing in here' : QUIPS[icon]);
  const filled = variant === 'filled';
  const sketch = variant === 'sketch';
  const s = seed ?? (icon || '').length;

  return (
    <span style={{ position: 'relative', display: 'inline-flex', flexShrink: 0, ...style }}>
      <button
        type="button"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
        data-cart-target={cartTarget ? '' : undefined}
        {...bind}
        {...rest}
        style={{
          position: 'relative',
          width: size,
          height: size,
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          padding: 0,
          border: sketch ? 0 : 'var(--border-thin) solid ' + (disabled ? 'var(--ink-300)' : 'var(--ink-900)'),
          background: sketch ? 'transparent' : filled ? (hover ? 'var(--nish-400)' : 'var(--nish-500)') : hover ? 'var(--zest-500)' : 'transparent',
          color: disabled ? 'var(--ink-300)' : filled ? 'var(--cream-50)' : 'var(--ink-900)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          animation: hover && doRattle ? 'nish-rattle 380ms infinite' : undefined,
          transform: press ? 'scale(.86)' : hover && !doRattle ? 'rotate(-10deg) scale(1.08)' : 'none',
          transition: 'transform var(--dur-slow) var(--ease-squish), background var(--dur-fast)',
        }}
      >
        <span
          key={bump}
          style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', animation: bump ? 'nish-jiggle 500ms' : undefined }}
        >
          {sketch && <DoodleBubble size={size} seed={s} hatch={hover ? 'var(--nish-300)' : 'var(--zest-500)'} />}
          <Icon name={icon} size={Math.round(size * 0.48)} boil={hover} style={{ position: 'relative' }} />
        </span>
        {badge != null && badge !== 0 && (
          <span
            key={'b' + badge}
            style={{
              position: 'absolute',
              top: -5,
              right: -7,
              minWidth: 22,
              height: 22,
              padding: '0 6px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--ink-900)',
              color: 'var(--cream-50)',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              fontSize: 11,
              lineHeight: '22px',
              textAlign: 'center',
              animation: 'nish-pop var(--dur-slow) var(--ease-squish)',
            }}
          >
            {badge}
          </span>
        )}
      </button>
      <Quip show={hover && !disabled}>{text}</Quip>
    </span>
  );
}
