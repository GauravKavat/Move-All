'use client';

import { Bell, Search } from 'lucide-react';
import { useState } from 'react';
import { ThemeTogglerButton } from '@/components/animate-ui/components/buttons/theme-toggler';
import { ComingSoonDialog } from '@/components/coming-soon-dialog';
import Link from 'next/link';

export function AdminHeader() {
  const [query, setQuery] = useState('');

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#1e212b] border-b border-gray-200 dark:border-[#2a2e3d]">
      <div className="flex h-16 w-full items-center gap-6 px-4 sm:px-6 lg:px-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8] dark:text-[#64748b]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search clients, shipments, escalations..."
              className="h-10 w-full rounded-lg border-none bg-[#f3f4f6] dark:bg-[#16181d] pl-10 pr-4 text-sm text-[#1f2937] dark:text-white outline-none transition focus:ring-2 focus:ring-[#f37a2a]/20"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <ComingSoonDialog title="Admin Notifications" type="action">
            <button
              type="button"
              aria-label="Notifications"
              className="relative rounded-xl p-2.5 text-[#292F54] dark:text-[#ededdf] transition hover:bg-gray-50 dark:hover:bg-[#2a2e3d]"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>
          </ComingSoonDialog>
          <ThemeTogglerButton
            variant="ghost"
            className="rounded-xl p-2.5 text-[#292F54] dark:text-[#ededdf] transition hover:bg-gray-50 dark:hover:bg-[#2a2e3d] hover:text-[#292F54] dark:hover:text-[#ededdf] [&_svg]:h-4 [&_svg]:w-4 h-auto w-auto min-w-0"
          />
          <Link
            href="/admin/settings"
            className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-[#292F54] dark:text-[#ededdf] transition hover:bg-gray-50 dark:hover:bg-[#2a2e3d]"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f37a2a] text-[11px] font-bold text-white">
              AD
            </span>
            <div className="hidden flex-col items-start md:flex">
              <span className="text-xs font-semibold leading-none text-[#111827] dark:text-white">Admin</span>
              <span className="text-[10px] text-[#64748b] mt-1">Superuser</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
