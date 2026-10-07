import type { Metadata } from 'next';
import { ShopPage } from '@/components/shop/ShopPage';
import { getProducts, type Product } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'shop all — replenish',
  description: 'Four flavours of nothing, all free. Everything is free, because nothing is real.',
};

// Re-read the products table at most once a minute.
export const revalidate = 60;

export default async function Shop() {
  let products: Product[] | null = null;
  try {
    products = await getProducts();
  } catch (err) {
    console.error(err);
  }
  return <ShopPage products={products} />;
}
