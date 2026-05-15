'use client';

import React from 'react';

import ProductGrid from '@/app/components/ProductGrid';
import EmptyState from '@/app/components/EmptyState';
import CategoryHeader from '@/app/components/ui/CategoryHeader';
import { getHommeProducts } from '@/app/lib/cloudinaryHelper';

import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';

export default function HommePage() {
    const products = getHommeProducts();

    return (
        <main className="min-h-screen bg-white font-sans">
            <Header />
            <div className="pt-[100px] md:pt-[120px]">
                <div className="max-w-[1600px] mx-auto px-6 py-8">

                    <CategoryHeader
                        title="Mode Homme"
                        count={products.length}
                        breadcrumbs={[
                            { label: 'Accueil', href: '/' },
                            { label: 'Homme', href: '/homme' }
                        ]}
                    />

                    {/* All Products Grid */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-6">Tous les produits ({products.length})</h2>
                        {products.length > 0 ? (
                            <ProductGrid products={products} />
                        ) : (
                            <EmptyState message="Aucun produit trouvé." />
                        )}
                    </div>

                </div>
            </div>
            <Footer />
        </main>
    );
}
