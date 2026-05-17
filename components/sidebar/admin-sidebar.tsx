'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/logo';

const NAV_ITEMS = [
  { href: '/admin',          label: 'Hypervisor',     icon: '⬡', description: 'Cross-tenant aggregation', danger: false },
  { href: '/admin/tenants',  label: 'Tenants',        icon: '◈', description: 'Provisioning & allocation', danger: false },
  { href: '/admin/couriers', label: 'Couriers',       icon: '◉', description: '3PL orchestration wall',   danger: false },
  { href: '/admin/data',     label: 'Data Pipelines', icon: '⟳', description: 'Ingestion telemetry',      danger: false },
  { href: '/admin/access',   label: 'Access / RBAC',  icon: '⚿', description: 'Security audit engine',   danger: true  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-black border-r border-white/10 flex flex-col z-40">
      <div className="h-16 flex items-center px-5 border-b border-white/10 flex-shrink-0">
        <div className="flex flex-col">
          <Logo size="sm" />
          <span className="text-[8px] font-mono text-red-400/80 tracking-widest uppercase mt-0.5 px-0.5">
            ⚠ ADMIN COMMAND ENGINE
          </span>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
        <div className="bg-[#292F54]/40 rounded-lg px-3 py-2 space-y-1.5">
          <p className="text-[10px] font-mono text-[#EDEDDF]/40 uppercase tracking-widest">
            Global System State
          </p>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-emerald-400 font-mono">All Pipelines Nominal</span>
          </div>
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-[#EDEDDF]/30">Active Tenants</span>
            <span className="text-white font-bold">1,842</span>
          </div>
          <div className="flex justify-between text-[10px] font-mono">
            <span className="text-[#EDEDDF]/30">Throughput</span>
            <span className="text-[#f37a2a] font-bold">18,311/min</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group ${
                isActive
                  ? item.danger
                    ? 'bg-red-500/10 border border-red-500/30 text-white'
                    : 'bg-[#f37a2a]/15 border border-[#f37a2a]/30 text-white'
                  : 'text-[#EDEDDF]/50 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span
                className={`text-base transition-colors ${
                  isActive
                    ? item.danger
                      ? 'text-red-400'
                      : 'text-[#f37a2a]'
                    : 'group-hover:text-[#f37a2a]'
                }`}
              >
                {item.icon}
              </span>
              <div>
                <p className="text-xs font-bold font-mono tracking-wide">{item.label}</p>
                <p className="text-[10px] text-[#EDEDDF]/30 font-mono">{item.description}</p>
              </div>
              {isActive && (
                <div
                  className={`ml-auto w-1 h-4 rounded-full ${
                    item.danger ? 'bg-red-400' : 'bg-[#f37a2a]'
                  }`}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-red-500/20 flex-shrink-0">
        <p className="text-[9px] font-mono text-red-400/40 text-center">
          RESTRICTED SYSTEM · AUTHORIZED ACCESS ONLY
        </p>
      </div>
    </aside>
  );
}
