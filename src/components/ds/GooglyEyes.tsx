'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';

// Two googly eyes that watch the cursor from anywhere on the page and blink. Pure decoration.
export function GooglyEyes({ size = 30, blinkEvery = 3200, style }: { size?: number; blinkEvery?: number; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [a, setA] = useState({ x: 0, y: 0 });
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const m = (e: MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 200);
      const reach = size * 0.23;
      setA({ x: (dx / d) * reach * k, y: (dy / d) * reach * k });
    };
    window.addEventListener('mousemove', m);
    const b = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    }, blinkEvery);
    return () => {
      window.removeEventListener('mousemove', m);
      clearInterval(b);
    };
  }, [size, blinkEvery]);

  const eye = (k: number) => (
    <span
      key={k}
      style={{
        width: size,
        height: blink ? size * 0.14 : size,
        borderRadius: 99,
        background: 'var(--white)',
        border: 'var(--border-thick) solid var(--ink-900)',
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        transition: 'height 80ms',
      }}
    >
      <span
        style={{
          width: size * 0.43,
          height: size * 0.43,
          borderRadius: '50%',
          background: 'var(--ink-900)',
          transform: `translate(${a.x}px, ${a.y}px)`,
          transition: 'transform 120ms ease-out',
        }}
      />
    </span>
  );

  return (
    <span ref={ref} aria-hidden="true" style={{ display: 'inline-flex', gap: size * 0.12, height: size, alignItems: 'center', ...style }}>
      {eye(0)}
      {eye(1)}
    </span>
  );
}
