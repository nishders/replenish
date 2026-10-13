import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { ForgotForm } from '@/components/auth/ForgotForm';
import { FORGOT_THEME } from '@/components/auth/themes';

export const metadata: Metadata = { title: 'forgot password — replenish' };

export default function ForgotPassword() {
  return (
    <AuthLayout theme={FORGOT_THEME}>
      <ForgotForm />
    </AuthLayout>
  );
}
