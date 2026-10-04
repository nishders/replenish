'use client';

import { useEffect, useState, type CSSProperties, type SVGProps } from 'react';
import { CLEAN, SKETCH } from './icon-data';

// Default hover captions. Keep them short, confident and useless.
export const QUIPS: Record<string, string> = {
  search: 'look for protein (good luck)',
  user: 'you, allegedly',
  'shopping-bag': 'bag of nothing',
  plus: 'add more nothing',
  minus: 'even less. love it.',
  'trash-2': 'un-nothing it',
  'arrow-right': 'onwards, bravely',
  'arrow-left': 'retreat!',
  x: 'nope',
  heart: 'unrequited',
  mail: 'zero spam, zero shakes',
  menu: 'the whole menu (4 things)',
  star: 'rate the void',
  'log-out': 'leaving? already?',
  package: 'contains air (maybe)',
  eye: 'peek',
  'eye-off': 'un-peek',
  check: 'done. somehow.',
  lock: 'very secure nothing',
  github: 'the only real part',
  instagram: "pics or it didn't happen",
  sparkles: 'magic (none)',
  'chevron-down': 'more, below',
  'circle-alert': 'uh oh',
  'circle-check': 'nailed it',
  shield: 'protected from protein',
};

type IconProps = Omit<SVGProps<SVGSVGElement>, 'name' | 'style'> & {
  name: string;
  size?: number;
  look?: 'sketch' | 'clean';
  boil?: boolean;
  frame?: number;
  strokeWidth?: number;
  color?: string;
  style?: CSSProperties;
};

/** Hand-drawn (rough) Lucide icon. look="clean" for the plain Lucide line. boil = jitter between two drawn frames. */
export function Icon({ name, size = 20, look, boil = false, frame = 0, strokeWidth, color = 'currentColor', style, ...rest }: IconProps) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!boil) return;
    const t = setInterval(() => setTick((x) => x + 1), 170);
    return () => clearInterval(t);
  }, [boil]);
  const f = boil ? (tick + 1) % 2 : 0;

  if (!CLEAN[name]) return null;
  const mode = look || (size < 18 ? 'clean' : 'sketch');
  const base = {
    xmlns: 'http://www.w3.org/2000/svg',
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    style: { flexShrink: 0, display: 'block', overflow: 'visible', ...style },
    ...rest,
  };
  if (mode === 'sketch' && SKETCH[name]) {
    return (
      <svg {...base} strokeWidth={strokeWidth || (size >= 32 ? 1.35 : 1.6)}>
        <path d={SKETCH[name][(frame + f) % 2]} />
      </svg>
    );
  }
  return <svg {...base} strokeWidth={strokeWidth || 1.75} dangerouslySetInnerHTML={{ __html: CLEAN[name] }} />;
}
