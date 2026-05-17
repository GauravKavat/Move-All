'use client';

import type { Metadata } from 'next';
import React, { useState } from 'react';
import type { Tenant, TenantHealth, TenantTier } from '@/lib/types';

const TIER_STYLES: Record<TenantTier, string> = {
  Starter:    'bg-white/10 text-white',
  Pro:        'bg-blue-500/20 border border-blue-500/40 text-blue-400',
  Enterprise: 'bg-[#f37a2a]/20 border border-[#f37a2a]/40 text-[#f37a2a]',
};

const HEALTH_STYLES: Record<TenantHealth, string> = {
  Healthy:  'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400',
  'At-Risk':'bg-amber-500/20 border border-amber-500/40 text-amber-400',
  Limited:  'bg-red-500/20 border border-red-500/40 text-red-400',
};

const SEED: Tenant[] = [
  { id: 'TNT-00192', name: 'Vedic Organic Botanicals Inc.', tier: 'Enterprise', lastActivity: '2026-05-17T14:46:00Z', health: 'Healthy',  monthlyGmv: 482019.00, activeShipments: 14209 },
  { id: 'TNT-08412', name: 'Jaipur Logistics Consortium',   tier: 'Pro',        lastActivity: '2026-05-17T14:12:00Z', health: 'At-Risk',  monthlyGmv: 129400.00, activeShipments: 4102  },
  { id: 'TNT-00445', name: 'Chennai Textile Exports Ltd.',  tier: 'Starter',    lastActivity: '2026-05-17T13:00:00Z', health: 'Limited',  monthlyGmv: 18200.00,  activeShipments: 340   },
];

export default function AdminTenantHypervisorPage() {
  const [tenants] = useState<Tenant[]>(SEED);
  const [filter, setFilter] = useState<TenantHealth | 'All'>('All');

  const filtered = filter === 'All' ? tenants : tenants.filter((t) => t.health === filter);

  return (
    <div className="p-8 space-y-6 min-h-screen">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight">GLOBAL CROSS-TENANT CONSOLE</h1>
        <p className="text-sm text-[#EDEDDF]/60 mt-1">
          Manage tenant accounts, audit tiers, inspect GMV streams, verify health profiles.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
        <div className="bg-[#292F54]/30 p-4 rounded-xl border border-white/10">
          <p className="text-xs text-[#EDEDDF]/40">AGGREGATED MONTHLY GMV</p>
          <p className="text-3xl font-black text-white mt-2">₹6,11,419.00</p>
          <p className="text-xs text-emerald-400 mt-1">▲ +14.2% Month-over-Month</p>
        </div>
        <div className="bg-[#292F54]/30 p-4 rounded-xl border border-white/10">
          <p className="text-xs text-[#EDEDDF]/40">TOTAL ISOLATED CONTEXTS</p>
          <p className="text-3xl font-black text-white mt-2">1,842 Tenants</p>
          <p className="text-xs text-amber-400 mt-1">94 Provisions Pending Verification</p>
        </div>
        <div className="bg-[#292F54]/30 p-4 rounded-xl border border-white/10">
          <p className="text-xs text-[#EDEDDF]/40">ACTIVE OUTBOUND CAPACITY</p>
          <p className="text-3xl font-black text-[#f37a2a] mt-2">18,311 / min</p>
          <p className="text-xs text-[#EDEDDF]/40 mt-1">Mean Latency: 0.04ms</p>
        </div>
      </div>

      <div className="flex gap-2">
        {(['All', 'Healthy', 'At-Risk', 'Limited'] as Array<TenantHealth | 'All'>).map((h) => (
          <button
            key={h}
            onClick={() => setFilter(h)}
            className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
              filter === h
                ? 'bg-[#f37a2a] text-black'
                : 'bg-white/5 border border-white/10 text-[#EDEDDF]/60 hover:text-white'
            }`}
          >
            {h}
          </button>
        ))}
      </div>

      <div className="bg-[#292F54]/20 rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black text-xs font-mono text-[#EDEDDF]/40 uppercase tracking-wider border-b border-white/10">
              <th className="p-4">Context ID / Tenant</th>
              <th className="p-4">Tier</th>
              <th className="p-4">Monthly GMV</th>
              <th className="p-4">Active Shipments</th>
              <th className="p-4">Last Activity</th>
              <th className="p-4">Health</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-white/5 font-mono">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-white/5 transition-all">
                <td className="p-4">
                  <p className="text-white font-bold font-sans">{t.name}</p>
                  <p className="text-xs text-[#EDEDDF]/40">{t.id}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${TIER_STYLES[t.tier]}`}>
                    {t.tier}
                  </span>
                </td>
                <td className="p-4 text-emerald-400 font-bold">
                  ₹{t.monthlyGmv.toLocaleString('en-IN')}
                </td>
                <td className="p-4 text-white font-bold">{t.activeShipments.toLocaleString()}</td>
                <td className="p-4 text-[10px] text-[#EDEDDF]/40">{t.lastActivity}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wide ${HEALTH_STYLES[t.health]}`}
                  >
                    ● {t.health}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
