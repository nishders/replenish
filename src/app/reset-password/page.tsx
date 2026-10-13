import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ResetForm } from '@/components/auth/ResetForm';
import { RESET_THEME } from '@/components/auth/themes';

export const metadata: Metadata = { title: 'reset password — replenish' };

type Props = { searchParams: Promise<{ link?: string }> };

export default async function ResetPassword({ searchParams }: Props) {
  const { link } = await searchParams;
  return (
    <AuthLayout theme={RESET_THEME}>
      <ResetForm expired={link === 'expired'} />
    </AuthLayout>
  );
}
