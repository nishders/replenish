'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

export const SPRING = 'cubic-bezier(.34,1.56,.64,1)';

// Shared hover/press state for squishy interactions.
export function usePress(disabled?: boolean) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const bind = disabled
    ? {}
    : {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => {
          setHover(false);
          setPress(false);
        },
        onMouseDown: () => setPress(true),
        onMouseUp: () => setPress(false),
        onTouchStart: () => setPress(true),
        onTouchEnd: () => setPress(false),
      };
  return { hover, press, bind };
}

type QuipProps = {
  show: boolean;
  children?: ReactNode;
  placement?: 'above' | 'below';
  style?: CSSProperties;
};

// Hand-written hover caption ("quip"). Parent must be position:relative.
// Nudges itself sideways so it never pokes out of the viewport.
export function Quip({ show, children, placement = 'below', style }: QuipProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!show || !el) return;
    const measure = () => {
      if (!el.isConnected) return;
      el.style.translate = '0 0';
      const r = el.getBoundingClientRect();
      const vw = document.documentElement.clientWidth;
      const pad = 10;
      let dx = 0;
      if (r.left < pad) dx = pad - r.left;
      else if (r.right > vw - pad) dx = vw - pad - r.right;
      el.style.translate = `${dx}px 0`;
    };
    el.addEventListener('animationend', measure, { once: true });
    const t = setTimeout(measure, 340);
    return () => {
      clearTimeout(t);
      el.removeEventListener('animationend', measure);
    };
  }, [show]);

  if (!show || !children) return null;
  const pos: CSSProperties = placement === 'above' ? { bottom: 'calc(100% + 8px)' } : { top: 'calc(100% + 8px)' };
  return (
    <span
      ref={ref}
      role="tooltip"
      style={{
        position: 'absolute',
        left: '50%',
        ...pos,
        zIndex: 30,
        whiteSpace: 'nowrap',
        fontFamily: 'var(--font-hand)',
        fontSize: 17,
        lineHeight: 1.1,
        fontWeight: 400,
        letterSpacing: 0,
        textTransform: 'none',
        color: 'var(--ink-900)',
        background: 'var(--cream-50)',
        border: 'var(--border-thin) solid var(--ink-900)',
        borderRadius: 10,
        padding: '3px 9px 4px',
        pointerEvents: 'none',
        animation: 'nish-quip 300ms var(--ease-squish) forwards',
        ...style,
      }}
    >
      {children}
    </span>
  );
}
