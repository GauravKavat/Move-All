import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-8 shadow-sm border border-red-200 dark:border-red-900/50">
          <ShieldAlert className="h-12 w-12 text-red-600 dark:text-red-500" />
        </div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Access Denied</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          You do not have the required permissions to access this page. Please sign in with an authorized account or return to the home page.
        </p>
        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/login">
            <Button className="w-full sm:w-auto bg-[#f37a2a] hover:bg-[#e06716] text-white font-bold px-8 h-12">
              Sign In
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto font-bold px-8 h-12 border-gray-300 dark:border-white/10 text-gray-900 dark:text-white hover:text-gray-900 dark:hover:text-white">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
