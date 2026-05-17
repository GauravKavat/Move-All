'use client';

import type { Metadata } from 'next';
import React, { useState } from 'react';
import type { CourierPartner, CourierHealth } from '@/lib/types';

const STATUS_STYLES: Record<CourierHealth, string> = {
  Operational: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40',
  Degraded:    'bg-amber-500/20 text-amber-400 border border-amber-500/40',
  Down:        'bg-red-500/20 text-red-400 border border-red-500/40',
};

const SEED: CourierPartner[] = [
  { id: '3PL-DHL',  name: 'DHL Global Express',    uptime: 99.98, latencyMs: 14,  status: 'Operational', lastIncident: 'None',                     currentLoadPercent: 42 },
  { id: '3PL-BD',   name: 'Bluedart Premium Link',  uptime: 98.42, latencyMs: 310, status: 'Degraded',    lastIncident: 'West Regional Hub Delays', currentLoadPercent: 15 },
  { id: '3PL-FX',   name: 'FedEx Local Ground',     uptime: 99.91, latencyMs: 22,  status: 'Operational', lastIncident: 'None',                     currentLoadPercent: 38 },
  { id: '3PL-DTDC', name: 'DTDC Nationwide',         uptime: 97.80, latencyMs: 88,  status: 'Operational', lastIncident: 'None',                     currentLoadPercent: 20 },
];

export default function AdminCourierFailoverPage() {
  const [partners, setPartners] = useState<CourierPartner[]>(SEED);

  const forceFailover = (id: string) =>
    setPartners(
      partners.map((p) =>
        p.id === id ? { ...p, status: 'Down' as CourierHealth, currentLoadPercent: 0 } : p
      )
    );

  const restore = (id: string) =>
    setPartners(
      partners.map((p) =>
        p.id === id
          ? { ...p, status: 'Operational' as CourierHealth, lastIncident: 'None', latencyMs: 14 }
          : p
      )
    );

  return (
    <div className="p-8 space-y-6 min-h-screen">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight">
          GLOBAL 3PL ORCHESTRATION WALL
        </h1>
        <p className="text-sm text-[#EDEDDF]/60 mt-1">
          Monitor endpoint performance, adjust latency thresholds, configure failover rules.
        </p>
      </div>

      <div className="bg-[#292F54]/20 rounded-xl border border-white/10 overflow-hidden font-mono">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black text-xs text-[#EDEDDF]/40 uppercase tracking-wider border-b border-white/10">
              <th className="p-4">3PL Operator</th>
              <th className="p-4">Uptime</th>
              <th className="p-4">Latency</th>
              <th className="p-4">Load</th>
              <th className="p-4">Health</th>
              <th className="p-4">Last Incident</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-white/5">
            {partners.map((p) => (
              <tr key={p.id} className="hover:bg-white/5 transition-all">
                <td className="p-4">
                  <p className="text-white font-bold">{p.name}</p>
                  <p className="text-xs text-[#EDEDDF]/40">{p.id}</p>
                </td>
                <td className="p-4 font-bold text-white">{p.uptime}%</td>
                <td className="p-4">
                  <span className={p.latencyMs > 200 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                    {p.latencyMs}ms
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          (p.currentLoadPercent ?? 0) > 80
                            ? 'bg-red-400'
                            : (p.currentLoadPercent ?? 0) > 50
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                        }`}
                        style={{ width: `${p.currentLoadPercent ?? 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-white">{p.currentLoadPercent ?? 0}%</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${STATUS_STYLES[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td
                  className="p-4 text-xs text-amber-400 max-w-[180px] truncate"
                  title={p.lastIncident}
                >
                  {p.lastIncident === 'None' ? (
                    <span className="text-[#EDEDDF]/30">None</span>
                  ) : (
                    p.lastIncident
                  )}
                </td>
                <td className="p-4">
                  {p.status !== 'Down' ? (
                    <button
                      onClick={() => forceFailover(p.id)}
                      className="px-2.5 py-1 text-[10px] font-mono font-bold bg-red-500/10 border border-red-500/30 text-red-400 rounded hover:bg-red-500/20 transition-all"
                    >
                      FORCE FAILOVER
                    </button>
                  ) : (
                    <button
                      onClick={() => restore(p.id)}
                      className="px-2.5 py-1 text-[10px] font-mono font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded hover:bg-emerald-500/20 transition-all"
                    >
                      RESTORE
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
