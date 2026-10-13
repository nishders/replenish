'use client';

import type { CSSProperties, MouseEvent } from 'react';
import { packSrc, type Flavour } from '@/components/ds/assets';
import s from './auth.module.css';

type Drifter = { x: number; d: number; o: number; dx: number; r0: number; r1: number } & (
  | { can: Flavour; size: number }
  | { t: string; bg: string; hand?: boolean }
);

const POPS = ['+0g', 'pop!', 'nothing!', '0 cal', 'gone.', 'wow. empty.'];

const deskItems = (word: string): Drifter[] => [
  { can: 'vanilla', size: 130, x: 4, d: 22, o: 3, dx: 40, r0: -14, r1: 20 },
  { can: 'chocolate', size: 150, x: 78, d: 26, o: 14, dx: -50, r0: 12, r1: -18 },
  { can: 'strawberry', size: 120, x: 42, d: 20, o: 9, dx: 30, r0: -6, r1: 28 },
  { can: 'latte', size: 140, x: 86, d: 24, o: 2, dx: -30, r0: 18, r1: -10 },
  { t: '0g', bg: 'var(--cream-50)', x: 18, d: 17, o: 11, dx: 60, r0: -10, r1: 14 },
  { t: 'free', bg: 'var(--zest-500)', x: 64, d: 19, o: 5, dx: -40, r0: 8, r1: -16 },
  { t: '✶', bg: 'var(--nish-200)', x: 30, d: 15, o: 1, dx: 20, r0: 0, r1: 180 },
  { t: '0ml', bg: 'var(--cream-50)', x: 92, d: 18, o: 16, dx: -60, r0: 6, r1: -12 },
  { t: word, hand: true, bg: 'var(--cream-50)', x: 8, d: 21, o: 17, dx: 50, r0: -6, r1: 8 },
  { t: '£0.00', bg: 'var(--zest-500)', x: 54, d: 23, o: 19, dx: 30, r0: -4, r1: 10 },
  { t: '?', hand: true, bg: 'var(--nish-200)', x: 70, d: 16, o: 12, dx: -20, r0: 10, r1: -20 },
];

const phoneItems = (word: string): Drifter[] => [
  { can: 'vanilla', size: 90, x: 2, d: 20, o: 4, dx: 30, r0: -14, r1: 16 },
  { can: 'chocolate', size: 100, x: 74, d: 24, o: 13, dx: -30, r0: 12, r1: -14 },
  { can: 'latte', size: 90, x: 40, d: 22, o: 19, dx: 20, r0: -8, r1: 18 },
  { t: '0g', bg: 'var(--cream-50)', x: 20, d: 16, o: 9, dx: 30, r0: -10, r1: 12 },
  { t: 'free', bg: 'var(--zest-500)', x: 62, d: 18, o: 2, dx: -30, r0: 8, r1: -12 },
  { t: '✶', bg: 'var(--nish-200)', x: 86, d: 14, o: 7, dx: -20, r0: 0, r1: 160 },
  { t: word, hand: true, bg: 'var(--cream-50)', x: 10, d: 19, o: 15, dx: 40, r0: -6, r1: 6 },
];

// Hovering a drifter pops it (shrinks away, then comes back) and floats a little word up from it.
function pop(e: MouseEvent<HTMLDivElement>) {
  const outer = e.currentTarget;
  const inner = outer.firstElementChild as HTMLElement | null;
  const layer = outer.parentElement;
  if (!inner?.animate || !layer || outer.dataset.busy) return;
  outer.dataset.busy = '1';
  inner.animate(
    [
      { transform: 'scale(1)' },
      { transform: 'scale(1.4) rotate(-12deg)', offset: 0.3 },
      { transform: 'scale(0)', opacity: 0, offset: 0.55 },
      { transform: 'scale(0)', opacity: 0, offset: 0.8 },
      { transform: 'scale(1)', opacity: 1 },
    ],
    { duration: 1100, easing: 'cubic-bezier(.34,1.56,.64,1)' },
  ).onfinish = () => delete outer.dataset.busy;

  const L = layer.getBoundingClientRect();
  const R = outer.getBoundingClientRect();
  const word = document.createElement('span');
  word.className = s.popWord;
  word.textContent = POPS[Math.floor(Math.random() * POPS.length)];
  word.style.left = R.left + R.width / 2 - L.left + 'px';
  word.style.top = R.top + R.height / 2 - L.top + 'px';
  layer.appendChild(word);
  word.animate(
    [
      { transform: 'translateY(0) scale(.6) rotate(-6deg)', opacity: 0 },
      { transform: 'translateY(-24px) scale(1.1) rotate(-4deg)', opacity: 1, offset: 0.25 },
      { transform: 'translateY(-70px) scale(1) rotate(-2deg)', opacity: 0 },
    ],
    { duration: 1400, easing: 'ease-out', fill: 'forwards' },
  ).onfinish = () => word.remove();
}

// Cans and price chips drifting up behind the form. `word` is the page's hand-written chip.
export function AuthBackdrop({ word, phone = false }: { word: string; phone?: boolean }) {
  const items = phone ? phoneItems(word) : deskItems(word);
  return (
    <div aria-hidden="true" className={s.backdrop}>
      {items.map((it, i) => (
        <div
          key={i}
          className={s.drifter}
          onMouseEnter={pop}
          style={
            {
              left: it.x + '%',
              '--d': it.d + 's',
              '--o': -it.o + 's',
              '--dx': it.dx + 'px',
              '--r0': it.r0 + 'deg',
              '--r1': it.r1 + 'deg',
            } as CSSProperties
          }
        >
          {'can' in it ? (
            // eslint-disable-next-line @next/next/no-img-element -- decorative, animated with the Web Animations API
            <img
              src={packSrc(it.can)}
              alt=""
              draggable={false}
              className={s.driftCan}
              style={{ height: it.size, '--w': 2 + (i % 3) * 0.4 + 's' } as CSSProperties}
            />
          ) : (
            <span
              className={it.hand ? `${s.driftChip} ${s.driftHand}` : s.driftChip}
              style={{ background: it.bg, '--w': 1.8 + (i % 4) * 0.3 + 's' } as CSSProperties}
            >
              {it.t}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
