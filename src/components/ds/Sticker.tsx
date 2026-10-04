'use client';

import { useRef, useState, type CSSProperties, type HTMLAttributes, type PointerEvent } from 'react';

const TONES = {
  free: { bg: 'var(--zest-500)', fg: 'var(--ink-900)' },
  'not-real': { bg: 'var(--nish-500)', fg: 'var(--cream-50)' },
  ink: { bg: 'var(--ink-900)', fg: 'var(--cream-100)' },
  cream: { bg: 'var(--cream-50)', fg: 'var(--ink-900)' },
  vanilla: { bg: 'var(--flavour-vanilla)', fg: 'var(--ink-900)' },
  chocolate: { bg: 'var(--flavour-chocolate)', fg: 'var(--cream-50)' },
  strawberry: { bg: 'var(--flavour-strawberry)', fg: 'var(--ink-900)' },
  latte: { bg: 'var(--flavour-latte)', fg: 'var(--ink-900)' },
};

type StickerProps = Omit<HTMLAttributes<HTMLSpanElement>, 'style'> & {
  tone?: keyof typeof TONES;
  shape?: 'pill' | 'round';
  rotate?: number;
  wobble?: boolean;
  peelable?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: CSSProperties;
};

// Outlined pill/circle sticker. peelable: drag it anywhere, it swings with drag speed and re-sticks at a random angle.
export function Sticker({ tone = 'free', shape = 'pill', rotate = -4, wobble = false, peelable = false, size = 'md', children, style, ...rest }: StickerProps) {
  const t = TONES[tone] || TONES.free;
  const [hover, setHover] = useState(false);
  const [p, setP] = useState({ x: 0, y: 0, r: rotate, lift: false });
  const drag = useRef<{ sx: number; sy: number; lx: number } | null>(null);
  const round = shape === 'round';
  const fs = size === 'sm' ? 12 : size === 'lg' ? 18 : 14;
  const dim = size === 'sm' ? 64 : size === 'lg' ? 120 : 88;

  const down = (e: PointerEvent<HTMLSpanElement>) => {
    if (!peelable) return;
    e.preventDefault();
    drag.current = { sx: e.clientX - p.x, sy: e.clientY - p.y, lx: e.clientX };
    e.currentTarget.setPointerCapture?.(e.pointerId);
    setP((v) => ({ ...v, lift: true }));
  };
  const move = (e: PointerEvent<HTMLSpanElement>) => {
    const d = drag.current;
    if (!d) return;
    const vx = e.clientX - d.lx;
    d.lx = e.clientX;
    setP((v) => ({ ...v, x: e.clientX - d.sx, y: e.clientY - d.sy, r: Math.max(-28, Math.min(28, vx * 2.5)) }));
  };
  const up = () => {
    if (!drag.current) return;
    drag.current = null;
    setP((v) => ({ ...v, lift: false, r: Math.round(Math.random() * 20 - 10) }));
  };

  const r = peelable ? p.r : hover ? rotate * -1 : rotate;
  return (
    <span
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      {...rest}
      style={{
        position: 'relative',
        zIndex: p.lift ? 50 : undefined,
        touchAction: peelable ? 'none' : undefined,
        cursor: peelable ? (p.lift ? 'grabbing' : 'grab') : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        ...(round
          ? { width: dim, height: dim, borderRadius: '50%', padding: 8, lineHeight: 1.05 }
          : {
              padding: size === 'sm' ? '4px 10px' : size === 'lg' ? '8px 18px' : '6px 14px',
              borderRadius: 'var(--radius-pill)',
              lineHeight: 1.1,
              whiteSpace: 'nowrap',
            }),
        background: t.bg,
        color: t.fg,
        border: 'var(--border-thick) solid var(--ink-900)',
        boxShadow: p.lift ? '7px 9px 0 var(--ink-900)' : 'var(--shadow-sm)',
        fontFamily: round ? 'var(--font-display)' : 'var(--font-body)',
        fontWeight: round ? 400 : 700,
        fontSize: round ? fs + 2 : fs,
        transform: `translate(${p.x}px, ${p.y}px) rotate(${r}deg) scale(${p.lift ? 1.12 : peelable && hover ? 1.04 : 1})`,
        transition: p.lift ? 'transform 70ms linear, box-shadow 120ms' : 'transform 520ms var(--ease-squish), box-shadow 200ms',
        animation: wobble && !p.lift && !hover ? 'nish-wobble 2.4s var(--ease-in-out) infinite' : undefined,
        userSelect: 'none',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
