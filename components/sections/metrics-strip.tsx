import React from 'react';

const METRICS = [
  { value: '41,293', unit: 'pkts/sec', label: 'Inbound Throughput' },
  { value: '0.02ms', unit: 'avg', label: 'Mean Ingestion Latency' },
  { value: '1,842', unit: 'tenants', label: 'Active Isolated Contexts' },
  { value: '99.98%', unit: 'uptime', label: 'Platform SLA' },
  { value: '< 0.01%', unit: '5xx rate', label: 'Upstream Error Rate' },
];

export function MetricsStrip() {
  return (
    <section className="w-full border-t border-b border-white/5 bg-[#292F54]/10 py-8">
      <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
        <div className="flex items-center justify-center min-w-max mx-auto">
          {METRICS.map((metric, index) => (
            <React.Fragment key={metric.label}>
              <div className="flex flex-col items-center px-10 py-2 text-center min-w-[160px]">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black text-white font-mono tracking-tight">
                    {metric.value}
                  </span>
                  <span className="text-xs text-[#f37a2a] font-mono font-bold uppercase tracking-wider">
                    {metric.unit}
                  </span>
                </div>
                <p className="text-xs text-[#EDEDDF]/40 font-mono mt-1 tracking-wide">
                  {metric.label}
                </p>
              </div>
              {index < METRICS.length - 1 && (
                <div className="w-px h-10 bg-white/10 flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
