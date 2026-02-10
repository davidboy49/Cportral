import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'App Portal',
  description: 'Internal app portal built with Firebase + Next.js'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
