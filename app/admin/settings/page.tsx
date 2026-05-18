export default function AdminSettingsPage() {
  return (
    <div className="space-y-4 w-full mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-white">Admin Settings</h1>
        <p className="text-sm text-[#64748b] dark:text-[#94a3b8] mt-1">
          Configure platform-wide settings, access controls, and preferences.
        </p>
      </div>

      <div className="bg-white dark:bg-[#1e212b] rounded-xl border border-gray-200 dark:border-[#2a2e3d] shadow-sm overflow-hidden animate-pulse">
        <div className="flex border-b border-gray-200 dark:border-[#2a2e3d]">
          {/* Tabs skeleton */}
          <div className="px-6 py-4 border-b-2 border-gray-300 dark:border-gray-500 w-32">
            <div className="h-4 bg-gray-200 dark:bg-[#2a2e3d] rounded w-full"></div>
          </div>
          <div className="px-6 py-4 w-32">
            <div className="h-4 bg-gray-100 dark:bg-[#2a2e3d]/50 rounded w-3/4"></div>
          </div>
          <div className="px-6 py-4 w-32">
            <div className="h-4 bg-gray-100 dark:bg-[#2a2e3d]/50 rounded w-4/5"></div>
          </div>
        </div>

        <div className="p-5 space-y-6">
          {/* Section 1 */}
          <div>
            <div className="h-5 bg-gray-200 dark:bg-[#2a2e3d] rounded w-48 mb-4"></div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="h-3 bg-gray-200 dark:bg-[#2a2e3d] rounded w-24 mb-2"></div>
                  <div className="h-10 bg-gray-100 dark:bg-[#16181d] border border-gray-200 dark:border-[#2a2e3d] rounded-lg w-full"></div>
                </div>
                <div>
                  <div className="h-3 bg-gray-200 dark:bg-[#2a2e3d] rounded w-32 mb-2"></div>
                  <div className="h-10 bg-gray-100 dark:bg-[#16181d] border border-gray-200 dark:border-[#2a2e3d] rounded-lg w-full"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-gray-200 dark:bg-[#2a2e3d]"></div>

          {/* Section 2 (Toggles) */}
          <div>
            <div className="h-5 bg-gray-200 dark:bg-[#2a2e3d] rounded w-40 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-gray-200 dark:bg-[#2a2e3d] rounded w-48 mb-1.5"></div>
                    <div className="h-3 bg-gray-100 dark:bg-[#2a2e3d]/50 rounded w-64"></div>
                  </div>
                  <div className="w-11 h-6 bg-gray-200 dark:bg-[#2a2e3d] rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
             <div className="h-10 w-24 bg-gray-100 dark:bg-[#2a2e3d] rounded-lg"></div>
             <div className="h-10 w-32 bg-gray-200 dark:bg-[#3a3f58] rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
