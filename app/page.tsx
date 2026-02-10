import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-server';
import { getPortalData } from '@/lib/data';
import { DashboardClient } from '@/components/dashboard/dashboard-client';

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const data = await getPortalData(user.uid);
  return (
    <DashboardClient
      apps={data.apps}
      categories={data.categories}
      settings={data.settings}
      favorites={data.favorites}
      recentIds={data.recentIds}
      userEmail={user.email}
    />
  );
}
