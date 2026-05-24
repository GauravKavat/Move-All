'use client';

import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { createClient } from '@/lib/client';

type ExceptionRow = {
  id: string;
  exceptionId: string;
  orderId: string;
  reason: string;
  lastAttempt: string;
  status: string;
};

export default function ClientExceptionsPage() {
  const [exceptions, setExceptions] = useState<ExceptionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExceptions() {
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
            const { data: exceptionData } = await supabase
              .from('exceptions')
              .select('*, shipments(awb, orders(id))')
              .eq('client_id', clientData.id)
              .neq('status', 'Resolved')
              .order('created_at', { ascending: false });

            if (exceptionData) {
              const mapped: ExceptionRow[] = exceptionData.map((e: any) => ({
                id: e.id,
                exceptionId: e.id.substring(0, 8).toUpperCase(),
                orderId: e.shipments?.orders?.id?.substring(0, 8).toUpperCase() || 'N/A',
                reason: e.reason,
                lastAttempt: new Date(e.created_at).toLocaleString('en-IN'),
                status: e.status,
              }));
              setExceptions(mapped);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load exceptions:", err);
      } finally {
        setLoading(false);
      }
    }
    loadExceptions();
  }, []);

  const handleResolve = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('exceptions')
        .update({ status: 'Resolved' })
        .eq('id', id);

      if (error) {
        toast.error("Failed to resolve exception.");
        return;
      }

      toast.success("Exception marked as resolved.");
      setExceptions(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] p-5 sm:p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Exceptions Monitoring</h1>
        <p className="mt-1 text-sm text-[#64748b] dark:text-[#94a3b8]">Track delivery failures, route anomalies, and courier exceptions requiring intervention.</p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[950px] w-full">
            <thead>
              <tr className="border-b border-[#efedde] dark:border-[#2a2e3d] bg-[#fcfbf6] dark:bg-[#16181d] text-left text-xs uppercase tracking-[0.16em] text-[#64748b] dark:text-[#94a3b8]">
                <th className="px-4 py-3">Exception ID</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Last Attempt</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {exceptions.length > 0 ? (
                exceptions.map((item) => (
                  <tr key={item.exceptionId} className="border-b border-[#f2f0e5] dark:border-[#2a2e3d] text-sm text-[#1f2937] dark:text-[#ededdf] hover:bg-gray-50/50 dark:hover:bg-[#2a2e3d]/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#292F54] dark:text-white">{item.exceptionId}</td>
                    <td className="px-4 py-3 text-[#292F54] dark:text-white">{item.orderId}</td>
                    <td className="px-4 py-3">{item.reason}</td>
                    <td className="px-4 py-3">{item.lastAttempt}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.status === 'Open' ? 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button 
                        onClick={() => handleResolve(item.id)}
                        className="rounded-lg border border-[#dddacb] dark:border-[#2a2e3d] bg-white dark:bg-[#16181d] px-3 py-1.5 text-xs font-semibold text-[#1f2937] dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#2a2e3d] hover:text-[#111827] dark:hover:text-white transition-colors"
                      >
                        Resolve
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#64748b] dark:text-gray-400">
                    {loading ? 'Loading exceptions...' : 'No active exceptions found.'}
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
