import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CheckoutPage } from '@/components/checkout/CheckoutPage';
import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome';
import { getProducts, type Product } from '@/lib/supabase';
import { getServerSupabase } from '@/lib/supabase-server';

export const metadata: Metadata = { title: 'checkout — replenish' };

// Logged in only. Logged-out visitors go to log in, then back to their cart.
export default async function Checkout() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/cart');

  let products: Product[] | null = null;
  try {
    products = await getProducts();
  } catch (err) {
    console.error(err);
  }
  return (
    <div style={{ overflowX: 'clip' }}>
      <SiteHeader active="shop" />
      <CheckoutPage products={products} email={user.email ?? 'you'} footer={<SiteFooter />} />
    </div>
  );
}
