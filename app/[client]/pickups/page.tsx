'use client';

import { ChevronRight } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { ComingSoonDialog } from '@/components/coming-soon-dialog';
import { createClient } from '@/lib/client';

type PickupState = 'Scheduled' | 'Completed';

type PickupRow = {
  pickupId: string;
  warehouseLocation: string;
  numberOfPackages: number;
  vehicle: string;
  driver: string;
  estTime: string;
  status: PickupState;
};

const FILTERS: Array<'All' | PickupState> = ['All', 'Scheduled', 'Completed'];

export default function ClientPickupsPage() {
  const [activeFilter, setActiveFilter] = useState<'All' | PickupState>('All');
  const [pickups, setPickups] = useState<PickupRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPickups() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: clientData } = await supabase
            .from('clients')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

          if (clientData) {
            const { data: pickupData } = await supabase
              .from('pickups')
              .select('*')
              .eq('client_id', clientData.id)
              .order('created_at', { ascending: false });

            if (pickupData) {
              const mapped: PickupRow[] = pickupData.map((p: any) => ({
                pickupId: p.id.substring(0, 8).toUpperCase(),
                warehouseLocation: p.warehouse_location === 'w1' ? 'Primary Warehouse (Delhi)' : p.warehouse_location === 'w2' ? 'Secondary Hub (Mumbai)' : p.warehouse_location,
                numberOfPackages: p.number_of_packages,
                vehicle: p.vehicle_number || 'Assigning...',
                driver: p.driver_name ? `${p.driver_name} (${p.driver_phone || ''})` : 'Assigning...',
                estTime: p.scheduled_time ? new Date(p.scheduled_time).toLocaleString('en-IN') : 'TBD',
                status: (p.status === 'Pending' ? 'Scheduled' : p.status) as PickupState,
              }));
              setPickups(mapped);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load pickups:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPickups();
  }, []);

  const totalCount = pickups.length;
  const scheduledCount = pickups.filter(p => p.status === 'Scheduled').length;
  const completedCount = pickups.filter(p => p.status === 'Completed').length;
  const successRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const data = useMemo(
    () => (activeFilter === 'All' ? pickups : pickups.filter((item) => item.status === activeFilter)),
    [activeFilter, pickups]
  );

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-[#64748b] dark:text-[#94a3b8] font-bold">Total Pickups</p>
          <p className="mt-2 text-3xl font-bold text-black dark:text-white">{loading ? '...' : totalCount}</p>
        </article>
        <article className="rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-[#64748b] dark:text-[#94a3b8] font-bold">Scheduled</p>
          <p className="mt-2 text-3xl font-bold text-black dark:text-white">{loading ? '...' : scheduledCount}</p>
          <p className="mt-1 text-xs text-[#64748b] dark:text-gray-400">Awaiting courier details</p>
        </article>
        <article className="rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-[#64748b] dark:text-[#94a3b8] font-bold">Completed</p>
          <p className="mt-2 text-3xl font-bold text-black dark:text-white">{loading ? '...' : completedCount}</p>
          <span className="mt-1 inline-flex rounded-full bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">Success Rate {successRate}%</span>
        </article>
      </section>

      <section className="rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] p-5 sm:p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Pickups Management</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveFilter(item)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeFilter === item
                  ? 'border-[#f37a2a] bg-[#fff2e8] text-[#d86219] dark:bg-[#f37a2a]/20 dark:text-[#f37a2a]'
                  : 'border-[#e4e1d3] bg-white text-[#64748b] dark:border-[#2a2e3d] dark:bg-[#16181d] dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#2a2e3d]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1000px] w-full">
            <thead>
              <tr className="border-b border-[#efedde] dark:border-[#2a2e3d] bg-[#fcfbf6] dark:bg-[#16181d] text-left text-xs uppercase tracking-[0.16em] text-[#64748b] dark:text-[#94a3b8]">
                <th className="px-4 py-3">Pickup ID</th>
                <th className="px-4 py-3">Warehouse Location</th>
                <th className="px-4 py-3">Packages</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Scheduled Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.pickupId} className="border-b border-[#f2f0e5] dark:border-[#2a2e3d] text-sm text-[#1f2937] dark:text-[#ededdf] hover:bg-gray-50/50 dark:hover:bg-[#2a2e3d]/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#292F54] dark:text-white">{row.pickupId}</td>
                    <td className="px-4 py-3">{row.warehouseLocation}</td>
                    <td className="px-4 py-3 font-semibold">{row.numberOfPackages}</td>
                    <td className="px-4 py-3">{row.vehicle}</td>
                    <td className="px-4 py-3">{row.driver}</td>
                    <td className="px-4 py-3">{row.estTime}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.status === 'Scheduled' ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ComingSoonDialog title="Pickup Details" type="pickup">
                        <button className="rounded-lg border border-[#e4e1d3] dark:border-[#2a2e3d] p-1.5 text-[#64748b] dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#2a2e3d] hover:text-[#111827] dark:hover:text-white transition-colors">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </ComingSoonDialog>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm text-[#64748b] dark:text-gray-400">
                    {loading ? 'Loading pickups...' : 'No pickups found.'}
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
