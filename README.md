# Next.js Firebase App Portal

Production-style internal App Portal built with Next.js App Router, Firebase Auth, Firestore, TailwindCSS, and server-side admin enforcement.

## Features

- Email/password authentication and optional Google sign-in.
- Protected dashboard (`/`) with:
  - app search (name/description/tags)
  - category chips
  - app cards + open in new tab
  - per-user favorites
  - per-user recently opened apps
- Admin portal (`/admin`) for ADMIN users only:
  - Apps CRUD
  - Categories CRUD
  - Users role management (USER/ADMIN)
  - Global settings (`settings/global`)
- Firebase Admin SDK server enforcement for all admin mutations.
- Zod validation for admin data mutations.
- Firestore security rules included in `firestore.rules`.

## Tech Stack

- Next.js 14+ App Router + TypeScript
- TailwindCSS with reusable UI primitives (shadcn-style patterns)
- Firebase Auth + Firestore
- Firebase Admin SDK
- Zod + server actions

## Firestore Data Model

- `users/{uid}`: `email`, `displayName`, `role`, `createdAt`
- `apps/{id}`: `name`, `url`, `description`, `iconUrl`, `categoryId`, `tags[]`, `isActive`, `createdAt`, `updatedAt`
- `categories/{id}`: `name`, `sortOrder`, `isActive`
- `users/{uid}/favorites/{appId}`: `createdAt`
- `users/{uid}/recent/{appId}`: `lastOpenedAt`
- `settings/global`: `portalName`, `logoUrl`

## Firebase Setup

1. Create a Firebase project.
2. Enable Authentication methods:
   - Email/Password
   - Google (optional)
3. Create Firestore (production mode recommended).
4. Create a service account key (Project settings > Service accounts).
5. Deploy Firestore rules:

```bash
firebase deploy --only firestore:rules
```

## Environment Variables

Copy `.env.example` to `.env.local` and populate values.

```bash
cp .env.example .env.local
```

Important notes:
- Keep `FIREBASE_ADMIN_PRIVATE_KEY` with escaped newlines (`\n`).
- Set `ADMIN_EMAIL` to bootstrap first admin role on initial login.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Admin Bootstrap + Seed

- On first login, if authenticated user's email matches `ADMIN_EMAIL`, the app creates `users/{uid}` with `role=ADMIN`.
- If no categories exist and this user is admin, app creates starter category + app.
- Optional seed script:

```bash
npm run seed
```

## Security Design

### Server-side enforcement

All admin mutations call `requireAdmin()` in server actions, which verifies session token and checks `users/{uid}.role === 'ADMIN'` using Firebase Admin SDK.

### Firestore rules summary

- Read active apps/categories/settings only if authenticated.
- Write access for apps/categories/settings requires admin role.
- Users may only write to their own `favorites` and `recent` subcollections.
- Users cannot self-upgrade role in rules; role changes require admin.

See full rules: [`firestore.rules`](./firestore.rules).

## Verification Checklist

1. Unauthenticated user redirected from `/` to `/login`.
2. Non-admin redirected away from `/admin` and receives server-side FORBIDDEN on admin actions.
3. Favorites/recent are scoped per user in subcollections.
4. Admin can CRUD apps/categories, change settings, and promote/demote users.

## Deploy Notes

- Deploy to Vercel or Cloud Run.
- Set all environment variables in deployment environment.
- For Vercel, ensure multiline private key is correctly escaped.
- Keep Firestore rules deployed and reviewed before production release.
