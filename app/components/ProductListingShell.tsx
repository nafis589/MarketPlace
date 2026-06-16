'use client';

import { Suspense, type ReactNode } from 'react';

import Footer from '@/app/components/sections/Footer';
import Header from '@/app/components/sections/Header';

function ListingFallback() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-64 animate-pulse rounded bg-gray-100" />
      <div className="h-8 w-48 animate-pulse rounded bg-gray-100" />
      <div className="grid grid-cols-2 gap-0 border-l border-t border-gray-200 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse border-r border-b border-gray-200 bg-gray-100" />
        ))}
      </div>
    </div>
  );
}

export default function ProductListingShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-white font-sans">
      <Header />
      <div className="pt-[100px] md:pt-[120px]">
        <div className="mx-auto max-w-[1600px] px-6 py-8">
          <Suspense fallback={<ListingFallback />}>{children}</Suspense>
        </div>
      </div>
      <Footer />
    </main>
  );
}
