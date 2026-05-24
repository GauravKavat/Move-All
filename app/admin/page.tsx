'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from "lucide-react";
import { ComingSoonDialog } from "@/components/coming-soon-dialog";
import { createClient } from '@/lib/client';

function formatTime(date: Date) {
  return date.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });
}

export default function AdminOverviewPage() {
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState([
    {
      label: "Total Active Clients",
      value: "0",
      delta: "+0%",
      trend: "up",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Global Shipments",
      value: "0",
      delta: "+0%",
      trend: "up",
      icon: Package,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Total GMV (INR)",
      value: "₹0",
      delta: "+0%",
      trend: "up",
      icon: TrendingUp,
      color: "text-[#f37a2a]",
      bg: "bg-[#f37a2a]/10",
    },
    {
      label: "Open Escalations",
      value: "0",
      delta: "0",
      trend: "down",
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
  ]);

  const [escalations, setEscalations] = useState<any[]>([]);
  const [chartData, setChartData] = useState<{ day: string; count: number }[]>([]);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const supabase = createClient();
        
        // Fetch global counts & values
        const [
          { count: clientsCount },
          { count: shipmentsCount },
          { data: ordersData },
          { count: openEscalations },
          { data: rawEscalations },
          { data: recentShipments }
        ] = await Promise.all([
          supabase.from('clients').select('*', { count: 'exact', head: true }),
          supabase.from('shipments').select('*', { count: 'exact', head: true }),
          supabase.from('orders').select('order_value'),
          supabase.from('exceptions').select('*', { count: 'exact', head: true }).neq('status', 'Resolved'),
          supabase.from('exceptions').select('*, clients(name)').neq('status', 'Resolved').order('created_at', { ascending: false }).limit(5),
          supabase.from('shipments').select('created_at').gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        ]);

        const totalClients = clientsCount || 0;
        const totalShipments = shipmentsCount || 0;
        const totalEscalations = openEscalations || 0;
        
        const gmv = ordersData ? ordersData.reduce((acc: number, curr: any) => acc + Number(curr.order_value || 0), 0) : 0;

        setKpis([
          {
            label: "Total Active Clients",
            value: totalClients.toString(),
            delta: "+0%",
            trend: "up",
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
          {
            label: "Global Shipments",
            value: totalShipments.toString(),
            delta: "+0%",
            trend: "up",
            icon: Package,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "Total GMV (INR)",
            value: `₹${gmv.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`,
            delta: "+0%",
            trend: "up",
            icon: TrendingUp,
            color: "text-[#f37a2a]",
            bg: "bg-[#f37a2a]/10",
          },
          {
            label: "Open Escalations",
            value: totalEscalations.toString(),
            delta: "0",
            trend: "down",
            icon: AlertTriangle,
            color: "text-red-500",
            bg: "bg-red-500/10",
          },
        ]);

        // Process Escalations
        if (rawEscalations) {
          setEscalations(rawEscalations.map((e: any) => ({
            id: e.id,
            client: e.clients?.name || 'Unknown Client',
            issue: e.reason,
            severity: 'high',
            time: formatTime(new Date(e.created_at))
          })));
        }

        // Process Chart Data
        const days: string[] = [];
        const counts: number[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
          days.push(dayName);

          const count = recentShipments?.filter(s => {
            const sDate = new Date(s.created_at);
            return sDate.toDateString() === d.toDateString();
          }).length || 0;

          counts.push(count);
        }

        setChartData(days.map((day, idx) => ({
          day,
          count: counts[idx]
        })));

      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
  }, []);

  const maxChartCount = Math.max(...chartData.map(c => c.count), 1);

  return (
    <div className="space-y-4 w-full mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Admin Dashboard</h1>
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            Global overview of all clients, shipments, and system health.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium border border-emerald-200 dark:border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            System Operational
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white dark:bg-[#1e212b] rounded-xl p-4 border border-gray-200 dark:border-[#2a2e3d] shadow-sm flex flex-col relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${kpi.bg}`}>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </div>
              <span
                className={`flex items-center text-xs font-semibold px-2 py-1 rounded-md ${
                  kpi.trend === "up"
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : kpi.trend === "down" && kpi.label === "Open Escalations" 
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {kpi.trend === "up" ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                {kpi.delta}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#64748b] dark:text-[#94a3b8]">{kpi.label}</p>
              <h3 className="text-2xl font-bold text-[#111827] dark:text-white mt-1">
                {loading ? '...' : kpi.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1e212b] rounded-xl border border-gray-200 dark:border-[#2a2e3d] shadow-sm overflow-hidden flex flex-col min-h-[320px]">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-[#2a2e3d] flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-[#111827] dark:text-white text-base">Global Shipment Volume</h3>
              <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">Across all active tenants (Last 7 Days)</p>
            </div>
            <select className="bg-gray-50 dark:bg-[#16181d] border border-gray-200 dark:border-[#2a2e3d] text-sm rounded-lg px-3 py-1.5 text-[#111827] dark:text-white outline-none">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Quarter</option>
            </select>
          </div>
          <div className="flex-1 p-6 flex items-end justify-center relative min-h-[220px]">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center flex-col opacity-50">
                 <Activity className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-2 animate-pulse" />
                 <p className="text-sm text-gray-400 dark:text-gray-500">Analytics visualization loading...</p>
              </div>
            ) : chartData.length > 0 ? (
              <div className="w-full h-full flex items-end justify-between gap-4 z-10 px-4 pt-8">
                {chartData.map((item) => {
                  const pct = (item.count / maxChartCount) * 100;
                  return (
                    <div key={item.day} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
                      <span className="text-xs font-bold text-[#f37a2a] opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.count}</span>
                      <div 
                        className="w-full rounded-t-md bg-gradient-to-t from-[#f37a2a]/60 to-[#f37a2a] hover:from-[#e06716] hover:to-[#e06716] transition-all duration-500 relative cursor-pointer" 
                        style={{ height: `${Math.max(pct, 8)}%` }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {item.count} shipments
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#64748b] dark:text-[#94a3b8]">{item.day}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center flex-col opacity-50">
                 <p className="text-sm text-gray-400 dark:text-gray-500">No shipments in the last 7 days.</p>
              </div>
            )}
          </div>
        </div>

        {/* Escalations / Alerts Feed */}
        <div className="bg-white dark:bg-[#1e212b] rounded-xl border border-gray-200 dark:border-[#2a2e3d] shadow-sm flex flex-col h-full">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-[#2a2e3d]">
             <h3 className="font-semibold text-[#111827] dark:text-white text-base">Priority Escalations</h3>
          </div>
          <div className="p-0 overflow-y-auto flex-1">
            {loading ? (
              <div className="p-6 text-center">
                <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">Loading escalations...</p>
              </div>
            ) : escalations.length > 0 ? (
              escalations.map((alert, index) => (
                <div 
                  key={alert.id} 
                  className={`px-5 py-4 flex gap-4 hover:bg-gray-50 dark:hover:bg-[#2a2e3d]/50 transition-colors cursor-pointer ${
                    index !== escalations.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''
                  }`}
                >
                  <div className="mt-0.5 w-2 h-2 rounded-full flex-shrink-0 bg-red-500" />
                  <div>
                    <p className="text-sm font-semibold text-[#111827] dark:text-white">{alert.client}</p>
                    <p className="text-sm text-[#475569] dark:text-[#cbd5e1] mt-0.5">{alert.issue}</p>
                    <p className="text-xs text-[#94a3b8] mt-1.5">{alert.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">No open escalations.</p>
              </div>
            )}
          </div>
          <div className="px-5 py-3 border-t border-gray-200 dark:border-[#2a2e3d] text-center">
            <ComingSoonDialog title="Escalation Details" type="action">
              <button className="text-sm text-[#f37a2a] hover:text-[#d96a20] font-medium transition-colors">
                View All Escalations →
              </button>
            </ComingSoonDialog>
          </div>
        </div>
      </div>
    </div>
  );
}
