'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Package, Truck, BarChart3, Download, Settings, FileText } from 'lucide-react';

export type FeatureType = 'order' | 'pickup' | 'reports' | 'export' | 'action' | 'profile' | 'support';

interface ComingSoonDialogProps {
  children: React.ReactNode;
  title: string;
  type: FeatureType;
}

export function ComingSoonDialog({ children, title, type }: ComingSoonDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-[#1e212b] border-[#e8e5d7] dark:border-[#2a2e3d]">
        <DialogHeader>
          <DialogTitle className="text-[#111827] dark:text-white flex items-center gap-2">
            {type === 'order' && <Package className="h-5 w-5 text-[#f37a2a]" />}
            {type === 'pickup' && <Truck className="h-5 w-5 text-[#f37a2a]" />}
            {type === 'reports' && <BarChart3 className="h-5 w-5 text-[#f37a2a]" />}
            {type === 'export' && <Download className="h-5 w-5 text-[#f37a2a]" />}
            {type === 'action' && <FileText className="h-5 w-5 text-[#f37a2a]" />}
            {type === 'profile' && <Settings className="h-5 w-5 text-[#f37a2a]" />}
            {title}
          </DialogTitle>
          <DialogDescription className="text-[#64748b] dark:text-[#94a3b8]">
            This feature is currently under active development. Here's a sneak peek of what's coming soon.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {type === 'order' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-[#2a2e3d]" />
                  <Skeleton className="h-10 w-full rounded-lg bg-gray-100 dark:bg-[#16181d]" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-gray-200 dark:bg-[#2a2e3d]" />
                  <Skeleton className="h-10 w-full rounded-lg bg-gray-100 dark:bg-[#16181d]" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-[#2a2e3d]" />
                <Skeleton className="h-24 w-full rounded-lg bg-gray-100 dark:bg-[#16181d]" />
              </div>
              <Skeleton className="h-10 w-full rounded-lg bg-[#f37a2a]/20 dark:bg-[#f37a2a]/20" />
            </div>
          )}

          {type === 'pickup' && (
            <div className="space-y-4">
              <Skeleton className="h-[200px] w-full rounded-xl bg-gray-100 dark:bg-[#16181d]" />
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 bg-gray-200 dark:bg-[#2a2e3d]" />
                  <Skeleton className="h-4 w-48 bg-gray-100 dark:bg-[#16181d]" />
                </div>
                <Skeleton className="h-10 w-24 rounded-lg bg-[#f37a2a]/20" />
              </div>
            </div>
          )}

          {type === 'reports' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-20 flex-1 rounded-xl bg-gray-100 dark:bg-[#16181d]" />
                <Skeleton className="h-20 flex-1 rounded-xl bg-gray-100 dark:bg-[#16181d]" />
                <Skeleton className="h-20 flex-1 rounded-xl bg-gray-100 dark:bg-[#16181d]" />
              </div>
              <Skeleton className="h-[150px] w-full rounded-xl bg-gray-100 dark:bg-[#16181d]" />
            </div>
          )}

          {type === 'export' && (
            <div className="space-y-4 flex flex-col items-center justify-center py-6">
              <Skeleton className="h-16 w-16 rounded-full bg-gray-100 dark:bg-[#16181d]" />
              <Skeleton className="h-4 w-48 bg-gray-200 dark:bg-[#2a2e3d]" />
              <Skeleton className="h-2 w-32 bg-gray-100 dark:bg-[#16181d]" />
              <Skeleton className="mt-4 h-10 w-full max-w-[200px] rounded-lg bg-[#f37a2a]/20" />
            </div>
          )}

          {(type === 'action' || type === 'support') && (
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <Skeleton className="h-10 w-10 shrink-0 rounded-full bg-gray-200 dark:bg-[#2a2e3d]" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-[#2a2e3d]" />
                  <Skeleton className="h-20 w-full rounded-lg bg-gray-100 dark:bg-[#16181d]" />
                </div>
              </div>
            </div>
          )}

          {type === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full bg-gray-200 dark:bg-[#2a2e3d]" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32 bg-gray-200 dark:bg-[#2a2e3d]" />
                  <Skeleton className="h-4 w-24 bg-gray-100 dark:bg-[#16181d]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Skeleton className="h-10 w-full rounded-lg bg-gray-100 dark:bg-[#16181d]" />
                <Skeleton className="h-10 w-full rounded-lg bg-gray-100 dark:bg-[#16181d]" />
                <Skeleton className="h-10 w-full rounded-lg bg-gray-100 dark:bg-[#16181d]" />
                <Skeleton className="h-10 w-full rounded-lg bg-gray-100 dark:bg-[#16181d]" />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
