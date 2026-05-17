import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin Hypervisor" };

const KPIS = [
  {
    label: "AGGREGATED MONTHLY GMV",
    value: "₹6,11,419",
    delta: "▲ +14.2% MoM",
    deltaColor: "text-emerald-400",
  },
  {
    label: "TOTAL ISOLATED CONTEXTS",
    value: "1,842",
    delta: "94 Provisions Pending",
    deltaColor: "text-amber-400",
  },
  {
    label: "PIPELINE THROUGHPUT",
    value: "18,311/min",
    delta: "Latency: 0.04ms",
    deltaColor: "text-[#EDEDDF]/40",
    valueColor: "text-[#f37a2a]",
  },
  {
    label: "TOTAL ACTIVE SHIPMENTS",
    value: "2,18,311",
    delta: "▲ +9.8% vs Last Month",
    deltaColor: "text-emerald-400",
  },
  {
    label: "OPEN EXCEPTION INCIDENTS",
    value: "141",
    delta: "▲ +22 Since Yesterday",
    deltaColor: "text-red-400",
  },
  {
    label: "CIRCUIT BREAKER OPEN STATES",
    value: "1 / 5",
    delta: "3PL-BD: West Degraded",
    deltaColor: "text-amber-400",
  },
];

const PIPELINE_HEALTH = [
  {
    id: "STRM-01",
    name: "Tenant Outbound Mutation Bus",
    status: "Online",
    lag: 0,
    throughput: 14209,
  },
  {
    id: "STRM-02",
    name: "3PL Webhook Ingestion Pipe",
    status: "Online",
    lag: 0,
    throughput: 41920,
  },
  {
    id: "STRM-03",
    name: "Reverse Logistics Async Queue",
    status: "Degraded",
    lag: 3,
    throughput: 1205,
  },
];

export default function AdminHypervisorPage() {
  return (
    <div className="p-8 space-y-8 min-h-screen">
      <div className="border-b border-white/10 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] font-mono text-red-400/80 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded uppercase tracking-widest">
            ⚠ Restricted — Admin Governance Engine
          </span>
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          CROSS-TENANT AGGREGATION HYPERVISOR
        </h1>
        <p className="text-sm text-[#EDEDDF]/60 mt-1">
          Live cross-tenant KPI matrix, pipeline health telemetry, and global
          network state.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 font-mono">
        {KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-[#292F54]/30 border border-white/10 rounded-xl p-5 space-y-2 hover:border-white/20 transition-colors"
          >
            <p className="text-[10px] text-[#EDEDDF]/40 uppercase tracking-widest">
              {kpi.label}
            </p>
            <p
              className={`text-2xl font-black ${"valueColor" in kpi ? kpi.valueColor : "text-white"}`}
            >
              {kpi.value}
            </p>
            <p className={`text-xs ${kpi.deltaColor}`}>{kpi.delta}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#292F54]/20 rounded-xl border border-white/10 overflow-hidden">
        <div className="bg-black border-b border-white/10 px-5 py-3 flex items-center justify-between">
          <p className="text-xs font-mono font-bold text-white tracking-wider uppercase">
            LIVE PIPELINE HEALTH SNAPSHOT
          </p>
          <span className="text-[10px] font-mono text-[#EDEDDF]/30">
            Auto-refresh 10s
          </span>
        </div>
        <div className="divide-y divide-white/5 font-mono">
          {PIPELINE_HEALTH.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between px-5 py-3 hover:bg-white/5 transition-colors"
            >
              <div>
                <p className="text-sm text-white font-bold">{p.name}</p>
                <p className="text-[10px] text-[#EDEDDF]/30">{p.id}</p>
              </div>
              <div className="flex items-center gap-6 text-xs">
                <span
                  className={`px-2 py-0.5 rounded font-bold ${
                    p.status === "Online"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/20 text-amber-400"
                  }`}
                >
                  ● {p.status}
                </span>
                <span
                  className={`font-bold ${p.lag > 0 ? "text-amber-400" : "text-emerald-400"}`}
                >
                  Lag: {p.lag}m
                </span>
                <span className="text-white font-black">
                  {p.throughput.toLocaleString()} msg/min
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
