"use client";

import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import GradientText from "@/components/ui/GradientText";
import MotionButton from "@/components/ui/MotionButton";

/* ------------------------------------------------------------------ */
/* Keycloak constants (with fallbacks)                                 */
/* ------------------------------------------------------------------ */

const KEYCLOAK_URL =
  process.env.NEXT_PUBLIC_KEYCLOAK_URL || "https://keycloak.lostinvirtual.world";
const KEYCLOAK_REALM =
  process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "lostinvirtual";
const KEYCLOAK_CLIENT_ID =
  process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "liv-app-dev";

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
/* Floating orb component                                              */
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
/* Input field component                                               */
/* ------------------------------------------------------------------ */

function FormInput({
  label,
  type = "text",
  placeholder,
  icon,
}: {
  label: string;
  type?: string;
  placeholder: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div variants={fadeUp} transition={springTransition}>
      <label className="block text-sm font-medium text-gray-400 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
          readOnly
          tabIndex={-1}
          aria-hidden
        />
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateAccount = () => {
    setLoading(true);
    setError(null);
    try {
      const callbackUrl = `${window.location.origin}/api/auth/callback/keycloak`;
      const registrationUrl =
        `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/registrations` +
        `?client_id=${KEYCLOAK_CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(callbackUrl)}` +
        `&response_type=code` +
        `&scope=openid`;
      window.location.href = registrationUrl;
    } catch {
      setError("Failed to redirect to registration. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden hero-gradient grid-bg noise-overlay">
      <Head>
        <title>Create Account — LostInVirtual</title>
        <meta
          name="description"
          content="Create your LostInVirtual citizen account and join the global digital citizen registry."
        />
      </Head>

      {/* Background orbs */}
      <FloatingOrb
        color="rgba(59,130,246,0.12)"
        size={450}
        top="-15%"
        left="15%"
        delay={0}
      />
      <FloatingOrb
        color="rgba(139,92,246,0.10)"
        size={350}
        top="50%"
        left="65%"
        delay={2}
      />
      <FloatingOrb
        color="rgba(236,72,153,0.06)"
        size={300}
        top="70%"
        left="5%"
        delay={4}
      />

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
              Create your citizen account
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

          {/* Form fields (visual only — redirect to Keycloak for actual registration) */}
          <motion.div
            className="space-y-4 mb-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <FormInput
              label="Full Name"
              type="text"
              placeholder="Jane Doe"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              }
            />
            <FormInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              }
            />
            <FormInput
              label="Username"
              type="text"
              placeholder="jane_citizen"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
                </svg>
              }
            />
            <FormInput
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              }
            />
            <FormInput
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              }
            />
          </motion.div>

          {/* Create Account button */}
          <motion.div
            variants={fadeUp}
            transition={springTransition}
            className="mb-4"
          >
            <MotionButton
              variant="primary"
              className="w-full py-4 text-base"
              loading={loading}
              onClick={handleCreateAccount}
            >
              Create Account
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

          {/* Sign In Instead */}
          <motion.div
            variants={fadeUp}
            transition={springTransition}
          >
            <MotionButton
              variant="secondary"
              className="w-full py-4 text-base"
              onClick={() => router.push("/login")}
            >
              Sign In Instead
            </MotionButton>
          </motion.div>

          {/* Terms & Privacy info */}
          <motion.div
            variants={fadeUp}
            transition={springTransition}
            className="mt-6 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
          >
            <p className="text-xs text-gray-600 text-center leading-relaxed">
              By creating an account, you agree to our{" "}
              <a href="#" className="text-gray-400 hover:text-gray-300 underline underline-offset-2 transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-gray-400 hover:text-gray-300 underline underline-offset-2 transition-colors">
                Privacy Policy
              </a>.
            </p>
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
