import Link from "next/link";
import { SearchX, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#f37a2a]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-6 relative z-10">
        <div className="mx-auto w-24 h-24 bg-[#f37a2a]/10 rounded-full flex items-center justify-center mb-4 shadow-sm border border-[#f37a2a]/20">
          <SearchX className="h-10 w-10 text-[#f37a2a]" />
        </div>
        <h1 className="text-8xl font-black text-gray-900 dark:text-white tracking-tighter opacity-10 dark:opacity-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 select-none">404</h1>
        
        <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Page Not Found</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="pt-6 flex justify-center">
          <Link href="/">
            <Button className="bg-[#292F54] hover:bg-[#1f2441] dark:bg-white dark:hover:bg-gray-200 dark:text-black text-white font-bold px-8 h-12 shadow-lg">
              <Home className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
