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

interface RegionData {
  id: string;
  name: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  zoomLevel: number;
  citizenCount: number;
  createdAt: string;
  updatedAt: string;
}

interface RegionForm {
  name: string;
  countryCode: string;
  latitude: string;
  longitude: string;
  zoomLevel: string;
}

/* ------------------------------------------------------------------ */
/* Regions Page                                                        */
/* ------------------------------------------------------------------ */

const emptyForm: RegionForm = { name: '', countryCode: '', latitude: '', longitude: '', zoomLevel: '5' };

export default function AdminRegionsPage() {
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('citizenCount');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 15;

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<RegionForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchRegions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        limit: String(perPage),
        sortBy,
        sortOrder,
        ...(search && { search }),
      });
      const res = await fetch(`/api/admin/regions?${params}`);
      if (res.ok) {
        const data = await res.json();
        setRegions(data.data || []);
        setTotal(data.total || 0);
      }
    } catch (err) {
      console.error('Error fetching regions:', err);
    } finally {
      setLoading(false);
    }
  }, [page, search, sortBy, sortOrder]);

  useEffect(() => { fetchRegions(); }, [fetchRegions]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      const method = editingId ? 'PATCH' : 'POST';
      const body = editingId
        ? { id: editingId, ...form, latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude), zoomLevel: parseInt(form.zoomLevel) }
        : { ...form, latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude), zoomLevel: parseInt(form.zoomLevel) };

      const res = await fetch('/api/admin/regions', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowForm(false);
        setForm(emptyForm);
        setEditingId(null);
        fetchRegions();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to save');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (region: RegionData) => {
    setForm({
      name: region.name,
      countryCode: region.countryCode,
      latitude: String(region.latitude),
      longitude: String(region.longitude),
      zoomLevel: String(region.zoomLevel),
    });
    setEditingId(region.id);
    setShowForm(true);
    setError('');
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/admin/regions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setDeleteConfirm(null);
        fetchRegions();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete');
        setDeleteConfirm(null);
      }
    } catch (err) {
      setError('Network error');
      setDeleteConfirm(null);
    }
  };

  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <AdminLayout>
      <Head>
        <title>Regions — Admin — LostInVirtual</title>
      </Head>

      {/* Header */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={spring}
      >
        <div>
          <h1 className="text-xl font-bold text-white">Regions</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} total regions</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyForm); setError(''); }}
          className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 hover:bg-blue-500/20 transition-all"
        >
          {showForm ? 'Cancel' : '+ Add Region'}
        </button>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div
          className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <motion.div
          className="glass-card p-4 mb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          <h3 className="text-sm font-medium text-white mb-3">
            {editingId ? 'Edit Region' : 'New Region'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Region name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
            />
            <input
              type="text"
              placeholder="Country code (e.g. US)"
              value={form.countryCode}
              onChange={(e) => setForm({ ...form, countryCode: e.target.value.toUpperCase() })}
              className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-gray-600 font-mono focus:outline-none focus:border-blue-500/50 transition-all"
            />
            <input
              type="number"
              placeholder="Latitude"
              value={form.latitude}
              onChange={(e) => setForm({ ...form, latitude: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-gray-600 font-mono focus:outline-none focus:border-blue-500/50 transition-all"
            />
            <input
              type="number"
              placeholder="Longitude"
              value={form.longitude}
              onChange={(e) => setForm({ ...form, longitude: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-gray-600 font-mono focus:outline-none focus:border-blue-500/50 transition-all"
            />
            <input
              type="number"
              placeholder="Zoom (1-18)"
              min={1}
              max={18}
              value={form.zoomLevel}
              onChange={(e) => setForm({ ...form, zoomLevel: e.target.value })}
              className="px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder-gray-600 font-mono focus:outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving || !form.name || !form.countryCode}
            className="mt-3 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400 hover:bg-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {saving ? 'Saving...' : editingId ? 'Update Region' : 'Create Region'}
          </button>
        </motion.div>
      )}

      {/* Search & Sort */}
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search regions..."
            className="pl-10 pr-4 py-2 w-64 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-all"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl">
          {[{ label: 'Citizens', value: 'citizenCount' }, { label: 'Name', value: 'name' }].map((s) => (
            <button
              key={s.value}
              onClick={() => toggleSort(s.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                sortBy === s.value
                  ? 'bg-white/[0.08] text-white border border-white/[0.08]'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {s.label} {sortBy === s.value ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        className="glass-card overflow-hidden"
        variants={stagger}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white/10 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-4 py-3 text-left text-[11px] text-gray-500 uppercase tracking-wider font-mono font-medium">Region</th>
                  <th className="px-4 py-3 text-left text-[11px] text-gray-500 uppercase tracking-wider font-mono font-medium">Country Code</th>
                  <th className="px-4 py-3 text-left text-[11px] text-gray-500 uppercase tracking-wider font-mono font-medium">Coordinates</th>
                  <th className="px-4 py-3 text-left text-[11px] text-gray-500 uppercase tracking-wider font-mono font-medium">Citizens</th>
                  <th className="px-4 py-3 text-left text-[11px] text-gray-500 uppercase tracking-wider font-mono font-medium">Zoom</th>
                  <th className="px-4 py-3 text-left text-[11px] text-gray-500 uppercase tracking-wider font-mono font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {regions.map((region) => (
                  <motion.tr
                    key={region.id}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                    variants={fadeUp}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🌍</span>
                        <span className="text-sm font-medium text-white">{region.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-0.5 text-[10px] font-mono font-medium rounded-md border bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {region.countryCode}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono">
                      {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-white">{region.citizenCount.toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 font-mono">{region.zoomLevel}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(region)}
                          className="px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] text-gray-400 hover:text-white transition-all font-mono"
                        >
                          Edit
                        </button>
                        {deleteConfirm === region.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(region.id)}
                              className="px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 hover:bg-red-500/20 transition-all font-mono"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[10px] text-gray-400 hover:text-white transition-all font-mono"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              if (region.citizenCount > 0) {
                                setError(`Cannot delete ${region.name}: ${region.citizenCount} citizens linked`);
                                return;
                              }
                              setDeleteConfirm(region.id);
                            }}
                            className={`px-2 py-1 rounded-lg border text-[10px] transition-all font-mono ${
                              region.citizenCount > 0
                                ? 'bg-gray-500/10 border-gray-500/20 text-gray-600 cursor-not-allowed'
                                : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20'
                            }`}
                            title={region.citizenCount > 0 ? 'Cannot delete: citizens linked' : 'Delete region'}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {regions.length === 0 && !loading && (
          <div className="py-12 text-center text-gray-600 text-sm">No regions found</div>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ← Prev
          </button>
          <span className="text-xs text-gray-600 font-mono">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            Next →
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
