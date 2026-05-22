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
      <section className="rounded-2xl border border-[#e8e5d7] bg-white p-5 sm:p-6">
        <h1 className="text-2xl font-bold text-[#111827]">Returned to Origin Portal</h1>
        <p className="mt-1 text-sm text-[#64748b]">Manage reverse logistics movement, warehouse receipt, and customer refund outcomes.</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActive(filter)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                active === filter
                  ? 'border-[#f37a2a] bg-[#fff2e8] text-[#d86219]'
                  : 'border-[#e4e1d3] bg-white text-[#64748b]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e8e5d7] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead>
              <tr className="border-b border-[#efedde] bg-[#fcfbf6] text-left text-xs uppercase tracking-[0.16em] text-[#64748b]">
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
                  <tr key={row.rtoId} className="border-b border-[#f2f0e5] text-sm text-[#1f2937]">
                    <td className="px-4 py-3 font-semibold text-[#292F54]">{row.rtoId}</td>
                    <td className="px-4 py-3">{row.customer}</td>
                    <td className="px-4 py-3">{row.reason}</td>
                    <td className="px-4 py-3">{row.returnDate}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-700">{row.status}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">No RTO records available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
