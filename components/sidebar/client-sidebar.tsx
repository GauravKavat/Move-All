'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/logo';

const NAV_ITEMS = [
  { href: '/client',            label: 'Dashboard',  icon: '◈', description: 'Performance matrix'  },
  { href: '/client/orders',     label: 'Orders',     icon: '◉', description: 'Order registry'      },
  { href: '/client/shipments',  label: 'Shipments',  icon: '◎', description: 'AWB telemetry'       },
  { href: '/client/pickups',    label: 'Pickups',    icon: '⬡', description: 'Dispatch control'    },
  { href: '/client/exceptions', label: 'Exceptions', icon: '⚠', description: 'Incident routing'   },
  { href: '/client/rto',        label: 'RTO',        icon: '↩', description: 'Reverse logistics'  },
];

export function ClientSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-60 bg-black border-r border-white/10 flex flex-col z-40">
      <div className="h-16 flex items-center px-5 border-b border-white/10 flex-shrink-0">
        <Logo size="sm" showTagline />
      </div>

      <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
        <div className="bg-[#292F54]/40 rounded-lg px-3 py-2">
          <p className="text-[10px] font-mono text-[#EDEDDF]/40 uppercase tracking-widest">
            Active Context
          </p>
          <p className="text-xs font-bold text-white font-mono truncate mt-0.5">
            Vedic Organic Botanicals
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-mono">Enterprise — Healthy</span>
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
                  ? 'bg-[#f37a2a]/15 border border-[#f37a2a]/30 text-white'
                  : 'text-[#EDEDDF]/50 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span
                className={`text-base transition-colors ${
                  isActive ? 'text-[#f37a2a]' : 'group-hover:text-[#f37a2a]'
                }`}
              >
                {item.icon}
              </span>
              <div>
                <p className="text-xs font-bold font-mono tracking-wide">{item.label}</p>
                <p className="text-[10px] text-[#EDEDDF]/30 font-mono">{item.description}</p>
              </div>
              {isActive && <div className="ml-auto w-1 h-4 rounded-full bg-[#f37a2a]" />}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-3 border-t border-white/10 flex-shrink-0">
        <p className="text-[10px] font-mono text-[#EDEDDF]/20 text-center">
          weMOVE
          <span className="text-[7px] relative -top-[3px] px-[1px] text-[#f37a2a]">it</span>
          ALL v1.0
        </p>
      </div>
    </aside>
  );
}
