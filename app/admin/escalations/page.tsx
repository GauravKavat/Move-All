import { Filter, Search } from "lucide-react";
import { ComingSoonDialog } from "@/components/coming-soon-dialog";

export default function EscalationsPage() {
  return (
    <div className="space-y-4 w-full mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Escalation Management</h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
          Review and resolve critical exceptions flagged across all tenants.
        </p>
      </div>

      <div className="bg-white dark:bg-[#1e212b] rounded-xl border border-gray-200 dark:border-[#2a2e3d] shadow-sm flex flex-col min-h-[400px] h-[calc(100vh-220px)]">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-[#2a2e3d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-md text-sm font-medium bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400">
              Critical (12)
            </button>
            <ComingSoonDialog title="Status Filters" type="action">
              <button className="px-3 py-1.5 rounded-md text-sm font-medium text-[#64748b] dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#2a2e3d]/50">
                High (45)
              </button>
            </ComingSoonDialog>
            <ComingSoonDialog title="Status Filters" type="action">
              <button className="px-3 py-1.5 rounded-md text-sm font-medium text-[#64748b] dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#2a2e3d]/50">
                Resolved
              </button>
            </ComingSoonDialog>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search escalations..."
                className="pl-9 pr-4 py-1.5 rounded-lg border border-gray-200 dark:border-[#2a2e3d] bg-white dark:bg-[#16181d] text-sm text-[#111827] dark:text-white outline-none focus:ring-2 focus:ring-[#f37a2a]/20 w-full sm:w-64"
              />
            </div>
            <ComingSoonDialog title="Advanced Filters" type="action">
              <button className="p-2 border border-gray-200 dark:border-[#2a2e3d] rounded-lg text-gray-500 hover:bg-gray-50 dark:hover:bg-[#2a2e3d]/50 transition-colors">
                <Filter className="h-4 w-4" />
              </button>
            </ComingSoonDialog>
          </div>
        </div>
        
        <div className="flex-1 p-0 overflow-y-auto">
          {/* Skeleton Loaders for Escalation Feed */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="px-6 py-5 border-b border-gray-100 dark:border-white/5 animate-pulse">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-400 dark:bg-red-500 flex-shrink-0"></div>
                  <div className="h-5 bg-gray-200 dark:bg-[#2a2e3d] rounded w-48"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-[#2a2e3d] rounded w-16"></div>
              </div>
              <div className="ml-5 space-y-2">
                <div className="h-4 bg-gray-100 dark:bg-[#2a2e3d]/60 rounded w-full max-w-2xl"></div>
                <div className="h-4 bg-gray-100 dark:bg-[#2a2e3d]/60 rounded w-3/4 max-w-lg"></div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="h-6 bg-gray-200 dark:bg-[#2a2e3d] rounded-md w-24"></div>
                  <div className="h-6 bg-gray-200 dark:bg-[#2a2e3d] rounded-md w-32"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
