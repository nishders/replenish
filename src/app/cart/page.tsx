import type { Metadata } from 'next';
import { CartBarSpacer, CartPage } from '@/components/cart/CartPage';
import { SiteFooter, SiteHeader } from '@/components/site/SiteChrome';
import { getProducts, type Product } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'your cart — replenish',
  description: 'Your cart. Impressively empty of protein. Total: free.',
};

// Product names and copy come from Supabase; the quantities live in the visitor's browser.
export const revalidate = 60;

export default async function Cart() {
  let products: Product[] | null = null;
  try {
    products = await getProducts();
  } catch (err) {
    console.error(err);
  }
  return (
    <div style={{ overflowX: 'clip' }}>
      <SiteHeader active="shop" accountQuip="it's free to try" />
      <CartPage products={products} />
      <SiteFooter />
      <CartBarSpacer />
    </div>
  );
}
