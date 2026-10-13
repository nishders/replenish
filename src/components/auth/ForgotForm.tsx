'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ds/Button';
import { Message } from '@/components/ds/Message';
import { TextField } from '@/components/ds/TextField';
import { LOGIN_HREF } from '@/components/site/content';
import { authCallbackUrl, getBrowserSupabase } from '@/lib/supabase-browser';
import { checkEmail, describeAuthError, SOMETHING_BROKE, type FormError } from './errors';
import { AuthHeading, StatusCard, SubmitButton } from './parts';
import s from './auth.module.css';

export function ForgotForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [formError, setFormError] = useState<FormError>();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [again, setAgain] = useState<'idle' | 'sending' | 'sent'>('idle');

  // Always ends on "check your inbox" so the page never reveals which emails have accounts.
  const send = () => getBrowserSupabase().auth.resetPasswordForEmail(email.trim(), { redirectTo: authCallbackUrl('/reset-password') });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const err = checkEmail(email);
    setError(err);
    setFormError(undefined);
    if (err) return;

    setBusy(true);
    try {
      const { error } = await send();
      if (error) {
        const d = describeAuthError(error, 'forgot');
        setError(d.email);
        setFormError(d.form);
      } else {
        setSent(true);
        setAgain('idle');
      }
    } catch {
      setFormError({ title: "couldn't send the link", body: SOMETHING_BROKE });
    }
    setBusy(false);
  };

  const sendAgain = async () => {
    setAgain('sending');
    const { error } = await send();
    setAgain(error ? 'idle' : 'sent');
  };

  if (sent) {
    return (
      <StatusCard icon="mail" title="check your inbox." body="if that email has an account, a reset link is on its way." aside="it expires in an hour. like milk, but faster.">
        <div className={s.statusAction}>
          <Button variant="outline" size="lg" fullWidth icon="arrow-left" quip="the long way round" onClick={() => router.push(LOGIN_HREF)}>
            back to log in
          </Button>
        </div>
        <p className={s.statusFoot}>
          <span>didn&apos;t get it?</span>
          <button type="button" onClick={sendAgain} disabled={again !== 'idle'}>
            {again === 'sending' ? 'sending…' : again === 'sent' ? 'sent again' : 'send again'}
          </button>
        </p>
      </StatusCard>
    );
  }

  return (
    <form noValidate onSubmit={submit} className={`${s.card} ${s.roomy}`}>
      <div className={s.head}>
        <AuthHeading desk="forgot your password? but you remember that email, right? ...RIGHT?" phone="forgot your password? relatable." />
        <p className={s.lede}>tell us your email and we&apos;ll send a link to make a new one.</p>
      </div>
      <TextField
        name="email"
        label="email"
        type="email"
        placeholder="you@somewhere.real"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={error}
        disabled={busy}
      />
      {formError && (
        <Message tone="error" title={formError.title}>
          {formError.body}
        </Message>
      )}
      <SubmitButton busy={busy} busyLabel="sending link…" quip="fresh one, coming up">
        send reset link
      </SubmitButton>
      <p className={s.switch}>
        <span>remembered it?</span>
        <a href={LOGIN_HREF}>log in</a>
      </p>
    </form>
  );
}
