'use client';

import React from 'react';
import { motion } from 'framer-motion';

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 };

interface Citizen {
  id: string;
  citizenNumber: string;
  region?: { id: string; name: string; countryCode?: string; [key: string]: any } | string | null;
  regionName?: string;
  city: string;
  country: string;
  countryCode?: string;
  bio?: string;
  activatedAt: string;
  achievements?: Array<{
    id: string;
    name: string;
    description?: string;
    icon?: string;
    category?: string;
    points?: number;
    earnedAt?: string;
  }>;
  [key: string]: any;
}

interface CitizenCardProps {
  citizen: Citizen;
}

function getRegionName(citizen: Citizen): string {
  if (citizen.regionName) return citizen.regionName;
  if (citizen.region && typeof citizen.region === 'object' && 'name' in citizen.region) {
    return citizen.region.name;
  }
  if (typeof citizen.region === 'string') return citizen.region;
  return 'Unknown';
}

function formatDate(date: string): string {
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: spring },
};

export default function CitizenCard({ citizen }: CitizenCardProps) {
  const initials = (citizen.city || 'C').charAt(0).toUpperCase();
  const regionName = getRegionName(citizen);

  return (
    <motion.div
      className="group relative rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: 24, rotate: 0 }}
      whileHover={{ rotate: 0.5, scale: 1.01 }}
      transition={spring}
    >
      {/* Gradient border glow on hover */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />

      <motion.div
        className="relative rounded-2xl bg-[#09090b] border border-white/[0.06] overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        {/* Header Bar — gradient with grid pattern */}
        <motion.div variants={itemVariants} className="relative h-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <div className="relative h-full flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white text-xs font-black tracking-tighter">LIV</span>
              </div>
              <span className="text-white/90 text-sm font-bold tracking-[0.15em] uppercase">
                LostInVirtual
              </span>
            </div>
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-green-400"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <span className="text-white/80 text-xs font-medium">Active Citizen</span>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Avatar + Citizen Number */}
          <motion.div variants={itemVariants} className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20 shrink-0">
              <span className="text-white text-xl font-black">{initials}</span>
            </div>
            <div>
              <p className="text-xs text-white/30 font-medium uppercase tracking-wider mb-0.5 font-mono">
                Citizen ID
              </p>
              <p className="text-xl font-mono font-black text-white tracking-wider">
                {citizen.citizenNumber}
              </p>
            </div>
          </motion.div>

          {/* Info Grid — 2x2 */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-6">
            <InfoItem icon="🌍" label="Region" value={regionName} />
            <InfoItem icon="🏙️" label="City" value={citizen.city || '—'} />
            <InfoItem icon="🏳️" label="Country" value={citizen.country || '—'} />
            <InfoItem icon="📅" label="Activated" value={formatDate(citizen.activatedAt)} />
          </motion.div>

          {/* Achievements */}
          {citizen.achievements && citizen.achievements.length > 0 && (
            <motion.div variants={itemVariants} className="pt-4 border-t border-white/[0.06]">
              <p className="text-xs text-white/30 font-medium uppercase tracking-wider mb-3 font-mono">
                Achievements
              </p>
              <div className="flex flex-wrap gap-2">
                {citizen.achievements.map((ach) => (
                  <motion.div
                    key={ach.id}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-white/[0.03] border border-white/[0.06] rounded-lg"
                    whileHover={{ scale: 1.04, backgroundColor: 'rgba(255,255,255,0.06)' }}
                    transition={spring}
                  >
                    {ach.icon && <span className="text-sm">{ach.icon}</span>}
                    <span className="text-xs text-white/60 font-medium">{ach.name}</span>
                    {ach.points && (
                      <span className="text-[10px] text-white/30 ml-0.5 font-mono">+{ach.points}</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function InfoItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="px-3 py-2.5 bg-white/[0.02] border border-white/[0.04] rounded-xl">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-sm">{icon}</span>
        <span className="text-[11px] text-white/30 font-medium uppercase tracking-wider font-mono">
          {label}
        </span>
      </div>
      <p className="text-sm text-white/80 font-medium truncate">{value}</p>
    </div>
  );
}
