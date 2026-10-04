import type { CSSProperties } from 'react';

type Row = { label: string; value: string; bold?: boolean; indent?: boolean };

const ROWS: Row[] = [
  { label: 'protein', value: '0g', bold: true },
  { label: 'sugar', value: '0g', bold: true },
  { label: 'drink', value: '0g', bold: true },
  { label: 'calories', value: '0' },
  { label: 'vibes', value: 'trace', indent: true },
  { label: 'self-awareness', value: '212%', indent: true },
];

// Joke nutrition label: chunky outline, mono rows, thick rules.
export function NutritionPanel({
  title = 'nutrition-ish facts',
  serving = 'serving size: 1 imaginary bottle (0ml)',
  rows = ROWS,
  footnote = '% daily value based on a diet of nothing.',
  style,
}: {
  title?: string;
  serving?: string;
  rows?: Row[];
  footnote?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 380,
        background: 'var(--cream-50)',
        border: 'var(--border-chunky) solid var(--ink-900)',
        borderRadius: 'var(--radius-md)',
        padding: '16px 18px',
        fontFamily: 'var(--font-mono)',
        color: 'var(--ink-900)',
        boxShadow: 'var(--shadow-lg)',
        ...style,
      }}
    >
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 34, lineHeight: 1 }}>{title}</div>
      <div style={{ fontSize: 12, padding: '6px 0 8px', borderBottom: '10px solid var(--ink-900)' }}>{serving}</div>
      {rows.map((r, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
            padding: '7px 0',
            paddingLeft: r.indent ? 16 : 0,
            borderBottom: i === 2 ? '5px solid var(--ink-900)' : '1px solid var(--ink-900)',
            fontSize: r.bold ? 16 : 13,
            fontWeight: r.bold ? 500 : 400,
          }}
        >
          <span>{r.label}</span>
          <span>{r.value}</span>
        </div>
      ))}
      <div style={{ fontSize: 11, paddingTop: 8, lineHeight: 1.45, color: 'var(--ink-700)' }}>{footnote}</div>
    </div>
  );
}
