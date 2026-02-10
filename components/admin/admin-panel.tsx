import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { deleteApp, deleteCategory, updateSettings, updateUserRole, upsertApp, upsertCategory } from '@/lib/actions';

export function AdminPanel({ data }: { data: any }) {
  return (
    <Tabs defaultValue="apps">
      <TabsList>
        <TabsTrigger value="apps">Apps</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="apps" className="space-y-4">
        <Card>
          <h2 className="mb-2 font-semibold">Create / Update App</h2>
          <form action={upsertApp} className="grid gap-2 md:grid-cols-2">
            <input name="id" placeholder="id (optional for update)" className="rounded border p-2" />
            <input name="name" placeholder="name" className="rounded border p-2" required />
            <input name="url" placeholder="url" className="rounded border p-2" required />
            <input name="iconUrl" placeholder="icon url" className="rounded border p-2" required />
            <input name="categoryId" placeholder="category id" className="rounded border p-2" required />
            <input name="tags" placeholder="tag1,tag2" className="rounded border p-2" />
            <input name="description" placeholder="description" className="rounded border p-2 md:col-span-2" required />
            <label className="flex items-center gap-2"><input type="checkbox" name="isActive" defaultChecked />Active</label>
            <Button type="submit">Save App</Button>
          </form>
        </Card>
        {data.apps.map((app: any) => (
          <Card key={app.id} className="flex items-center justify-between">
            <div><p className="font-medium">{app.name}</p><p className="text-sm text-slate-600">{app.id}</p></div>
            <form action={async () => { 'use server'; await deleteApp(app.id); }}>
              <Button type="submit" variant="destructive">Delete</Button>
            </form>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="categories" className="space-y-4">
        <Card>
          <h2 className="mb-2 font-semibold">Create / Update Category</h2>
          <form action={upsertCategory} className="grid gap-2 md:grid-cols-2">
            <input name="id" placeholder="id (optional)" className="rounded border p-2" />
            <input name="name" placeholder="name" className="rounded border p-2" required />
            <input name="sortOrder" placeholder="sort order" className="rounded border p-2" defaultValue={0} />
            <label className="flex items-center gap-2"><input type="checkbox" name="isActive" defaultChecked />Active</label>
            <Button type="submit">Save Category</Button>
          </form>
        </Card>
        {data.categories.map((cat: any) => (
          <Card key={cat.id} className="flex items-center justify-between">
            <div><p className="font-medium">{cat.name}</p><p className="text-sm text-slate-600">{cat.id}</p></div>
            <form action={async () => { 'use server'; await deleteCategory(cat.id); }}>
              <Button type="submit" variant="destructive">Delete</Button>
            </form>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="users" className="space-y-3">
        {data.users.map((user: any) => (
          <Card key={user.uid} className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-slate-600">{user.role}</p>
            </div>
            <form action={updateUserRole} className="flex items-center gap-2">
              <input type="hidden" name="uid" value={user.uid} />
              <select name="role" defaultValue={user.role} className="rounded border p-2">
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
              <Button type="submit">Update</Button>
            </form>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="settings">
        <Card>
          <h2 className="mb-2 font-semibold">Global settings</h2>
          <form action={updateSettings} className="space-y-2">
            <input name="portalName" defaultValue={data.settings.portalName} className="w-full rounded border p-2" required />
            <input name="logoUrl" defaultValue={data.settings.logoUrl} className="w-full rounded border p-2" required />
            <Button type="submit">Save Settings</Button>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
