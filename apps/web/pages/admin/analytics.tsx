'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import AdminLayout from '@/components/admin/AdminLayout';

const spring = { type: 'spring' as const, stiffness: 100, damping: 20 };
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.03 } } };
const fadeUp = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: spring } };

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface AnalyticsData {
  overview: {
    totalCitizens: number;
    totalTokens: number;
    totalRegions: number;
    totalUsers: number;
  };
  citizensPerRegion: { name: string; code: string; count: number }[];
  tokensByStatus: { status: string; count: number }[];
  tokensByType: { type: string; count: number }[];
  citizensPerMonth: { month: string; count: number }[];
  usersPerMonth: { month: string; count: number }[];
  topCountries: { countryCode: string; count: number }[];
}

/* ------------------------------------------------------------------ */
/* Dynamic Recharts import (client-side only)                          */
/* ------------------------------------------------------------------ */

let RechartsComponents: any = null;

function useRecharts() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    import('recharts').then((mod) => {
      RechartsComponents = mod;
      setLoaded(true);
    });
  }, []);
  return loaded;
}

/* ------------------------------------------------------------------ */
/* Stat Card                                                           */
/* ------------------------------------------------------------------ */

function StatCard({ label, value, icon, delay }: { label: string; value: number; icon: string; delay: number }) {
  return (
    <motion.div
      className="glass-card p-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider font-mono">{label}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-white font-mono">{value.toLocaleString()}</p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Chart Container                                                     */
/* ------------------------------------------------------------------ */

function ChartCard({ title, children, delay }: { title: string; children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      className="glass-card p-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...spring, delay }}
    >
      <h3 className="text-sm font-medium text-white mb-4">{title}</h3>
      <div className="w-full h-[280px]">
        {children}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Analytics Page                                                      */
/* ------------------------------------------------------------------ */

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const chartsLoaded = useRecharts();

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  const renderCharts = () => {
    if (!chartsLoaded || !RechartsComponents || !data) return null;

    const {
      BarChart, Bar, PieChart, Pie, LineChart, Line,
      XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
    } = RechartsComponents;

    const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#06b6d4', '#ec4899', '#f97316'];
    const STATUS_COLORS: Record<string, string> = {
      UNUSED: '#6b7280',
      ACTIVATED: '#10b981',
      SUSPENDED: '#ef4444',
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Citizens per Region */}
        <ChartCard title="Citizens per Region (Top 10)" delay={0.2}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.citizensPerRegion} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6b7280', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
                angle={-35}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="count" name="Citizens" radius={[4, 4, 0, 0]}>
                {data.citizensPerRegion.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Tokens by Status */}
        <ChartCard title="Tokens by Status" delay={0.25}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.tokensByStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                paddingAngle={2}
                label={({ status, percent }: any) => `${status} ${(percent * 100).toFixed(0)}%`}
              >
                {data.tokensByStatus.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#6b7280'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Tokens by Type */}
        <ChartCard title="Tokens by Merchandise Type" delay={0.3}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.tokensByType} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="type"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="count" name="Tokens" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                {data.tokensByType.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* New Citizens per Month */}
        <ChartCard title="New Citizens (Last 6 Months)" delay={0.35}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.citizensPerMonth} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#6b7280', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="New Citizens"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top 5 Countries */}
        <ChartCard title="Top 5 Countries by Citizen Count" delay={0.4}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.topCountries} layout="vertical" margin={{ top: 5, right: 20, left: 50, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                type="number"
                tick={{ fill: '#6b7280', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="countryCode"
                tick={{ fill: '#6b7280', fontSize: 11 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="count" name="Citizens" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                {data.topCountries.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* New Users per Month */}
        <ChartCard title="New Users (Last 6 Months)" delay={0.45}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.usersPerMonth} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis
                dataKey="month"
                tick={{ fill: '#6b7280', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6b7280', fontSize: 10 }}
                axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#fff',
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                name="New Users"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    );
  };

  return (
    <AdminLayout>
      <Head>
        <title>Analytics — Admin — LostInVirtual</title>
      </Head>

      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
      >
        <div>
          <h1 className="text-xl font-bold text-white">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Platform-wide statistics and trends</p>
        </div>
      </motion.div>

      {loading ? (
        <div className="py-20 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : data ? (
        <>
          {/* Overview Cards */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
            variants={stagger}
            initial="hidden"
            animate="visible"
          >
            <StatCard label="Citizens" value={data.overview.totalCitizens} icon="👤" delay={0} />
            <StatCard label="Tokens" value={data.overview.totalTokens} icon="🎫" delay={0.05} />
            <StatCard label="Regions" value={data.overview.totalRegions} icon="🌍" delay={0.1} />
            <StatCard label="Users" value={data.overview.totalUsers} icon="👥" delay={0.15} />
          </motion.div>

          {/* Charts */}
          {renderCharts()}
        </>
      ) : (
        <div className="py-12 text-center text-gray-600 text-sm">Failed to load analytics data</div>
      )}
    </AdminLayout>
  );
}
