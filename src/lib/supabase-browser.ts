import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | undefined;

// One Supabase client for the whole browser tab. The session lives in cookies, so it survives a refresh.
export function getBrowserSupabase() {
  client ??= createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
  return client;
}

// Where Supabase email links land. `next` is the page to continue to once the link is checked.
export const authCallbackUrl = (next: string) => `${window.location.origin}/auth/confirm?next=${encodeURIComponent(next)}`;
