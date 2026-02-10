import { adminDb } from '../lib/firebase-admin';

async function seed() {
  const catRef = adminDb.collection('categories').doc('general');
  await catRef.set({ name: 'General', sortOrder: 1, isActive: true }, { merge: true });

  await adminDb.collection('apps').doc('firebase-console').set(
    {
      name: 'Firebase Console',
      url: 'https://console.firebase.google.com',
      description: 'Manage Firebase resources',
      iconUrl: 'https://www.gstatic.com/devrel-devsite/prod/v8f4d8c7e9ea38943b403fc6f989de99f5f7adf393f5f9554f65231d31589f89c/firebase/images/lockup.svg',
      categoryId: 'general',
      tags: ['firebase', 'admin'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );

  await adminDb.collection('settings').doc('global').set(
    {
      portalName: 'App Portal',
      logoUrl:
        'https://www.gstatic.com/devrel-devsite/prod/v8f4d8c7e9ea38943b403fc6f989de99f5f7adf393f5f9554f65231d31589f89c/firebase/images/lockup.svg'
    },
    { merge: true }
  );

  console.log('Seed completed');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
