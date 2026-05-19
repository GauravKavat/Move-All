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
  { label: 'Total Orders', value: '8542', delta: '+12.5%', positive: true, icon: Package },
  { label: 'Shipped', value: '7823', delta: '+8.3%', positive: true, icon: Truck },
  { label: 'Delivered', value: '7401', delta: '+15.2%', positive: true, icon: CheckCircle2 },
  { label: 'RTO Rate', value: '2.8%', delta: '-0.5%', positive: false, icon: RotateCcw },
  { label: 'Active Issues', value: '47', delta: '-3.2%', positive: false, icon: AlertCircle },
  { label: 'Active Pickups', value: '5', delta: '+5.3%', positive: true, icon: ArrowUpRight },
];

const ACTIVITY_FEED = [
  {
    icon: Package,
    iconBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    text: 'Order ORD-001 delivered to Rajesh Kumar',
    time: '16:30',
  },
  {
    icon: Truck,
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
    text: 'Shipment EKL-789456 out for delivery',
    time: '14:15',
  },
  {
    icon: AlertCircle,
    iconBg: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
    text: 'Exception EXC-001: Address not found',
    time: '12:45',
  },
  {
    icon: Package,
    iconBg: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    text: 'Order ORD-005 confirmed',
    time: '10:20',
  },
  {
    icon: RotateCcw,
    iconBg: 'bg-orange-100 dark:bg-orange-900/40 text-[#f37a2a] dark:text-orange-400',
    text: 'RTO-001 initiated for order ORD-007',
    time: '10:00',
  },
];

const NETWORK_STATUS = [
  { label: 'Active Couriers', value: 47, total: 50 },
  { label: 'Hub Utilization', value: 2847, total: 5000 },
];

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
            Sunday, May 17 • 5 active pickups to manage
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
              {ACTIVITY_FEED.map((item) => (
                <div key={item.text} className="flex gap-4">
                  <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${item.iconBg}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#1f2937] dark:text-[#e2e8f0]">{item.text}</p>
                    <p className="mt-1 text-[13px] text-[#64748b] dark:text-[#94a3b8]">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* Network Status - col-span-3 */}
        <div className="h-full lg:col-span-3">
          <article className="rounded-2xl bg-white dark:bg-[#1e212b] p-6 shadow-sm border border-transparent dark:border-[#2a2e3d] h-full">
            <h2 className="text-[15px] font-bold uppercase tracking-wide text-[#111827] dark:text-white">Network Status</h2>
            <div className="mt-8 space-y-6">
              {NETWORK_STATUS.map((metric) => {
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
              })}
            </div>
          </article>
        </div>

        {/* Alerts - col-span-4 */}
        <div className="h-full lg:col-span-4">
          <article className="rounded-2xl bg-white dark:bg-[#1e212b] p-6 shadow-sm border border-transparent dark:border-[#2a2e3d] h-full">
            <h2 className="text-[15px] font-bold text-[#111827] dark:text-white">Alerts</h2>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-[#fef2f2] dark:bg-red-950/20 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                  <div>
                    <p className="text-[14px] font-medium text-red-800 dark:text-red-300">Address missing for ORD-004. Please verify customer location.</p>
                    <Sheet>
                      <SheetTrigger asChild>
                        <button className="mt-3 rounded-lg border border-gray-200 dark:border-red-900/50 bg-white dark:bg-transparent px-3 py-1.5 text-xs font-semibold text-[#1f2937] dark:text-red-300 shadow-sm hover:bg-gray-50 dark:hover:bg-red-900/30">Take Action</button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Resolve Address Issue</SheetTitle>
                          <SheetDescription>Update the missing address details for ORD-004.</SheetDescription>
                        </SheetHeader>
                        <div className="space-y-4 mt-6">
                          <div className="space-y-2">
                            <Label>Full Address</Label>
                            <Input placeholder="Enter updated address..." />
                          </div>
                          <Button className="w-full bg-[#f37a2a] hover:bg-[#e06716] text-white" onClick={() => toast.success("Address updated!")}>
                            Save & Retry Delivery
                          </Button>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-[#eff6ff] dark:bg-blue-950/20 p-4">
                <div className="flex items-center gap-3">
                  <Info className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                  <p className="text-[14px] font-medium text-blue-800 dark:text-blue-300">AI verified and auto-processed 156 orders</p>
                </div>
              </div>

              <div className="rounded-xl border border-yellow-200 dark:border-yellow-900/50 bg-[#fefce8] dark:bg-yellow-950/20 p-4">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <p className="text-[14px] font-medium text-yellow-800 dark:text-yellow-300">High exception rate (8.2%) from DPL today</p>
                    <Sheet>
                      <SheetTrigger asChild>
                        <button className="mt-3 rounded-lg border border-gray-200 dark:border-yellow-900/50 bg-white dark:bg-transparent px-3 py-1.5 text-xs font-semibold text-[#1f2937] dark:text-yellow-300 shadow-sm hover:bg-gray-50 dark:hover:bg-yellow-900/30">Review Exceptions</button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Exception Overview</SheetTitle>
                          <SheetDescription>Analyzing the high exception rate for DPL courier.</SheetDescription>
                        </SheetHeader>
                        <div className="mt-6 flex flex-col gap-3 text-sm">
                          <p>Most common reason: Customer not available (45%)</p>
                          <p>Affected regions: North (60%)</p>
                          <Button variant="outline" className="mt-4" onClick={() => toast.success("Escalation email sent to Courier Partner.")}>Escalate to Partner</Button>
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </div>
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
