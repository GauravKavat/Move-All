"use client";

import { Bell } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export function NotificationDrawer() {
  return (
  <Drawer direction="right">
    <DrawerTrigger asChild>
      <button
        type="button"
        aria-label="Notifications"
        className="relative rounded-xl p-2.5 text-[#292F54] dark:text-[#ededdf] transition hover:bg-gray-50 dark:hover:bg-[#2a2e3d]"
      >
        <Bell className="h-4 w-4" />
      </button>
    </DrawerTrigger>
    <DrawerContent className="bg-white dark:bg-[#1e212b] border-l border-gray-200 dark:border-[#2a2e3d] text-[#111827] dark:text-white">
      <DrawerHeader className="border-b border-gray-100 dark:border-[#2a2e3d] pb-4">
        <DrawerTitle className="text-[#111827] dark:text-white text-xl font-bold">Notifications</DrawerTitle>
        <DrawerDescription className="text-[#64748b] dark:text-[#94a3b8]">You have 0 unread notifications</DrawerDescription>
      </DrawerHeader>
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-6">
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">No new notifications.</p>
      </div>
      <div className="border-t border-gray-100 dark:border-[#2a2e3d] p-4">
        <DrawerClose asChild>
          <button className="w-full rounded-xl bg-[#f37a2a] hover:bg-[#e06716] text-white font-bold h-11 transition-colors">
            Mark all as read
          </button>
        </DrawerClose>
      </div>
    </DrawerContent>
  </Drawer>
  );
}
