'use client';

import { use } from 'react';

import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';
import VendorProfile from '@/app/components/vendor/VendorProfile';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function VendorPage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <main className="min-h-screen bg-white font-sans">
      <Header />
      <div className="pt-[100px] md:pt-[120px]">
        <VendorProfile vendorId={id} />
      </div>
      <Footer />
    </main>
  );
}
