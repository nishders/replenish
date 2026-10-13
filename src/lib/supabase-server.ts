import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Supabase client for server code (route handlers, server components) that reads and writes the session cookies.
export async function getServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server components can't set cookies; the browser client refreshes the session instead.
        }
      },
    },
  });
}
