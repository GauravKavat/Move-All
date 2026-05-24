"use client";

import { Wallet, Search, TrendingUp, AlertTriangle, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/client";
import { toast } from "sonner";

type AdminWallet = {
  id: string;
  client_name: string;
  balance: number;
  negative_shipments: number;
};

export default function AdminBillingPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [wallets, setWallets] = useState<AdminWallet[]>([]);
  const [totalBalance, setTotalBalance] = useState(0.00);
  const [negativeCount, setNegativeCount] = useState(0);
  const [todayRecharges, setTodayRecharges] = useState(0.00);

  useEffect(() => {
    async function loadAdminBilling() {
      try {
        setLoading(true);
        const supabase = createClient();

        // Fetch clients and their wallets
        const { data: clientsData, error: clientsError } = await supabase
          .from('clients')
          .select('id, name, negative_shipments_count, wallets(id, balance)');

        if (clientsError || !clientsData) {
          setWallets([]);
          setTotalBalance(0.00);
          setNegativeCount(0);
          setLoading(false);
          return;
        }

        let totBal = 0;
        let negC = 0;
        const formattedWallets: AdminWallet[] = [];

        clientsData.forEach((client: any) => {
          const walletRaw = client.wallets;
          const wallet = Array.isArray(walletRaw) ? walletRaw[0] : walletRaw;
          const bal = wallet?.balance ? Number(wallet.balance) : 0.00;
          const walletId = wallet?.id || 'No Wallet';
          const negCountVal = client.negative_shipments_count || 0;

          formattedWallets.push({
            id: walletId,
            client_name: client.name,
            balance: bal,
            negative_shipments: negCountVal
          });

          totBal += bal;
          if (bal < 0) {
            negC += 1;
          }
        });

        setWallets(formattedWallets);
        setTotalBalance(totBal);
        setNegativeCount(negC);

        // Fetch Today's Recharges
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const { data: rechargesData } = await supabase
          .from('wallet_transactions')
          .select('amount')
          .eq('type', 'recharge')
          .gte('created_at', startOfToday.toISOString());

        let rechargesSum = 0;
        if (rechargesData) {
          rechargesData.forEach((tx: any) => {
            rechargesSum += Number(tx.amount);
          });
        }
        setTodayRecharges(rechargesSum);

      } catch (err) {
        console.error('Error loading admin billing:', err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminBilling();
  }, []);

  const filteredWallets = wallets.filter(w => 
    w.client_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#f37a2a]" />
        <span className="ml-2 font-medium text-gray-500">Loading wallet statistics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Global Wallet Balances</h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
          Monitor client balances and manage manual ledger entries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Card className="p-5 border-l-4 border-l-[#f37a2a]">
             <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Total Platform Balance</p>
             <p className="text-3xl font-black mt-2">₹{totalBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
         </Card>
         <Card className="p-5 border-l-4 border-l-red-500">
             <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Clients in Negative</p>
             <p className="text-3xl font-black mt-2">{negativeCount}</p>
         </Card>
         <Card className="p-5 border-l-4 border-l-emerald-500">
             <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">Today's Recharges</p>
             <p className="text-3xl font-black mt-2">₹{todayRecharges.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
         </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-[#2a2e3d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by client name..."
              className="pl-9 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Wallet ID</TableHead>
              <TableHead>Current Balance</TableHead>
              <TableHead>Negative Shipments</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWallets.length > 0 ? (
              filteredWallets.map((wallet) => (
                <TableRow key={wallet.id}>
                  <TableCell className="font-bold">{wallet.client_name}</TableCell>
                  <TableCell className="font-mono text-sm text-gray-500">
                    {wallet.id !== 'No Wallet' ? `${wallet.id.substring(0, 8)}...` : wallet.id}
                  </TableCell>
                  <TableCell>
                    <span className={`font-bold ${wallet.balance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      ₹{wallet.balance.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    {wallet.negative_shipments > 0 ? (
                        <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                            <AlertTriangle className="h-4 w-4" />
                            {wallet.negative_shipments} / 2
                        </div>
                    ) : (
                        <span className="text-gray-400">0 / 2</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => toast.info("Manual adjustment feature coming soon")}>Adjust Balance</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No wallets found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
