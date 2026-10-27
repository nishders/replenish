'use client';

import { useState, type FormEvent } from 'react';
import type { AuthError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { resetPassword } from '@/app/reset-password/actions';
import { Button } from '@/components/ds/Button';
import { Message } from '@/components/ds/Message';
import { TextField } from '@/components/ds/TextField';
import { FORGOT_HREF, LOGIN_HREF } from '@/components/site/content';
import { getBrowserSupabase } from '@/lib/supabase-browser';
import { checkConfirm, checkNewPassword, describeAuthError, PASSWORD_HINT, SOMETHING_BROKE, type FormError } from './errors';
import { AuthHeading, StatusCard, SubmitButton } from './parts';
import s from './auth.module.css';

type Stage = 'form' | 'expired';

// Reached from the reset email. The link doesn't log anyone in; saving goes through the server,
// then it's straight to log in with the new password.
export function ResetForm({ expired }: { expired?: boolean }) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>(expired ? 'expired' : 'form');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [formError, setFormError] = useState<FormError>();
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next = { password: checkNewPassword(password), confirm: checkConfirm(password, confirm) };
    setErrors(next);
    setFormError(undefined);
    if (next.password || next.confirm) return;

    setBusy(true);
    try {
      const result = await resetPassword(password);
      if (result.ok) {
        // Clear any login this browser had before, then log in fresh with the new password.
        await getBrowserSupabase().auth.signOut({ scope: 'local' });
        router.push(`${LOGIN_HREF}?notice=password-changed`);
        return;
      }
      if (result.expired) {
        setStage('expired');
      } else {
        const d = describeAuthError({ code: result.code, status: result.status, message: result.message } as AuthError, 'reset');
        setErrors({ password: d.password });
        setFormError(d.form);
      }
    } catch {
      setFormError({ title: "couldn't save your password", body: SOMETHING_BROKE });
    }
    setBusy(false);
  };


  if (stage === 'expired') {
    return (
      <StatusCard
        icon="circle-alert"
        tone="error"
        doodles={['?', '~ ~']}
        title="this link has gone flat."
        body="reset links only work once, and only for an hour. this one's expired or already been used."
        aside="like a can left open overnight. a can of nothing, but still."
      >
        <div className={s.statusAction}>
          <Button size="lg" fullWidth icon="mail" quip="freshly fizzy" onClick={() => router.push(FORGOT_HREF)}>
            send a new link
          </Button>
        </div>
        <p className={s.statusFoot}>
          <a href={LOGIN_HREF}>back to log in</a>
        </p>
      </StatusCard>
    );
  }

  return (
    <form noValidate onSubmit={submit} className={`${s.card} ${s.roomy}`}>
      <div className={s.head}>
        <AuthHeading desk="set that new password, i guess. i'm still not delivering any drinks though." phone="new password, same zero protein." />
        <p className={s.lede}>make it a good one. or at least one you&apos;ll remember this time.</p>
      </div>
      <TextField
        name="new-password"
        label="new password"
        type="password"
        hint={PASSWORD_HINT}
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        disabled={busy}
      />
      <TextField
        name="confirm-password"
        label="confirm new password"
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
      <SubmitButton busy={busy} busyLabel="saving…" quip="lock it in">
        save new password
      </SubmitButton>
      <p className={s.switch}>
        <span>link acting up?</span>
        <a href={FORGOT_HREF}>get a new one</a>
      </p>
    </form>
  );
}
