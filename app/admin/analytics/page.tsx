import { Download } from "lucide-react";
import { ComingSoonDialog } from "@/components/coming-soon-dialog";

export default function GlobalAnalyticsPage() {
  return (
    <div className="space-y-4 w-full mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Global Analytics</h1>
          <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
            Platform-wide telemetry, performance metrics, and financial reporting.
          </p>
        </div>
        <ComingSoonDialog title="Export Data" type="export">
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1e212b] border border-gray-200 dark:border-[#2a2e3d] rounded-lg text-sm font-medium text-[#111827] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2a2e3d]/80 transition-colors">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </ComingSoonDialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chart Skeleton 1 */}
        <div className="bg-white dark:bg-[#1e212b] rounded-xl border border-gray-200 dark:border-[#2a2e3d] shadow-sm p-5 animate-pulse min-h-[300px] flex flex-col">
          <div className="h-5 bg-gray-200 dark:bg-[#2a2e3d] rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-100 dark:bg-[#2a2e3d]/50 rounded w-1/4 mb-8"></div>
          
          <div className="flex-1 flex items-end justify-between gap-3 mt-4">
            {[40, 70, 30, 85, 55, 100, 65, 45, 90, 60].map((h, i) => (
              <div key={i} className="w-full bg-gray-200 dark:bg-[#2a2e3d] rounded-t-sm" style={{ height: `${h}%` }}></div>
            ))}
          </div>
        </div>

        {/* Chart Skeleton 2 */}
        <div className="bg-white dark:bg-[#1e212b] rounded-xl border border-gray-200 dark:border-[#2a2e3d] shadow-sm p-5 animate-pulse min-h-[300px] flex flex-col">
          <div className="h-5 bg-gray-200 dark:bg-[#2a2e3d] rounded w-2/5 mb-2"></div>
          <div className="h-3 bg-gray-100 dark:bg-[#2a2e3d]/50 rounded w-1/3 mb-8"></div>
          
          <div className="flex-1 flex items-center justify-center relative">
            <div className="w-48 h-48 rounded-full border-[16px] border-gray-200 dark:border-[#2a2e3d] border-t-gray-300 dark:border-t-[#3a3f58]"></div>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
               <div className="h-6 bg-gray-300 dark:bg-[#3a3f58] rounded w-16 mb-1"></div>
               <div className="h-3 bg-gray-200 dark:bg-[#2a2e3d] rounded w-10"></div>
            </div>
          </div>
        </div>
        
        {/* Full width chart skeleton */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1e212b] rounded-xl border border-gray-200 dark:border-[#2a2e3d] shadow-sm p-5 animate-pulse min-h-[300px] flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="h-5 bg-gray-200 dark:bg-[#2a2e3d] rounded w-48 mb-2"></div>
              <div className="h-3 bg-gray-100 dark:bg-[#2a2e3d]/50 rounded w-32"></div>
            </div>
            <div className="h-8 bg-gray-200 dark:bg-[#2a2e3d] rounded-md w-32"></div>
          </div>
          
          <div className="flex-1 w-full border-b border-l border-gray-200 dark:border-[#2a2e3d] relative">
             <div className="absolute top-1/4 w-full border-t border-dashed border-gray-200 dark:border-[#2a2e3d]"></div>
             <div className="absolute top-2/4 w-full border-t border-dashed border-gray-200 dark:border-[#2a2e3d]"></div>
             <div className="absolute top-3/4 w-full border-t border-dashed border-gray-200 dark:border-[#2a2e3d]"></div>
             
             {/* Fake SVG line path representation */}
             <div className="absolute inset-0 overflow-hidden">
                <svg className="w-full h-full text-gray-300 dark:text-[#3a3f58]" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,80 L10,60 L20,70 L30,40 L40,50 L50,20 L60,35 L70,10 L80,45 L90,25 L100,5" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
