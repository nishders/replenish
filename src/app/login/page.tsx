import type { Metadata } from 'next';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm, type LoginNotice } from '@/components/auth/LoginForm';
import { LOGIN_THEME } from '@/components/auth/themes';

export const metadata: Metadata = { title: 'log in — replenish' };

type Props = { searchParams: Promise<{ notice?: string }> };

export default async function Login({ searchParams }: Props) {
  const { notice } = await searchParams;
  const known = notice === 'confirmed' || notice === 'link-expired' ? (notice as LoginNotice) : undefined;
  return (
    <AuthLayout theme={LOGIN_THEME}>
      <LoginForm notice={known} />
    </AuthLayout>
  );
}
