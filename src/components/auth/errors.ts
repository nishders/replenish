import type { AuthError } from '@supabase/supabase-js';

// Friendly copy for form checks and Supabase auth errors.

export const MIN_PASSWORD = 8;

export const checkEmail = (email: string) =>
  !email.trim() ? 'please enter your email' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? undefined : "that doesn't look like an email";

// Matches the Supabase password rules: 8+ characters with lower case, upper case, a number and a symbol.
export const PASSWORD_HINT = `at least ${MIN_PASSWORD} characters, with a capital, a number and a symbol`;

export const checkNewPassword = (pw: string) => {
  if (!pw) return 'please choose a password';
  if (pw.length < MIN_PASSWORD) return `that password is too short. at least ${MIN_PASSWORD} characters.`;
  const missing = [
    !/[a-z]/.test(pw) && 'a lowercase letter',
    !/[A-Z]/.test(pw) && 'a capital letter',
    !/[0-9]/.test(pw) && 'a number',
    !/[^a-zA-Z0-9]/.test(pw) && 'a symbol',
  ].filter(Boolean);
  return missing.length ? `add ${missing.join(', ').replace(/, ([^,]*)$/, ' and $1')}.` : undefined;
};

export const checkConfirm = (pw: string, confirm: string) =>
  !confirm ? 'please type it again' : confirm !== pw ? "passwords don't match" : undefined;

export const WEAK_PASSWORD = 'that password is too easy to guess. try something longer or less obvious.';

export const EMAIL_TAKEN = 'that email already has an account. try logging in instead.';

export type FormError = { title: string; body: string };

export const SOMETHING_BROKE = 'something broke on our end. please try again.';
const TOO_MANY: FormError = { title: 'slow down a little', body: 'too many tries in a row. wait a minute, then try again.' };

const isRateLimit = (e: AuthError) => e.code?.startsWith('over_') || e.status === 429;
const isEmailSendFailure = (e: AuthError) => /error sending .*email/i.test(e.message);

// Turns a Supabase error into either a message for one field or a message for the whole form.
export function describeAuthError(e: AuthError, action: 'login' | 'signup' | 'reset' | 'forgot') {
  console.warn(`[auth:${action}]`, e.code ?? e.status, e.message);
  if (isRateLimit(e)) return { form: TOO_MANY };
  if (isEmailSendFailure(e)) return { form: { title: "couldn't send the email", body: "our email sender is having a moment. please try again in a few minutes." } };
  switch (e.code) {
    case 'invalid_credentials':
      return { form: { title: "couldn't log you in", body: "wrong email or password. we won't say which." } };
    case 'email_not_confirmed':
      return { form: { title: 'confirm your email first', body: 'we sent you a link when you signed up. click it, then log in.' }, unconfirmed: true };
    case 'user_already_exists':
    case 'email_exists':
      return { email: EMAIL_TAKEN };
    case 'email_address_invalid':
      return { email: "that doesn't look like an email" };
    case 'weak_password':
      return { password: e.message.includes('at least one character of each') ? `use ${PASSWORD_HINT}.` : WEAK_PASSWORD };
    case 'same_password':
      return { password: "that's your old password. pick a new one." };
    case 'signup_disabled':
      return { form: { title: 'sign-ups are closed', body: 'new accounts are paused right now. try again later.' } };
  }
  const title =
    action === 'login'
      ? "couldn't log you in"
      : action === 'signup'
        ? "couldn't create your account"
        : action === 'reset'
          ? "couldn't save your password"
          : "couldn't send the link";
  return { form: { title, body: SOMETHING_BROKE } };
}
