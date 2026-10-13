import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignupForm } from '@/components/auth/SignupForm';
import { SIGNUP_THEME } from '@/components/auth/themes';

export const metadata: Metadata = { title: 'sign up — replenish' };

export default function Signup() {
  return (
    <AuthLayout theme={SIGNUP_THEME}>
      <SignupForm />
    </AuthLayout>
  );
}
