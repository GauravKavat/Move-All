export function AboutIdentity() {
  return (
    <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
      <div className="lg:col-span-7 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#f37a2a]/30 bg-[#f37a2a]/10 text-[#f37a2a] text-sm font-mono">
          {"SYSTEM IDENTITY // OVERVIEW"}
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
          THE ARCHITECTURE BEHIND{" "}
          <span className="inline-flex items-baseline text-[#f37a2a]">
            weMOVE
            <span className="text-[11px] font-medium tracking-normal text-[#f37a2a] relative -top-3 px-0.5">
              it
            </span>
            ALL
          </span>
        </h2>
        <p className="text-lg text-[#EDEDDF]/80 leading-relaxed font-sans">
          MoveAll replaces fragmented legacy supply lines with a deterministic,
          multi-tenant execution network. Row-level database isolation combined
          with dynamic route failovers shifts your logistics stack from
          operational bottleneck to scalable growth engine.
        </p>
        <ul className="space-y-2 text-sm text-[#EDEDDF]/70 font-mono">
          <li className="flex items-start gap-2">
            <span className="text-[#f37a2a] mt-0.5">▶</span>
            PostgreSQL RLS isolates every tenant at the query layer.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#f37a2a] mt-0.5">▶</span>
            Circuit breakers + exponential backoff handle 3PL outages
            automatically.
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#f37a2a] mt-0.5">▶</span>
            SHA-256 idempotency keys eliminate duplicate refunds across RTO
            pipelines.
          </li>
        </ul>
      </div>

      <div className="lg:col-span-5 bg-black p-8 rounded-xl border border-white/10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#292F54]/40 rounded-full filter blur-3xl group-hover:bg-[#f37a2a]/20 transition-all duration-700" />
        <div className="font-mono text-xs text-[#EDEDDF]/40 space-y-4 relative z-10">
          <p className="text-[#f37a2a] font-bold">
            <span>{"//"}</span>
            {" NETWORK TELEMETRY REGISTRY"}
          </p>
          <div className="p-3 bg-white/5 rounded border border-white/5 space-y-1">
            <p className="text-white flex justify-between">
              <span>Core Engine:</span>
              <span className="text-emerald-400">ONLINE</span>
            </p>
            <p className="flex justify-between">
              <span>Inbound Streams:</span>
              <span>41,293 pkts/sec</span>
            </p>
            <p className="flex justify-between">
              <span>Mean Ingestion Lag:</span>
              <span className="text-emerald-400">0.02ms</span>
            </p>
            <p className="flex justify-between">
              <span>Active Tenants:</span>
              <span>1,842</span>
            </p>
            <p className="flex justify-between">
              <span>RLS Policies Active:</span>
              <span className="text-emerald-400">5 Tables</span>
            </p>
          </div>
          <div className="p-3 bg-white/5 rounded border border-white/5 space-y-2">
            <p className="text-white font-semibold flex items-baseline gap-1">
              Logo Spec:{" "}
              <span className="text-lg font-black tracking-tight">
                weMOVE
                <span className="text-[10px] font-medium tracking-normal text-[#f37a2a] relative -top-1 px-0.5">
                  it
                </span>
                ALL
              </span>
            </p>
            <p className="text-[11px] leading-snug">
              Mathematical scaling logic applied to inline &quot;it&quot; marker
              enforces explicit visual contrast hierarchy at all resolutions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
