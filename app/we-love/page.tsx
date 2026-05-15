'use client';

import React from 'react';
import ProductGrid from '@/app/components/ProductGrid';
import EmptyState from '@/app/components/EmptyState';
import CategoryHeader from '@/app/components/ui/CategoryHeader';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';

export default function WeLovePage() {
    return (
        <main className="min-h-screen bg-white font-sans">
            <Header />
            <div className="pt-[100px] md:pt-[120px]">
                <div className="max-w-[1600px] mx-auto px-6 py-8">
                    <CategoryHeader
                        title="We Love"
                        count={0}
                        breadcrumbs={[
                            { label: 'Accueil', href: '/' },
                            { label: 'We Love', href: '/we-love' }
                        ]}
                    />
                    <EmptyState message="Aucun produit trouvé." />
                </div>
            </div>
            <Footer />
        </main>
    );
}
