"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

const steps = [
  {
    number: "01",
    title: "Buat Identitas Digital",
    description:
      "Daftar dan bangun profil digital kamu. Pilih username, avatar, dan definisi siapa kamu di dunia ini.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Jelajahi & Terhubung",
    description:
      "Akses konten curated, ikut mini courses, dan terhubung dengan fellow residents yang sepemikiran.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Miliki Pengalaman Eksklusif",
    description:
      "Dapatkan akses ke merchandise edisi terbatas, konten premium, dan event khusus residents.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
];

function StepCard({
  step,
  index,
  isLast,
}: {
  step: (typeof steps)[number];
  index: number;
  isLast: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ ...springTransition, delay: index * 0.15 }}
      className="relative"
    >
      <div className="flex gap-6 sm:gap-8">
        {/* Step indicator */}
        <div className="flex flex-col items-center">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/20">
            {step.icon}
          </div>
          {!isLast && (
            <div className="mt-4 h-full w-px bg-gradient-to-b from-brand-500/30 to-transparent" />
          )}
        </div>

        {/* Content */}
        <div className="pb-12">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold tracking-widest text-brand-400 uppercase">
              Step {step.number}
            </span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
          <p className="text-sm text-surface-400 leading-relaxed max-w-md">
            {step.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="relative py-24 sm:py-32">
      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={springTransition}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full glass text-xs font-medium text-brand-300 tracking-wide uppercase mb-4">
            Cara Kerja
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Tiga langkah menuju{" "}
            <span className="gradient-text">dunia baru</span>
          </h2>
          <p className="mx-auto max-w-xl text-surface-400 leading-relaxed">
            Proses yang simpel, tapi hasilnya transformatif. Mulai perjalanan
            digital identity kamu sekarang.
          </p>
        </motion.div>

        {/* Steps */}
        <div>
          {steps.map((step, index) => (
            <StepCard
              key={step.number}
              step={step}
              index={index}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
