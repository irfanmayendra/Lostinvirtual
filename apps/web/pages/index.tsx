"use client";

import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { motion, useInView } from "framer-motion";
import WorldMapPreview from "@/components/WorldMapPreview";
import GlassCard from "@/components/ui/GlassCard";
import GradientText from "@/components/ui/GradientText";
import MotionButton from "@/components/ui/MotionButton";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface Region {
  name: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  citizenCount: number;
}

interface WorldMapData {
  regions: Region[];
  totalCitizens: number;
  totalRegions: number;
}

/* ------------------------------------------------------------------ */
/* Animation variants                                                  */
/* ------------------------------------------------------------------ */

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const staggerContainerFast = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

/* ------------------------------------------------------------------ */
/* Animated counter hook                                               */
/* ------------------------------------------------------------------ */

function useCountUp(end: number, duration = 1800, active = true) {
  const [value, setValue] = useState(0);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (!active || end === 0) {
      setValue(end);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end));
      if (progress < 1) {
        ref.current = requestAnimationFrame(tick);
      }
    };
    ref.current = requestAnimationFrame(tick);
    return () => {
      if (ref.current) cancelAnimationFrame(ref.current);
    };
  }, [end, duration, active]);

  return value;
}

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
/* Scroll indicator                                                    */
/* ------------------------------------------------------------------ */

function ScrollIndicator() {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8 }}
    >
      <span className="text-[10px] uppercase tracking-widest font-mono">
        Scroll
      </span>
      <motion.div
        className="w-px h-8 bg-gradient-to-b from-gray-600 to-transparent"
        animate={{ scaleY: [1, 0.6, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Features data                                                       */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: "🛡️",
    title: "Secure Identity",
    desc: "Your digital identity is cryptographically verified and sovereign. No centralized authority controls your status.",
  },
  {
    icon: "🌐",
    title: "Global Presence",
    desc: "Join citizens from every region on a decentralized network. Your identity travels with you across borders.",
  },
  {
    icon: "⚡",
    title: "Instant Activation",
    desc: "Become a citizen in seconds with seamless onboarding. Purchase merchandise, activate your token, and you're in.",
  },
];

/* ------------------------------------------------------------------ */
/* How it works data                                                   */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    number: "01",
    title: "Buy Merchandise",
    desc: "Purchase official LostInVirtual merchandise from our store. Each item contains a unique activation token.",
  },
  {
    number: "02",
    title: "Activate Token",
    desc: "Enter your activation code to link the merchandise to your emerging digital identity.",
  },
  {
    number: "03",
    title: "Become a Citizen",
    desc: "Complete registration and receive your permanent citizen credentials in the global registry.",
  },
];

/* ------------------------------------------------------------------ */
/* Stat counter component                                              */
/* ------------------------------------------------------------------ */

function StatCounter({
  value,
  label,
  color,
  loading,
}: {
  value: number;
  label: string;
  color: string;
  loading: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className={`text-3xl sm:text-4xl font-bold tabular-nums font-mono ${color}`}
      >
        {loading ? (
          <span className="inline-block w-16 h-8 bg-gray-800 rounded animate-pulse" />
        ) : (
          value.toLocaleString()
        )}
      </div>
      <div className="text-xs sm:text-sm text-gray-500 mt-1 uppercase tracking-wider font-mono">
        {label}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [worldData, setWorldData] = useState<WorldMapData | null>(null);
  const [loading, setLoading] = useState(true);

  /* ---- fetch world data ---- */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/world-map");
        if (res.ok) setWorldData(await res.json());
      } catch {
        /* silent */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ---- animated counters ---- */
  const citizenCount = useCountUp(worldData?.totalCitizens ?? 0, 2000, !loading);
  const regionCount = useCountUp(worldData?.totalRegions ?? 0, 2000, !loading);
  const merchandiseCount = useCountUp(1247, 2200, !loading);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col noise-overlay">
      <Head>
        <title>LostInVirtual — Digital Citizen Registry</title>
        <meta
          name="description"
          content="The digital frontier's premier citizen registry. Claim your identity, secure your status, and become part of the ecosystem."
        />
      </Head>

      {/* ============================================================ */}
      {/* HERO                                                          */}
      {/* ============================================================ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden hero-gradient grid-bg">
        {/* Animated floating orbs */}
        <FloatingOrb
          color="rgba(59,130,246,0.15)"
          size={500}
          top="-10%"
          left="20%"
          delay={0}
        />
        <FloatingOrb
          color="rgba(139,92,246,0.12)"
          size={400}
          top="30%"
          left="60%"
          delay={2}
        />
        <FloatingOrb
          color="rgba(236,72,153,0.08)"
          size={350}
          top="60%"
          left="10%"
          delay={4}
        />

        <motion.div
          className="relative z-10 text-center space-y-8 max-w-4xl mx-auto px-6 py-20"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Title */}
          <motion.h1
            variants={fadeUp}
            transition={springTransition}
            className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight leading-none"
          >
            <GradientText>LostInVirtual</GradientText>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            transition={springTransition}
            className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Digital Citizen Registry
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            variants={fadeUp}
            transition={springTransition}
            className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MotionButton
              variant="primary"
              className="px-8 py-4 text-lg"
              onClick={() => router.push("/signup")}
            >
              Become a Citizen
            </MotionButton>
            <MotionButton
              variant="secondary"
              className="px-8 py-4 text-lg"
              onClick={() =>
                document
                  .getElementById("world")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Explore Map
            </MotionButton>
          </motion.div>
        </motion.div>

        <ScrollIndicator />
      </section>

      {/* ============================================================ */}
      {/* STATS BAR                                                     */}
      {/* ============================================================ */}
      <section className="py-12 px-6 border-y border-white/[0.06]">
        <motion.div
          className="max-w-4xl mx-auto grid grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainerFast}
        >
          <motion.div variants={fadeUp} transition={springTransition}>
            <StatCounter
              value={citizenCount}
              label="Citizens"
              color="text-blue-400"
              loading={loading}
            />
          </motion.div>
          <motion.div variants={fadeUp} transition={springTransition}>
            <StatCounter
              value={regionCount}
              label="Regions"
              color="text-purple-400"
              loading={loading}
            />
          </motion.div>
          <motion.div variants={fadeUp} transition={springTransition}>
            <StatCounter
              value={merchandiseCount}
              label="Merchandise"
              color="text-pink-400"
              loading={loading}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* WORLD MAP SECTION                                             */}
      {/* ============================================================ */}
      <section id="world" className="py-20 sm:py-28 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeUp}
              transition={springTransition}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              <GradientText>Global Network</GradientText>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              transition={springTransition}
              className="text-gray-500 max-w-lg mx-auto"
            >
              Our citizens span every continent. Explore the network and find
              where your community thrives.
            </motion.p>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={springTransition}
          >
            {loading ? (
              <div className="glass-card p-8 flex items-center justify-center h-80">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent" />
                  <span className="text-sm text-gray-500 font-mono">
                    Loading global network…
                  </span>
                </div>
              </div>
            ) : (
              <WorldMapPreview regions={worldData?.regions ?? []} />
            )}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FEATURES SECTION                                              */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeUp}
              transition={springTransition}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              Why <GradientText>LostInVirtual</GradientText>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              transition={springTransition}
              className="text-gray-500 max-w-lg mx-auto"
            >
              Built for citizens who demand sovereignty, security, and seamless
              global access.
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            {FEATURES.map((f) => (
              <GlassCard key={f.title} className="p-8 text-center">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.desc}
                </p>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* HOW IT WORKS SECTION                                          */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={fadeUp}
              transition={springTransition}
              className="text-3xl sm:text-4xl font-bold mb-4"
            >
              How It <GradientText>Works</GradientText>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              transition={springTransition}
              className="text-gray-500 max-w-lg mx-auto"
            >
              Three steps to digital citizenship. Simple, secure, instant.
            </motion.p>
          </motion.div>

          <motion.div
            className="relative"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={staggerContainerFast}
          >
            {/* Connecting line */}
            <div className="hidden sm:block absolute top-8 left-[calc(16.67%+16px)] right-[calc(16.67%+16px)] h-px bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.number}
                  variants={fadeUp}
                  transition={springTransition}
                  className="flex flex-col items-center text-center"
                >
                  {/* Step number */}
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/[0.08] flex items-center justify-center">
                      <span className="text-xl font-bold font-mono text-blue-400">
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CTA BANNER                                                    */}
      {/* ============================================================ */}
      <section className="py-20 sm:py-28 px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <motion.h2
            variants={fadeUp}
            transition={springTransition}
            className="text-3xl sm:text-4xl font-bold mb-4"
          >
            Ready to become a <GradientText>Citizen</GradientText>?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            transition={springTransition}
            className="text-gray-500 max-w-lg mx-auto mb-8"
          >
            Join the global network of digital citizens. Your identity, your
            sovereignty, your future.
          </motion.p>
          <motion.div variants={fadeUp} transition={springTransition}>
            <MotionButton
              variant="primary"
              className="px-10 py-4 text-lg"
              onClick={() => router.push("/signup")}
            >
              Get Started
            </MotionButton>
          </motion.div>
        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER                                                        */}
      {/* ============================================================ */}
      <motion.footer
        className="mt-auto py-8 px-6 border-t border-gray-900"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-600 font-mono">
            © 2026 LostInVirtual Registry. Secure. Sovereign.
          </span>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-gray-300 transition-colors">
              Docs
            </a>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}
