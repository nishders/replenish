// Order numbers are stored as plain numbers (42) and shown as NISH-0042.

export const formatOrderNumber = (n: number) => `NISH-${String(n).padStart(4, '0')}`;

export function parseOrderNumber(text: string): number | null {
  const m = /^NISH-(\d{1,12})$/i.exec(text.trim());
  return m ? Number(m[1]) : null;
}

// "15 oct 2026"
export const formatOrderDate = (iso: string, timeZone?: string) =>
  new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone }).format(new Date(iso)).toLowerCase();

export type OrderLine = { slug: string; name: string; quantity: number };
