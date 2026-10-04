import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'replenish — the least protein per ml on the market',
  description: 'A fictional protein shake with nothing in it. A portfolio project by nish: nothing is sold, everything is free.',
};

export const viewport: Viewport = {
  themeColor: '#0B7C74',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
