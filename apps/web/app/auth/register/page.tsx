'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthForm from '@/components/AuthForm';

const registerFields = [
  { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your name', required: true },
  { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@example.com', required: true },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Min. 8 characters',
    required: true,
    minLength: 8,
  },
  {
    name: 'confirmPassword',
    label: 'Confirm Password',
    type: 'password',
    placeholder: 'Re-enter your password',
    required: true,
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [verificationPending, setVerificationPending] = useState(false);

  const handleRegister = async (data: Record<string, string>) => {
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Store user in localStorage
    const user = {
      name: data.name,
      email: data.email,
      verified: false,
      activated: false,
      registeredAt: new Date().toISOString(),
    };
    localStorage.setItem('liv_user', JSON.stringify(user));

    // Mock email verification delay
    setVerificationPending(true);

    // Simulate email verification (auto-verify after 2s for demo)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const verifiedUser = { ...user, verified: true };
    localStorage.setItem('liv_user', JSON.stringify(verifiedUser));

    router.push('/dashboard');
  };

  if (verificationPending) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 grid-bg">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="glass rounded-2xl p-8 max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center animate-pulse">
            <span className="text-2xl">📧</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Check Your Email</h2>
          <p className="text-gray-400 text-sm mb-4">
            We&apos;ve sent a verification link to your email. Verifying automatically for demo...
          </p>
          <div className="flex justify-center">
            <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full animate-[shimmer_2s_ease-in-out]" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthForm
      title="Create Account"
      subtitle="Join the digital frontier community"
      fields={registerFields}
      submitLabel="Create Account"
      loadingLabel="Creating account..."
      onSubmit={handleRegister}
      footer={
        <>
          Already have an account?{' '}
          <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
            Sign in
          </Link>
        </>
      }
    />
  );
}
