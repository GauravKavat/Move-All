"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { SignupForm } from "@/components/signup-form";

export default function LoginPage() {
  const [view, setView] = useState<"login" | "signup">("login");
  const searchParams = useSearchParams();
  const errorMsg = searchParams.get("error");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-[#f37a2a]/20 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#f37a2a]/10 blur-[120px] rounded-full pointer-events-none" />

      <Link href="/" className="mb-8 flex items-center gap-3 relative z-10 group">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#292F54] dark:bg-[#2b3358] text-lg font-extrabold text-white shadow-sm group-hover:scale-105 transition-transform">
          M
        </div>
        <span className="font-bold text-2xl tracking-tight text-gray-900 dark:text-white">Move All</span>
      </Link>

      <div className="w-full max-w-md relative z-10">
        {errorMsg === 'unauthorized' && (
          <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 flex items-start gap-3 animate-in slide-in-from-top-2 fade-in duration-300">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">Access Denied</h3>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">Please sign in with appropriate credentials to access this page.</p>
            </div>
          </div>
        )}

        {view === "login" ? (
          <LoginForm onSwitchToSignup={() => setView("signup")} />
        ) : (
          <SignupForm onSwitchToLogin={() => setView("login")} />
        )}
      </div>
    </div>
  );
}
