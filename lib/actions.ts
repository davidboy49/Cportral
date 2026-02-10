'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { adminDb } from './firebase-admin';
import { appSchema, categorySchema, roleSchema, settingsSchema } from './schemas';
import { requireAdmin, requireAuth } from './auth-server';

const now = () => new Date().toISOString();

export async function setSessionToken(token: string) {
  cookies().set('session-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/'
  });
}

export async function clearSessionToken() {
  cookies().delete('session-token');
}

export async function bootstrapUser(payload: { uid: string; email: string; displayName: string }) {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const isAdmin = payload.email.toLowerCase() === adminEmail;
  const ref = adminDb.collection('users').doc(payload.uid);
  const exists = await ref.get();
  if (!exists.exists) {
    await ref.set({
      email: payload.email,
      displayName: payload.displayName,
      role: isAdmin ? 'ADMIN' : 'USER',
      createdAt: now()
    });
  }

  const settingsRef = adminDb.collection('settings').doc('global');
  const settingsDoc = await settingsRef.get();
  if (!settingsDoc.exists) {
    await settingsRef.set({
      portalName: 'App Portal',
      logoUrl: 'https://www.gstatic.com/devrel-devsite/prod/v8f4d8c7e9ea38943b403fc6f989de99f5f7adf393f5f9554f65231d31589f89c/firebase/images/lockup.svg'
    });
  }

  const categorySnap = await adminDb.collection('categories').limit(1).get();
  if (categorySnap.empty && isAdmin) {
    const catRef = adminDb.collection('categories').doc();
    await catRef.set({ name: 'Engineering', sortOrder: 1, isActive: true });
    const appRef = adminDb.collection('apps').doc();
    await appRef.set({
      name: 'Observability',
      url: 'https://console.cloud.google.com',
      description: 'Cloud dashboards and logs',
      iconUrl: 'https://www.gstatic.com/images/branding/product/2x/cloud_48dp.png',
      categoryId: catRef.id,
      tags: ['infra', 'logs'],
      isActive: true,
      createdAt: now(),
      updatedAt: now()
    });
  }
}

export async function toggleFavorite(appId: string, favorited: boolean) {
  const user = await requireAuth();
  const ref = adminDb.collection('users').doc(user.uid).collection('favorites').doc(appId);
  if (favorited) {
    await ref.delete();
  } else {
    await ref.set({ createdAt: now() });
  }
  revalidatePath('/');
}

export async function recordRecent(appId: string) {
  const user = await requireAuth();
  await adminDb.collection('users').doc(user.uid).collection('recent').doc(appId).set({
    lastOpenedAt: now()
  });
  revalidatePath('/');
}

export async function upsertApp(formData: FormData) {
  await requireAdmin();
  const parsed = appSchema.parse({
    id: formData.get('id') || undefined,
    name: formData.get('name'),
    url: formData.get('url'),
    description: formData.get('description'),
    iconUrl: formData.get('iconUrl'),
    categoryId: formData.get('categoryId'),
    tags: String(formData.get('tags') || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean),
    isActive: formData.get('isActive') === 'on'
  });

  const ref = parsed.id
    ? adminDb.collection('apps').doc(parsed.id)
    : adminDb.collection('apps').doc();

  await ref.set(
    {
      ...parsed,
      createdAt: parsed.id ? undefined : now(),
      updatedAt: now()
    },
    { merge: true }
  );

  revalidatePath('/admin');
  revalidatePath('/');
}

export async function deleteApp(id: string) {
  await requireAdmin();
  await adminDb.collection('apps').doc(id).delete();
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function upsertCategory(formData: FormData) {
  await requireAdmin();
  const parsed = categorySchema.parse({
    id: formData.get('id') || undefined,
    name: formData.get('name'),
    sortOrder: formData.get('sortOrder'),
    isActive: formData.get('isActive') === 'on'
  });
  const ref = parsed.id
    ? adminDb.collection('categories').doc(parsed.id)
    : adminDb.collection('categories').doc();
  await ref.set({ name: parsed.name, sortOrder: parsed.sortOrder, isActive: parsed.isActive }, { merge: true });
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await adminDb.collection('categories').doc(id).delete();
  revalidatePath('/admin');
  revalidatePath('/');
}

export async function updateUserRole(formData: FormData) {
  await requireAdmin();
  const parsed = roleSchema.parse({ uid: formData.get('uid'), role: formData.get('role') });
  await adminDb.collection('users').doc(parsed.uid).set({ role: parsed.role }, { merge: true });
  revalidatePath('/admin');
}

export async function updateSettings(formData: FormData) {
  await requireAdmin();
  const parsed = settingsSchema.parse({
    portalName: formData.get('portalName'),
    logoUrl: formData.get('logoUrl')
  });
  await adminDb.collection('settings').doc('global').set(parsed, { merge: true });
  revalidatePath('/admin');
  revalidatePath('/');
}
