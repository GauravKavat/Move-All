'use client';

import { ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from "sonner";
import { ComingSoonDialog } from '@/components/coming-soon-dialog';

type PickupState = 'Scheduled' | 'Completed';

type PickupRow = {
  pickupId: string;
  customerName: string;
  orderId: string;
  deliveryAddress: string;
  weight: string;
  vehicle: string;
  driver: string;
  estTime: string;
  status: PickupState;
};

const PICKUP_ROWS: PickupRow[] = [];

const FILTERS: Array<'All' | PickupState> = ['All', 'Scheduled', 'Completed'];

export default function ClientPickupsPage() {
  const [activeFilter, setActiveFilter] = useState<'All' | PickupState>('All');

  const data = useMemo(
    () => (activeFilter === 'All' ? PICKUP_ROWS : PICKUP_ROWS.filter((item) => item.status === activeFilter)),
    [activeFilter]
  );

  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-[#e8e5d7] bg-white p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-[#64748b]">Total Pickups</p>
          <p className="mt-2 text-3xl font-bold text-black">0</p>
        </article>
        <article className="rounded-2xl border border-[#e8e5d7] bg-white p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-[#64748b]">Scheduled</p>
          <p className="mt-2 text-3xl font-bold text-black">0</p>
          <p className="mt-1 text-xs text-[#64748b]">Awaiting pickup status update</p>
        </article>
        <article className="rounded-2xl border border-[#e8e5d7] bg-white p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-[#64748b]">Completed</p>
          <p className="mt-2 text-3xl font-bold text-black">0</p>
          <span className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">Success Rate 0%</span>
        </article>
      </section>

      <section className="rounded-2xl border border-[#e8e5d7] bg-white p-5 sm:p-6">
        <h1 className="text-2xl font-bold text-[#111827]">Pickups Management</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setActiveFilter(item)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                activeFilter === item
                  ? 'border-[#f37a2a] bg-[#fff2e8] text-[#d86219]'
                  : 'border-[#e4e1d3] bg-white text-[#64748b]'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e8e5d7] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] w-full">
            <thead>
              <tr className="border-b border-[#efedde] bg-[#fcfbf6] text-left text-xs uppercase tracking-[0.16em] text-[#64748b]">
                <th className="px-4 py-3">Pickup ID</th>
                <th className="px-4 py-3">Customer Name</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Delivery Address</th>
                <th className="px-4 py-3">Weight</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Est. Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row) => (
                  <tr key={row.pickupId} className="border-b border-[#f2f0e5] text-sm text-[#1f2937]">
                    <td className="px-4 py-3 font-semibold text-[#292F54]">{row.pickupId}</td>
                    <td className="px-4 py-3">{row.customerName}</td>
                    <td className="px-4 py-3 text-[#292F54]">{row.orderId}</td>
                    <td className="px-4 py-3 text-[#475569]">{row.deliveryAddress}</td>
                    <td className="px-4 py-3">{row.weight}</td>
                    <td className="px-4 py-3">{row.vehicle}</td>
                    <td className="px-4 py-3">{row.driver}</td>
                    <td className="px-4 py-3">{row.estTime}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.status === 'Scheduled' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ComingSoonDialog title="Pickup Details" type="pickup">
                        <button className="rounded-lg border border-[#e4e1d3] p-1.5 text-[#64748b] hover:text-[#111827]">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </ComingSoonDialog>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-sm text-[#64748b]">No pickups found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
