'use client';

import { useState, type CSSProperties } from 'react';
import { Icon } from './Icon';

function Step({ icon, label, onClick, disabled }: { icon: string; label: string; onClick: () => void; disabled: boolean }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        width: 36,
        height: '100%',
        border: 0,
        background: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        color: disabled ? 'var(--ink-300)' : 'var(--ink-900)',
        display: 'grid',
        placeItems: 'center',
        transform: pressed ? 'scale(.8)' : 'none',
        transition: 'transform var(--dur-fast) var(--ease-squish)',
      }}
    >
      <Icon name={icon} size={20} strokeWidth={2} />
    </button>
  );
}

type QuantityStepperProps = {
  value?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md';
  label?: string; // what is being counted, for screen readers
  style?: CSSProperties;
};

// Pill-shaped − n + control. The number pops when it changes.
export function QuantityStepper({ value = 1, min = 1, max = 99, onChange, size = 'md', label = 'quantity', style }: QuantityStepperProps) {
  const h = size === 'sm' ? 34 : 42;
  const set = (v: number) => onChange?.(Math.max(min, Math.min(max, v)));
  return (
    <div
      role="group"
      aria-label={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: h,
        borderRadius: 'var(--radius-pill)',
        border: 'var(--border-thick) solid var(--ink-900)',
        background: 'var(--cream-50)',
        ...style,
      }}
    >
      <Step icon="minus" label="decrease" onClick={() => set(value - 1)} disabled={value <= min} />
      <span
        key={value}
        aria-live="polite"
        style={{
          display: 'inline-block',
          animation: 'nish-pop 320ms var(--ease-squish)',
          minWidth: 24,
          textAlign: 'center',
          fontFamily: 'var(--font-mono)',
          fontWeight: 500,
          fontSize: 15,
        }}
      >
        {value}
      </span>
      <Step icon="plus" label="increase" onClick={() => set(value + 1)} disabled={value >= max} />
    </div>
  );
}
