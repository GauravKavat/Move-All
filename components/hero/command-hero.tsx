"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Moon, SunMedium } from "lucide-react";

export function CommandHero() {
  const [activeTab, setActiveTab] = useState<"stream" | "failover">("stream");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const isLight = theme === "light";

  return (
    <div
      className={`relative w-full max-w-6xl mx-auto flex flex-col items-center text-center space-y-8 rounded-4xl border px-4 py-8 md:px-8 md:py-10 overflow-hidden transition-colors duration-300 ${
        isLight
          ? "border-slate-200 bg-[#f7f2e8] text-slate-950 shadow-[0_24px_80px_rgba(15,23,42,0.12)]"
          : "border-white/10 bg-linear-to-b from-white/3 to-transparent text-[#EDEDDF]"
      }`}
    >
      <div
        className={`absolute inset-x-8 top-0 h-px transition-opacity duration-300 ${
          isLight ? "bg-slate-300/80" : "bg-white/10"
        }`}
      />
      <button
        type="button"
        onClick={() => setTheme(isLight ? "dark" : "light")}
        aria-pressed={isLight}
        className={`absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-mono uppercase tracking-[0.18em] transition-all duration-200 md:right-6 md:top-6 ${
          isLight
            ? "border-slate-300 bg-white text-slate-700 hover:bg-slate-100"
            : "border-white/10 bg-black/60 text-[#EDEDDF]/80 hover:bg-black/80"
        }`}
      >
        {isLight ? <Moon className="h-3.5 w-3.5" /> : <SunMedium className="h-3.5 w-3.5" />}
        {isLight ? "Dark mode" : "Light mode"}
      </button>
      <div className="space-y-4 max-w-3xl">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono tracking-widest uppercase transition-colors duration-300 ${
            isLight
              ? "border-slate-300 bg-white text-[#c66518]"
              : "border-safety-amber/30 bg-safety-amber/10 text-safety-amber"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-safety-amber animate-pulse" />
          Enterprise Logistics Infrastructure — Live
        </div>
        <h1
          className={`text-5xl md:text-7xl font-black tracking-tight leading-none transition-colors duration-300 ${
            isLight ? "text-slate-950" : "text-white"
          }`}
        >
          Unified Logistics Platform for{" "}
          <span className="text-safety-amber">Enterprise Stack</span>
        </h1>
        <p
          className={`text-xl max-w-2xl mx-auto leading-relaxed transition-colors duration-300 ${
            isLight ? "text-slate-600" : "text-[#EDEDDF]/70"
          }`}
        >
          Automate fulfillment routing, exception processing, and multi-tenant
          courier operations with sub-millisecond API overhead.
        </p>
      </div>

      <div
        className={`flex gap-4 p-1.5 rounded-lg border font-mono text-xs transition-colors duration-300 ${
          isLight
            ? "border-slate-200 bg-white text-slate-700"
            : "border-white/10 bg-[#292F54]/40 text-[#EDEDDF]"
        }`}
      >
        <button
          onClick={() => setActiveTab("stream")}
          className={`px-4 py-2 rounded-md transition-all ${
            activeTab === "stream"
              ? "bg-safety-amber text-black font-bold"
              : isLight
                ? "text-slate-500 hover:text-slate-950"
                : "text-[#EDEDDF]/60 hover:text-white"
          }`}
        >
          LIVE DATA STREAMING
        </button>
        <button
          onClick={() => setActiveTab("failover")}
          className={`px-4 py-2 rounded-md transition-all ${
            activeTab === "failover"
              ? "bg-safety-amber text-black font-bold"
              : isLight
                ? "text-slate-500 hover:text-slate-950"
                : "text-[#EDEDDF]/60 hover:text-white"
          }`}
        >
          AUTOMATED FAILOVER MATRIX
        </button>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`w-full h-95 rounded-xl border shadow-2xl p-6 font-mono text-left relative overflow-hidden flex flex-col justify-between transition-colors duration-300 ${
          isLight
            ? "border-slate-200 bg-[#fcfaf5] text-slate-950 shadow-[0_24px_80px_rgba(15,23,42,0.12)]"
            : "border-white/10 bg-black text-[#EDEDDF]"
        }`}
      >
        {activeTab === "stream" ? (
          <div className={`space-y-2 text-xs ${isLight ? "text-emerald-700" : "text-emerald-400"}`}>
            <p className={isLight ? "text-slate-500" : "text-white/40"}>
              <span>{"//"}</span>
              {" TELEMETRY INGESTION PIPELINE LIVE READOUT"}
            </p>
            <p className="animate-pulse">
              [INFO] 2026-05-17T14:47:00Z — Tenant-B2B-098x: 1,420 orders
              processed.
            </p>
            <p>[METRIC] DHL API 200 OK | Latency: 12ms</p>
            <p className={isLight ? "text-amber-600" : "text-amber-400"}>
              [WARN] Bluedart degradation — West Corridor. Throttling to 15%.
            </p>
            <p>[METRIC] FedEx Local Ground 200 OK | Latency: 22ms</p>
            <p className={isLight ? "text-blue-600" : "text-blue-400"}>
              [SYSTEM] Circuit breaker CLOSED for 3PL-DHL — failure count reset.
            </p>
            <p>
              [INFO] RTO scan event deduplicated via SHA-256 idempotency key.
              Duplicate refund hook discarded.
            </p>
          </div>
        ) : (
          <div className={`space-y-3 text-xs ${isLight ? "text-amber-600" : "text-amber-400"}`}>
            <p className={isLight ? "text-slate-500" : "text-white/40"}>
              <span>{"//"}</span>
              {" FAILOVER MITIGATION POLICIES IN EFFECT"}
            </p>
            <div
              className={`grid grid-cols-3 gap-4 p-3 rounded transition-colors duration-300 ${
                isLight ? "border border-slate-200 bg-white" : "border border-white/10 bg-white/5"
              }`}
            >
              <div>
                <p className={isLight ? "text-slate-950 font-semibold mb-1" : "text-white font-semibold mb-1"}>COURIER</p>
                <p className={isLight ? "text-slate-600" : "text-[#EDEDDF]/60"}>FedEx India</p>
                <p className={isLight ? "text-slate-600" : "text-[#EDEDDF]/60"}>Bluedart</p>
                <p className={isLight ? "text-slate-600" : "text-[#EDEDDF]/60"}>DHL Express</p>
              </div>
              <div>
                <p className={isLight ? "text-slate-950 font-semibold mb-1" : "text-white font-semibold mb-1"}>STATUS</p>
                <p className="text-red-500">DEGRADED (450ms)</p>
                <p className={isLight ? "text-emerald-700" : "text-emerald-400"}>OPERATIONAL</p>
                <p className={isLight ? "text-emerald-700" : "text-emerald-400"}>OPERATIONAL (14ms)</p>
              </div>
              <div>
                <p className={isLight ? "text-slate-950 font-semibold mb-1" : "text-white font-semibold mb-1"}>ACTION</p>
                <p className="text-safety-amber">Rerouted 85% Vol → Bluedart</p>
                <p className={isLight ? "text-emerald-700" : "text-emerald-400"}>Accepting Load Spikes</p>
                <p className={isLight ? "text-emerald-700" : "text-emerald-400"}>Primary Route Active</p>
              </div>
            </div>
            <p className={isLight ? "text-emerald-700 text-[11px]" : "text-emerald-400 text-[11px]"}>
              [SUCCESS] Rerouted 4,192 shipments across 12 tenant configs.
            </p>
            <p className={isLight ? "text-blue-600 text-[11px]" : "text-blue-400 text-[11px]"}>
              [CIRCUIT] 3PL-FX: OPEN → Half-Open probe in 47s.
            </p>
          </div>
        )}
        <div
          className={`border-t pt-4 flex justify-between items-center text-xs transition-colors duration-300 ${
            isLight ? "border-slate-200 text-slate-500" : "border-white/5 text-[#EDEDDF]/40"
          }`}
        >
          <span>Latency: 0.04ms</span>
          <span>TLS 1.3 / AES-256-GCM</span>
          <span>Active Tenants: 1,842</span>
        </div>
      </motion.div>
    </div>
  );
}
