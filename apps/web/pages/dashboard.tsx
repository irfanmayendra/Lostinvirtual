'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import AuthButton from '@/components/AuthButton';
import ActivationForm from '@/components/ActivationForm';
import CitizenCard from '@/components/CitizenCard';

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
  achievements?: Array<{
    id: string;
    name: string;
    description?: string;
    icon?: string;
    category?: string;
    points?: number;
    earnedAt?: string;
  }>;
  activatedAt: string;
  createdAt?: string;
  [key: string]: any;
}

function getRegionName(citizen: Citizen): string {
  if (citizen.regionName) return citizen.regionName;
  if (citizen.region && typeof citizen.region === 'object' && 'name' in citizen.region) {
    return citizen.region.name;
  }
  if (typeof citizen.region === 'string') return citizen.region;
  return '—';
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

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: spring },
};

const steps = [
  { icon: '🔑', title: 'Get a Token', desc: 'Receive your activation token with LostInVirtual merchandise' },
  { icon: '⚡', title: 'Activate', desc: 'Enter your token on the dashboard to become a citizen' },
  { icon: '🌍', title: 'Explore', desc: 'Access your digital citizen card and connect with others' },
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCitizenInfo = useCallback(async () => {
    try {
      const res = await fetch('/api/citizen/me');
      if (res.ok) {
        const data = await res.json();
        setCitizen(data.citizen);
      } else {
        setCitizen(null);
      }
    } catch (err: any) {
      console.error('Error fetching citizen info:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
    if (status === 'authenticated') {
      fetchCitizenInfo();
    }
  }, [status, router, fetchCitizenInfo]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={spring}
        >
          <motion.div
            className="w-8 h-8 border-2 border-white/10 border-t-blue-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-sm text-white/30 font-mono">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!session) return null;

  const regionName = citizen ? getRegionName(citizen) : '—';
  const totalPoints =
    citizen?.achievements?.reduce((sum, a) => sum + (a.points || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-black text-white noise-overlay">
      <Head>
        <title>Dashboard | LostInVirtual</title>
      </Head>

      {/* ===== Header — sticky glass effect ===== */}
      <motion.header
        className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/60 backdrop-blur-xl"
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={spring}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                LostInVirtual
              </span>
            </h1>
            <span className="px-2 py-0.5 text-[11px] font-medium text-white/40 bg-white/[0.04] border border-white/[0.06] rounded-md font-mono">
              Dashboard
            </span>
          </div>
          <AuthButton />
        </div>
      </motion.header>

      {/* ===== Main Content ===== */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <h2 className="text-3xl font-bold mb-1">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {session.user?.name || 'Citizen'}
            </span>
          </h2>
          <p className="text-sm text-white/30">
            Here&apos;s your digital citizenship overview
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            className="mb-6 px-4 py-3 bg-red-500/5 border border-red-500/20 rounded-xl text-sm text-red-300"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={spring}
          >
            {error}
          </motion.div>
        )}

        {citizen ? (
          <motion.div
            className="space-y-6"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {/* Citizen Card */}
            <motion.div variants={fadeUp}>
              <CitizenCard citizen={citizen} />
            </motion.div>

            {/* Info Cards Grid — 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Location Card */}
              <motion.div
                className="glass-card rounded-2xl p-5 glow-hover"
                variants={fadeUp}
              >
                <h3 className="text-xs font-medium text-white/30 uppercase tracking-wider mb-4 font-mono">
                  Location
                </h3>
                <div className="space-y-3">
                  <Row icon="🌍" label="Region" value={regionName} />
                  <Row icon="🏙️" label="City" value={citizen.city || '—'} />
                  <Row icon="🏳️" label="Country" value={citizen.country || '—'} />
                </div>
              </motion.div>

              {/* Account Card */}
              <motion.div
                className="glass-card rounded-2xl p-5 glow-hover"
                variants={fadeUp}
              >
                <h3 className="text-xs font-medium text-white/30 uppercase tracking-wider mb-4 font-mono">
                  Account
                </h3>
                <div className="space-y-3">
                  <Row icon="🔑" label="Citizen ID" value={citizen.citizenNumber || '—'} mono />
                  <Row icon="📅" label="Activated" value={formatDate(citizen.activatedAt)} />
                  <Row
                    icon="✅"
                    label="Status"
                    value={<span className="text-green-400 font-medium">Active</span>}
                  />
                </div>
              </motion.div>

              {/* Stats Card */}
              <motion.div
                className="glass-card rounded-2xl p-5 glow-hover"
                variants={fadeUp}
              >
                <h3 className="text-xs font-medium text-white/30 uppercase tracking-wider mb-4 font-mono">
                  Stats
                </h3>
                <div className="space-y-3">
                  <Row icon="🏆" label="Achievements" value={String(citizen.achievements?.length || 0)} />
                  <Row icon="⭐" label="Total Points" value={String(totalPoints)} />
                  <Row icon="👤" label="Bio" value={citizen.bio || 'No bio yet'} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          /* ===== No Citizen — Activation Section ===== */
          <motion.div
            className="space-y-10"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            {/* Activation Card */}
            <motion.div variants={fadeUp}>
              <ActivationForm onSuccess={fetchCitizenInfo} />
            </motion.div>

            {/* How to become a citizen — Visual Guide */}
            <motion.div variants={fadeUp}>
              <div className="max-w-3xl mx-auto">
                <h3 className="text-center text-lg font-semibold text-white/70 mb-6">
                  How to become a citizen
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {steps.map((step, i) => (
                    <motion.div
                      key={i}
                      className="glass-card rounded-2xl p-6 text-center glow-hover"
                      whileHover={{ scale: 1.02 }}
                      transition={spring}
                    >
                      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                        <span className="text-2xl">{step.icon}</span>
                      </div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[11px] font-mono font-bold text-blue-400">
                          {i + 1}
                        </span>
                        <h4 className="text-sm font-semibold text-white/90">{step.title}</h4>
                      </div>
                      <p className="text-xs text-white/30 leading-relaxed">{step.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>

      {/* ===== Footer ===== */}
      <motion.footer
        className="border-t border-white/[0.06] mt-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={spring}
      >
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <span className="text-xs text-white/20 font-mono">© 2026 LostInVirtual</span>
          <span className="text-xs text-white/20">Digital Citizenship Platform</span>
        </div>
      </motion.footer>
    </div>
  );
}

function Row({ icon, label, value, mono }: { icon: string; label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm">{icon}</span>
        <span className="text-xs text-white/40">{label}</span>
      </div>
      <span className={`text-sm text-white/80 font-medium ${mono ? 'font-mono' : ''}`}>
        {value}
      </span>
    </div>
  );
}
