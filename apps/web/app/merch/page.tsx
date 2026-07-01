'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ShoppingCart, Check, Package } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  badge?: string;
}

const products: Product[] = [
  {
    id: 'citizen-card',
    name: 'Citizen Card',
    price: 29,
    description: 'Premium digital citizen identification card with holographic effects',
    image: '🎴',
    badge: 'Most Popular',
  },
  {
    id: 'avatar-pack',
    name: 'Avatar Pack',
    price: 19,
    description: 'Exclusive avatar designs and customization options',
    image: '🎨',
  },
  {
    id: 'starter-kit',
    name: 'Starter Kit',
    price: 49,
    description: 'Everything you need: Card + Avatar + Community Access + Badges',
    image: '📦',
    badge: 'Best Value',
  },
  {
    id: 'event-pass',
    name: 'Event Pass',
    price: 39,
    description: 'Annual pass to all virtual events and workshops',
    image: '🎟️',
  },
];

export default function MerchPage() {
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [activationCode, setActivationCode] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('liv_user');
    if (!stored) {
      router.push('/auth/login');
    }
  }, [router]);

  const handlePurchase = async (product: Product) => {
    setSelectedProduct(product);
    setPurchasing(true);

    // Mock payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate mock activation code
    const code = `LIV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setActivationCode(code);
    setPurchasing(false);
    setPurchased(true);

    // Store the code
    localStorage.setItem('liv_activation_code', code);
  };

  if (purchased && activationCode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 grid-bg">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
            <Check size={28} className="text-emerald-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Purchase Complete!</h2>
          <p className="text-gray-400 text-sm mb-6">
            Your activation code is ready. Use it to unlock all features.
          </p>

          <div className="bg-[#1a1a2e] rounded-xl p-4 mb-6 border border-gray-700">
            <p className="text-xs text-gray-500 mb-1">Your Activation Code</p>
            <p className="text-xl font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400 tracking-wider">
              {activationCode}
            </p>
          </div>

          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                navigator.clipboard.writeText(activationCode);
              }}
              className="flex-1 py-3 rounded-lg bg-white/5 border border-white/10 text-white text-sm font-medium hover:bg-white/10 transition-colors"
            >
              Copy Code
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/activate')}
              className="flex-1 py-3 rounded-lg btn-gradient text-white text-sm font-medium"
            >
              Activate Now
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid-bg">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-violet-600/5 rounded-full blur-[150px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
              <span className="text-sm font-bold">L</span>
            </div>
            <span className="font-semibold text-white">Shop</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
              LostInVirtual
            </span>{' '}
            Merch
          </h1>
          <p className="text-gray-400">
            Purchase merchandise to receive your activation code
          </p>
        </motion.div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 relative overflow-hidden group"
            >
              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-500/30">
                  <span className="text-xs font-medium text-indigo-300">{product.badge}</span>
                </div>
              )}

              <div className="text-4xl mb-4">{product.image}</div>
              <h3 className="text-lg font-semibold text-white mb-1">{product.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{product.description}</p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-white">${product.price}</span>
                  <span className="text-gray-500 text-sm ml-1">USD</span>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={purchasing}
                  onClick={() => handlePurchase(product)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg btn-gradient text-white text-sm font-medium disabled:opacity-50"
                >
                  {purchasing && selectedProduct?.id === product.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      Buy to Activate
                    </>
                  )}
                </motion.button>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 text-sm">
            <Package size={14} />
            All purchases include an activation code sent instantly
          </div>
        </motion.div>
      </main>
    </div>
  );
}
