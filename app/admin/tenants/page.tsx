'use client';

import type { Metadata } from 'next';
import React, { useState } from 'react';
import type { Tenant, TenantHealth, TenantTier } from '@/lib/types';
import { Users, Search, MoreVertical, Building2 } from 'lucide-react';
import { ComingSoonDialog } from '@/components/coming-soon-dialog';

const TIER_STYLES: Record<TenantTier, string> = {
  Starter:    'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700',
  Pro:        'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
  Enterprise: 'bg-[#f37a2a]/10 text-[#f37a2a] dark:bg-[#f37a2a]/20 border-[#f37a2a]/20 dark:border-[#f37a2a]/30',
};

const HEALTH_STYLES: Record<TenantHealth, string> = {
  Healthy:  'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  'At-Risk':'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  Limited:  'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
};

const SEED: Tenant[] = [
  { id: 'TNT-00192', name: 'Vedic Organic Botanicals Inc.', tier: 'Enterprise', lastActivity: '2026-05-17T14:46:00Z', health: 'Healthy',  monthlyGmv: 482019.00, activeShipments: 14209 },
  { id: 'TNT-08412', name: 'Jaipur Logistics Consortium',   tier: 'Pro',        lastActivity: '2026-05-17T14:12:00Z', health: 'At-Risk',  monthlyGmv: 129400.00, activeShipments: 4102  },
  { id: 'TNT-00445', name: 'Chennai Textile Exports Ltd.',  tier: 'Starter',    lastActivity: '2026-05-17T13:00:00Z', health: 'Limited',  monthlyGmv: 18200.00,  activeShipments: 340   },
  { id: 'TNT-00891', name: 'Delhi Electronics Wholesale',   tier: 'Enterprise', lastActivity: '2026-05-18T09:12:00Z', health: 'Healthy',  monthlyGmv: 954000.00, activeShipments: 25100 },
];

export default function AdminTenantHypervisorPage() {
  const [tenants] = useState<Tenant[]>(SEED);
  const [filter, setFilter] = useState<TenantHealth | 'All'>('All');
  const [search, setSearch] = useState('');

  const filtered = tenants.filter((t) => {
    const matchesFilter = filter === 'All' || t.health === filter;
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4 w-full mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Tenants & Users</h1>
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            Manage client organizations, audit tiers, and monitor account health.
          </p>
        </div>
        <ComingSoonDialog title="Provision Tenant" type="action">
          <button className="px-4 py-2 bg-[#f37a2a] text-white rounded-lg text-sm font-medium hover:bg-[#d96a20] transition-colors shadow-sm">
            + Provision New Tenant
          </button>
        </ComingSoonDialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1e212b] p-4 rounded-xl border border-gray-200 dark:border-[#2a2e3d] shadow-sm">
          <p className="text-sm font-medium text-[#64748b] dark:text-[#94a3b8]">Total Organizations</p>
          <p className="text-2xl font-bold text-[#111827] dark:text-white mt-1">1,842</p>
          <p className="text-xs text-amber-500 mt-1 font-medium">94 Provisions Pending</p>
        </div>
        <div className="bg-white dark:bg-[#1e212b] p-4 rounded-xl border border-gray-200 dark:border-[#2a2e3d] shadow-sm">
          <p className="text-sm font-medium text-[#64748b] dark:text-[#94a3b8]">Aggregated Monthly GMV</p>
          <p className="text-2xl font-bold text-[#111827] dark:text-white mt-1">₹6,11,419</p>
          <p className="text-xs text-emerald-500 mt-1 font-medium">▲ +14.2% MoM</p>
        </div>
        <div className="bg-white dark:bg-[#1e212b] p-4 rounded-xl border border-gray-200 dark:border-[#2a2e3d] shadow-sm">
          <p className="text-sm font-medium text-[#64748b] dark:text-[#94a3b8]">Active Sub-Users</p>
          <p className="text-2xl font-bold text-[#111827] dark:text-white mt-1">12,503</p>
          <p className="text-xs text-[#64748b] dark:text-[#94a3b8] mt-1 font-medium">Across all tenants</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e212b] rounded-xl border border-gray-200 dark:border-[#2a2e3d] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-[#2a2e3d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            {(['All', 'Healthy', 'At-Risk', 'Limited'] as Array<TenantHealth | 'All'>).map((h) => (
              <button
                key={h}
                onClick={() => setFilter(h)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  filter === h
                    ? 'bg-gray-100 dark:bg-[#2a2e3d] text-[#111827] dark:text-white'
                    : 'text-[#64748b] dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#2a2e3d]/50 hover:text-[#111827] dark:hover:text-white'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search tenants..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 rounded-lg border border-gray-200 dark:border-[#2a2e3d] bg-white dark:bg-[#16181d] text-sm text-[#111827] dark:text-white outline-none focus:ring-2 focus:ring-[#f37a2a]/20 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-[#16181d]/50 text-xs font-semibold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider border-b border-gray-200 dark:border-[#2a2e3d]">
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Tier</th>
                <th className="px-4 py-3">Monthly GMV</th>
                <th className="px-4 py-3">Active Shipments</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#2a2e3d] text-sm">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2e3d]/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-gray-100 dark:bg-[#2a2e3d] flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-[#64748b] dark:text-[#94a3b8]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#111827] dark:text-white">{t.name}</p>
                        <p className="text-xs text-[#64748b] dark:text-[#94a3b8]">{t.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${TIER_STYLES[t.tier]}`}>
                      {t.tier}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#111827] dark:text-white">
                    ₹{t.monthlyGmv.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-3 text-[#64748b] dark:text-[#94a3b8]">
                    {t.activeShipments.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${
                        t.health === 'Healthy' ? 'bg-emerald-500' :
                        t.health === 'At-Risk' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <span className={`text-xs font-semibold ${
                        t.health === 'Healthy' ? 'text-emerald-700 dark:text-emerald-400' :
                        t.health === 'At-Risk' ? 'text-amber-700 dark:text-amber-400' : 
                        'text-red-700 dark:text-red-400'
                      }`}>
                        {t.health}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ComingSoonDialog title="Tenant Options" type="action">
                      <button className="p-1 text-[#64748b] hover:text-[#111827] dark:text-[#94a3b8] dark:hover:text-white transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </ComingSoonDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filtered.length === 0 && (
            <div className="p-8 text-center text-[#64748b] dark:text-[#94a3b8]">
              No tenants found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
