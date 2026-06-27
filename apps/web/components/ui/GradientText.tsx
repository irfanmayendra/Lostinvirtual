"use client";

import React from "react";

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  via?: string;
  to?: string;
}

export default function GradientText({
  children,
  className = "",
  from = "#60a5fa",
  via = "#a78bfa",
  to = "#f472b6",
}: GradientTextProps) {
  return (
    <span
      className={`gradient-text ${className}`}
      style={{
        background: `linear-gradient(135deg, ${from} 0%, ${via} 50%, ${to} 100%)`,
        backgroundSize: "300% 300%",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        animation: "gradient-shift 6s ease infinite",
      }}
    >
      {children}
    </span>
  );
}
