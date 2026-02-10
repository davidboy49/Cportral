import { adminDb } from './firebase-admin';
import { AppItem, Category, PortalSettings } from '@/types';

export async function getPortalData(uid: string) {
  const [appsSnap, catSnap, settingsDoc, favoritesSnap, recentSnap] = await Promise.all([
    adminDb.collection('apps').where('isActive', '==', true).get(),
    adminDb.collection('categories').where('isActive', '==', true).orderBy('sortOrder', 'asc').get(),
    adminDb.collection('settings').doc('global').get(),
    adminDb.collection('users').doc(uid).collection('favorites').get(),
    adminDb
      .collection('users')
      .doc(uid)
      .collection('recent')
      .orderBy('lastOpenedAt', 'desc')
      .limit(5)
      .get()
  ]);

  const apps: AppItem[] = appsSnap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<AppItem, 'id'>) }));
  const categories: Category[] = catSnap.docs.map((doc) => ({ id: doc.id, ...(doc.data() as Omit<Category, 'id'>) }));
  const settings = (settingsDoc.data() as PortalSettings | undefined) ?? {
    portalName: 'App Portal',
    logoUrl: ''
  };
  const favorites = new Set(favoritesSnap.docs.map((doc) => doc.id));
  const recentIds = recentSnap.docs.map((doc) => doc.id);

  return { apps, categories, settings, favorites: Array.from(favorites), recentIds };
}

export async function getAdminData() {
  const [appsSnap, catSnap, usersSnap, settingsDoc] = await Promise.all([
    adminDb.collection('apps').get(),
    adminDb.collection('categories').orderBy('sortOrder', 'asc').get(),
    adminDb.collection('users').get(),
    adminDb.collection('settings').doc('global').get()
  ]);

  return {
    apps: appsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    categories: catSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    users: usersSnap.docs.map((doc) => ({ uid: doc.id, ...doc.data() })),
    settings: settingsDoc.data() ?? { portalName: 'App Portal', logoUrl: '' }
  };
}
