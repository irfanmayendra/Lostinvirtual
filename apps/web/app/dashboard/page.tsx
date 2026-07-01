'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, ShoppingCart, Sparkles } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';
import LockedFeature from '@/components/LockedFeature';

interface UserData {
  name: string;
  email: string;
  verified: boolean;
  activated: boolean;
}

const features = [
  { title: 'Digital Identity', description: 'Your unique citizen profile in the virtual world', icon: 'identity', unlocked: true },
  { title: 'Community Hub', description: 'Connect with other digital citizens and creators', icon: 'community', unlocked: false },
  { title: 'Marketplace', description: 'Buy, sell, and trade virtual goods and services', icon: 'marketplace', unlocked: false },
  { title: 'Virtual Events', description: 'Exclusive access to meetups, workshops, and parties', icon: 'events', unlocked: false },
  { title: 'Profile Customization', description: 'Customize your avatar, badges, and public profile', icon: 'profile', unlocked: false },
  { title: 'Achievement Badges', description: 'Earn badges for community contributions', icon: 'badges', unlocked: false },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('liv_user');
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      router.push('/auth/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('liv_user');
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-indigo-600/5 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <span className="text-sm font-bold">L</span>
            </div>
            <span className="font-semibold text-white">LostInVirtual</span>
          </div>
          <div className="flex items-center gap-4">
            {!user.activated && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/merch')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg btn-gradient text-white text-sm font-medium"
              >
                <ShoppingCart size={16} />
                Shop to Activate
              </motion.button>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">{user.name}</span>
          </h1>
          <p className="text-gray-400">
            {user.activated
              ? 'Your digital identity is fully activated.'
              : 'Your digital identity is locked. Activate your account to unlock all features.'}
          </p>
        </motion.div>

        {/* Digital Identity Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-6 mb-10"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                user.activated
                  ? 'bg-gradient-to-br from-indigo-500 to-violet-500'
                  : 'bg-gray-800/50 border border-gray-600/30'
              }`}>
                {user.activated ? (
                  <Sparkles size={24} className="text-white" />
                ) : (
                  <span className="text-2xl">🔒</span>
                )}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">Your Digital Identity</h2>
                <p className="text-gray-400 text-sm">
                  {user.activated ? 'Fully activated citizen' : 'Identity pending activation'}
                </p>
              </div>
            </div>

            {!user.activated && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push('/merch')}
                className="btn-gradient px-5 py-2.5 rounded-lg text-white font-medium text-sm"
              >
                Activate Now
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                locked={!feature.unlocked && !user.activated}
                index={i}
              />
            ))}
          </div>
        </div>

        {/* Activation CTA */}
        {!user.activated && (
          <div className="mt-10">
            <LockedFeature
              title="Unlock Full Access"
              description="Purchase merchandise to receive your activation code and unlock all platform features."
              onActivate={() => router.push('/merch')}
            />
          </div>
        )}
      </main>
    </div>
  );
}
