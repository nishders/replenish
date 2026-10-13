'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ds/Button';
import { Message } from '@/components/ds/Message';
import { TextField } from '@/components/ds/TextField';
import { FORGOT_HREF, LOGIN_HREF } from '@/components/site/content';
import { getBrowserSupabase } from '@/lib/supabase-browser';
import { checkConfirm, checkNewPassword, describeAuthError, PASSWORD_HINT, SOMETHING_BROKE, type FormError } from './errors';
import { AuthHeading, StatusCard, SubmitButton } from './parts';
import s from './auth.module.css';

type Stage = 'checking' | 'form' | 'success' | 'expired';

// Reached from the reset email (via /auth/confirm, which signs the person in for this one change).
export function ResetForm({ expired }: { expired?: boolean }) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>(expired ? 'expired' : 'checking');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [formError, setFormError] = useState<FormError>();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (expired) return;
    getBrowserSupabase()
      .auth.getUser()
      .then(({ data }) => setStage(data.user ? 'form' : 'expired'));
  }, [expired]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next = { password: checkNewPassword(password), confirm: checkConfirm(password, confirm) };
    setErrors(next);
    setFormError(undefined);
    if (next.password || next.confirm) return;

    setBusy(true);
    try {
      const supabase = getBrowserSupabase();
      const { error } = await supabase.auth.updateUser({ password });
      if (!error) {
        // Log out so "log in" on the success card means what it says.
        await supabase.auth.signOut();
        setStage('success');
      } else if (error.code === 'session_not_found' || error.code === 'session_expired' || error.status === 401) {
        setStage('expired');
      } else {
        const d = describeAuthError(error, 'reset');
        setErrors({ password: d.password });
        setFormError(d.form);
      }
    } catch {
      setFormError({ title: "couldn't save your password", body: SOMETHING_BROKE });
    }
    setBusy(false);
  };

  if (stage === 'checking') return null;

  if (stage === 'success') {
    return (
      <StatusCard icon="circle-check" doodles={['✶', '0g']} title="password changed." body="try to remember this one." aside="we can't remind you. we never see it.">
        <div className={s.statusAction}>
          <Button size="lg" fullWidth arrow quip="go on then" onClick={() => router.push(LOGIN_HREF)}>
            log in
          </Button>
        </div>
      </StatusCard>
    );
  }

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
