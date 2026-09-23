import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Suraksha Parivar - Family Anti-Scam Shield for India',
  description: 'Detect digital scams in English, Hindi, and Marathi. Alert family guardians in 1 tap and get guided first-30-minutes incident response.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0F766E',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen antialiased selection:bg-teal-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
