'use client';

import { useMemo, useState } from 'react';
import { toast } from "sonner";
import { ComingSoonDialog } from '@/components/coming-soon-dialog';

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

const ORDER_ROWS: OrderRow[] = [
  {
    orderId: 'ORD-88301',
    customerName: 'Rajesh Meena',
    phoneNumber: '+91 98123 45678',
    deliveryAddress: '14-B MG Road, Jaipur, Rajasthan',
    pincode: '302001',
    status: 'Delivered',
    cost: 'Rs 890.00',
  },
  {
    orderId: 'ORD-88302',
    customerName: 'Ananya Sharma',
    phoneNumber: '+91 99012 34567',
    deliveryAddress: 'Silver Oak, Baner, Pune, Maharashtra',
    pincode: '411045',
    status: 'In Transit',
    cost: 'Rs 1200.00',
  },
  {
    orderId: 'ORD-88303',
    customerName: 'Acme Distribution Corp',
    phoneNumber: '+91 98765 43210',
    deliveryAddress: 'Sector 18 Industrial Area, Gurugram',
    pincode: '122015',
    status: 'Shipped',
    cost: 'Rs 4250.00',
  },
  {
    orderId: 'ORD-88304',
    customerName: 'Nitin Traders',
    phoneNumber: '+91 98111 22111',
    deliveryAddress: 'Ring Road, Indore, Madhya Pradesh',
    pincode: '452001',
    status: 'Confirmed',
    cost: 'Rs 740.00',
  },
  {
    orderId: 'ORD-88305',
    customerName: 'Livia Exports',
    phoneNumber: '+91 98888 30012',
    deliveryAddress: 'Anna Salai, Chennai, Tamil Nadu',
    pincode: '600002',
    status: 'Failed',
    cost: 'Rs 1520.00',
  },
  {
    orderId: 'ORD-88306',
    customerName: 'Harpreet Singh',
    phoneNumber: '+91 90000 30128',
    deliveryAddress: 'Urban Estate, Ludhiana, Punjab',
    pincode: '141001',
    status: 'Returned',
    cost: 'Rs 980.00',
  },
  {
    orderId: 'ORD-88307',
    customerName: 'Mila Retail',
    phoneNumber: '+91 97800 99111',
    deliveryAddress: 'Infantry Road, Bengaluru, Karnataka',
    pincode: '560001',
    status: 'Pending',
    cost: 'Rs 1110.00',
  },
];

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
            <p className="mt-1 text-sm text-[#64748b]">14,209 orders this month, 96.8% successful delivery ratio, average SLA 2.4 days.</p>
          </div>
          <div className="flex items-center gap-2">
            <ComingSoonDialog title="Create Order" type="order">
              <button className="rounded-lg bg-[#f37a2a] px-4 py-2 text-sm font-bold text-white">+ New Order</button>
            </ComingSoonDialog>
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
              {filteredRows.map((row) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
