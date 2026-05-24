'use client';

import { useMemo, useState } from 'react';
import { toast } from "sonner";

type RtoStatus = 'In Transit' | 'Received' | 'Refunded';

const RTO_ROWS: any[] = [];

const FILTERS: Array<'All' | RtoStatus> = ['All', 'In Transit', 'Received', 'Refunded'];

export default function ClientRtoPage() {
  const [active, setActive] = useState<'All' | RtoStatus>('All');

  const rows = useMemo(() => (active === 'All' ? RTO_ROWS : RTO_ROWS.filter((item) => item.status === active)), [active]);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] p-5 sm:p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Returned to Origin Portal</h1>
        <p className="mt-1 text-sm text-[#64748b] dark:text-[#94a3b8]">Manage reverse logistics movement, warehouse receipt, and customer refund outcomes.</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActive(filter)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                active === filter
                  ? 'border-[#f37a2a] bg-[#fff2e8] text-[#d86219] dark:bg-[#f37a2a]/20 dark:text-[#f37a2a]'
                  : 'border-[#e4e1d3] bg-white text-[#64748b] dark:border-[#2a2e3d] dark:bg-[#16181d] dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#2a2e3d]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead>
              <tr className="border-b border-[#efedde] dark:border-[#2a2e3d] bg-[#fcfbf6] dark:bg-[#16181d] text-left text-xs uppercase tracking-[0.16em] text-[#64748b] dark:text-[#94a3b8]">
                <th className="px-4 py-3">RTO ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Return Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <tr key={row.rtoId} className="border-b border-[#f2f0e5] dark:border-[#2a2e3d] text-sm text-[#1f2937] dark:text-[#ededdf] hover:bg-gray-50/50 dark:hover:bg-[#2a2e3d]/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#292F54] dark:text-white">{row.rtoId}</td>
                    <td className="px-4 py-3">{row.customer}</td>
                    <td className="px-4 py-3">{row.reason}</td>
                    <td className="px-4 py-3">{row.returnDate}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-orange-50 dark:bg-orange-950/20 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:text-orange-400">{row.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">No RTO records available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
