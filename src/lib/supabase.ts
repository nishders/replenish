import { createClient } from '@supabase/supabase-js';

export type Product = {
  id: number;
  slug: string;
  name: string;
  description: string;
  colour: string;
  image_path: string;
  price: number;
  sort_order: number;
};

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Reads the public products table (anyone can read, nobody can write — see the table's row level security).
export async function getProducts(): Promise<Product[]> {
  if (!url || !key) throw new Error('Supabase URL or publishable key is missing from .env.local');
  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from('products')
    .select('id, slug, name, description, colour, image_path, price, sort_order')
    .order('sort_order');
  if (error) throw new Error(`Could not load products: ${error.message}`);
  return data;
}
