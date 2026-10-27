'use client';

import { formatOrderDate } from '@/lib/orders';

// Order dates are shown in the visitor's own time zone (the server only knows UTC), so the browser fills them in.
export function OrderDate({ iso }: { iso: string }) {
  return <span suppressHydrationWarning>{formatOrderDate(iso)}</span>;
}
