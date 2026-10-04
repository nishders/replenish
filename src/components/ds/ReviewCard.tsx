'use client';

import { useState, type CSSProperties } from 'react';
import { avatarSrc } from './assets';
import { Icon } from './Icon';

// Invented review: stars, a display-font quote and an avatar that tilts on hover.
export function ReviewCard({
  quote,
  name,
  role,
  rating = 5,
  avatar,
  avatarSrc: src,
  avatarTone = 'var(--zest-500)',
  invented = true,
  style,
}: {
  quote: string;
  name: string;
  role: string;
  rating?: number;
  avatar?: number;
  avatarSrc?: string;
  avatarTone?: string;
  invented?: boolean;
  style?: CSSProperties;
}) {
  const [h, setH] = useState(false);
  const img = src || (avatar ? avatarSrc(avatar) : null);
  const initials = (name || '?')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toLowerCase();

  return (
    <figure
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        padding: 28,
        background: 'var(--surface-raised)',
        border: 'var(--outline)',
        borderRadius: 'var(--radius-lg)',
        ...style,
      }}
    >
      <div role="img" aria-label={`${rating} out of 5 stars`} style={{ display: 'flex', gap: 3, color: 'var(--nish-500)' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Icon key={i} name="star" size={18} look="clean" strokeWidth={2} style={{ fill: i < rating ? 'currentColor' : 'none' }} />
        ))}
      </div>
      <blockquote style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 24, lineHeight: 1.15 }}>
        “{quote}”
      </blockquote>
      <figcaption style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto' }}>
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element -- small fixed-size avatar
          <img
            src={img}
            alt=""
            width={56}
            height={56}
            loading="lazy"
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              border: 'var(--border-thick) solid var(--ink-900)',
              flexShrink: 0,
              transform: h ? 'rotate(-10deg) scale(1.08)' : 'none',
              transition: 'transform var(--dur-slow) var(--ease-squish)',
            }}
          />
        ) : (
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              background: avatarTone,
              border: 'var(--border-thin) solid var(--ink-900)',
              display: 'grid',
              placeItems: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: 16,
            }}
          >
            {initials}
          </span>
        )}
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: 700, fontSize: 15 }}>{name}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
            {role}
            {invented ? ' · invented' : ''}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
