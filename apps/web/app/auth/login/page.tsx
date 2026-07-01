'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';

const loginFields = [
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', required: true },
  { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password', required: true },
];

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = async (data: Record<string, string>) => {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Check if user exists in localStorage
    const stored = localStorage.getItem('liv_user');

    if (stored) {
      const user = JSON.parse(stored);
      if (user.email === data.email) {
        router.push('/dashboard');
        return;
      }
    }

    // For demo: create user and login
    const user = {
      name: data.email.split('@')[0],
      email: data.email,
      verified: true,
      activated: false,
      registeredAt: new Date().toISOString(),
    };
    localStorage.setItem('liv_user', JSON.stringify(user));
    router.push('/dashboard');
  };

  return (
    <AuthForm
      title="Welcome Back"
      subtitle="Sign in to your LostInVirtual account"
      fields={loginFields}
      submitLabel="Sign In"
      loadingLabel="Signing in..."
      onSubmit={handleLogin}
      showRememberMe
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
            Create one
          </Link>
        </>
      }
    />
  );
}
