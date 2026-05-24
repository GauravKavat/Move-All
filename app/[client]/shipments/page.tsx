'use client';

import { useMemo, useState, useEffect } from 'react';
import { toast } from "sonner";
import { ComingSoonDialog } from '@/components/coming-soon-dialog';
import { createClient } from '@/lib/client';

type ShipmentRow = {
  awb: string;
  customerName: string;
  courier: string;
  status: 'Pending' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'RTO';
  eta: string;
  cost: string;
};

const COURIER_FILTERS = ['All', 'Bluedart', 'DHL', 'FedEx', 'DTDC'];

export default function ClientShipmentsPage() {
  const [query, setQuery] = useState('');
  const [activeCourier, setActiveCourier] = useState('All');
  const [shipments, setShipments] = useState<ShipmentRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShipments() {
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
            const { data: shipmentData } = await supabase
              .from('shipments')
              .select('*, orders(customer_name)')
              .eq('client_id', clientData.id)
              .order('created_at', { ascending: false });

            if (shipmentData) {
              const mapped: ShipmentRow[] = shipmentData.map((s: any) => ({
                awb: s.awb,
                customerName: s.orders?.customer_name || 'Unknown',
                courier: s.courier,
                status: s.status,
                eta: s.eta ? new Date(s.eta).toLocaleDateString('en-IN') : 'TBD',
                cost: `₹${Number(s.cost).toFixed(2)}`,
              }));
              setShipments(mapped);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load shipments:", err);
      } finally {
        setLoading(false);
      }
    }
    loadShipments();
  }, []);

  const rows = useMemo(() => {
    return shipments.filter((shipment) => {
      const matchQuery =
        shipment.awb.toLowerCase().includes(query.toLowerCase()) ||
        shipment.customerName.toLowerCase().includes(query.toLowerCase());
      const matchCourier = activeCourier === 'All' || shipment.courier === activeCourier;
      return matchQuery && matchCourier;
    });
  }, [activeCourier, query, shipments]);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] p-5 sm:p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Shipments Tracking</h1>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by AWB or Order"
            className="h-10 flex-1 rounded-lg border border-[#dfdccd] dark:border-[#2a2e3d] bg-white dark:bg-[#16181d] px-3 text-sm text-[#1f2937] dark:text-white outline-none focus:border-[#f37a2a] focus:ring-1 focus:ring-[#f37a2a]"
          />
          <ComingSoonDialog title="Live Tracking" type="pickup">
            <button className="h-10 rounded-lg bg-[#f37a2a] hover:bg-[#e06716] px-5 text-sm font-bold text-white shadow-md transition-colors">Track</button>
          </ComingSoonDialog>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {COURIER_FILTERS.map((courier) => (
            <button
              key={courier}
              onClick={() => setActiveCourier(courier)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                activeCourier === courier
                  ? 'border-[#f37a2a] bg-[#fff2e8] text-[#d86219] dark:bg-[#f37a2a]/20 dark:text-[#f37a2a]'
                  : 'border-[#e4e1d3] bg-white text-[#64748b] dark:border-[#2a2e3d] dark:bg-[#16181d] dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#2a2e3d]'
              }`}
            >
              {courier}
            </button>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead>
              <tr className="border-b border-[#efedde] dark:border-[#2a2e3d] bg-[#fcfbf6] dark:bg-[#16181d] text-left text-xs uppercase tracking-[0.16em] text-[#64748b] dark:text-[#94a3b8]">
                <th className="px-4 py-3">AWB</th>
                <th className="px-4 py-3">Customer Name</th>
                <th className="px-4 py-3">Courier</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">ETA</th>
                <th className="px-4 py-3">Cost</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((row) => (
                  <tr key={row.awb} className="border-b border-[#f2f0e5] dark:border-[#2a2e3d] text-sm text-[#1f2937] dark:text-[#ededdf] hover:bg-gray-50/50 dark:hover:bg-[#2a2e3d]/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#292F54] dark:text-white">{row.awb}</td>
                    <td className="px-4 py-3">{row.customerName}</td>
                    <td className="px-4 py-3">{row.courier}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-blue-50 dark:bg-blue-950/20 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">{row.status}</span>
                    </td>
                    <td className="px-4 py-3">{row.eta}</td>
                    <td className="px-4 py-3 font-semibold text-black dark:text-white">{row.cost}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    {loading ? 'Loading shipments...' : 'No shipments found.'}
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
