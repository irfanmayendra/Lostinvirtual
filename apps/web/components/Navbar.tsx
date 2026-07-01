"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Community", href: "#testimonials" },
];

const springTransition = { type: "spring" as const, stiffness: 100, damping: 20 };

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ ...springTransition, delay: 0.1 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="glass-strong mt-4 rounded-2xl px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-[2px] rounded-[6px] bg-surface-950 flex items-center justify-center">
                  <span className="text-sm font-bold gradient-text">L</span>
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight hidden sm:block">
                Lost<span className="gradient-text">In</span>Virtual
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm text-surface-400 hover:text-white transition-colors duration-200 rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="#cta"
                className="px-5 py-2 text-sm font-medium text-surface-300 hover:text-white transition-colors"
              >
                Login
              </a>
              <a
                href="#cta"
                className="relative px-5 py-2 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 hover:from-brand-600 hover:to-accent-600 transition-all duration-200 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40"
              >
                Join the Circle
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative p-2 text-surface-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={springTransition}
            className="md:hidden mx-4 mt-2 overflow-hidden"
          >
            <div className="glass-strong rounded-2xl p-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 text-sm text-surface-300 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-white/5">
                <a
                  href="#cta"
                  onClick={() => setIsOpen(false)}
                  className="block w-full px-4 py-3 text-sm font-semibold text-white text-center rounded-xl bg-gradient-to-r from-brand-500 to-accent-500"
                >
                  Join the Circle
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
