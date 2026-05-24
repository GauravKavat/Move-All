'use client';

import { useMemo, useState, useEffect } from 'react';
import { toast } from "sonner";
import { ComingSoonDialog } from '@/components/coming-soon-dialog';
import { CreateOrderDialog } from '@/components/create-order-dialog';
import { createClient } from '@/lib/client';

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
  Delivered: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400',
  'In Transit': 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400',
  Shipped: 'bg-violet-50 text-violet-700 dark:bg-violet-950/20 dark:text-violet-400',
  Failed: 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400',
  Confirmed: 'bg-sky-50 text-sky-700 dark:bg-sky-950/20 dark:text-sky-400',
  Returned: 'bg-orange-50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400',
  Pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400',
};

export default function ClientOrdersPage() {
  const [activeFilter, setActiveFilter] = useState<'All' | OrderStatus>('All');
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
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
            const { data: orderData } = await supabase
              .from('orders')
              .select('*')
              .eq('client_id', clientData.id)
              .order('created_at', { ascending: false });

            if (orderData) {
              const mapped: OrderRow[] = orderData.map((order: any) => ({
                orderId: order.id.substring(0, 8).toUpperCase(),
                customerName: order.customer_name,
                phoneNumber: order.phone_number,
                deliveryAddress: order.delivery_address,
                pincode: order.pincode,
                status: order.status as OrderStatus,
                cost: `₹${Number(order.cost).toFixed(2)}`,
              }));
              setOrders(mapped);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const filteredRows = useMemo(
    () => (activeFilter === 'All' ? orders : orders.filter((row) => row.status === activeFilter)),
    [activeFilter, orders]
  );

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Orders Panel</h1>
            <p className="mt-1 text-sm text-[#64748b] dark:text-[#94a3b8]">{orders.length} orders this month.</p>
          </div>
          <div className="flex items-center gap-2">
            <CreateOrderDialog>
              <button className="rounded-lg bg-[#f37a2a] hover:bg-[#e06716] px-4 py-2 text-sm font-bold text-white shadow-md transition-colors">+ New Order</button>
            </CreateOrderDialog>
            <ComingSoonDialog title="Export Data" type="export">
              <button className="rounded-lg border border-[#d9d7c8] dark:border-[#2a2e3d] bg-white dark:bg-[#16181d] px-4 py-2 text-sm font-semibold text-[#1f2937] dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#2a2e3d] transition-colors">Export</button>
            </ComingSoonDialog>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeFilter === filter
                  ? 'border-[#f37a2a] bg-[#fff2e8] text-[#d86219] dark:bg-[#f37a2a]/20 dark:text-[#f37a2a]'
                  : 'border-[#e4e1d3] bg-white text-[#64748b] dark:border-[#2a2e3d] dark:bg-[#16181d] dark:text-[#94a3b8] hover:text-[#1f2937] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#2a2e3d]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full">
            <thead>
              <tr className="border-b border-[#efedde] dark:border-[#2a2e3d] bg-[#fcfbf6] dark:bg-[#16181d] text-left text-xs uppercase tracking-[0.16em] text-[#64748b] dark:text-[#94a3b8]">
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
                  <tr key={row.orderId} className="border-b border-[#f2f0e5] dark:border-[#2a2e3d] text-sm text-[#1f2937] dark:text-[#ededdf] hover:bg-gray-50/50 dark:hover:bg-[#2a2e3d]/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#292F54] dark:text-white">{row.orderId}</td>
                    <td className="px-4 py-3">{row.customerName}</td>
                    <td className="px-4 py-3 text-[#475569] dark:text-gray-400">{row.phoneNumber}</td>
                    <td className="px-4 py-3 text-[#475569] dark:text-gray-400">{row.deliveryAddress}</td>
                    <td className="px-4 py-3">{row.pincode}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_CLASS[row.status]}`}>{row.status}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-black dark:text-white">{row.cost}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-[#64748b] dark:text-gray-400">
                    {loading ? "Loading orders..." : "No orders found."}
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
