'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 grid-bg relative overflow-hidden">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/8 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 text-center space-y-8 max-w-2xl">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400"
        >
          LostInVirtual
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-400"
        >
          The digital frontier&apos;s premier citizen registry. Claim your identity, secure your status, and become part of the ecosystem.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/auth/register')}
            className="flex items-center gap-2 px-8 py-3.5 btn-gradient rounded-lg font-semibold text-white text-sm"
          >
            Join Now
            <ArrowRight size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/auth/login')}
            className="px-8 py-3.5 border border-gray-700 hover:border-gray-500 rounded-lg font-semibold text-sm text-gray-300 hover:text-white transition-all"
          >
            Sign In
          </motion.button>
        </motion.div>
      </main>

      <footer className="relative z-10 absolute bottom-8 text-gray-600 text-sm">
        © 2026 LostInVirtual Registry. Secure. Sovereign.
      </footer>
    </div>
  );
}
