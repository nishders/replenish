'use client';

import { useState, type CSSProperties } from 'react';
import { Icon } from './Icon';

// Ruled +/− accordion. One item open at a time unless multiple.
export function Accordion({
  items = [],
  defaultOpen = 0,
  multiple = false,
  style,
}: {
  items: { title: string; body: string }[];
  defaultOpen?: number | null;
  multiple?: boolean;
  style?: CSSProperties;
}) {
  const [open, setOpen] = useState(() => new Set<number>(defaultOpen == null ? [] : [defaultOpen]));
  const toggle = (i: number) =>
    setOpen((prev) => {
      const n = new Set(multiple ? prev : []);
      if (prev.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', ...style }}>
      {items.map((it, i) => {
        const o = open.has(i);
        return (
          <div key={i} style={{ borderBottom: 'var(--border-thin) solid var(--ink-900)' }}>
            <button
              type="button"
              aria-expanded={o}
              onClick={() => toggle(i)}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 16,
                padding: '18px 0',
                background: 'none',
                border: 0,
                cursor: 'pointer',
                color: 'var(--ink-900)',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: 17,
                textAlign: 'left',
              }}
            >
              {it.title}
              <Icon
                name="plus"
                size={20}
                strokeWidth={2.25}
                style={{ transform: o ? 'rotate(45deg)' : 'none', transition: 'transform var(--dur-base) var(--ease-squish)' }}
              />
            </button>
            <div style={{ display: 'grid', gridTemplateRows: o ? '1fr' : '0fr', transition: 'grid-template-rows var(--dur-base) var(--ease-out)' }}>
              <div style={{ overflow: 'hidden' }}>
                <p
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 13,
                    lineHeight: 'var(--leading-mono)',
                    color: 'var(--text-secondary)',
                    paddingBottom: 18,
                    maxWidth: 560,
                  }}
                >
                  {it.body}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
