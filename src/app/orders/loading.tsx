import { OrdersHeader, OrdersSkeleton } from '@/components/orders/OrdersPage';
import { SiteHeader } from '@/components/site/SiteChrome';

// Shown while the orders page loads its orders.
export default function Loading() {
  return (
    <div style={{ overflowX: 'clip' }}>
      <SiteHeader />
      <main>
        <OrdersHeader count={null} />
        <OrdersSkeleton />
      </main>
    </div>
  );
}
