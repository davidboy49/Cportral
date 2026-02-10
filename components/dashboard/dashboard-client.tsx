'use client';

import Image from 'next/image';
import { useMemo, useState, useTransition } from 'react';
import { AppItem, Category, PortalSettings } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { recordRecent, toggleFavorite, clearSessionToken } from '@/lib/actions';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Props {
  apps: AppItem[];
  categories: Category[];
  settings: PortalSettings;
  favorites: string[];
  recentIds: string[];
  userEmail: string;
}

export function DashboardClient({ apps, categories, settings, favorites, recentIds, userEmail }: Props) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return apps.filter((app) => {
      const categoryOk = activeCategory === 'all' || app.categoryId === activeCategory;
      const searchOk = [app.name, app.description, app.tags.join(' ')].join(' ').toLowerCase().includes(q);
      return categoryOk && searchOk;
    });
  }, [apps, query, activeCategory]);

  async function onOpen(appId: string, url: string) {
    startTransition(async () => {
      await recordRecent(appId);
      window.open(url, '_blank', 'noopener,noreferrer');
      router.refresh();
    });
  }

  async function onLogout() {
    await clearSessionToken();
    router.push('/login');
    router.refresh();
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {settings.logoUrl && <Image src={settings.logoUrl} alt="logo" width={34} height={34} className="rounded" />}
          <div>
            <h1 className="text-2xl font-semibold">{settings.portalName}</h1>
            <p className="text-sm text-slate-600">Signed in as {userEmail}</p>
          </div>
        </div>
        <Button variant="outline" onClick={onLogout}>Log out</Button>
      </header>

      <div className="space-y-3">
        <Input placeholder="Search by app, description, tags..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          <Button variant={activeCategory === 'all' ? 'default' : 'secondary'} onClick={() => setActiveCategory('all')}>All</Button>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={activeCategory === cat.id ? 'default' : 'secondary'}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((app) => {
          const isFav = favorites.includes(app.id);
          return (
            <Card key={app.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Image src={app.iconUrl} alt={app.name} width={36} height={36} className="rounded" />
                  <div>
                    <h2 className="font-semibold">{app.name}</h2>
                    <p className="text-sm text-slate-600">{app.description}</p>
                  </div>
                </div>
                <button
                  aria-label="favorite"
                  onClick={() => startTransition(() => toggleFavorite(app.id, isFav))}
                  className={isFav ? 'text-red-500' : 'text-slate-400'}
                >
                  <Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">{app.tags.map((t) => <Badge key={t}>{t}</Badge>)}</div>
              <Button disabled={pending} onClick={() => onOpen(app.id, app.url)} className="w-full">Open</Button>
            </Card>
          );
        })}
      </section>

      <Card>
        <h3 className="mb-2 font-semibold">Recently opened</h3>
        <ul className="list-disc pl-5 text-sm text-slate-700">
          {recentIds.length === 0 && <li>No recent apps yet.</li>}
          {recentIds.map((id) => {
            const app = apps.find((item) => item.id === id);
            return <li key={id}>{app?.name ?? id}</li>;
          })}
        </ul>
      </Card>
    </main>
  );
}
