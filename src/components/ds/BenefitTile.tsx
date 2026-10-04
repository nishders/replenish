'use client';

import { useState, type CSSProperties } from 'react';

const BG = {
  cream: 'var(--cream-50)',
  brand: 'var(--nish-500)',
  accent: 'var(--zest-500)',
  vanilla: 'var(--flavour-vanilla-tint)',
  strawberry: 'var(--flavour-strawberry-tint)',
  latte: 'var(--flavour-latte-tint)',
  chocolate: 'var(--flavour-chocolate-tint)',
};

// Outlined tile with a hand-font doodle that spins on hover.
export function BenefitTile({
  doodle = '✶',
  title,
  body,
  tone = 'cream',
  style,
}: {
  doodle?: string;
  title: string;
  body: string;
  tone?: keyof typeof BG;
  style?: CSSProperties;
}) {
  const bg = BG[tone] || BG.cream;
  const fg = tone === 'brand' ? 'var(--cream-50)' : 'var(--ink-900)';
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 24,
        background: bg,
        color: fg,
        border: 'var(--outline)',
        borderRadius: 'var(--radius-lg)',
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          fontFamily: 'var(--font-hand)',
          fontSize: 52,
          lineHeight: 1,
          display: 'inline-block',
          width: 'fit-content',
          transform: h ? 'rotate(14deg) scale(1.1)' : 'rotate(-6deg)',
          transition: 'transform var(--dur-slow) var(--ease-squish)',
        }}
      >
        {doodle}
      </span>
      <h3 style={{ fontSize: 26, lineHeight: 1.05 }}>{title}</h3>
      <p style={{ fontSize: 15, lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}
