'use client';
import { toast } from "sonner";
import { ComingSoonDialog } from '@/components/coming-soon-dialog';
import { WalletRechargeModal } from '@/components/wallet-recharge-modal';
import Script from 'next/script';
import { Button } from "@/components/ui/button";
import { Wallet, TrendingDown, ArrowUpRight, ArrowDownRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/client";

type Transaction = {
  id: string;
  created_at: string;
  description: string;
  type: 'recharge' | 'deduction' | 'refund' | 'bonus';
  amount: number;
  reference_id?: string;
};

export default function ClientBillingPage() {
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0.00);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [mtdSpend, setMtdSpend] = useState(0.00);
  const [avgCost, setAvgCost] = useState(0.00);
  const [percentageDiff, setPercentageDiff] = useState(0);

  useEffect(() => {
    async function loadBillingData() {
      try {
        setLoading(true);
        const supabase = createClient();
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // Fetch client and wallet
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('id, wallets(id, balance)')
          .eq('user_id', user.id)
          .maybeSingle();

        if (clientError || !clientData) {
          setBalance(0.00);
          setTransactions([]);
          setLoading(false);
          return;
        }

        const walletRaw = clientData.wallets;
        const wallet = Array.isArray(walletRaw) ? walletRaw[0] : walletRaw;

        if (!wallet) {
          setBalance(0.00);
          setTransactions([]);
          setLoading(false);
          return;
        }

        setBalance(wallet.balance || 0.00);

        // Fetch transactions
        const { data: txsData, error: txsError } = await supabase
          .from('wallet_transactions')
          .select('*')
          .eq('wallet_id', wallet.id)
          .order('created_at', { ascending: false });

        if (txsError || !txsData) {
          setTransactions([]);
          setLoading(false);
          return;
        }

        // Process transactions
        const formattedTxs: Transaction[] = txsData.map((tx: any) => ({
          id: tx.id,
          created_at: tx.created_at,
          description: tx.description || (tx.type === 'recharge' ? 'Wallet Recharge' : 'Shipment Deduction'),
          type: tx.type,
          amount: Number(tx.amount),
          reference_id: tx.reference_id
        }));

        setTransactions(formattedTxs);

        // Calculate statistics
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        let currentMonthDeductions = 0;
        let lastMonthDeductions = 0;
        let totalDeductions = 0;
        let deductionCount = 0;

        formattedTxs.forEach(tx => {
          const txDate = new Date(tx.created_at);
          if (tx.type === 'deduction') {
            const cost = Math.abs(tx.amount);
            totalDeductions += cost;
            deductionCount += 1;

            if (txDate >= startOfMonth) {
              currentMonthDeductions += cost;
            } else if (txDate >= startOfLastMonth && txDate <= endOfLastMonth) {
              lastMonthDeductions += cost;
            }
          }
        });

        setMtdSpend(currentMonthDeductions);
        setAvgCost(deductionCount > 0 ? totalDeductions / deductionCount : 0.00);
        
        if (lastMonthDeductions > 0) {
          const diff = ((lastMonthDeductions - currentMonthDeductions) / lastMonthDeductions) * 100;
          setPercentageDiff(diff);
        }
      } catch (err) {
        console.error('Error loading billing data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadBillingData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#f37a2a]" />
        <span className="ml-2 font-medium text-gray-500">Loading billing data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Load Razorpay Script for Modal */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* Wallet Balance Widget */}
        <article className="rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-[#f37a2a]/30 transition-all">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#f37a2a]/10 blur-2xl -mr-10 -mt-10 pointer-events-none" />
          <div>
            <div className="flex justify-between items-center">
                <p className="text-xs uppercase tracking-[0.16em] text-[#64748b] dark:text-[#94a3b8] font-bold">Wallet Balance</p>
                <div className="p-1.5 bg-[#f37a2a]/10 rounded-md">
                    <Wallet className="w-4 h-4 text-[#f37a2a]" />
                </div>
            </div>
            <p className="mt-2 text-4xl font-black text-gray-900 dark:text-white tracking-tight">₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
            {balance < 500 && (
              <p className="text-xs text-red-500 font-semibold mt-1">Low Balance - Please recharge</p>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-[#2a2e3d] flex items-center justify-between">
            <WalletRechargeModal>
               <Button className="bg-[#f37a2a] hover:bg-[#e06716] text-white w-full font-bold shadow-md h-10">
                 + Add Funds
               </Button>
            </WalletRechargeModal>
          </div>
        </article>

        <article className="rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-[#64748b] dark:text-[#94a3b8] font-bold">Month to Date Spend</p>
          <p className="mt-2 text-3xl font-bold text-black dark:text-white">₹{mtdSpend.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          {percentageDiff > 0 && (
            <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded">
              <TrendingDown className="w-3 h-3" />
              <span>{percentageDiff.toFixed(0)}% less than last month</span>
            </div>
          )}
        </article>

        <article className="rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.16em] text-[#64748b] dark:text-[#94a3b8] font-bold">Avg Cost per Parcel</p>
          <p className="mt-2 text-3xl font-bold text-black dark:text-white">₹{avgCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
        </article>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] shadow-sm">
        <header className="flex items-center justify-between border-b border-[#efedde] dark:border-[#2a2e3d] p-5">
          <h1 className="text-xl font-bold text-[#111827] dark:text-white">Wallet Transactions</h1>
          <ComingSoonDialog title="Download Export" type="export">
            <button className="rounded-lg border border-gray-200 dark:border-[#2a2e3d] hover:bg-gray-50 dark:hover:bg-[#2a2e3d] px-4 py-2 text-sm font-bold text-gray-700 dark:text-[#94a3b8] transition-colors">Download PDF</button>
          </ComingSoonDialog>
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead>
              <tr className="border-b border-[#efedde] dark:border-[#2a2e3d] bg-[#fcfbf6] dark:bg-[#16181d] text-left text-xs uppercase tracking-[0.16em] text-[#64748b] dark:text-[#94a3b8]">
                <th className="px-5 py-4 font-bold">Transaction ID</th>
                <th className="px-5 py-4 font-bold">Date & Time</th>
                <th className="px-5 py-4 font-bold">Description</th>
                <th className="px-5 py-4 font-bold">Amount</th>
                <th className="px-5 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? (
                transactions.map((row) => (
                  <tr key={row.id} className="border-b border-[#f2f0e5] dark:border-[#2a2e3d] text-sm text-[#1f2937] dark:text-[#ededdf] hover:bg-gray-50/50 dark:hover:bg-[#2a2e3d]/30 transition-colors">
                    <td className="px-5 py-4 font-mono font-bold text-gray-500">{row.id.substring(0, 8)}...</td>
                    <td className="px-5 py-4 font-medium">{new Date(row.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                    <td className="px-5 py-4 font-medium text-gray-900 dark:text-white">{row.description}</td>
                    <td className={`px-5 py-4 font-bold flex items-center gap-1 ${row.type === 'recharge' || row.type === 'bonus' || row.type === 'refund' ? 'text-emerald-600' : 'text-gray-900 dark:text-white'}`}>
                      {row.type === 'recharge' || row.type === 'bonus' || row.type === 'refund' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4 text-red-500" />}
                      {row.amount > 0 ? '+' : ''} ₹{Math.abs(row.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                        Success
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm font-medium text-gray-500 dark:text-gray-400">No transactions found. Recharge your wallet to start shipping.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
