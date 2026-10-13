'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Message } from '@/components/ds/Message';
import { TextField } from '@/components/ds/TextField';
import { FORGOT_HREF, SIGNUP_HREF } from '@/components/site/content';
import { authCallbackUrl, getBrowserSupabase } from '@/lib/supabase-browser';
import { checkEmail, describeAuthError, SOMETHING_BROKE, type FormError } from './errors';
import { AuthHeading, SubmitButton } from './parts';
import s from './auth.module.css';

// Shown above the form when arriving from an email link.
const NOTICES = {
  confirmed: { tone: 'success', title: "you're confirmed.", body: 'log in below. nothing has changed, but now it\'s official.' },
  'link-expired': { tone: 'warning', title: 'that link has gone flat', body: "confirmation links expire. log in and we'll offer you a fresh one." },
} as const;
export type LoginNotice = keyof typeof NOTICES;

export function LoginForm({ notice }: { notice?: LoginNotice }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<FormError>();
  const [unconfirmed, setUnconfirmed] = useState(false);
  const [resent, setResent] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next = { email: checkEmail(email), password: password ? undefined : 'please enter your password' };
    setErrors(next);
    setFormError(undefined);
    setUnconfirmed(false);
    if (next.email || next.password) return;

    setBusy(true);
    try {
      const { error } = await getBrowserSupabase().auth.signInWithPassword({ email: email.trim(), password });
      if (!error) {
        router.push('/');
        router.refresh();
        return;
      }
      const d = describeAuthError(error, 'login');
      setErrors({ email: d.email, password: d.password });
      setFormError(d.form);
      setUnconfirmed(!!d.unconfirmed);
      setResent('idle');
    } catch {
      setFormError({ title: "couldn't log you in", body: SOMETHING_BROKE });
    }
    setBusy(false);
  };

  const resend = async () => {
    setResent('sending');
    const { error } = await getBrowserSupabase().auth.resend({ type: 'signup', email: email.trim(), options: { emailRedirectTo: authCallbackUrl('/') } });
    setResent(error ? 'idle' : 'sent');
    if (error) setFormError(describeAuthError(error, 'signup').form);
  };

  const n = notice && NOTICES[notice];

  return (
    <form noValidate onSubmit={submit} className={s.card}>
      <div className={s.head}>
        <AuthHeading desk="lol you came back? ...on purpose?" />
        <p className={s.lede}>like, fr? there&apos;s still nothing here. but sure, log in. we&apos;re not judging. (we are judging a little.)</p>
      </div>
      {n && !formError && (
        <Message tone={n.tone} title={n.title}>
          {n.body}
        </Message>
      )}
      <TextField
        name="email"
        label="email"
        type="email"
        placeholder="you@somewhere.real"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        disabled={busy}
      />
      <TextField
        name="password"
        label="password"
        type="password"
        hint="the one you swore you'd remember"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        disabled={busy}
      />
      <div className={s.forgot}>
        <a href={FORGOT_HREF} className={s.textLink}>
          forgot password?
        </a>
      </div>
      {formError && (
        <Message tone="error" title={formError.title}>
          {formError.body}
          {unconfirmed && (
            <>
              {' '}
              {resent === 'sent' ? (
                <strong>sent. check your inbox.</strong>
              ) : (
                <button type="button" className={s.inlineAction} onClick={resend} disabled={resent === 'sending'}>
                  {resent === 'sending' ? 'sending…' : 'send the link again'}
                </button>
              )}
            </>
          )}
        </Message>
      )}
      <SubmitButton busy={busy} busyLabel="logging in…" quip="fine. come in.">
        log in
      </SubmitButton>
      <p className={s.switch}>
        <span>new here?</span>
        <a href={SIGNUP_HREF}>create an account</a>
      </p>
    </form>
  );
}
