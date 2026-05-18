'use client';

import React, { useState } from 'react';
import { AdminSidebar } from '@/components/sidebar/admin-sidebar';
import { AdminHeader } from '@/components/sidebar/admin-header';

export function AdminClientWrapper({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f4f2ea] dark:bg-[#16181d] text-[#292F54] dark:text-[#ededdf]">
      <AdminSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      <div 
        className={`flex-1 min-h-screen flex flex-col overflow-x-hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-20' : 'ml-64'}`}
      >
        <AdminHeader />
        <main className="flex-1 w-full p-4 sm:p-5">{children}</main>
      </div>
    </div>
  );
}
