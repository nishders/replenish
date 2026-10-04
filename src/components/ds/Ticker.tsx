'use client';

import { Fragment, useState, type CSSProperties } from 'react';

const DEFAULT = ['now with even less', 'clinically untested', 'loved by zero athletes', 'a very nish product', '0g protein', 'everything is free'];

// Scrolling marquee band. Pauses on hover.
export function Ticker({
  items = DEFAULT,
  tone = 'brand',
  speed = 40,
  style,
}: {
  items?: string[];
  tone?: 'brand' | 'accent' | 'ink';
  speed?: number;
  style?: CSSProperties;
}) {
  const [h, setH] = useState(false);
  const bg = tone === 'accent' ? 'var(--zest-500)' : tone === 'ink' ? 'var(--ink-900)' : 'var(--nish-500)';
  const fg = tone === 'accent' ? 'var(--ink-900)' : 'var(--cream-50)';
  const row = [...items, ...items];
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        height: 'var(--ticker-h)',
        background: bg,
        color: fg,
        overflow: 'hidden',
        borderBottom: 'var(--border-thin) solid var(--ink-900)',
        display: 'flex',
        alignItems: 'center',
        ...style,
      }}
    >
      <div
        data-marquee=""
        style={{
          display: 'flex',
          gap: 22,
          whiteSpace: 'nowrap',
          animation: `nish-marquee ${speed}s linear infinite`,
          animationPlayState: h ? 'paused' : 'running',
          paddingLeft: 22,
        }}
      >
        {[0, 1].map((k) => (
          <div key={k} aria-hidden={k === 1 ? true : undefined} style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
            {row.map((t, i) => (
              <Fragment key={i}>
                <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 13 }}>{t}</span>
                <span aria-hidden="true" style={{ fontSize: 15 }}>
                  ✶
                </span>
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
