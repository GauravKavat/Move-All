'use client';

import { useState } from 'react';
import { toast } from "sonner";

export default function ClientSettingsPage() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [digestEnabled, setDigestEnabled] = useState(true);

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <section className="rounded-2xl border border-[#e8e5d7] bg-white p-5 sm:p-6">
        <h1 className="text-2xl font-bold text-[#111827]">Profile Details</h1>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm text-[#475569] sm:col-span-2">
            <span>Company Name</span>
            <input className="h-10 w-full rounded-lg border border-[#dddacb] px-3 outline-none focus:border-[#f37a2a]" defaultValue="Move All Logistics Pvt Ltd" />
          </label>
          <label className="space-y-1 text-sm text-[#475569]">
            <span>First Name</span>
            <input className="h-10 w-full rounded-lg border border-[#dddacb] px-3 outline-none focus:border-[#f37a2a]" defaultValue="Arjun" />
          </label>
          <label className="space-y-1 text-sm text-[#475569]">
            <span>Last Name</span>
            <input className="h-10 w-full rounded-lg border border-[#dddacb] px-3 outline-none focus:border-[#f37a2a]" defaultValue="Kumar" />
          </label>
          <label className="space-y-1 text-sm text-[#475569]">
            <span>Email</span>
            <input className="h-10 w-full rounded-lg border border-[#dddacb] px-3 outline-none focus:border-[#f37a2a]" defaultValue="arjun@moveall.io" />
          </label>
          <label className="space-y-1 text-sm text-[#475569]">
            <span>Phone</span>
            <input className="h-10 w-full rounded-lg border border-[#dddacb] px-3 outline-none focus:border-[#f37a2a]" defaultValue="+91 98123 45678" />
          </label>
        </div>
        <div className="mt-5 flex items-center gap-2 border-t border-[#efedde] pt-4">
          <button onClick={() => toast.success("Profile saved successfully! 💾")} className="rounded-lg bg-[#f37a2a] px-4 py-2 text-sm font-bold text-white">Save Profile</button>
          <button onClick={() => toast("Signing out... 👋")} className="rounded-lg border border-[#dddacb] bg-white px-4 py-2 text-sm font-semibold text-[#1f2937]">Sign out</button>
        </div>
      </section>

      <section className="space-y-4">
        <article className="rounded-2xl border border-[#e8e5d7] bg-white p-5 sm:p-6">
          <h2 className="text-xl font-bold text-[#111827]">Notifications Preferences</h2>
          <div className="mt-4 space-y-3 text-sm text-[#1f2937]">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={emailEnabled} onChange={(event) => setEmailEnabled(event.target.checked)} />
              Email Notifications
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={smsEnabled} onChange={(event) => setSmsEnabled(event.target.checked)} />
              SMS Alerts
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={digestEnabled} onChange={(event) => setDigestEnabled(event.target.checked)} />
              Daily Digests
            </label>
          </div>
          <button onClick={() => toast.success("Preferences updated! ⚙️")} className="mt-4 rounded-lg bg-[#f37a2a] px-4 py-2 text-sm font-bold text-white">Save Preferences</button>
        </article>

        <article className="rounded-2xl border border-red-200 bg-rose-50 p-5 sm:p-6">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-red-700">Danger Zone</p>
          <p className="mt-2 text-sm text-red-700">Deleting this account is irreversible. All logistics history and billing records will be removed permanently.</p>
          <button onClick={() => toast.error("Account deletion requires contacting support! 🛑")} className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white">Delete Account</button>
        </article>
      </section>
    </div>
  );
}
