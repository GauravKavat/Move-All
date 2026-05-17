const FEATURES = [
  {
    tag: 'MULTI-TENANT ISOLATION',
    title: 'Row-Level Security at Every Query',
    description:
      'Every database operation is cryptographically bound to a validated tenant context via PostgreSQL RLS policies. Zero cross-tenant data leakage by design.',
    stat: '5 RLS Tables',
    statColor: 'text-emerald-400',
  },
  {
    tag: 'RESILIENCE ENGINE',
    title: 'Autonomous 3PL Failover Orchestration',
    description:
      'Circuit breakers monitor every upstream 3PL endpoint. After 3 consecutive 5xx failures, traffic is automatically rerouted to the highest-availability fallback carrier.',
    stat: 'Backoff: 0.5s→30s',
    statColor: 'text-[#f37a2a]',
  },
  {
    tag: 'RTO INTEGRITY',
    title: 'SHA-256 Idempotency Rail System',
    description:
      'Incoming reverse logistics events are validated against a 5-second deduplication window using composite SHA-256 keys, eliminating duplicate refund processing.',
    stat: '5000ms Window',
    statColor: 'text-blue-400',
  },
  {
    tag: 'RATE CONTROL',
    title: 'Tier-Adaptive Token Bucket Limiting',
    description:
      'API throughput governed per tenant by subscription tier. Starter at 60 req/min, Pro at 300, Enterprise receives custom elastic buckets.',
    stat: 'Starter→Enterprise',
    statColor: 'text-amber-400',
  },
];

export function FeatureMatrix() {
  return (
    <section className="w-full py-24 px-6" id="platform">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[#EDEDDF]/60 text-xs font-mono tracking-widest uppercase">
            PLATFORM CAPABILITIES
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
            Engineered for <span className="text-[#f37a2a]">Production-Grade Scale</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.tag}
              className="bg-[#292F54]/20 border border-white/10 rounded-xl p-6 space-y-4 hover:border-[#f37a2a]/30 transition-colors duration-300 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#f37a2a] uppercase bg-[#f37a2a]/10 border border-[#f37a2a]/20 px-2 py-0.5 rounded">
                  {f.tag}
                </span>
                <span className={`text-xs font-mono font-bold ${f.statColor}`}>{f.stat}</span>
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-[#f37a2a] transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-[#EDEDDF]/60 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
