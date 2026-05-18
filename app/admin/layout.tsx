import { AdminClientWrapper } from '@/components/sidebar/admin-client-wrapper';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminClientWrapper>{children}</AdminClientWrapper>;
}
