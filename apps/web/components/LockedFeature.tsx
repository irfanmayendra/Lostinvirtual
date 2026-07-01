'use client';

import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

interface LockedFeatureProps {
  title: string;
  description: string;
  onActivate?: () => void;
}

export default function LockedFeature({
  title,
  description,
  onActivate,
}: LockedFeatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative glass rounded-2xl p-8 text-center"
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 rounded-2xl grid-bg opacity-50" />

      <div className="relative z-10">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-gray-700/50 to-gray-800/50 flex items-center justify-center border border-gray-600/30"
        >
          <Lock size={24} className="text-gray-400" />
        </motion.div>

        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
          {description}
        </p>

        {onActivate && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onActivate}
            className="btn-gradient px-6 py-2.5 rounded-lg text-white font-medium text-sm"
          >
            Activate Now
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
