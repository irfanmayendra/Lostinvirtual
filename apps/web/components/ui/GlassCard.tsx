"use client";

import { motion } from "framer-motion";
import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function GlassCard({
  children,
  className = "",
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={springTransition}
      whileHover={
        hover
          ? {
              y: -2,
              boxShadow:
                "0 0 24px rgba(59,130,246,0.35), 0 0 48px rgba(139,92,246,0.2)",
            }
          : undefined
      }
      className={`glass-card ${className}`}
    >
      {children}
    </motion.div>
  );
}
