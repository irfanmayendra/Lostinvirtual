"use client";

import { motion } from "framer-motion";
import React, { forwardRef } from "react";

interface AnimatedInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | null;
}

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

const AnimatedInput = forwardRef<HTMLInputElement, AnimatedInputProps>(
  ({ error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        <motion.div
          whileFocus={{ scale: 1.01 }}
          transition={springTransition}
          className="relative"
        >
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 rounded-xl
              bg-gray-900/80 border border-gray-800/50
              text-white font-mono text-sm
              placeholder:text-gray-600
              focus:border-blue-500/60 focus:outline-none
              focus:shadow-[0_0_0_3px_rgba(59,130,246,0.15)]
              transition-shadow duration-200
              ${error ? "border-red-500/60 focus:border-red-500/80" : ""}
              ${className}
            `}
            {...props}
          />
        </motion.div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springTransition}
            className="mt-1.5 text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

AnimatedInput.displayName = "AnimatedInput";

export default AnimatedInput;
