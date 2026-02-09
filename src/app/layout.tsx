import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/Header';
import { CategoryNav } from '@/components/layout/CategoryNav';
import { AuthInit } from '@/components/auth/AuthInit';
import { Suspense } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'E-Commerce Store',
  description: 'Amazon-inspired shopping experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
        <AuthInit />
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <Suspense fallback={<div className="h-10 bg-muted/20 animate-pulse" />}>
            <CategoryNav />
          </Suspense>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
