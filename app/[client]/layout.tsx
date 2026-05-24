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
import { NotificationDrawer } from "@/components/drawer-right-5";
import { Input } from "@/components/ui/input";
import { useMemo, useState, useEffect, use } from 'react';
import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler';
import { createClient } from "@/lib/client";

type ClientTab = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const getClientTabs = (client: string): ClientTab[] => [
  { label: 'Dashboard', href: `/${client}`, icon: LayoutDashboard },
  { label: 'Orders', href: `/${client}/orders`, icon: Package },
  { label: 'Pickups', href: `/${client}/pickups`, icon: MapPin },
  { label: 'Shipments', href: `/${client}/shipments`, icon: Truck },
  { label: 'Exceptions', href: `/${client}/exceptions`, icon: AlertTriangle },
  { label: 'RTO', href: `/${client}/rto`, icon: RotateCcw },
  { label: 'Couriers', href: `/${client}/couriers`, icon: Users },
  { label: 'Analytics', href: `/${client}/analytics`, icon: BarChart3 },
  { label: 'Billing', href: `/${client}/billing`, icon: Receipt },
  { label: 'Settings', href: `/${client}/settings`, icon: Settings },
];

export default function ClientLayout({ children, params }: { children: React.ReactNode, params: Promise<{ client: string }> }) {
  const pathname = usePathname();
  const { client } = use(params);
  const clientTabs = useMemo(() => getClientTabs(client), [client]);
  const [query, setQuery] = useState('');
  const [darkMode] = useState(false);
  const [initials, setInitials] = useState('U');
  const [displayName, setDisplayName] = useState('User');
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (user.user_metadata?.full_name) {
          const fullName = user.user_metadata.full_name.trim();
          const parts = fullName.split(/\s+/);
          
          if (parts.length === 1) {
            setInitials(parts[0][0].toUpperCase());
            setDisplayName(parts[0]);
          } else {
            const first = parts[0];
            const last = parts[parts.length - 1];
            const middle = parts.slice(1, -1);
            
            setInitials(`${first[0]}${last[0]}`.toUpperCase());
            
            let formattedName = `${first[0].toUpperCase()}.`;
            if (middle.length > 0) {
              formattedName += ` ${middle.map((m: string) => m[0].toUpperCase() + '.').join(' ')}`;
            }
            formattedName += ` ${last.charAt(0).toUpperCase() + last.slice(1)}`;
            
            setDisplayName(formattedName);
          }
        }

        // Fetch client and wallet balance
        const { data: clientData, error: clientErr } = await supabase
          .from('clients')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (clientErr) {
          console.error("Error fetching client profile:", clientErr);
          if (clientErr.code === 'PGRST205' || (clientErr.message && clientErr.message.includes('Could not find the table'))) {
            toast.error("Database tables missing! Please run database_schema.sql in your Supabase SQL Editor.", {
              id: 'db-missing-warning',
              duration: 15000
            });
          }
        } else if (clientData) {
          const { data: walletData, error: walletErr } = await supabase
            .from('wallets')
            .select('balance')
            .eq('client_id', clientData.id)
            .maybeSingle();

          if (walletErr) {
            console.error("Error fetching wallet:", walletErr);
          } else if (walletData) {
            setWalletBalance(Number(walletData.balance));
          }
        }
      }
    }
    loadUser();
  }, []);

  const activeTab = useMemo(
    () => clientTabs.find((tab) => pathname === tab.href) ?? clientTabs[0],
    [pathname, clientTabs]
  );

  return (
    <div className="min-h-screen bg-[#f4f2ea] dark:bg-[#16181d] text-[#292F54] dark:text-[#ededdf]">
      <header className="sticky top-0 z-50 bg-white dark:bg-[#1e212b]">
        <div className="flex w-full items-center gap-6 border-b border-gray-200 dark:border-[#2a2e3d] px-4 py-3 sm:px-6 lg:px-8">
          <Link href={`/${client}`} className="flex items-center gap-3">
            <img src="/moveall-for-light-theme.png" alt="Move All Logistics" className="h-10 w-auto object-contain dark:hidden" />
            <img src="/moveall-for-dark-theme.png" alt="Move All Logistics" className="hidden dark:block h-10 w-auto object-contain" />
          </Link>

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
            <NotificationDrawer />
            <ThemeTogglerButton
              variant="ghost"
              className="rounded-xl p-2.5 text-[#292F54] dark:text-[#ededdf] transition hover:bg-gray-50 dark:hover:bg-[#2a2e3d] hover:text-[#292F54] dark:hover:text-[#ededdf] [&_svg]:h-4 [&_svg]:w-4 h-auto w-auto min-w-0"
            />
            <Link
              href={`/${client}/billing`}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-bold transition-all hover:scale-105 ${
                (walletBalance ?? 0) < 0 
                  ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 text-rose-700 dark:text-rose-400 hover:bg-rose-100/50' 
                  : (walletBalance ?? 0) < 500 
                  ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 hover:bg-amber-100/50' 
                  : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/50'
              }`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  (walletBalance ?? 0) < 0 ? 'bg-rose-400' : (walletBalance ?? 0) < 500 ? 'bg-amber-400' : 'bg-emerald-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                  (walletBalance ?? 0) < 0 ? 'bg-rose-500' : (walletBalance ?? 0) < 500 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}></span>
              </span>
              <span>₹{(walletBalance ?? 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </Link>
            <Link
              href={`/${client}/settings`}
              className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-[#292F54] dark:text-[#ededdf] transition hover:bg-gray-50 dark:hover:bg-[#2a2e3d]"
            >
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#e4e4e7] dark:bg-[#2a2e3d] text-[11px] font-bold text-[#1f2937] dark:text-[#ededdf]">
                {initials}
              </span>
              <span className="hidden text-xs font-semibold text-[#111827] dark:text-white md:inline">{displayName}</span>
            </Link>
          </div>
        </div>

        <div className="border-b border-[#e5e7eb] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b]">
          <nav className="flex w-full justify-between items-end overflow-x-auto">
            {clientTabs.map((tab) => {
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
