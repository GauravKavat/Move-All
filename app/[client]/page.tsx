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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const KPI_CARDS = [
  { label: 'Total Orders', value: '0', delta: '0%', positive: true, icon: Package },
  { label: 'Shipped', value: '0', delta: '0%', positive: true, icon: Truck },
  { label: 'Delivered', value: '0', delta: '0%', positive: true, icon: CheckCircle2 },
  { label: 'RTO Rate', value: '0%', delta: '0%', positive: false, icon: RotateCcw },
  { label: 'Active Issues', value: '0', delta: '0%', positive: false, icon: AlertCircle },
  { label: 'Active Pickups', value: '0', delta: '0%', positive: true, icon: ArrowUpRight },
];

const ACTIVITY_FEED: any[] = [];
const NETWORK_STATUS: any[] = [];

export default function ClientDashboardPage() {
  const handleSubmit = (e: React.FormEvent, type: string) => {
    e.preventDefault();
    toast.success(`${type} request submitted successfully.`);
  };

  return (
    <div className="w-full max-w-full space-y-8 overflow-x-hidden relative pb-20 pt-6">
      {/* Hero Section */}
      <div className="space-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-extrabold text-[#111827] dark:text-white sm:text-5xl">
            Welcome back
          </h1>
          <p className="max-w-[24rem] text-base font-medium text-[#64748b] dark:text-[#94a3b8] sm:text-lg">
            Ready to process your shipments
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg bg-[#f37a2a] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#e06716]">
                <Plus className="h-4 w-4" />
                Create Order
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Order</DialogTitle>
                <DialogDescription>Enter the details to create a new shipment order.</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => handleSubmit(e, "Order")} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <Input placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                  <Label>Destination Pincode</Label>
                  <Input placeholder="110001" required />
                </div>
                <Button type="submit" className="w-full bg-[#f37a2a] hover:bg-[#e06716] text-white">Submit Order</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <button className="rounded-lg bg-white dark:bg-[#1e212b] px-4 py-2 text-sm font-semibold text-[#1f2937] dark:text-[#ededdf] shadow-sm hover:bg-gray-50 dark:hover:bg-[#2a2e3d] border border-[#d1d5db] dark:border-[#2a2e3d]">
                Create Pickup
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Pickup</DialogTitle>
                <DialogDescription>Request a courier to pick up packages from your warehouse.</DialogDescription>
              </DialogHeader>
              <form onSubmit={(e) => handleSubmit(e, "Pickup")} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Warehouse Location</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="w1">Primary Warehouse (Delhi)</SelectItem>
                      <SelectItem value="w2">Secondary Hub (Mumbai)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Number of Packages</Label>
                  <Input type="number" min="1" defaultValue="1" required />
                </div>
                <Button type="submit" className="w-full bg-[#f37a2a] hover:bg-[#e06716] text-white">Schedule Now</Button>
              </form>
            </DialogContent>
          </Dialog>

          <Button variant="ghost" onClick={() => toast.info("Reports module is generating data.")}>
            View Reports
          </Button>
        </div>
      </div>

      {/* Status Cards Grid */}
      <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-6">
        {KPI_CARDS.map((card) => (
          <article key={card.label} className="rounded-2xl bg-white dark:bg-[#1e212b] p-5 shadow-sm border border-transparent dark:border-[#2a2e3d]">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#64748b] dark:text-[#94a3b8]">{card.label}</p>
              <div className="rounded-lg bg-[#fff4ed] dark:bg-[#f37a2a]/10 p-1.5 text-[#f37a2a]">
                <card.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-4 text-[28px] font-bold leading-none text-[#111827] dark:text-white">{card.value}</p>
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
              {ACTIVITY_FEED.length > 0 ? ACTIVITY_FEED.map((item) => (
                <div key={item.text} className="flex gap-4">
                  <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${item.iconBg}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#1f2937] dark:text-[#e2e8f0]">{item.text}</p>
                    <p className="mt-1 text-[13px] text-[#64748b] dark:text-[#94a3b8]">{item.time}</p>
                  </div>
                </div>
              )) : (
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
              {NETWORK_STATUS.length > 0 ? NETWORK_STATUS.map((metric) => {
                const ratio = (metric.value / metric.total) * 100;
                return (
                  <div key={metric.label} className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-[#64748b] dark:text-[#94a3b8]">{metric.label}</span>
                      <span className="font-semibold text-[#111827] dark:text-white">
                        {metric.value.toLocaleString()}/{metric.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#f4f2e8] dark:bg-[#2a2e3d] rounded-full overflow-hidden">
                      <div className="h-full bg-[#f37a2a]" style={{ width: `${ratio}%` }} />
                    </div>
                  </div>
                );
              }) : (
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
              <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">No active alerts at this time.</p>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Support Chat</DialogTitle>
            <DialogDescription>How can we help you today?</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4 min-h-[200px] justify-between">
            <p className="text-sm text-muted-foreground text-center mt-10">An agent will connect shortly...</p>
            <div className="flex gap-2">
              <Input placeholder="Type a message..." />
              <Button type="submit" size="sm">Send</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
