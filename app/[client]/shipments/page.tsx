'use client';

import { useMemo, useState } from 'react';
import { toast } from "sonner";
import { ComingSoonDialog } from '@/components/coming-soon-dialog';

type ShipmentRow = {
  awb: string;
  customerName: string;
  courier: string;
  status: 'Pending' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'RTO';
  eta: string;
  cost: string;
};

const SHIPMENTS: ShipmentRow[] = [];

const COURIER_FILTERS = ['All', 'Bluedart', 'DHL', 'FedEx', 'DTDC'];

export default function ClientShipmentsPage() {
  const [query, setQuery] = useState('');
  const [activeCourier, setActiveCourier] = useState('All');

  const rows = useMemo(() => {
    return SHIPMENTS.filter((shipment) => {
      const matchQuery =
        shipment.awb.toLowerCase().includes(query.toLowerCase()) ||
        shipment.customerName.toLowerCase().includes(query.toLowerCase());
      const matchCourier = activeCourier === 'All' || shipment.courier === activeCourier;
      return matchQuery && matchCourier;
    });
  }, [activeCourier, query]);

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#e8e5d7] bg-white p-5 sm:p-6">
        <h1 className="text-2xl font-bold text-[#111827]">Shipments Tracking</h1>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by AWB or Order"
            className="h-10 flex-1 rounded-lg border border-[#dfdccd] px-3 text-sm text-[#1f2937] outline-none focus:border-[#f37a2a]"
          />
          <ComingSoonDialog title="Live Tracking" type="pickup">
            <button className="h-10 rounded-lg bg-[#f37a2a] px-5 text-sm font-bold text-white">Track</button>
          </ComingSoonDialog>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {COURIER_FILTERS.map((courier) => (
            <button
              key={courier}
              onClick={() => setActiveCourier(courier)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                activeCourier === courier
                  ? 'border-[#f37a2a] bg-[#fff2e8] text-[#d86219]'
                  : 'border-[#e4e1d3] bg-white text-[#64748b]'
              }`}
            >
              {courier}
            </button>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e8e5d7] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead>
              <tr className="border-b border-[#efedde] bg-[#fcfbf6] text-left text-xs uppercase tracking-[0.16em] text-[#64748b]">
                <th className="px-4 py-3">AWB</th>
                <th className="px-4 py-3">Customer Name</th>
                <th className="px-4 py-3">Courier</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">ETA</th>
                <th className="px-4 py-3">Cost</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.awb} className="border-b border-[#f2f0e5] text-sm text-[#1f2937]">
                  <td className="px-4 py-3 font-semibold text-[#292F54]">{row.awb}</td>
                  <td className="px-4 py-3">{row.customerName}</td>
                  <td className="px-4 py-3">{row.courier}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">{row.status}</span>
                  </td>
                  <td className="px-4 py-3">{row.eta}</td>
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
