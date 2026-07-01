"use client";

import { motion } from "framer-motion";

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: springTransition },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-brand-500/20 blur-[128px]" />
        <div className="absolute top-1/3 -left-40 h-80 w-80 rounded-full bg-accent-500/15 blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-brand-600/10 blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 text-center">
        <motion.div variants={container} initial="hidden" animate="show">
          {/* Badge */}
          <motion.div variants={item} className="mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-brand-300 tracking-wide uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400 animate-pulse" />
              Exclusive Community — Limited Access
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={item}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6"
          >
            <span className="block text-white">Kamu Tidak Sendirian.</span>
            <span className="block gradient-text mt-2">
              Temukan Dunia Digital Kamu.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={item}
            className="mx-auto max-w-2xl text-base sm:text-lg text-surface-400 leading-relaxed mb-10"
          >
            Sebuah ruang eksklusif untuk mereka yang lelah dengan kebisingan
            dunia nyata dan internet. Di sini, kamu bukan sekadar user — kamu
            adalah bagian dari sebuah{" "}
            <span className="text-surface-200 font-medium">identitas digital</span>{" "}
            yang dihargai.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#cta"
              className="group relative px-8 py-3.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 transition-all duration-200 shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10">Masuk ke Circle</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-brand-400 to-accent-400 opacity-0 group-hover:opacity-20 transition-opacity" />
            </a>
            <a
              href="#features"
              className="px-8 py-3.5 text-sm font-medium text-surface-300 hover:text-white rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all duration-200"
            >
              Jelajahi Fitur
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            variants={item}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-surface-500"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-7 w-7 rounded-full border-2 border-surface-950 bg-gradient-to-br from-brand-500 to-accent-500"
                    style={{ opacity: 1 - i * 0.15 }}
                  />
                ))}
              </div>
              <span className="text-surface-300 font-medium">2,847+</span>
              <span>residents bergabung</span>
            </div>
            <div className="hidden sm:block h-4 w-px bg-surface-700" />
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <svg
                  key={i}
                  className="h-4 w-4 text-amber-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-surface-300 font-medium">4.9</span>
              <span>dari residents</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-950 to-transparent" />
    </section>
  );
}
