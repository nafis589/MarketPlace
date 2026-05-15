'use client';

import React, { use } from 'react';
import ProductGrid from '@/app/components/ProductGrid';
import EmptyState from '@/app/components/EmptyState';
import CategoryHeader from '@/app/components/ui/CategoryHeader';
import { getProductsByFilter } from '@/app/lib/cloudinaryHelper';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export default function SacsCategoryPage({ params }: PageProps) {
    const { slug } = use(params);
    const category = slug[0];
    const subType = slug[1];

    let products = [];
    let title = "";

    if (subType) {
        products = getProductsByFilter({ category: 'sacs', type: subType });
        title = `${subType} Sacs`;
    } else {
        products = getProductsByFilter({ category: 'sacs', type: category });
        title = `${category} Sacs`;
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
                            { label: 'Sacs', href: '/sacs' },
                            ...(subType ? [
                                { label: category, href: `/sacs/${category}` },
                                { label: subType, href: `/sacs/${category}/${subType}` }
                            ] : [
                                { label: category, href: `/sacs/${category}` }
                            ])
                        ]}
                    />
                    {products.length > 0 ? (
                        <ProductGrid products={products} />
                    ) : (
                        <EmptyState message={`Aucun produit trouvé.`} />
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
