import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { OrderView, type Order, type OrderItem } from '@/components/order/OrderView';
import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome';
import { formatOrderNumber, parseOrderNumber } from '@/lib/orders';
import { getServerSupabase } from '@/lib/supabase-server';

export const metadata: Metadata = { title: 'order placed — replenish' };

type Props = { params: Promise<{ number: string }> };

type Row = {
  order_number: number;
  created_at: string;
  order_items: { quantity: number; products: { slug: string; name: string; image_path: string; sort_order: number } }[];
};

// Shows one order. The orders security rules mean someone else's order simply isn't returned, so it shows "not found".
export default async function OrderPage({ params }: Props) {
  const { number } = await params;
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/order/${encodeURIComponent(number)}`);

  let order: Order | null = null;
  const n = parseOrderNumber(decodeURIComponent(number));
  if (n !== null) {
    const { data } = await supabase
      .from('orders')
      .select('order_number, created_at, order_items(quantity, products(slug, name, image_path, sort_order))')
      .eq('order_number', n)
      .maybeSingle<Row>();
    if (data) {
      const items: OrderItem[] = data.order_items
        .sort((a, b) => a.products.sort_order - b.products.sort_order)
        .map((i) => ({ slug: i.products.slug, name: i.products.name, image_path: i.products.image_path, quantity: i.quantity }));
      order = { number: formatOrderNumber(data.order_number), createdAt: data.created_at, items };
    }
  }

  return (
    <div style={{ overflowX: 'clip' }}>
      <SiteHeader />
      <OrderView order={order} email={user.email ?? 'you'} />
      <SiteFooter />
    </div>
  );
}
