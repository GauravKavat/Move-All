'use client';

import { useMemo, useState, useEffect } from 'react';
import { ComingSoonDialog } from '@/components/coming-soon-dialog';
import { createClient } from '@/lib/client';

type CourierRow = {
  courier: string;
  successRate: number;
  avgDeliveryTime: string;
  costEfficiency: number;
  activeShipments: number;
};

export default function ClientCouriersPage() {
  const [query, setQuery] = useState('');
  const [couriers, setCouriers] = useState<CourierRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCouriers() {
      try {
        const supabase = createClient();
        const { data: courierData } = await supabase
          .from('couriers')
          .select('*')
          .order('name');

        if (courierData) {
          const mapped: CourierRow[] = courierData.map((c: any) => {
            let successRate = 98;
            let efficiency = 95;
            let activeShipments = 1250;
            let avgTime = '2.4 days';
            
            if (c.status === 'Degraded') {
              successRate = 72;
              efficiency = 65;
              activeShipments = 450;
              avgTime = '4.8 days';
            } else if (c.status === 'Down') {
              successRate = 0;
              efficiency = 0;
              activeShipments = 0;
              avgTime = 'N/A';
            }
            
            return {
              courier: c.name,
              successRate,
              avgDeliveryTime: avgTime,
              costEfficiency: efficiency,
              activeShipments,
            };
          });
          setCouriers(mapped);
        }
      } catch (err) {
        console.error("Failed to load couriers:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCouriers();
  }, []);

  const rows = useMemo(
    () => couriers.filter((item) => item.courier.toLowerCase().includes(query.toLowerCase())),
    [query, couriers]
  );

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] p-5 sm:p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Couriers Fleet Performance</h1>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search courier"
            className="h-10 flex-1 rounded-lg border border-[#dfdccd] dark:border-[#2a2e3d] bg-white dark:bg-[#16181d] px-3 text-sm text-[#1f2937] dark:text-white outline-none focus:border-[#f37a2a] focus:ring-1 focus:ring-[#f37a2a]"
          />
          <ComingSoonDialog title="Search Directory" type="action">
            <button className="h-10 rounded-lg bg-[#f37a2a] hover:bg-[#e06716] px-5 text-sm font-bold text-white shadow-md transition-colors">Search</button>
          </ComingSoonDialog>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead>
              <tr className="border-b border-[#efedde] dark:border-[#2a2e3d] bg-[#fcfbf6] dark:bg-[#16181d] text-left text-xs uppercase tracking-[0.16em] text-[#64748b] dark:text-[#94a3b8]">
                <th className="px-4 py-3">Courier</th>
                <th className="px-4 py-3">Success Rate</th>
                <th className="px-4 py-3">Avg Delivery Time</th>
                <th className="px-4 py-3">Cost Efficiency</th>
                <th className="px-4 py-3">Active Shipments</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <tr key={row.courier} className="border-b border-[#f2f0e5] dark:border-[#2a2e3d] text-sm text-[#1f2937] dark:text-[#ededdf] hover:bg-gray-50/50 dark:hover:bg-[#2a2e3d]/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#292F54] dark:text-white">{row.courier}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-36 rounded-full bg-[#ecf7ef] dark:bg-[#ecf7ef]/10">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${row.successRate}%` }} />
                        </div>
                        <span>{row.successRate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{row.avgDeliveryTime}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-36 rounded-full bg-[#ebf4ff] dark:bg-[#ebf4ff]/10">
                          <div className="h-full rounded-full bg-blue-500" style={{ width: `${row.costEfficiency}%` }} />
                        </div>
                        <span>{row.costEfficiency}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-black dark:text-white">{row.activeShipments.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#64748b] dark:text-gray-400">
                    {loading ? 'Loading couriers...' : 'No couriers found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
