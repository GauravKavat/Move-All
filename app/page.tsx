import { Navbar } from "@/components/landing/navbar";
import { CommandHero } from "@/components/hero/command-hero";
import { MetricsStrip } from "@/components/sections/metrics-strip";
import { AboutIdentity } from "@/components/sections/about-identity";
import { FeatureMatrix } from "@/components/sections/feature-matrix";
import { CallToAction } from "@/components/sections/call-to-action";

export default function MarketingHomePage() {
  return (
    <main className="min-h-screen bg-black text-[#EDEDDF] overflow-x-hidden">
      <Navbar />
      <section className="relative w-full pt-24 pb-12 flex flex-col items-center justify-center px-4 md:px-8">
        <CommandHero />
      </section>
      <MetricsStrip />
      <section className="w-full bg-[#292F54]/30 py-20 border-t border-white/5">
        <AboutIdentity />
      </section>
      <FeatureMatrix />
      <CallToAction />
    </main>
  );
}
