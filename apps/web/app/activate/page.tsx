'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ActivatePage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem('liv_user');
    if (!stored) {
      router.push('/auth/login');
    }
    inputRef.current?.focus();
  }, [router]);

  const fireConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  };

  const handleActivate = async () => {
    if (!code.trim()) {
      setError('Please enter your activation code');
      return;
    }

    setVerifying(true);
    setError('');

    // Mock verification
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Accept any code starting with LIV- or demo code
    const storedCode = localStorage.getItem('liv_activation_code');
    const isValid =
      code.startsWith('LIV-') ||
      code.toUpperCase() === 'DEMO-CODE' ||
      code === storedCode;

    if (isValid) {
      // Update user
      const stored = localStorage.getItem('liv_user');
      if (stored) {
        const user = JSON.parse(stored);
        user.activated = true;
        user.activatedAt = new Date().toISOString();
        localStorage.setItem('liv_user', JSON.stringify(user));
      }

      setSuccess(true);
      fireConfetti();

      // Redirect after celebration
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
    } else {
      setError('Invalid activation code. Please check and try again.');
      setVerifying(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleActivate();
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 grid-bg">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="glass rounded-2xl p-10 max-w-md text-center relative"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2, duration: 0.5 }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-500 to-green-400 flex items-center justify-center"
          >
            <CheckCircle2 size={40} className="text-white" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-white mb-2"
          >
            🎉 Activation Successful!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-gray-400 text-sm mb-6"
          >
            Welcome to LostInVirtual! Your digital identity is now fully activated.
            Redirecting to your dashboard...
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center"
          >
            <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 grid-bg">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8">
          {/* Back button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm mb-6"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center"
            >
              <span className="text-2xl">🔓</span>
            </motion.div>
            <h1 className="text-2xl font-bold text-white">Activate Account</h1>
            <p className="text-gray-400 mt-2 text-sm">
              Enter your activation code to unlock all features
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Code Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Activation Code
            </label>
            <input
              ref={inputRef}
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="LIV-XXXX-XXXX"
              className="w-full px-4 py-3.5 rounded-lg text-white placeholder-gray-500 text-center text-lg font-mono tracking-wider"
            />
            <p className="text-gray-500 text-xs mt-2 text-center">
              Hint: Use <code className="text-indigo-400">DEMO-CODE</code> or any <code className="text-indigo-400">LIV-*</code> code
            </p>
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: verifying ? 1 : 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleActivate}
            disabled={verifying}
            className="w-full py-3.5 rounded-lg btn-gradient text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {verifying ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Verifying Code...
              </>
            ) : (
              'Activate Account'
            )}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
