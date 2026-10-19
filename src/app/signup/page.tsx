import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { SignupForm } from '@/components/auth/SignupForm';
import { SIGNUP_THEME } from '@/components/auth/themes';

export const metadata: Metadata = { title: 'sign up — replenish' };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function Signup({ searchParams }: Props) {
  const { next } = await searchParams;
  return (
    <AuthLayout theme={SIGNUP_THEME}>
      <SignupForm returnTo={next?.startsWith('/') && !next.startsWith('//') ? next : '/'} />
    </AuthLayout>
  );
}
