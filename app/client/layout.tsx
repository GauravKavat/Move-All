'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  Package,
  MapPin,
  Truck,
  AlertTriangle,
  RotateCcw,
  Users,
  BarChart3,
  Receipt,
  Settings,
  Search,
} from 'lucide-react';
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from 'react';
import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler';

type ClientTab = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const CLIENT_TABS: ClientTab[] = [
  { label: 'Dashboard', href: '/client', icon: LayoutDashboard },
  { label: 'Orders', href: '/client/orders', icon: Package },
  { label: 'Pickups', href: '/client/pickups', icon: MapPin },
  { label: 'Shipments', href: '/client/shipments', icon: Truck },
  { label: 'Exceptions', href: '/client/exceptions', icon: AlertTriangle },
  { label: 'RTO', href: '/client/rto', icon: RotateCcw },
  { label: 'Couriers', href: '/client/couriers', icon: Users },
  { label: 'Analytics', href: '/client/analytics', icon: BarChart3 },
  { label: 'Billing', href: '/client/billing', icon: Receipt },
  { label: 'Settings', href: '/client/settings', icon: Settings },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [query, setQuery] = useState('');
  const [darkMode] = useState(false);

  const activeTab = useMemo(
    () => CLIENT_TABS.find((tab) => pathname === tab.href) ?? CLIENT_TABS[0],
    [pathname]
  );

  return (
    <div className="min-h-screen bg-[#f4f2ea] dark:bg-[#16181d] text-[#292F54] dark:text-[#ededdf]">
      <header className="sticky top-0 z-50 bg-white dark:bg-[#1e212b]">
        <div className="flex w-full items-center gap-6 border-b border-gray-200 dark:border-[#2a2e3d] px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#292F54] dark:bg-[#2b3358] text-base font-extrabold text-white">
              M
            </span>
            <div>
              <p className="text-[15px] font-bold leading-tight text-[#111827] dark:text-white">Move All</p>
              <p className="text-xs font-medium text-[#64748b] dark:text-[#94a3b8]">Logistics</p>
            </div>
          </div>

          <div className="relative hidden flex-1 lg:block ml-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] dark:text-[#64748b]" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search orders, shipments, pickups, RTO, exceptions, couriers..."
              className="h-11 w-full rounded-lg border-none bg-[#f3f4f6] dark:bg-[#16181d] pl-10 pr-4 text-sm text-[#1f2937] dark:text-white outline-none transition focus-visible:ring-2 focus-visible:ring-[#f37a2a]/20"
            />
          </div>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative rounded-xl p-2.5 text-[#292F54] dark:text-[#ededdf] transition hover:bg-gray-50 dark:hover:bg-[#2a2e3d]"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#f37a2a]" />
                </button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Notifications</SheetTitle>
                  <SheetDescription>You have 3 unread messages.</SheetDescription>
                </SheetHeader>
                <div className="mt-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-1 border-b pb-4">
                    <span className="text-sm font-semibold">New Exception: ORD-004</span>
                    <span className="text-xs text-muted-foreground">Address not found. Please update.</span>
                  </div>
                  <div className="flex flex-col gap-1 border-b pb-4">
                    <span className="text-sm font-semibold">Pickup Scheduled</span>
                    <span className="text-xs text-muted-foreground">Driver assigned for today 3:00 PM.</span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <ThemeTogglerButton
              variant="ghost"
              className="rounded-xl p-2.5 text-[#292F54] dark:text-[#ededdf] transition hover:bg-gray-50 dark:hover:bg-[#2a2e3d] hover:text-[#292F54] dark:hover:text-[#ededdf] [&_svg]:h-4 [&_svg]:w-4 h-auto w-auto min-w-0"
            />
            <Link
              href="/client/settings"
              className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-[#292F54] dark:text-[#ededdf] transition hover:bg-gray-50 dark:hover:bg-[#2a2e3d]"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#e4e4e7] dark:bg-[#2a2e3d] text-[11px] font-bold text-[#1f2937] dark:text-[#ededdf]">
                TU
              </span>
              <span className="hidden text-xs font-semibold text-[#111827] dark:text-white md:inline">Test</span>
            </Link>
          </div>
        </div>

        <div className="border-b border-[#e5e7eb] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b]">
          <nav className="flex w-full justify-between items-end overflow-x-auto">
            {CLIENT_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab.href === tab.href;

              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`group relative inline-flex flex-1 min-w-[120px] whitespace-nowrap items-center justify-center gap-2 px-3 py-4 text-sm transition ${
                    isActive ? 'font-semibold text-[#111827] dark:text-white' : 'font-medium text-[#64748b] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  <span
                    className={`absolute inset-x-0 bottom-0 h-[3px] bg-[#f37a2a] transition ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="w-full px-4 py-5 sm:px-6 lg:px-8 lg:py-7">{children}</main>
      <span className="sr-only">Theme state: {darkMode ? 'dark' : 'light'}</span>
    </div>
  );
}
