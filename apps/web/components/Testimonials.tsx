"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

const testimonials = [
  {
    name: "Andi Pratama",
    role: "UI Designer",
    content:
      "LostInVirtual memberikan ruang yang saya butuhkan — tanpa noise, tanpa pretensi. Komunitas ini seperti rumah kedua untuk kreativitas saya.",
    avatar: "A",
  },
  {
    name: "Sari Dewi",
    role: "Content Creator",
    content:
      "Akhirnya ada platform yang benar-benar menghargai konten bermakna. Mini courses-nya gila sih, langsung applicable!",
    avatar: "S",
  },
  {
    name: "Rizky Aditya",
    role: "Freelance Developer",
    content:
      "Digital identity saya di sini lebih nyata dari social media manapun. Merch- limited edition juga bikin saya makin feel belong.",
    avatar: "R",
  },
];

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[number];
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
    >
      <div className="glass rounded-2xl p-6 sm:p-8 h-full hover:border-brand-500/15 transition-all duration-300">
        {/* Stars */}
        <div className="flex gap-1 mb-4">
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
        </div>

        {/* Quote */}
        <p className="text-surface-300 text-sm leading-relaxed mb-6">
          &ldquo;{testimonial.content}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-sm font-bold">
            {testimonial.avatar}
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {testimonial.name}
            </p>
            <p className="text-xs text-surface-500">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      {/* Background accent */}
      <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-accent-500/5 blur-[120px] pointer-events-none" />

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
            Testimoni
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Apa kata{" "}
            <span className="gradient-text">residents</span> kami?
          </h2>
          <p className="mx-auto max-w-xl text-surface-400 leading-relaxed">
            Mereka yang sudah merasakan perbedaan. Sekarang giliran kamu.
          </p>
        </motion.div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
