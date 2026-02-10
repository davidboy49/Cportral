import { cookies } from 'next/headers';
import { adminAuth, adminDb } from './firebase-admin';
import { UserProfile } from '@/types';

export async function getCurrentUser() {
  const token = cookies().get('session-token')?.value;
  if (!token) return null;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const userRef = adminDb.collection('users').doc(decoded.uid);
    const doc = await userRef.get();
    const data = doc.data() as UserProfile | undefined;
    return {
      uid: decoded.uid,
      email: decoded.email ?? '',
      role: data?.role ?? 'USER',
      displayName: data?.displayName ?? decoded.name ?? ''
    };
  } catch {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error('UNAUTHORIZED');
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'ADMIN') throw new Error('FORBIDDEN');
  return user;
}
