import { AdminSidebar } from '@/components/sidebar/admin-sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black">
      <AdminSidebar />
      <main className="flex-1 ml-64 min-h-screen overflow-x-hidden">{children}</main>
    </div>
  );
}
