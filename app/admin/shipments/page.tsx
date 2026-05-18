import { Search, Filter, MoreHorizontal, MapPin } from "lucide-react";
import { ComingSoonDialog } from "@/components/coming-soon-dialog";

export default function GlobalShipmentsPage() {
  return (
    <div className="space-y-4 w-full mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Global Shipments</h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
          Monitor and search across all cross-tenant shipment activities.
        </p>
      </div>

      <div className="bg-white dark:bg-[#1e212b] rounded-xl border border-gray-200 dark:border-[#2a2e3d] shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-[#2a2e3d] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 dark:bg-[#2a2e3d] text-[#111827] dark:text-white">
              All Statuses
            </button>
            <ComingSoonDialog title="Status Filters" type="action">
              <button className="px-3 py-1.5 rounded-md text-sm font-medium text-[#64748b] dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#2a2e3d]/50">
                In Transit
              </button>
            </ComingSoonDialog>
            <ComingSoonDialog title="Status Filters" type="action">
              <button className="px-3 py-1.5 rounded-md text-sm font-medium text-[#64748b] dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#2a2e3d]/50">
                Delivered
              </button>
            </ComingSoonDialog>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search AWB..."
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

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-[#16181d]/50 text-xs font-semibold text-[#64748b] dark:text-[#94a3b8] uppercase tracking-wider border-b border-gray-200 dark:border-[#2a2e3d]">
                <th className="px-6 py-4">AWB Number</th>
                <th className="px-6 py-4">Tenant</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Courier</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#2a2e3d]">
              {/* Skeletons to mock loading state */}
              {[...Array(6)].map((_, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-[#2a2e3d]/30 transition-colors animate-pulse">
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-[#2a2e3d] rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-100 dark:bg-[#2a2e3d]/50 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-[#2a2e3d] rounded w-32"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-gray-200 dark:bg-[#2a2e3d] rounded-full"></div>
                      <div className="h-3 bg-gray-200 dark:bg-[#2a2e3d] rounded w-12"></div>
                      <div className="h-px bg-gray-300 dark:bg-gray-600 w-4"></div>
                      <div className="h-3 bg-gray-200 dark:bg-[#2a2e3d] rounded w-12"></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-[#2a2e3d] rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 bg-gray-200 dark:bg-[#2a2e3d] rounded-full w-20"></div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <ComingSoonDialog title="Shipment Actions" type="action">
                      <button className="p-1 text-[#64748b] hover:text-[#111827] dark:text-[#94a3b8] dark:hover:text-white transition-colors">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </ComingSoonDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
