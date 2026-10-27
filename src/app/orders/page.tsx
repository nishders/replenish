import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { OrdersPage, type PastOrder } from '@/components/orders/OrdersPage';
import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome';
import { formatOrderNumber } from '@/lib/orders';
import { getServerSupabase } from '@/lib/supabase-server';

export const metadata: Metadata = { title: 'my orders — replenish' };

type Row = {
  order_number: number;
  created_at: string;
  order_items: { quantity: number; products: { slug: string; name: string; image_path: string; sort_order: number } }[];
};

// The logged-in person's orders, newest first. The orders security rules mean only their own come back.
export default async function Orders() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/orders');

  const { data, error } = await supabase
    .from('orders')
    .select('order_number, created_at, order_items(quantity, products(slug, name, image_path, sort_order))')
    .order('created_at', { ascending: false })
    .limit(200)
    .returns<Row[]>();
  if (error) console.error('[orders]', error.message);

  const orders: PastOrder[] = (data ?? []).map((o) => ({
    number: formatOrderNumber(o.order_number),
    createdAt: o.created_at,
    items: [...o.order_items]
      .sort((a, b) => a.products.sort_order - b.products.sort_order)
      .map((i) => ({ slug: i.products.slug, name: i.products.name, image_path: i.products.image_path, quantity: i.quantity })),
  }));

  return (
    <div style={{ overflowX: 'clip' }}>
      <SiteHeader />
      <OrdersPage orders={orders} failed={!!error} />
      <SiteFooter />
    </div>
  );
}
