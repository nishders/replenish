'use client';

import { useState, type ChangeEvent, type CSSProperties } from 'react';
import { Icon } from './Icon';

type TextFieldProps = {
  label?: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  name?: string;
  id?: string;
  autoComplete?: string;
  style?: CSSProperties;
};

// Labelled input. Password fields get a show/hide toggle; errors rattle the field and replace the hint.
export function TextField({
  label,
  type = 'text',
  value,
  defaultValue,
  placeholder,
  error,
  hint,
  disabled = false,
  onChange,
  name,
  id,
  autoComplete,
  style,
}: TextFieldProps) {
  const [show, setShow] = useState(false);
  const [focus, setFocus] = useState(false);
  const fid = id || name || (label ? 'f-' + label.replace(/\W+/g, '-').toLowerCase() : undefined);
  const isPw = type === 'password';
  const border = error ? 'var(--error-500)' : disabled ? 'var(--ink-300)' : 'var(--ink-900)';
  const msgId = fid ? fid + '-msg' : undefined;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && (
        <label htmlFor={fid} style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
          {label}
        </label>
      )}
      <div
        key={error || 'ok'}
        style={{ position: 'relative', display: 'flex', alignItems: 'center', animation: error ? 'nish-rattle 300ms 2' : undefined }}
      >
        <input
          id={fid}
          name={name}
          type={isPw && show ? 'text' : type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          onChange={onChange}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          aria-invalid={!!error}
          aria-describedby={error || hint ? msgId : undefined}
          style={{
            width: '100%',
            height: 52,
            padding: isPw ? '0 52px 0 18px' : '0 18px',
            borderRadius: 'var(--radius-md)',
            border: `var(--border-thick) solid ${border}`,
            background: disabled ? 'var(--cream-200)' : error ? 'var(--error-100)' : 'var(--cream-50)',
            color: 'var(--ink-900)',
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            outline: 'none',
            boxShadow: focus ? (error ? '4px 4px 0 var(--error-500)' : 'var(--shadow-brand)') : 'none',
            transition: 'box-shadow var(--dur-base) var(--ease-squish)',
          }}
        />
        {isPw && (
          <button
            type="button"
            aria-label={show ? 'hide password' : 'show password'}
            onClick={() => setShow((s) => !s)}
            disabled={disabled}
            style={{
              position: 'absolute',
              right: 8,
              width: 36,
              height: 36,
              border: 0,
              background: 'none',
              cursor: 'pointer',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--ink-700)',
            }}
          >
            <Icon name={show ? 'eye-off' : 'eye'} size={22} />
          </button>
        )}
      </div>
      {error ? (
        <span id={msgId} role="alert" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: 'var(--error-500)' }}>
          <Icon name="circle-alert" size={16} strokeWidth={2.25} />
          {error}
        </span>
      ) : hint ? (
        <span id={msgId} style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}
