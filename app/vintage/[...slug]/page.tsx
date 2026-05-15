'use client';

import React, { use } from 'react';
import ProductGrid from '@/app/components/ProductGrid';
import EmptyState from '@/app/components/EmptyState';
import CategoryHeader from '@/app/components/ui/CategoryHeader';
import { getProductsByFilter } from '@/app/lib/cloudinaryHelper';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';
import { unslugify } from '@/app/lib/routing-utils';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export default function VintageCategoryPage({ params }: PageProps) {
    const { slug } = use(params);
    const category = slug[0];
    const type = slug[1];

    let products = [];
    let title = "";

    if (type) {
        products = getProductsByFilter({ category, type });
        title = `${type} Vintage`;
    } else {
        products = getProductsByFilter({ category });
        title = `${unslugify(category)} Vintage`;
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
                            { label: 'Vintage', href: '/vintage' },
                            ...(type ? [
                                { label: unslugify(category), href: `/vintage/${category}` },
                                { label: unslugify(type), href: `/vintage/${category}/${type}` }
                            ] : [
                                { label: unslugify(category), href: `/vintage/${category}` }
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
