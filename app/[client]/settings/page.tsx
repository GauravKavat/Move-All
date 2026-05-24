'use client';

import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { createClient } from "@/lib/client";
import { useRouter } from "next/navigation";

export default function ClientSettingsPage() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [digestEnabled, setDigestEnabled] = useState(true);

  const [companyName, setCompanyName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setEmail(user.email || "");
        
        // Split full name into first and last name
        const fullName = user.user_metadata?.full_name || "";
        const parts = fullName.trim().split(/\s+/);
        setFirstName(parts[0] || "");
        setLastName(parts.length > 1 ? parts.slice(1).join(' ') : "");
      }
      setLoading(false);
    }
    loadUser();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully 👋");
    router.push("/");
    router.refresh();
  };

  const handleSaveProfile = () => {
    // In a real app, you would send an update to the database here
    toast.success("Profile saved successfully! 💾");
  };

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <section className="rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] p-5 sm:p-6 shadow-sm transition-all">
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Profile Details</h1>
        {loading ? (
          <div className="mt-5 animate-pulse space-y-4">
            <div className="h-10 bg-gray-100 dark:bg-white/5 rounded-lg w-full"></div>
            <div className="h-10 bg-gray-100 dark:bg-white/5 rounded-lg w-full"></div>
            <div className="h-10 bg-gray-100 dark:bg-white/5 rounded-lg w-full"></div>
            <div className="h-10 bg-gray-100 dark:bg-white/5 rounded-lg w-full"></div>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label className="space-y-1 text-sm text-[#475569] dark:text-[#94a3b8] sm:col-span-2">
              <span>Company Name</span>
              <input 
                className="h-10 w-full rounded-lg border border-[#dddacb] dark:border-[#2a2e3d] bg-white dark:bg-[#16181d] px-3 text-[#1f2937] dark:text-white outline-none focus:border-[#f37a2a] focus:ring-1 focus:ring-[#f37a2a]" 
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter Company Name"
              />
            </label>
            <label className="space-y-1 text-sm text-[#475569] dark:text-[#94a3b8]">
              <span>First Name</span>
              <input 
                className="h-10 w-full rounded-lg border border-[#dddacb] dark:border-[#2a2e3d] bg-white dark:bg-[#16181d] px-3 text-[#1f2937] dark:text-white outline-none focus:border-[#f37a2a] focus:ring-1 focus:ring-[#f37a2a]" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
            <label className="space-y-1 text-sm text-[#475569] dark:text-[#94a3b8]">
              <span>Last Name</span>
              <input 
                className="h-10 w-full rounded-lg border border-[#dddacb] dark:border-[#2a2e3d] bg-white dark:bg-[#16181d] px-3 text-[#1f2937] dark:text-white outline-none focus:border-[#f37a2a] focus:ring-1 focus:ring-[#f37a2a]" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
            <label className="space-y-1 text-sm text-[#475569] dark:text-[#94a3b8]">
              <span>Email</span>
              <input 
                className="h-10 w-full rounded-lg border border-[#dddacb] dark:border-[#2a2e3d] bg-gray-50 dark:bg-white/5 px-3 text-[#1f2937] dark:text-white/60 outline-none cursor-not-allowed" 
                value={email}
                disabled
              />
            </label>
            <label className="space-y-1 text-sm text-[#475569] dark:text-[#94a3b8]">
              <span>Phone</span>
              <input 
                className="h-10 w-full rounded-lg border border-[#dddacb] dark:border-[#2a2e3d] bg-white dark:bg-[#16181d] px-3 text-[#1f2937] dark:text-white outline-none focus:border-[#f37a2a] focus:ring-1 focus:ring-[#f37a2a]" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 234 567 890"
              />
            </label>
          </div>
        )}
        <div className="mt-5 flex items-center gap-2 border-t border-[#efedde] dark:border-[#2a2e3d] pt-4">
          <button onClick={handleSaveProfile} className="rounded-lg bg-[#f37a2a] hover:bg-[#e06716] px-4 py-2 text-sm font-bold text-white shadow-md transition-colors">
            Save Profile
          </button>
          <button onClick={handleSignOut} className="rounded-lg border border-[#dddacb] dark:border-[#2a2e3d] bg-white dark:bg-[#16181d] px-4 py-2 text-sm font-semibold text-[#1f2937] dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#2a2e3d] hover:text-[#111827] dark:hover:text-white transition-colors">
            Sign out
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <article className="rounded-2xl border border-[#e8e5d7] dark:border-[#2a2e3d] bg-white dark:bg-[#1e212b] p-5 sm:p-6 shadow-sm">
          <h2 className="text-xl font-bold text-[#111827] dark:text-white">Notifications Preferences</h2>
          <div className="mt-4 space-y-3 text-sm text-[#1f2937] dark:text-[#ededdf]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-[#f37a2a]" checked={emailEnabled} onChange={(event) => setEmailEnabled(event.target.checked)} />
              Email Notifications
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-[#f37a2a]" checked={smsEnabled} onChange={(event) => setSmsEnabled(event.target.checked)} />
              SMS Alerts
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-[#f37a2a]" checked={digestEnabled} onChange={(event) => setDigestEnabled(event.target.checked)} />
              Daily Digests
            </label>
          </div>
          <button onClick={() => toast.success("Preferences updated! ⚙️")} className="mt-4 rounded-lg bg-[#f37a2a] hover:bg-[#e06716] px-4 py-2 text-sm font-bold text-white shadow-md transition-colors">
            Save Preferences
          </button>
        </article>

        <article className="rounded-2xl border border-red-200 dark:border-red-900/30 bg-rose-50 dark:bg-rose-950/10 p-5 sm:p-6">
          <p className="text-sm font-bold uppercase tracking-[0.12em] text-red-700 dark:text-red-400">Danger Zone</p>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">Deleting this account is irreversible. All logistics history and billing records will be removed permanently.</p>
          <button onClick={() => toast.error("Account deletion requires contacting support! 🛑")} className="mt-4 rounded-lg bg-red-600 hover:bg-red-700 px-4 py-2 text-sm font-bold text-white shadow-md transition-colors">
            Delete Account
          </button>
        </article>
      </section>
    </div>
  );
}
