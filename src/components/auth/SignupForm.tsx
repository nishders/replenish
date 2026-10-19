'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ds/Button';
import { Message } from '@/components/ds/Message';
import { TextField } from '@/components/ds/TextField';
import { LOGIN_HREF } from '@/components/site/content';
import { authCallbackUrl, getBrowserSupabase } from '@/lib/supabase-browser';
import { checkConfirm, checkEmail, checkNewPassword, describeAuthError, EMAIL_TAKEN, PASSWORD_HINT, SOMETHING_BROKE, type FormError } from './errors';
import { AuthHeading, StatusCard, SubmitButton } from './parts';
import s from './auth.module.css';

type FieldErrors = { email?: string; password?: string; confirm?: string };

// `returnTo` is where the confirmation link sends them once confirmed (e.g. back to the cart).
export function SignupForm({ returnTo = '/' }: { returnTo?: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<FormError>();
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string>();
  const [resent, setResent] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next = { email: checkEmail(email), password: checkNewPassword(password), confirm: checkConfirm(password, confirm) };
    setErrors(next);
    setFormError(undefined);
    if (next.email || next.password || next.confirm) return;

    setBusy(true);
    try {
      const addr = email.trim();
      const { data, error } = await getBrowserSupabase().auth.signUp({ email: addr, password, options: { emailRedirectTo: authCallbackUrl(returnTo) } });
      if (error) {
        const d = describeAuthError(error, 'signup');
        setErrors({ email: d.email, password: d.password });
        setFormError(d.form);
      } else if (data.user && data.user.identities?.length === 0) {
        // Supabase hides whether an email is taken; an empty identities list means it already has an account.
        setErrors({ email: EMAIL_TAKEN });
      } else {
        setSentTo(addr);
        setResent('idle');
      }
    } catch {
      setFormError({ title: "couldn't create your account", body: SOMETHING_BROKE });
    }
    setBusy(false);
  };

  const resend = async () => {
    if (!sentTo) return;
    setResent('sending');
    const { error } = await getBrowserSupabase().auth.resend({ type: 'signup', email: sentTo, options: { emailRedirectTo: authCallbackUrl(returnTo) } });
    setResent(error ? 'failed' : 'sent');
  };

  const startAgain = () => {
    setSentTo(undefined);
    setPassword('');
    setConfirm('');
    setErrors({});
  };

  if (sentTo) {
    return (
      <StatusCard
        icon="mail"
        title="check your inbox."
        body={
          <>
            we sent a link to <strong>{sentTo}</strong>. click it to confirm your account, then come back and order nothing.
          </>
        }
        aside="it's the only thing we'll ever actually deliver."
      >
        <div className={s.statusAction}>
          <Button variant="outline" size="lg" fullWidth icon="mail" quip="same email, new hope" onClick={resend} disabled={resent === 'sending' || resent === 'sent'}>
            {resent === 'sending' ? 'sending…' : resent === 'sent' ? 'sent again. check spam too.' : 'resend the email'}
          </Button>
        </div>
        {resent === 'failed' && (
          <Message tone="error" title="couldn't resend it" style={{ width: '100%', textAlign: 'left' }}>
            wait a minute, then try again.
          </Message>
        )}
        <p className={s.statusFoot}>
          <span>nothing there? check spam. wrong email?</span>
          <button type="button" onClick={startAgain}>
            start again
          </button>
        </p>
      </StatusCard>
    );
  }

  return (
    <form noValidate onSubmit={submit} className={s.card}>
      <div className={s.head}>
        <AuthHeading desk="join the nish market. population: you." />
        <p className={s.lede}>an account lets you order drinks that don&apos;t exist.</p>
      </div>
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
        hint={PASSWORD_HINT}
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        disabled={busy}
      />
      <TextField
        name="confirm"
        label="confirm password"
        type="password"
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
        disabled={busy}
      />
      {formError && (
        <Message tone="error" title={formError.title}>
          {formError.body}
        </Message>
      )}
      <SubmitButton busy={busy} busyLabel="creating account…" quip="commit to nothing">
        create account
      </SubmitButton>
      <p className={s.switch}>
        <span>already have an account?</span>
        <a href={returnTo === '/' ? LOGIN_HREF : `${LOGIN_HREF}?next=${encodeURIComponent(returnTo)}`}>log in</a>
      </p>
      <p className={s.fine}>
        <span aria-hidden="true">✶</span>
        <span>this is a portfolio project. your email is only used to log you in and send your fake order confirmation.</span>
      </p>
    </form>
  );
}
