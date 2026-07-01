'use client';

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface FormField {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  minLength?: number;
}

interface AuthFormProps {
  title: string;
  subtitle: string;
  fields: FormField[];
  submitLabel: string;
  loadingLabel?: string;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  footer?: React.ReactNode;
  showRememberMe?: boolean;
  onRememberMeChange?: (checked: boolean) => void;
}

export default function AuthForm({
  title,
  subtitle,
  fields,
  submitLabel,
  loadingLabel = 'Processing...',
  onSubmit,
  footer,
  showRememberMe,
  onRememberMeChange,
}: AuthFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [rememberMe, setRememberMe] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    for (const field of fields) {
      const value = formData[field.name] || '';

      if (field.required && !value.trim()) {
        newErrors[field.name] = `${field.label} is required`;
        continue;
      }

      if (field.name === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.name] = 'Please enter a valid email address';
        }
      }

      if (field.minLength && value.length < field.minLength) {
        newErrors[field.name] = `${field.label} must be at least ${field.minLength} characters`;
      }

      if (field.name === 'confirmPassword') {
        if (value !== (formData['password'] || '')) {
          newErrors[field.name] = 'Passwords do not match';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setErrors({ _form: err instanceof Error ? err.message : 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = (name: string) => {
    setShowPassword((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 grid-bg">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <div className="glass rounded-2xl p-8 shadow-2xl shadow-indigo-500/5">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center"
            >
              <span className="text-2xl font-bold">L</span>
            </motion.div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            <p className="text-gray-400 mt-2 text-sm">{subtitle}</p>
          </div>

          {/* Form Error */}
          <AnimatePresence>
            {errors._form && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
              >
                {errors._form}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map((field, i) => (
              <motion.div
                key={field.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                  {field.label}
                </label>
                <div className="relative focus-glow rounded-lg">
                  <input
                    type={
                      field.type === 'password' && showPassword[field.name]
                        ? 'text'
                        : field.type
                    }
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className={`w-full px-4 py-3 rounded-lg text-white placeholder-gray-500 text-sm ${
                      errors[field.name] ? 'border-red-500!' : ''
                    }`}
                    autoComplete={
                      field.type === 'password' ? 'current-password' : field.name
                    }
                  />
                  {field.type === 'password' && (
                    <button
                      type="button"
                      onClick={() => togglePassword(field.name)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                    >
                      {showPassword[field.name] ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  )}
                </div>
                <AnimatePresence>
                  {errors[field.name] && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-red-400 text-xs mt-1.5"
                    >
                      {errors[field.name]}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}

            {/* Remember Me */}
            {showRememberMe && (
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => {
                      setRememberMe(e.target.checked);
                      onRememberMeChange?.(e.target.checked);
                    }}
                    className="w-4 h-4 rounded border-gray-600 bg-[#1a1a2e] text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-400">Remember me</span>
                </label>
                <a href="#" className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-lg btn-gradient text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {loadingLabel}
                </>
              ) : (
                submitLabel
              )}
            </motion.button>
          </form>

          {/* Footer */}
          {footer && (
            <div className="mt-6 text-center text-sm text-gray-400">
              {footer}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
