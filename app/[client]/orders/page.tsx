'use client';

import { useMemo, useState } from 'react';
import { toast } from "sonner";
import { ComingSoonDialog } from '@/components/coming-soon-dialog';
import { CreateOrderDialog } from '@/components/create-order-dialog';

type OrderStatus =
  | 'Delivered'
  | 'In Transit'
  | 'Shipped'
  | 'Failed'
  | 'Confirmed'
  | 'Returned'
  | 'Pending';

type OrderRow = {
  orderId: string;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  pincode: string;
  status: OrderStatus;
  cost: string;
};

const ORDER_ROWS: OrderRow[] = [];

const FILTERS: Array<'All' | OrderStatus> = [
  'All',
  'Delivered',
  'In Transit',
  'Shipped',
  'Failed',
  'Confirmed',
  'Returned',
  'Pending',
];

const STATUS_CLASS: Record<OrderStatus, string> = {
  Delivered: 'bg-emerald-50 text-emerald-700',
  'In Transit': 'bg-blue-50 text-blue-700',
  Shipped: 'bg-violet-50 text-violet-700',
  Failed: 'bg-red-50 text-red-700',
  Confirmed: 'bg-sky-50 text-sky-700',
  Returned: 'bg-orange-50 text-orange-700',
  Pending: 'bg-amber-50 text-amber-700',
};

export default function ClientOrdersPage() {
  const [activeFilter, setActiveFilter] = useState<'All' | OrderStatus>('All');

  const filteredRows = useMemo(
    () => (activeFilter === 'All' ? ORDER_ROWS : ORDER_ROWS.filter((row) => row.status === activeFilter)),
    [activeFilter]
  );

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#e8e5d7] bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Orders Panel</h1>
            <p className="mt-1 text-sm text-[#64748b]">0 orders this month, 0% successful delivery ratio, average SLA 0 days.</p>
          </div>
          <div className="flex items-center gap-2">
            <CreateOrderDialog>
              <button className="rounded-lg bg-[#f37a2a] px-4 py-2 text-sm font-bold text-white">+ New Order</button>
            </CreateOrderDialog>
            <ComingSoonDialog title="Export Data" type="export">
              <button className="rounded-lg border border-[#d9d7c8] bg-white px-4 py-2 text-sm font-semibold text-[#1f2937]">Export</button>
            </ComingSoonDialog>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                activeFilter === filter
                  ? 'border-[#f37a2a] bg-[#fff2e8] text-[#d86219]'
                  : 'border-[#e4e1d3] bg-white text-[#64748b] hover:text-[#1f2937]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e8e5d7] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full">
            <thead>
              <tr className="border-b border-[#efedde] bg-[#fcfbf6] text-left text-xs uppercase tracking-[0.16em] text-[#64748b]">
                <th className="px-4 py-3 font-semibold">Order ID</th>
                <th className="px-4 py-3 font-semibold">Customer Name</th>
                <th className="px-4 py-3 font-semibold">Phone Number</th>
                <th className="px-4 py-3 font-semibold">Delivery Address</th>
                <th className="px-4 py-3 font-semibold">Pincode</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Cost</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length > 0 ? (
                filteredRows.map((row) => (
                  <tr key={row.orderId} className="border-b border-[#f2f0e5] text-sm text-[#1f2937]">
                    <td className="px-4 py-3 font-semibold text-[#292F54]">{row.orderId}</td>
                    <td className="px-4 py-3">{row.customerName}</td>
                    <td className="px-4 py-3 text-[#475569]">{row.phoneNumber}</td>
                    <td className="px-4 py-3 text-[#475569]">{row.deliveryAddress}</td>
                    <td className="px-4 py-3">{row.pincode}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASS[row.status]}`}>{row.status}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-black">{row.cost}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-[#64748b]">
                    No orders found.
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
