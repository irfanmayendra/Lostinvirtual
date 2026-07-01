"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="cta" className="relative py-24 sm:py-32">
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={
            isInView
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: 0, y: 40, scale: 0.98 }
          }
          transition={springTransition}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-accent-500" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />

          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-20 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ ...springTransition, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4"
            >
              Siap Menjadi{" "}
              <span className="text-white/90">Resident</span>?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ ...springTransition, delay: 0.2 }}
              className="mx-auto max-w-xl text-brand-100 text-base sm:text-lg leading-relaxed mb-8"
            >
              Bergabung sekarang dan mulai membangun identitas digital kamu.
              Akses eksklusif, komunitas premium, dan pengalaman yang tidak
              akan kamu temukan di tempat lain.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ ...springTransition, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="#"
                className="group relative px-8 py-4 text-sm font-bold text-brand-600 bg-white rounded-xl hover:bg-brand-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98]"
              >
                <span className="relative z-10">Buat Identitas Sekarang</span>
              </a>
              <a
                href="#"
                className="px-8 py-4 text-sm font-medium text-white/90 hover:text-white rounded-xl border border-white/20 hover:border-white/30 hover:bg-white/10 transition-all duration-200"
              >
                Pelajari Lebih Lanjut
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ ...springTransition, delay: 0.4 }}
              className="mt-8 text-xs text-brand-200/60"
            >
              Gratis untuk memulai. Tidak ada kartu kredit yang dibutuhkan.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
