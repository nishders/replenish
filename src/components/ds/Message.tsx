'use client';

import type { CSSProperties, ReactNode } from 'react';
import { Icon } from './Icon';

const TONES = {
  success: { bg: 'var(--success-100)', border: 'var(--success-500)', icon: 'circle-check', color: 'var(--success-500)' },
  error: { bg: 'var(--error-100)', border: 'var(--error-500)', icon: 'circle-alert', color: 'var(--error-500)' },
  info: { bg: 'var(--nish-100)', border: 'var(--nish-500)', icon: 'sparkles', color: 'var(--nish-600)' },
  warning: { bg: 'var(--zest-100)', border: 'var(--ink-900)', icon: 'circle-alert', color: 'var(--ink-900)' },
};

type MessageProps = {
  tone?: keyof typeof TONES;
  title?: ReactNode;
  children?: ReactNode;
  onDismiss?: () => void;
  style?: CSSProperties;
};

// Inline status message. Errors are announced as alerts, everything else as status.
export function Message({ tone = 'info', title, children, onDismiss, style }: MessageProps) {
  const t = TONES[tone] || TONES.info;
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        padding: '14px 16px',
        background: t.bg,
        border: `var(--border-thick) solid ${t.border}`,
        borderRadius: 'var(--radius-md)',
        color: 'var(--ink-900)',
        ...style,
      }}
    >
      <Icon name={t.icon} size={22} strokeWidth={2.25} color={t.color} style={{ marginTop: 1, flexShrink: 0 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {title && <strong style={{ fontWeight: 700, fontSize: 15 }}>{title}</strong>}
        {children && <span style={{ fontSize: 14, lineHeight: 1.45 }}>{children}</span>}
      </div>
      {onDismiss && (
        <button type="button" aria-label="dismiss" onClick={onDismiss} style={{ border: 0, background: 'none', cursor: 'pointer', padding: 2, color: 'var(--ink-900)' }}>
          <Icon name="x" size={18} />
        </button>
      )}
    </div>
  );
}
