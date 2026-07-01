'use client';

import { motion } from 'framer-motion';
import { Lock, Check, Zap } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  locked: boolean;
  index?: number;
}

const iconMap: Record<string, React.ReactNode> = {
  identity: <Zap size={20} />,
  community: <span className="text-xl">🌐</span>,
  marketplace: <span className="text-xl">🛒</span>,
  events: <span className="text-xl">📅</span>,
  profile: <span className="text-xl">👤</span>,
  badges: <span className="text-xl">🏆</span>,
};

export default function FeatureCard({
  title,
  description,
  icon,
  locked,
  index = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + index * 0.08 }}
      whileHover={!locked ? { scale: 1.02, y: -2 } : {}}
      className={`relative glass rounded-xl p-5 transition-all duration-300 ${
        locked
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5'
      }`}
    >
      {/* Locked overlay */}
      {locked && (
        <div className="absolute inset-0 bg-[#0a0a0f]/40 rounded-xl flex items-center justify-center z-10">
          <div className="bg-[#0a0a0f]/80 rounded-full p-2">
            <Lock size={16} className="text-gray-500" />
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          locked
            ? 'bg-gray-800/50 text-gray-500'
            : 'bg-gradient-to-br from-indigo-500/20 to-violet-500/20 text-indigo-400'
        }`}>
          {iconMap[icon] || iconMap.identity}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-semibold text-sm ${locked ? 'text-gray-400' : 'text-white'}`}>
              {title}
            </h3>
            {!locked && (
              <Check size={14} className="text-emerald-400" />
            )}
          </div>
          <p className="text-gray-500 text-xs mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
