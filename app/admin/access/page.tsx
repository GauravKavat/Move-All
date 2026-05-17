"use client";

import type { Metadata } from "next";
import React, { useState } from "react";
import type {
  AccessUser,
  AuditLog,
  AuditSeverity,
  AccessStatus,
} from "@/lib/types";

const SEV_STYLES: Record<AuditSeverity, string> = {
  Critical: "bg-red-500 text-white animate-pulse",
  Warning: "bg-amber-500/20 text-amber-400 border border-amber-500/40",
  Info: "bg-blue-500/20 text-blue-400 border border-blue-500/40",
};

const USR_STYLES: Record<AccessStatus, string> = {
  Active: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40",
  Suspended: "bg-red-500/20 text-red-400 border border-red-500/40",
  Pending: "bg-amber-500/20 text-amber-400 border border-amber-500/40",
};

const SEED_USERS: AccessUser[] = [
  {
    id: "USR-01",
    name: "Gaurav Meena",
    email: "gaurav.meena@moveall.com",
    role: "Staff Systems Architect",
    tenantScope: "GLOBAL",
    lastSeen: "Active Now",
    status: "Active",
    mfaEnabled: true,
  },
  {
    id: "USR-02",
    name: "Rohan Sharma",
    email: "rohan.sharma@moveall.com",
    role: "Operations Auditor",
    tenantScope: "GLOBAL",
    lastSeen: "2 Hours Ago",
    status: "Active",
    mfaEnabled: true,
  },
  {
    id: "USR-03",
    name: "Priya Nair",
    email: "priya.nair@moveall.com",
    role: "Tenant Support Engineer",
    tenantScope: "TNT-00192, TNT-08412",
    lastSeen: "5 Hours Ago",
    status: "Suspended",
    mfaEnabled: false,
  },
];

const SEED_LOGS: AuditLog[] = [
  {
    id: "LOG-8841",
    actor: "gaurav.meena@moveall.com",
    action: "TENANT_PROVISION_BYPASS_OVERRIDE",
    target: "TNT-08412",
    timestamp: "2026-05-17T14:45:10Z",
    severity: "Critical",
  },
  {
    id: "LOG-8842",
    actor: "rohan.sharma@moveall.com",
    action: "COURIER_ROUTING_THRESHOLD_MUTATION",
    target: "3PL-BD",
    timestamp: "2026-05-17T14:10:22Z",
    severity: "Warning",
  },
  {
    id: "LOG-8840",
    actor: "gaurav.meena@moveall.com",
    action: "CIRCUIT_BREAKER_MANUAL_RESET",
    target: "3PL-FX",
    timestamp: "2026-05-17T13:55:01Z",
    severity: "Warning",
  },
  {
    id: "LOG-8839",
    actor: "rohan.sharma@moveall.com",
    action: "AUDIT_LOG_EXPORT_INITIATED",
    target: "GLOBAL",
    timestamp: "2026-05-17T13:00:00Z",
    severity: "Info",
  },
];

export default function AdminSecurityGovernancePage() {
  const [users] = useState<AccessUser[]>(SEED_USERS);
  const [logs] = useState<AuditLog[]>(SEED_LOGS);
  const [sevFilter, setSevFilter] = useState<AuditSeverity | "All">("All");

  const filteredLogs =
    sevFilter === "All" ? logs : logs.filter((l) => l.severity === sevFilter);

  return (
    <div className="p-8 space-y-8 min-h-screen">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight">
          SECURITY CRITICAL RBAC HYPERVISOR
        </h1>
        <p className="text-sm text-[#EDEDDF]/60 mt-1">
          Provision security tokens, audit admin access, trace modifications
          across immutable logs.
        </p>
      </div>

      <div className="bg-[#292F54]/20 rounded-xl border border-white/10 overflow-hidden font-mono">
        <div className="p-4 bg-black border-b border-white/10 text-white font-bold text-xs tracking-wider uppercase">
          AUTHORIZED GOVERNANCE INTERFACES
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="bg-black/40 text-[10px] text-[#EDEDDF]/40 uppercase tracking-wider border-b border-white/5">
              <th className="p-4">Identity</th>
              <th className="p-4">Role</th>
              <th className="p-4">Tenant Scope</th>
              <th className="p-4">MFA</th>
              <th className="p-4">Last Seen</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-white/5">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/5 transition-all">
                <td className="p-4">
                  <p className="font-bold text-white">{u.name}</p>
                  <p className="text-[10px] text-[#EDEDDF]/40">
                    {u.email} · {u.id}
                  </p>
                </td>
                <td className="p-4 text-[#f37a2a] font-bold text-xs">
                  {u.role}
                </td>
                <td className="p-4 text-[10px] text-[#EDEDDF]/50">
                  {u.tenantScope}
                </td>
                <td className="p-4">
                  <span
                    className={`text-[10px] font-bold ${
                      u.mfaEnabled ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {u.mfaEnabled ? "✓ ENABLED" : "✗ DISABLED"}
                  </span>
                </td>
                <td className="p-4 text-xs text-[#EDEDDF]/60">{u.lastSeen}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${USR_STYLES[u.status]}`}
                  >
                    {u.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-[#292F54]/20 rounded-xl border border-white/10 overflow-hidden font-mono">
        <div className="p-4 bg-black border-b border-white/10 flex items-center justify-between">
          <p className="text-red-400 font-bold text-xs tracking-wider uppercase">
            IMMUTABLE CRITICAL AUDIT LOG TRAIL
          </p>
          <div className="flex gap-2">
            {(
              ["All", "Critical", "Warning", "Info"] as Array<
                AuditSeverity | "All"
              >
            ).map((s) => (
              <button
                key={s}
                onClick={() => setSevFilter(s)}
                className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                  sevFilter === s
                    ? "bg-[#f37a2a] text-black"
                    : "bg-white/5 border border-white/10 text-[#EDEDDF]/60 hover:text-white"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-black/40 text-[#EDEDDF]/40 border-b border-white/5">
              <th className="p-3">Actor</th>
              <th className="p-3">Action</th>
              <th className="p-3">Target</th>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-white/5 transition-all">
                <td className="p-3 text-white font-bold">{log.actor}</td>
                <td className="p-3 text-amber-400 font-bold">{log.action}</td>
                <td className="p-3 text-blue-400">{log.target}</td>
                <td className="p-3 text-[#EDEDDF]/60">{log.timestamp}</td>
                <td className="p-3">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${SEV_STYLES[log.severity]}`}
                  >
                    {log.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
