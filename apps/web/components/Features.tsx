"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

const features = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
    title: "Digital Identity",
    description: "Bukan sekadar akun — ini adalah identitas digital kamu. Profil yang mencerminkan siapa kamu sebenarnya, bukan siapa kamu seharusnya.",
    gradient: "from-brand-500 to-brand-600",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: "Curated Content",
    description: "Konten yang dipilih secara personal, bukan hasil algoritma yang membuat kamu makinbosan. Setiap konten punya makna.",
    gradient: "from-accent-500 to-accent-600",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    title: "Mini Courses",
    description: "Belajar sesuatu yang berharga tanpa harus scroll berjam-jam. Mini courses yang langsung applicable untuk hidup kamu.",
    gradient: "from-brand-400 to-accent-500",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    title: "Exclusive Merch",
    description: "Merchandise yang tidak bisa kamu temukan di mana pun. Design eksklusif yang hanya tersedia untuk residents.",
    gradient: "from-accent-400 to-brand-500",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ ...springTransition, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="glass rounded-2xl p-6 sm:p-8 h-full hover:border-brand-500/20 transition-all duration-300 hover:glow-brand">
        {/* Icon */}
        <div
          className={`inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-5 shadow-lg`}
        >
          {feature.icon}
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-white mb-3">
          {feature.title}
        </h3>
        <p className="text-sm text-surface-400 leading-relaxed">
          {feature.description}
        </p>

        {/* Hover arrow */}
        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span>Learn more</span>
          <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-24 sm:py-32">
      {/* Background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-brand-500/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={springTransition}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full glass text-xs font-medium text-brand-300 tracking-wide uppercase mb-4">
            Fitur
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Lebih dari sekadar{" "}
            <span className="gradient-text">platform</span>
          </h2>
          <p className="mx-auto max-w-2xl text-surface-400 leading-relaxed">
            Setiap fitur dirancang untuk memberikan pengalaman digital yang
            bermakna — bukan hanya menghabiskan waktu.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
