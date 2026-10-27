import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// A password-reset link is checked once, when it's clicked. The short-lived session it gives is kept in a private
// cookie only the server can read (not the normal login cookies), so the person isn't logged in on the site.

export const RESET_COOKIE = 'replenish-reset';
const PATH = '/reset-password';

type Tokens = { a: string; r: string };

// A Supabase client that keeps its session in memory only.
export const memoryClient = () =>
  createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

export const resetCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: PATH,
  maxAge: 60 * 60, // matches the link's one hour
};

export const encodeTokens = (access: string, refresh: string) => JSON.stringify({ a: access, r: refresh } satisfies Tokens);

export async function readResetTokens(): Promise<Tokens | null> {
  const raw = (await cookies()).get(RESET_COOKIE)?.value;
  if (!raw) return null;
  try {
    const t = JSON.parse(raw) as Tokens;
    return t.a && t.r ? t : null;
  } catch {
    return null;
  }
}
