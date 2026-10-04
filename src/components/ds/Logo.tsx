'use client';

import { useState, type CSSProperties, type ElementType, type HTMLAttributes } from 'react';

const JIT = {
  r: [-4, 3, -2, 4, -3, 3, -3, 4, -2],
  y: [0, -0.03, 0.02, -0.02, 0.03, 0.02, -0.03, 0, -0.02],
};

type LogoProps = Omit<HTMLAttributes<HTMLElement>, 'style'> & {
  treatment?: 'hand' | 'highlight' | 'plain';
  short?: boolean;
  mono?: boolean;
  size?: number | string;
  color?: string;
  animated?: boolean;
  as?: ElementType;
  style?: CSSProperties;
};

// Type-only wordmark in Darumadrop One: "reple" + a tilted, accent-coloured "nish". Letters jitter like hand lettering and hop on hover.
export function Logo({ treatment = 'hand', short = false, mono = false, size = 32, color, animated = true, as: Tag = 'span', style, ...rest }: LogoProps) {
  const [hover, setHover] = useState(false);
  const ink = color || (mono ? 'currentColor' : 'var(--ink-900)');
  const accent = mono || treatment === 'plain' ? ink : 'var(--nish-500)';
  const hop = hover && animated;

  const letter = (ch: string, i: number) => (
    <span
      key={i}
      style={{
        display: 'inline-block',
        transform: `translateY(${hop ? -0.09 : JIT.y[i]}em) rotate(${JIT.r[i] * (hop ? -1 : 1)}deg)`,
        transition: `transform 380ms cubic-bezier(.34,1.56,.64,1) ${i * 28}ms`,
      }}
    >
      {ch}
    </span>
  );
  const word = (str: string, offset: number) => str.split('').map((c, i) => letter(c, i + offset));

  const nish = (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        transform: 'rotate(-5deg) translateY(-0.04em)',
        fontSize: '1.08em',
        marginLeft: short ? 0 : '0.03em',
      }}
    >
      {treatment === 'highlight' && (
        <span
          aria-hidden="true"
          style={
            mono
              ? { position: 'absolute', left: 0, right: 0, bottom: '0.06em', height: '0.1em', background: ink, borderRadius: 99 }
              : {
                  position: 'absolute',
                  left: '-0.08em',
                  right: '-0.08em',
                  top: '0.22em',
                  bottom: '0.02em',
                  background: 'var(--zest-500)',
                  borderRadius: '0.4em 0.22em 0.38em 0.18em',
                  transform: 'rotate(3deg)',
                }
          }
        />
      )}
      <span style={{ position: 'relative', display: 'inline-flex', color: treatment === 'highlight' ? ink : accent }}>{word('nish', 5)}</span>
    </span>
  );

  return (
    <Tag
      aria-label={short ? 'nish' : 'replenish'}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...rest}
      style={{
        fontFamily: 'var(--font-logo)',
        fontWeight: 400,
        fontSize: size,
        lineHeight: 1.15,
        letterSpacing: '-0.01em',
        color: ink,
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'baseline',
        ...style,
      }}
    >
      {!short && <span style={{ display: 'inline-flex' }}>{word('reple', 0)}</span>}
      {nish}
    </Tag>
  );
}
