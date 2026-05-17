'use client';
import { toast } from "sonner";
import { ComingSoonDialog } from '@/components/coming-soon-dialog';

const EXCEPTIONS = [
  {
    exceptionId: 'EXC-2201',
    orderId: 'ORD-88303',
    reason: 'Routing Error: Hub scan mismatch',
    lastAttempt: '17 May, 14:45',
    status: 'Open',
  },
  {
    exceptionId: 'EXC-2202',
    orderId: 'ORD-88307',
    reason: 'Courier Exception: Address not reachable',
    lastAttempt: '17 May, 13:10',
    status: 'In Progress',
  },
  {
    exceptionId: 'EXC-2203',
    orderId: 'ORD-88261',
    reason: 'Delivery Failed: Customer unavailable',
    lastAttempt: '17 May, 11:55',
    status: 'Open',
  },
];

export default function ClientExceptionsPage() {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#e8e5d7] bg-white p-5 sm:p-6">
        <h1 className="text-2xl font-bold text-[#111827]">Exceptions Monitoring</h1>
        <p className="mt-1 text-sm text-[#64748b]">Track delivery failures, route anomalies, and courier exceptions requiring intervention.</p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e8e5d7] bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-[950px] w-full">
            <thead>
              <tr className="border-b border-[#efedde] bg-[#fcfbf6] text-left text-xs uppercase tracking-[0.16em] text-[#64748b]">
                <th className="px-4 py-3">Exception ID</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Last Attempt</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {EXCEPTIONS.map((item) => (
                <tr key={item.exceptionId} className="border-b border-[#f2f0e5] text-sm text-[#1f2937]">
                  <td className="px-4 py-3 font-semibold text-[#292F54]">{item.exceptionId}</td>
                  <td className="px-4 py-3 text-[#292F54]">{item.orderId}</td>
                  <td className="px-4 py-3">{item.reason}</td>
                  <td className="px-4 py-3">{item.lastAttempt}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'Open' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ComingSoonDialog title="Exception Resolver" type="action">
                      <button className="rounded-lg border border-[#dddacb] bg-white px-3 py-1.5 text-xs font-semibold text-[#1f2937]">Resolve</button>
                    </ComingSoonDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
