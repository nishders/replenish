import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ResetForm } from '@/components/auth/ResetForm';
import { RESET_THEME } from '@/components/auth/themes';
import { readResetTokens } from '@/lib/reset-session';

export const metadata: Metadata = { title: 'reset password — replenish' };

type Props = { searchParams: Promise<{ link?: string }> };

export default async function ResetPassword({ searchParams }: Props) {
  const { link } = await searchParams;
  // The reset link leaves a private, short-lived cookie; without it there's nothing to reset.
  const canReset = link !== 'expired' && (await readResetTokens()) !== null;
  return (
    <AuthLayout theme={RESET_THEME}>
      <ResetForm expired={!canReset} />
    </AuthLayout>
  );
}
