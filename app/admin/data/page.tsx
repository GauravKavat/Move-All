'use client';

import type { Metadata } from 'next';
import React, { useState } from 'react';
import type { PipelineStream, PipelineStatus } from '@/lib/types';

const STATUS_STYLES: Record<PipelineStatus, string> = {
  Online:  'bg-emerald-500/20 text-emerald-400',
  Degraded:'bg-amber-500/20 text-amber-400',
  Down:    'bg-red-500/20 text-red-400',
};

const SEED: PipelineStream[] = [
  { id: 'STRM-01', name: 'Tenant Outbound Mutation Bus',   status: 'Online',   lastSync: '2026-05-17T14:47:01Z', lagMinutes: 0, throughputPerMin: 14209 },
  { id: 'STRM-02', name: '3PL Webhook Ingestion Pipe',     status: 'Online',   lastSync: '2026-05-17T14:47:00Z', lagMinutes: 0, throughputPerMin: 41920 },
  { id: 'STRM-03', name: 'Reverse Logistics Async Queue',  status: 'Degraded', lastSync: '2026-05-17T14:44:12Z', lagMinutes: 3, throughputPerMin: 1205  },
  { id: 'STRM-04', name: 'Rate Limit Token Bucket Sync',   status: 'Online',   lastSync: '2026-05-17T14:47:00Z', lagMinutes: 0, throughputPerMin: 8920  },
  { id: 'STRM-05', name: 'Audit Event Emission Bus',       status: 'Online',   lastSync: '2026-05-17T14:46:58Z', lagMinutes: 0, throughputPerMin: 3402  },
];

export default function AdminDataPipelinePage() {
  const [streams] = useState<PipelineStream[]>(SEED);

  const totalThroughput = streams.reduce((s, p) => s + p.throughputPerMin, 0);
  const degradedCount = streams.filter((p) => p.status !== 'Online').length;

  return (
    <div className="p-8 space-y-6 min-h-screen">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight">
          INGESTION PIPELINE CONFIGURATION MATRIX
        </h1>
        <p className="text-sm text-[#EDEDDF]/60 mt-1">
          Audit message buses, async workers, and stream processing engine metrics.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 font-mono">
        <div className="bg-[#292F54]/30 border border-white/10 rounded-xl p-4">
          <p className="text-[10px] text-[#EDEDDF]/40 uppercase tracking-widest">TOTAL THROUGHPUT</p>
          <p className="text-2xl font-black text-[#f37a2a] mt-1">
            {totalThroughput.toLocaleString()} msg/min
          </p>
        </div>
        <div className="bg-[#292F54]/30 border border-white/10 rounded-xl p-4">
          <p className="text-[10px] text-[#EDEDDF]/40 uppercase tracking-widest">ACTIVE STREAMS</p>
          <p className="text-2xl font-black text-white mt-1">
            {streams.length - degradedCount} / {streams.length}
          </p>
        </div>
        <div className="bg-[#292F54]/30 border border-white/10 rounded-xl p-4">
          <p className="text-[10px] text-[#EDEDDF]/40 uppercase tracking-widest">DEGRADED CHANNELS</p>
          <p
            className={`text-2xl font-black mt-1 ${
              degradedCount > 0 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {degradedCount}
          </p>
        </div>
      </div>

      <div className="bg-[#292F54]/20 rounded-xl border border-white/10 overflow-hidden font-mono">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black text-xs text-[#EDEDDF]/40 uppercase tracking-wider border-b border-white/10">
              <th className="p-4">Stream Channel</th>
              <th className="p-4">Health</th>
              <th className="p-4">Lag</th>
              <th className="p-4">Throughput</th>
              <th className="p-4">Last Sync</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-white/5">
            {streams.map((s) => (
              <tr key={s.id} className="hover:bg-white/5 transition-all">
                <td className="p-4">
                  <p className="text-white font-bold">{s.name}</p>
                  <p className="text-[10px] text-[#EDEDDF]/40">{s.id}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${STATUS_STYLES[s.status]}`}>
                    ● {s.status}
                  </span>
                </td>
                <td
                  className={`p-4 font-bold ${
                    s.lagMinutes > 0 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  {s.lagMinutes} min
                </td>
                <td className="p-4 text-white font-black">
                  {s.throughputPerMin.toLocaleString()} msg/min
                </td>
                <td className="p-4 text-[10px] text-[#EDEDDF]/40">{s.lastSync}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
