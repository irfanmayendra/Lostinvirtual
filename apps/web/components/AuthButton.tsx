'use client';

import { motion } from 'framer-motion';
import { signIn, signOut, useSession } from 'next-auth/react';

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 };

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-3">
        <div className="h-9 w-24 rounded-lg bg-white/[0.04] animate-pulse" />
      </div>
    );
  }

  if (session?.user) {
    const initials = (session.user.name || 'U').charAt(0).toUpperCase();

    return (
      <div className="flex items-center gap-3">
        <motion.div
          className="flex items-center gap-2.5"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={spring}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-2 ring-white/10 shrink-0">
            <span className="text-white text-xs font-bold">{initials}</span>
          </div>
          <span className="text-sm font-medium text-white/90 max-w-[120px] truncate hidden sm:inline">
            {session.user.name || 'Citizen'}
          </span>
        </motion.div>
        <motion.button
          onClick={() => signOut()}
          className="px-3 py-1.5 text-xs font-medium text-white/50 hover:text-red-400 border border-white/10 hover:border-red-500/50 rounded-lg"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={spring}
        >
          Logout
        </motion.button>
      </div>
    );
  }

  return (
    <motion.button
      onClick={() => signIn('keycloak')}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 rounded-lg"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={spring}
    >
      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
      <span>Login</span>
    </motion.button>
  );
}
