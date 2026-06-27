"use client";

import React, { useState } from "react";
import Head from "next/head";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import GradientText from "@/components/ui/GradientText";
import MotionButton from "@/components/ui/MotionButton";

/* ------------------------------------------------------------------ */
/* Animation variants                                                  */
/* ------------------------------------------------------------------ */

const springTransition = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

/* ------------------------------------------------------------------ */
/* Floating orb                                                        */
/* ------------------------------------------------------------------ */

function FloatingOrb({
  color,
  size,
  top,
  left,
  delay = 0,
}: {
  color: string;
  size: number;
  top: string;
  left: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        top,
        left,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(80px)",
      }}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -25, 15, 0],
        scale: [1, 1.1, 0.95, 1],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      aria-hidden
    />
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use callbackUrl from query params if available, otherwise default to /dashboard
      const callbackUrl = (router.query.callbackUrl as string) || '/dashboard';
      await signIn("keycloak", { callbackUrl });
    } catch {
      setError("Failed to sign in. Please try again.");
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && email && password) {
      handleSignIn();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden hero-gradient grid-bg noise-overlay">
      <Head>
        <title>Sign In — LostInVirtual</title>
        <meta
          name="description"
          content="Sign in to your LostInVirtual citizen account."
        />
      </Head>

      {/* Background orbs */}
      <FloatingOrb color="rgba(59,130,246,0.12)" size={450} top="-15%" left="15%" delay={0} />
      <FloatingOrb color="rgba(139,92,246,0.10)" size={350} top="50%" left="65%" delay={2} />
      <FloatingOrb color="rgba(236,72,153,0.06)" size={300} top="70%" left="5%" delay={4} />

      {/* Card */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-6"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <div className="glass-card p-8 sm:p-10">
          {/* Logo / Brand */}
          <motion.div
            variants={fadeUp}
            transition={springTransition}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">
              <GradientText>LostInVirtual</GradientText>
            </h1>
            <p className="text-sm text-gray-500">
              Sign in to your citizen account
            </p>
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Auth error from query params */}
          {router.query.error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
            >
              Authentication failed. Please try again.
            </motion.div>
          )}

          {/* Form fields */}
          <motion.div
            className="space-y-4 mb-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            onKeyDown={handleKeyDown}
          >
            {/* Email */}
            <motion.div variants={fadeUp} transition={springTransition}>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={fadeUp} transition={springTransition}>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Sign In button */}
          <motion.div
            variants={fadeUp}
            transition={springTransition}
            className="mb-4"
          >
            <MotionButton
              variant="primary"
              className="w-full py-4 text-base"
              loading={loading}
              onClick={handleSignIn}
            >
              Sign In
            </MotionButton>
          </motion.div>

          {/* Divider */}
          <motion.div
            variants={fadeUp}
            transition={springTransition}
            className="flex items-center gap-3 mb-4"
          >
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-gray-600 uppercase tracking-wider font-mono">
              or
            </span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </motion.div>

          {/* Create Account button */}
          <motion.div
            variants={fadeUp}
            transition={springTransition}
          >
            <MotionButton
              variant="secondary"
              className="w-full py-4 text-base"
              onClick={() => router.push("/signup")}
            >
              Create Account
            </MotionButton>
          </motion.div>

          {/* Back to landing */}
          <motion.div
            variants={fadeUp}
            transition={springTransition}
            className="mt-6 text-center"
          >
            <a
              href="/"
              className="text-sm text-gray-600 hover:text-gray-400 transition-colors"
            >
              ← Back to home
            </a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
