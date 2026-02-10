'use client';

import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { firebaseAuth, googleProvider } from '@/lib/firebase-client';
import { bootstrapUser, setSessionToken } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    try {
      const email = String(formData.get('email'));
      const password = String(formData.get('password'));
      const displayName = String(formData.get('displayName') || email.split('@')[0]);
      const cred =
        mode === 'login'
          ? await signInWithEmailAndPassword(firebaseAuth, email, password)
          : await createUserWithEmailAndPassword(firebaseAuth, email, password);

      if (mode === 'signup') {
        await updateProfile(cred.user, { displayName });
      }

      const token = await cred.user.getIdToken();
      await setSessionToken(token);
      await bootstrapUser({ uid: cred.user.uid, email: cred.user.email || email, displayName });
      router.push('/');
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleGoogle() {
    try {
      const cred = await signInWithPopup(firebaseAuth, googleProvider);
      const token = await cred.user.getIdToken();
      await setSessionToken(token);
      await bootstrapUser({
        uid: cred.user.uid,
        email: cred.user.email || '',
        displayName: cred.user.displayName || cred.user.email || 'User'
      });
      router.push('/');
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <h1 className="text-2xl font-semibold">{mode === 'login' ? 'Sign in' : 'Create account'}</h1>
      <Input name="email" type="email" placeholder="you@company.com" required />
      {mode === 'signup' && <Input name="displayName" placeholder="Display name" required />}
      <Input name="password" type="password" placeholder="Password" required minLength={6} />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full">{mode === 'login' ? 'Sign in' : 'Sign up'}</Button>
      <Button type="button" variant="outline" className="w-full" onClick={handleGoogle}>
        Continue with Google
      </Button>
      <button
        type="button"
        className="text-sm text-blue-600"
        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
      >
        {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
      </button>
    </form>
  );
}
