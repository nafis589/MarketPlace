'use client';

import React, { use } from 'react';
import ProductGrid from '@/app/components/ProductGrid';
import EmptyState from '@/app/components/EmptyState';
import CategoryHeader from '@/app/components/ui/CategoryHeader';
import { getFemmeProductsByCategory, getFemmeProductsByType } from '@/app/lib/cloudinaryHelper';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export default function FemmeCategoryPage({ params }: PageProps) {
    const { slug } = use(params);
    const category = slug[0];
    const type = slug[1];

    let products = [];
    let title = "";

    if (type) {
        products = getFemmeProductsByType(category, type);
        title = `${type} Femme`;
    } else {
        products = getFemmeProductsByCategory(category);
        title = `${category} Femme`;
    }

    return (
        <main className="min-h-screen bg-white font-sans">
            <Header />
            <div className="pt-[100px] md:pt-[120px]">
                <div className="max-w-[1600px] mx-auto px-6 py-8">
                    <CategoryHeader
                        title={title}
                        count={products.length}
                        breadcrumbs={[
                            { label: 'Accueil', href: '/' },
                            { label: 'Femme', href: '/femme' },
                            ...(type ? [
                                { label: category, href: `/femme/${category}` },
                                { label: type, href: `/femme/${category}/${type}` }
                            ] : [
                                { label: category, href: `/femme/${category}` }
                            ])
                        ]}
                    />
                    {products.length > 0 ? (
                        <ProductGrid products={products} />
                    ) : (
                        <EmptyState message={`Aucun produit trouvé dans ${title}.`} />
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
