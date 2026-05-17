'use client';

import { useMemo, useState } from 'react';
import { ComingSoonDialog } from '@/components/coming-soon-dialog';

type CourierRow = {
  courier: string;
  successRate: number;
  avgDeliveryTime: string;
  costEfficiency: number;
  activeShipments: number;
};

const COURIERS: CourierRow[] = [
  { courier: 'Bluedart', successRate: 97, avgDeliveryTime: '2.1 days', costEfficiency: 72, activeShipments: 1820 },
  { courier: 'DHL', successRate: 95, avgDeliveryTime: '2.4 days', costEfficiency: 69, activeShipments: 1432 },
  { courier: 'FedEx', successRate: 94, avgDeliveryTime: '2.8 days', costEfficiency: 64, activeShipments: 1299 },
  { courier: 'DTDC', successRate: 91, avgDeliveryTime: '3.1 days', costEfficiency: 77, activeShipments: 1025 },
];

export default function ClientCouriersPage() {
  const [query, setQuery] = useState('');

  const rows = useMemo(
    () => COURIERS.filter((item) => item.courier.toLowerCase().includes(query.toLowerCase())),
    [query]
  );

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#e8e5d7] bg-white p-5 sm:p-6">
        <h1 className="text-2xl font-bold text-[#111827]">Couriers Fleet Performance</h1>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search courier"
            className="h-10 flex-1 rounded-lg border border-[#dfdccd] px-3 text-sm text-[#1f2937] outline-none focus:border-[#f37a2a]"
          />
          <ComingSoonDialog title="Search Directory" type="action">
            <button className="h-10 rounded-lg bg-[#f37a2a] px-5 text-sm font-bold text-white">Search</button>
          </ComingSoonDialog>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e8e5d7] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead>
              <tr className="border-b border-[#efedde] bg-[#fcfbf6] text-left text-xs uppercase tracking-[0.16em] text-[#64748b]">
                <th className="px-4 py-3">Courier</th>
                <th className="px-4 py-3">Success Rate</th>
                <th className="px-4 py-3">Avg Delivery Time</th>
                <th className="px-4 py-3">Cost Efficiency</th>
                <th className="px-4 py-3">Active Shipments</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.courier} className="border-b border-[#f2f0e5] text-sm text-[#1f2937]">
                  <td className="px-4 py-3 font-semibold text-[#292F54]">{row.courier}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-36 rounded-full bg-[#ecf7ef]">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${row.successRate}%` }} />
                      </div>
                      <span>{row.successRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{row.avgDeliveryTime}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-36 rounded-full bg-[#ebf4ff]">
                        <div className="h-full rounded-full bg-blue-500" style={{ width: `${row.costEfficiency}%` }} />
                      </div>
                      <span>{row.costEfficiency}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-black">{row.activeShipments.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
