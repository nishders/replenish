'use client';

import { useState, type CSSProperties, type HTMLAttributes, type MouseEvent } from 'react';
import { packSrc, type Flavour } from './assets';

export const FLAVOURS: Record<Flavour, { color: string; tint: string; label: string; fg: string }> = {
  vanilla: { color: 'var(--flavour-vanilla)', tint: 'var(--flavour-vanilla-tint)', label: 'vanilla-ish', fg: 'var(--ink-900)' },
  chocolate: { color: 'var(--flavour-chocolate)', tint: 'var(--flavour-chocolate-tint)', label: 'chocolate, allegedly', fg: 'var(--cream-50)' },
  strawberry: { color: 'var(--flavour-strawberry)', tint: 'var(--flavour-strawberry-tint)', label: 'strawberry (trace amounts)', fg: 'var(--ink-900)' },
  latte: { color: 'var(--flavour-latte)', tint: 'var(--flavour-latte-tint)', label: 'iced latte, roughly', fg: 'var(--ink-900)' },
};

type PackProps = Omit<HTMLAttributes<HTMLSpanElement>, 'style'> & {
  flavour?: Flavour;
  size?: number;
  src?: string;
  hoverSrc?: string;
  tilt?: 'lean' | '3d' | 'none';
  hovered?: boolean;
  label?: string;
  shadow?: boolean;
  style?: CSSProperties;
};

// Product pack — the real can (public/packs/<flavour>.png).
// Hover: can lifts, ground shadow shrinks, a glint sweeps across the metal. hoverSrc cross-fades an alternate image if supplied.
export function Pack({ flavour = 'vanilla', size = 220, src, hoverSrc, tilt = 'lean', hovered, label, shadow = true, style, ...rest }: PackProps) {
  const f = FLAVOURS[flavour] || FLAVOURS.vanilla;
  const [own, setOwn] = useState(false);
  const [t, setT] = useState({ x: 0, y: 0 });
  const on = hovered ?? own;
  const img = src || packSrc(flavour);
  const w = size * 0.401;

  const move = (e: MouseEvent<HTMLSpanElement>) => {
    if (tilt !== '3d') return;
    const r = e.currentTarget.getBoundingClientRect();
    setT({ x: (e.clientX - r.left) / r.width - 0.5, y: (e.clientY - r.top) / r.height - 0.5 });
  };
  const leave = () => {
    setOwn(false);
    setT({ x: 0, y: 0 });
  };

  const lift = on ? ' translateY(-' + Math.round(size * 0.035) + 'px)' : '';
  const tf =
    tilt === '3d'
      ? `perspective(700px) rotateY(${t.x * 40}deg) rotateX(${-t.y * 28}deg) translateZ(${on ? 24 : 0}px)${lift}`
      : tilt === 'lean' && on
        ? 'rotate(var(--tilt-hover)) translateY(-4px)'
        : on
          ? lift.trim() || 'none'
          : 'none';
  const tr = tilt === '3d' && on ? 'transform 90ms linear' : 'transform 600ms var(--ease-squish)';
  const name = label || f.label;
  const imgStyle: CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', transition: 'opacity 160ms' };

  return (
    <span
      role="img"
      aria-label={name + ' can'}
      onMouseEnter={() => setOwn(true)}
      onMouseMove={move}
      onMouseLeave={leave}
      {...rest}
      style={{ width: w, height: size, display: 'inline-block', position: 'relative', flexShrink: 0, ...style }}
    >
      {shadow && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '8%',
            right: '8%',
            bottom: -size * 0.012,
            height: size * 0.035,
            borderRadius: '50%',
            background: 'var(--ink-900)',
            opacity: on ? 0.1 : 0.18,
            transform: on ? 'scaleX(.78)' : 'none',
            transition: 'transform 600ms var(--ease-squish), opacity 400ms',
          }}
        />
      )}
      <span style={{ position: 'absolute', inset: 0, transformOrigin: '50% 90%', transform: tf, transition: tr }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- sized by the pack box, mask reuses the same URL */}
        <img src={img} alt="" draggable={false} style={{ ...imgStyle, opacity: hoverSrc && on ? 0 : 1 }} />
        {hoverSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hoverSrc} alt="" draggable={false} style={{ ...imgStyle, opacity: on ? 1 : 0 }} />
        )}
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            WebkitMaskImage: `url("${img}")`,
            maskImage: `url("${img}")`,
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
            background: 'linear-gradient(105deg, transparent 38%, rgba(255,255,255,.55) 47%, rgba(255,255,255,.1) 53%, transparent 60%)',
            backgroundSize: '260% 100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: on ? '0% 0' : '130% 0',
            transition: on ? 'background-position 700ms var(--ease-out)' : 'none',
            mixBlendMode: 'soft-light',
            pointerEvents: 'none',
          }}
        />
      </span>
    </span>
  );
}
