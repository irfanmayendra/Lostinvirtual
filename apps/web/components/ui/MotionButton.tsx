"use client";

import { motion } from "framer-motion";
import React from "react";

interface MotionButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  loading?: boolean;
}

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

const variantClasses: Record<string, string> = {
  primary:
    "bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg shadow-blue-500/20",
  secondary:
    "border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 bg-transparent",
  ghost: "text-gray-400 hover:text-white bg-transparent",
};

export default function MotionButton({
  children,
  variant = "primary",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  loading = false,
}: MotionButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={disabled ? undefined : { scale: 1.03 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={springTransition}
      className={`
        relative inline-flex items-center justify-center
        px-6 py-3 rounded-xl text-base
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        overflow-hidden
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {/* Inner highlight */}
      {variant === "primary" && (
        <span
          className="absolute inset-0 rounded-xl bg-white/5 pointer-events-none"
          aria-hidden
        />
      )}
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="relative z-10">{children}</span>
        </span>
      ) : (
        <span className="relative z-10">{children}</span>
      )}
    </motion.button>
  );
}
