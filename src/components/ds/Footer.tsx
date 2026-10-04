import type { CSSProperties } from 'react';
import { GooglyEyes } from './GooglyEyes';
import { Logo } from './Logo';

export type FooterColumn = { title: string; links: { label: string; href: string }[] };

// Disclaimer + googly eyes, link columns, and a huge wordmark across the bottom.
export function Footer({
  columns,
  disclaimer = 'replenish is a portfolio project. Please do not attempt to drink this website.',
  credit = 'designed & built by nish',
  style,
}: {
  columns: FooterColumn[];
  disclaimer?: string;
  credit?: string;
  style?: CSSProperties;
}) {
  return (
    <footer style={{ background: 'var(--surface-page)', borderTop: 'var(--rule)', ...style }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, padding: '48px var(--gutter) 40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 320 }}>
          <GooglyEyes size={26} />
          <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15 }}>{disclaimer}</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>{credit}</p>
        </div>
        {columns.map((c) => (
          <div key={c.title} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-caps)',
                color: 'var(--text-muted)',
              }}
            >
              {c.title}
            </span>
            {c.links.map((l) => (
              <a key={l.label} href={l.href} style={{ fontSize: 14, color: 'var(--ink-900)', textDecoration: 'none' }}>
                {l.label}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: 'var(--rule)', padding: '12px var(--gutter) 20px', overflow: 'hidden' }}>
        <Logo size="min(17vw, 240px)" style={{ display: 'flex', justifyContent: 'center', lineHeight: 1.1 }} />
      </div>
    </footer>
  );
}
