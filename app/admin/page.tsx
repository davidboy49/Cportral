import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-server';
import { getAdminData } from '@/lib/data';
import { AdminPanel } from '@/components/admin/admin-panel';

export default async function AdminPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/?error=403');
  }

  const data = await getAdminData();

  return (
    <main className="mx-auto max-w-6xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Admin Portal</h1>
      <AdminPanel data={data} />
    </main>
  );
}
