'use client';

import {
  ArrowDownRight,
  ArrowUpRight,
  Package,
  Truck,
  CheckCircle2,
  RotateCcw,
  AlertCircle,
  AlertTriangle,
  Info,
  MessageCircle,
  Plus
} from 'lucide-react';
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreateOrderDialog } from '@/components/create-order-dialog';
import { createClient } from '@/lib/client';
import { useState, useEffect } from 'react';

function formatTime(date: Date) {
  return date.toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' });
}

export default function ClientDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [clientData, setClientData] = useState<any>(null);
  const [kpis, setKpis] = useState([
    { label: 'Total Orders', value: '0', delta: '+0%', positive: true, icon: Package },
    { label: 'Shipped', value: '0', delta: '+0%', positive: true, icon: Truck },
    { label: 'Delivered', value: '0', delta: '+0%', positive: true, icon: CheckCircle2 },
    { label: 'RTO Rate', value: '0%', delta: '0%', positive: false, icon: RotateCcw },
    { label: 'Active Issues', value: '0', delta: '0%', positive: false, icon: AlertCircle },
    { label: 'Active Pickups', value: '0', delta: '+0%', positive: true, icon: ArrowUpRight },
  ]);
  const [activityFeed, setActivityFeed] = useState<any[]>([]);
  const [networkStatus, setNetworkStatus] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  // Schedule pickup fields
  const [pickupOpen, setPickupOpen] = useState(false);
  const [warehouseLocation, setWarehouseLocation] = useState('w1');
  const [numberOfPackages, setNumberOfPackages] = useState(1);
  const [submittingPickup, setSubmittingPickup] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: client } = await supabase
          .from('clients')
          .select('id, name')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!client) return;
        setClientData(client);

        // Fetch counts
        const [
          { count: totalOrders },
          { count: shippedShipments },
          { count: deliveredShipments },
          { count: rtoShipments },
          { count: activeExceptions },
          { count: activePickups },
          { data: recentOrders },
          { data: recentExceptions },
          { data: couriersData }
        ] = await Promise.all([
          supabase.from('orders').select('*', { count: 'exact', head: true }).eq('client_id', client.id),
          supabase.from('shipments').select('*', { count: 'exact', head: true }).eq('client_id', client.id).in('status', ['Shipped', 'In Transit', 'Out for Delivery']),
          supabase.from('shipments').select('*', { count: 'exact', head: true }).eq('client_id', client.id).eq('status', 'Delivered'),
          supabase.from('shipments').select('*', { count: 'exact', head: true }).eq('client_id', client.id).eq('status', 'RTO'),
          supabase.from('exceptions').select('*', { count: 'exact', head: true }).eq('client_id', client.id).neq('status', 'Resolved'),
          supabase.from('pickups').select('*', { count: 'exact', head: true }).eq('client_id', client.id).in('status', ['Pending', 'Scheduled', 'In Transit']),
          supabase.from('orders').select('customer_name, created_at').eq('client_id', client.id).order('created_at', { ascending: false }).limit(3),
          supabase.from('exceptions').select('reason, created_at, awb').eq('client_id', client.id).neq('status', 'Resolved').order('created_at', { ascending: false }).limit(3),
          supabase.from('couriers').select('name, uptime').order('name')
        ]);

        const totalOrdersNum = totalOrders || 0;
        const shippedNum = shippedShipments || 0;
        const deliveredNum = deliveredShipments || 0;
        const rtoNum = rtoShipments || 0;
        const activeIssuesNum = activeExceptions || 0;
        const activePickupsNum = activePickups || 0;

        const totalShipments = shippedNum + deliveredNum + rtoNum;
        const rtoRate = totalShipments > 0 ? Math.round((rtoNum / totalShipments) * 100) : 0;

        setKpis([
          { label: 'Total Orders', value: totalOrdersNum.toString(), delta: '+0%', positive: true, icon: Package },
          { label: 'Shipped', value: shippedNum.toString(), delta: '+0%', positive: true, icon: Truck },
          { label: 'Delivered', value: deliveredNum.toString(), delta: '+0%', positive: true, icon: CheckCircle2 },
          { label: 'RTO Rate', value: `${rtoRate}%`, delta: '0%', positive: false, icon: RotateCcw },
          { label: 'Active Issues', value: activeIssuesNum.toString(), delta: '0%', positive: false, icon: AlertCircle },
          { label: 'Active Pickups', value: activePickupsNum.toString(), delta: '+0%', positive: true, icon: ArrowUpRight },
        ]);

        // Build Activity Feed
        const rawFeed: any[] = [];
        if (recentOrders) {
          recentOrders.forEach((o: any) => {
            rawFeed.push({
              text: `Order created for ${o.customer_name}`,
              date: new Date(o.created_at),
              icon: Package,
              iconBg: 'bg-orange-50 dark:bg-[#f37a2a]/10 text-[#f37a2a]'
            });
          });
        }
        if (recentExceptions) {
          recentExceptions.forEach((e: any) => {
            rawFeed.push({
              text: `Delivery Exception for AWB ${e.awb}: ${e.reason}`,
              date: new Date(e.created_at),
              icon: AlertTriangle,
              iconBg: 'bg-red-50 dark:bg-red-950/20 text-red-500'
            });
          });
        }
        rawFeed.sort((a, b) => b.date.getTime() - a.date.getTime());
        setActivityFeed(rawFeed.slice(0, 5).map(item => ({
          text: item.text,
          time: formatTime(item.date),
          icon: item.icon,
          iconBg: item.iconBg
        })));

        // Build Network Status
        if (couriersData) {
          setNetworkStatus(couriersData.map((c: any) => ({
            label: c.name,
            value: Math.round(Number(c.uptime)),
            total: 100
          })));
        }

        // Build Alerts
        if (recentExceptions) {
          setAlerts(recentExceptions.map((e: any) => ({
            id: e.awb,
            text: `AWB ${e.awb} requires attention: ${e.reason}`,
            time: formatTime(new Date(e.created_at))
          })));
        }

      } catch (err) {
        console.error("Error loading dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleSchedulePickup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientData) {
      toast.error("Profile not loaded yet.");
      return;
    }
    setSubmittingPickup(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from('pickups').insert({
        client_id: clientData.id,
        warehouse_location: warehouseLocation,
        number_of_packages: numberOfPackages,
        status: 'Pending',
      });

      if (error) {
        toast.error(error.message || "Failed to schedule pickup.");
        return;
      }

      toast.success("Pickup scheduled successfully!");
      setPickupOpen(false);
      
      // Refresh to reflect new pickup
      if (typeof window !== 'undefined') {
        window.location.reload();
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setSubmittingPickup(false);
    }
  };

  return (
    <div className="w-full max-w-full space-y-8 overflow-x-hidden relative pb-20 pt-6">
      {/* Hero Section */}
      <div className="space-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-extrabold text-[#111827] dark:text-white sm:text-5xl">
            Welcome back{clientData?.name ? `, ${clientData.name}` : ''}
          </h1>
          <p className="max-w-[24rem] text-base font-medium text-[#64748b] dark:text-[#94a3b8] sm:text-lg">
            Ready to process your shipments
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <CreateOrderDialog>
            <button className="flex items-center gap-2 rounded-lg bg-[#f37a2a] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e06716]">
              <Plus className="h-4 w-4" />
              Create Order
            </button>
          </CreateOrderDialog>

          <Dialog open={pickupOpen} onOpenChange={setPickupOpen}>
            <DialogTrigger asChild>
              <button className="rounded-lg bg-white dark:bg-[#1e212b] px-4 py-2 text-sm font-semibold text-[#1f2937] dark:text-[#ededdf] shadow-sm hover:bg-gray-50 dark:hover:bg-[#2a2e3d] border border-[#d1d5db] dark:border-[#2a2e3d]">
                Create Pickup
              </button>
            </DialogTrigger>
            <DialogContent className="bg-white dark:bg-[#1e212b] border-[#e8e5d7] dark:border-[#2a2e3d]">
              <DialogHeader>
                <DialogTitle className="text-black dark:text-white">Schedule Pickup</DialogTitle>
                <DialogDescription>Request a courier to pick up packages from your warehouse.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSchedulePickup} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label className="text-[#475569] dark:text-[#94a3b8]">Warehouse Location</Label>
                  <Select value={warehouseLocation} onValueChange={setWarehouseLocation}>
                    <SelectTrigger className="bg-[#f8f9fa] dark:bg-[#16181d] border-[#dddacb] dark:border-[#2a2e3d] text-black dark:text-white">
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-[#1e212b] border-[#e8e5d7] dark:border-[#2a2e3d] text-black dark:text-white">
                      <SelectItem value="w1">Primary Warehouse (Delhi)</SelectItem>
                      <SelectItem value="w2">Secondary Hub (Mumbai)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[#475569] dark:text-[#94a3b8]">Number of Packages</Label>
                  <Input 
                    type="number" 
                    min="1" 
                    value={numberOfPackages} 
                    onChange={(e) => setNumberOfPackages(Number(e.target.value))} 
                    required 
                    className="bg-[#f8f9fa] dark:bg-[#16181d] border-[#dddacb] dark:border-[#2a2e3d] text-black dark:text-white"
                  />
                </div>
                <Button type="submit" disabled={submittingPickup} className="w-full bg-[#f37a2a] hover:bg-[#e06716] text-white">
                  {submittingPickup ? 'Scheduling...' : 'Schedule Now'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" className="text-[#1f2937] dark:text-[#ededdf] hover:bg-gray-100 dark:hover:bg-[#2a2e3d]" onClick={() => toast.info("Reports module is generating data.")}>
            View Reports
          </Button>
        </div>
      </div>

      {/* Status Cards Grid */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-6">
        {kpis.map((card) => (
          <article key={card.label} className="rounded-2xl bg-white dark:bg-[#1e212b] p-5 shadow-sm border border-transparent dark:border-[#2a2e3d]">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8]">{card.label}</p>
              <div className="rounded-lg bg-[#fff4ed] dark:bg-[#f37a2a]/10 p-1.5 text-[#f37a2a]">
                <card.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-[28px] font-bold leading-none text-[#111827] dark:text-white">
              {loading ? '...' : card.value}
            </p>
            <div className="mt-3 flex items-center gap-1 text-[13px] font-semibold text-[#f37a2a]">
              {card.delta.startsWith('+') ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {card.delta}
            </div>
          </article>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid w-full min-w-0 grid-cols-1 items-stretch gap-4 sm:gap-6 lg:grid-cols-12">
        {/* Activity Feed - col-span-5 */}
        <div className="h-full lg:col-span-5">
          <article className="rounded-2xl bg-white dark:bg-[#1e212b] p-6 shadow-sm border border-transparent dark:border-[#2a2e3d] h-full">
            <h2 className="text-[15px] font-bold text-[#111827] dark:text-white">Activity Feed</h2>
            <div className="mt-6 space-y-6">
              {loading ? (
                <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">Loading activity...</p>
              ) : activityFeed.length > 0 ? (
                activityFeed.map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${item.iconBg}`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-[#1f2937] dark:text-[#e2e8f0]">{item.text}</p>
                      <p className="mt-1 text-[13px] text-[#64748b] dark:text-[#94a3b8]">{item.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">No recent activity.</p>
              )}
            </div>
          </article>
        </div>

        {/* Network Status - col-span-3 */}
        <div className="h-full lg:col-span-3">
          <article className="rounded-2xl bg-white dark:bg-[#1e212b] p-6 shadow-sm border border-transparent dark:border-[#2a2e3d] h-full">
            <h2 className="text-[15px] font-bold uppercase tracking-wide text-[#111827] dark:text-white">Network Status</h2>
            <div className="mt-8 space-y-6">
              {loading ? (
                <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">Loading status...</p>
              ) : networkStatus.length > 0 ? (
                networkStatus.map((metric) => {
                  const ratio = (metric.value / metric.total) * 100;
                  return (
                    <div key={metric.label} className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-[#64748b] dark:text-[#94a3b8]">{metric.label}</span>
                        <span className="font-semibold text-[#111827] dark:text-white">
                          {metric.value.toLocaleString()}/{metric.total.toLocaleString()}% Uptime
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#f4f2e8] dark:bg-[#2a2e3d] rounded-full overflow-hidden">
                        <div className="h-full bg-[#f37a2a]" style={{ width: `${ratio}%` }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">No network data available.</p>
              )}
            </div>
          </article>
        </div>

        {/* Alerts - col-span-4 */}
        <div className="h-full lg:col-span-4">
          <article className="rounded-2xl bg-white dark:bg-[#1e212b] p-6 shadow-sm border border-transparent dark:border-[#2a2e3d] h-full">
            <h2 className="text-[15px] font-bold text-[#111827] dark:text-white">Alerts</h2>
            <div className="mt-6 space-y-4">
              {loading ? (
                <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">Loading alerts...</p>
              ) : alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div key={alert.id} className="flex gap-3 items-start p-3 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-300 text-xs">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                    <div>
                      <p className="font-medium">{alert.text}</p>
                      <p className="mt-1 text-[10px] text-[#64748b] dark:text-gray-400">{alert.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">No active alerts at this time.</p>
              )}
            </div>
          </article>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <button className="fixed bottom-6 right-6 grid h-14 w-14 place-items-center rounded-full bg-[#292F54] text-white shadow-lg transition hover:bg-[#1f2441] z-50">
            <MessageCircle className="h-6 w-6" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#1e212b] border-[#e8e5d7] dark:border-[#2a2e3d]">
          <DialogHeader>
            <DialogTitle className="text-black dark:text-white">Support Chat</DialogTitle>
            <DialogDescription>How can we help you today?</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4 min-h-[200px] justify-between">
            <p className="text-sm text-muted-foreground text-center mt-10">An agent will connect shortly...</p>
            <div className="flex gap-2">
              <Input placeholder="Type a message..." className="bg-[#f8f9fa] dark:bg-[#16181d] text-black dark:text-white" />
              <Button type="submit" size="sm" className="bg-[#f37a2a] hover:bg-[#e06716] text-white">Send</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
