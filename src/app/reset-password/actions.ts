'use server';

import { cookies } from 'next/headers';
import { encodeTokens, memoryClient, readResetTokens, RESET_COOKIE, resetCookieOptions } from '@/lib/reset-session';

export type ResetResult = { ok: true } | { ok: false; expired: boolean; code?: string; status?: number; message: string };

// Sets the new password using the session from the reset link (kept in a server-only cookie).
// On success every session for the account is signed out, and the person logs in fresh with the new password.
export async function resetPassword(password: string): Promise<ResetResult> {
  const jar = await cookies();
  const tokens = await readResetTokens();
  if (!tokens || typeof password !== 'string') return { ok: false, expired: true, message: 'no reset session' };

  const supabase = memoryClient();
  const { data, error: sessionError } = await supabase.auth.setSession({ access_token: tokens.a, refresh_token: tokens.r });
  if (sessionError || !data.session) {
    jar.delete({ name: RESET_COOKIE, path: resetCookieOptions.path });
    return { ok: false, expired: true, code: sessionError?.code, message: sessionError?.message ?? 'session expired' };
  }
  // Keep the freshest tokens, so a second try (e.g. after "that's your old password") still works.
  jar.set(RESET_COOKIE, encodeTokens(data.session.access_token, data.session.refresh_token), resetCookieOptions);

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, expired: false, code: error.code, status: error.status, message: error.message };

  await supabase.auth.signOut({ scope: 'global' });
  jar.delete({ name: RESET_COOKIE, path: resetCookieOptions.path });
  return { ok: true };
}
