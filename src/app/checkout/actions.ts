'use server';

import { headers } from 'next/headers';
import { sendOrderEmail } from '@/lib/order-email';
import { formatOrderNumber, type OrderLine } from '@/lib/orders';
import { getServerSupabase } from '@/lib/supabase-server';

export type PlaceOrderResult = { ok: true; orderNumber: string } | { ok: false; reason: 'login' | 'empty' | 'failed' };

type CartItem = { slug: string; quantity: number };

// Saves the order (via the place_order database function, which applies the orders security rules),
// then emails a confirmation to the logged-in person's own address.
export async function placeOrder(items: CartItem[]): Promise<PlaceOrderResult> {
  const clean = (Array.isArray(items) ? items : [])
    .filter((i) => typeof i?.slug === 'string' && Number.isInteger(i.quantity) && i.quantity >= 1 && i.quantity <= 10)
    .slice(0, 20)
    .map((i) => ({ slug: i.slug, quantity: i.quantity }));
  if (!clean.length) return { ok: false, reason: 'empty' };

  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, reason: 'login' };

  const { data: orderNumber, error } = await supabase.rpc('place_order', { items: clean });
  if (error || typeof orderNumber !== 'number') {
    console.error('[checkout] place_order failed', error?.message);
    return { ok: false, reason: error?.message?.includes('cart is empty') ? 'empty' : 'failed' };
  }

  // Read the saved order back (names come from the products table) for the email.
  const { data: order } = await supabase
    .from('orders')
    .select('created_at, order_items(quantity, products(slug, name, sort_order))')
    .eq('order_number', orderNumber)
    .single();

  if (order && user.email) {
    const lines: OrderLine[] = (order.order_items as unknown as { quantity: number; products: { slug: string; name: string; sort_order: number } }[])
      .sort((a, b) => a.products.sort_order - b.products.sort_order)
      .map((i) => ({ slug: i.products.slug, name: i.products.name, quantity: i.quantity }));
    const h = await headers();
    const origin = h.get('origin') ?? `https://${h.get('host')}`;
    await sendOrderEmail({ to: user.email, orderNumber, createdAt: order.created_at, lines, origin });
  }

  return { ok: true, orderNumber: formatOrderNumber(orderNumber) };
}
