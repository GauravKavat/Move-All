import { 
  BarChart3, 
  Package, 
  MapPin, 
  Truck, 
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { ComingSoonDialog } from "@/components/coming-soon-dialog";

export default function ClientDetailView({ params, searchParams }: { params: { clientId: string }, searchParams?: { name?: string } }) {
  // Mock data for client based on ID or use searchParams name
  const clientName = searchParams?.name || (params.clientId === 'cli_acme' ? 'Acme Logistics' : 
                     params.clientId === 'cli_globex' ? 'Globex Corp' : 
                     params.clientId === 'cli_stark' ? 'Stark Ind.' : 
                     'Client Organization');

  return (
    <div className="space-y-4 w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#64748b] dark:text-[#94a3b8] mb-1">
            <span>Admin</span>
            <span>/</span>
            <span>Clients</span>
            <span>/</span>
            <span className="text-[#f37a2a]">{params.clientId}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-white flex items-center gap-3">
            {clientName}
            <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium border border-emerald-200 dark:border-emerald-500/20">
              Active Contract
            </span>
          </h1>
        </div>
        
        <div className="flex gap-2">
          <ComingSoonDialog title="Export Client Data" type="export">
            <button className="px-4 py-2 bg-white dark:bg-[#1e212b] border border-gray-200 dark:border-[#2a2e3d] rounded-lg text-sm font-medium text-[#111827] dark:text-white hover:bg-gray-50 dark:hover:bg-[#2a2e3d]/80 transition-colors">
              Export Report
            </button>
          </ComingSoonDialog>
          <ComingSoonDialog title="Client Settings" type="action">
            <button className="px-4 py-2 bg-[#f37a2a] text-white rounded-lg text-sm font-medium hover:bg-[#d96a20] transition-colors shadow-sm">
              Manage Client Settings
            </button>
          </ComingSoonDialog>
        </div>
      </div>

      {/* Analytics KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Monthly Volume", value: "0", trend: "0%", icon: Package },
          { label: "Avg Delivery Time", value: "0 Days", trend: "0 Days", icon: Truck },
          { label: "Exception Rate", value: "0%", trend: "0%", icon: AlertTriangle, positiveIsDown: true },
          { label: "Monthly Revenue", value: "₹0", trend: "0%", icon: TrendingUp },
        ].map((kpi, i) => (
          <div key={i} className="bg-white dark:bg-[#1e212b] rounded-xl p-4 border border-gray-200 dark:border-[#2a2e3d] shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-gray-50 dark:bg-[#2a2e3d]">
                <kpi.icon className="h-5 w-5 text-[#64748b] dark:text-[#94a3b8]" />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400`}>
                 {kpi.trend}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-[#64748b] dark:text-[#94a3b8]">{kpi.label}</p>
              <h3 className="text-2xl font-bold text-[#111827] dark:text-white mt-1">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Shipment Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white dark:bg-[#1e212b] rounded-xl border border-gray-200 dark:border-[#2a2e3d] shadow-sm overflow-hidden flex flex-col min-h-[320px]">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-[#2a2e3d] flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-[#111827] dark:text-white text-base">Shipment Analytics</h3>
              <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">Breakdown of ongoing vs completed shipments</p>
            </div>
          </div>
          <div className="flex-1 p-6 flex items-center justify-center bg-gray-50/50 dark:bg-[#16181d]/50">
             <div className="text-center">
               <BarChart3 className="h-12 w-12 text-[#94a3b8] mx-auto mb-3" />
               <p className="text-[#64748b] dark:text-[#94a3b8]">Detailed shipment charts will render here.</p>
             </div>
          </div>
        </div>

        {/* Live Shipments List */}
        <div className="bg-white dark:bg-[#1e212b] rounded-xl border border-gray-200 dark:border-[#2a2e3d] shadow-sm flex flex-col min-h-[320px]">
          <div className="px-5 py-4 border-b border-gray-200 dark:border-[#2a2e3d]">
             <h3 className="font-semibold text-[#111827] dark:text-white text-base">Live Active Shipments</h3>
          </div>
          <div className="p-0 overflow-y-auto flex-1 flex flex-col items-center justify-center min-h-[160px]">
            <p className="text-sm text-[#64748b] dark:text-[#94a3b8]">No active shipments found.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
