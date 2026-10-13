import type { EmailOtpType } from '@supabase/supabase-js';
import { NextResponse, type NextRequest } from 'next/server';
import { getServerSupabase } from '@/lib/supabase-server';

// Email links (sign-up confirmation, password reset) land here, get checked, then continue to `next`.
// Links carry either a `token_hash` (custom email templates, work in any browser) or a `code` (default
// templates, only work in the browser that asked for the email).
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const next = searchParams.get('next')?.startsWith('/') ? searchParams.get('next')! : '/';
  const tokenHash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const code = searchParams.get('code');
  const isReset = type === 'recovery' || next.startsWith('/reset-password');
  const failed = (reason: string) => {
    console.warn('[auth:confirm]', reason);
    return NextResponse.redirect(`${origin}${isReset ? '/reset-password?link=expired' : '/login?notice=link-expired'}`);
  };

  // Supabase adds error details when a link is expired or already used.
  if (searchParams.get('error_code') || searchParams.get('error')) return failed(searchParams.get('error_code') ?? 'error');

  const supabase = await getServerSupabase();

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    return error ? failed(`verifyOtp: ${error.code ?? error.message}`) : NextResponse.redirect(`${origin}${next}`);
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    // Opened in a different browser. For sign-up the email is confirmed already, so just ask them to log in.
    if (!isReset) return NextResponse.redirect(`${origin}/login?notice=confirmed`);
    return failed(`exchangeCode: ${error.code ?? error.message}`);
  }

  return failed('no token in link');
}
