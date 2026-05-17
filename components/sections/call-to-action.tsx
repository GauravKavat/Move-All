import Link from 'next/link';

export function CallToAction() {
  return (
    <section className="w-full py-24 px-6 border-t border-white/5">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
            Ready to Eliminate Logistics{' '}
            <span className="text-[#f37a2a]">Bottlenecks?</span>
          </h2>
          <p className="text-lg text-[#EDEDDF]/60 max-w-2xl mx-auto">
            Join 1,842 enterprise tenants running production workloads on the{' '}
            <span className="inline-flex items-baseline font-black text-white">
              weMOVE
              <span className="text-[9px] font-medium text-[#f37a2a] relative -top-2 px-[2px]">
                it
              </span>
              ALL
            </span>{' '}
            platform.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/client"
            className="bg-[#f37a2a] text-black font-black px-8 py-3.5 rounded text-sm font-mono tracking-wide hover:bg-[#f37a2a]/90 transition-all"
          >
            START FREE TRIAL →
          </Link>
          <a
            href="#platform"
            className="bg-white/5 border border-white/10 text-[#EDEDDF]/70 hover:text-white font-bold px-8 py-3.5 rounded text-sm font-mono tracking-wide transition-all"
          >
            VIEW ARCHITECTURE DOCS
          </a>
        </div>
        <p className="text-xs text-[#EDEDDF]/30 font-mono">
          No credit card required · 14-day free trial · Enterprise SLA available
        </p>
      </div>
    </section>
  );
}
