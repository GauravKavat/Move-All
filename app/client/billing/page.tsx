'use client';
import { toast } from "sonner";
import { ComingSoonDialog } from '@/components/coming-soon-dialog';

const INVOICES = [
  { id: 'INV-3021', date: '12 May 2026', courier: 'Bluedart', status: 'Paid', amount: 'Rs 48,200.00' },
  { id: 'INV-3014', date: '05 May 2026', courier: 'DHL', status: 'Paid', amount: 'Rs 35,940.00' },
  { id: 'INV-3007', date: '28 Apr 2026', courier: 'FedEx', status: 'Pending', amount: 'Rs 22,410.00' },
];

export default function ClientBillingPage() {
  return (
    <div className="space-y-5">
      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <article className="rounded-2xl border border-[#e8e5d7] bg-white p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-[#64748b]">Month to Date Spend</p>
          <p className="mt-2 text-3xl font-bold text-black">Rs 1,06,550</p>
        </article>
        <article className="rounded-2xl border border-[#e8e5d7] bg-white p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-[#64748b]">Avg Cost per Parcel</p>
          <p className="mt-2 text-3xl font-bold text-black">Rs 84.2</p>
        </article>
        <article className="rounded-2xl border border-[#e8e5d7] bg-white p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-[#64748b]">Upcoming Invoice Due</p>
          <p className="mt-2 text-3xl font-bold text-black">Rs 22,410</p>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e8e5d7] bg-white">
        <header className="flex items-center justify-between border-b border-[#efedde] p-5">
          <h1 className="text-2xl font-bold text-[#111827]">Billing History</h1>
          <ComingSoonDialog title="Download Export" type="export">
            <button className="rounded-lg bg-[#f37a2a] px-4 py-2 text-sm font-bold text-white">Download All</button>
          </ComingSoonDialog>
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead>
              <tr className="border-b border-[#efedde] bg-[#fcfbf6] text-left text-xs uppercase tracking-[0.16em] text-[#64748b]">
                <th className="px-4 py-3">Invoice ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Courier</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((row) => (
                <tr key={row.id} className="border-b border-[#f2f0e5] text-sm text-[#1f2937]">
                  <td className="px-4 py-3 font-semibold text-[#292F54]">{row.id}</td>
                  <td className="px-4 py-3">{row.date}</td>
                  <td className="px-4 py-3">{row.courier}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${row.status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-semibold text-black">{row.amount}</td>
                  <td className="px-4 py-3 text-right">
                    <ComingSoonDialog title="Download Export" type="export">
                      <button className="rounded-lg border border-[#dddacb] bg-white px-3 py-1.5 text-xs font-semibold text-[#1f2937]">Download</button>
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
