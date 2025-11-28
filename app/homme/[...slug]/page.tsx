'use client';

import React, { use } from 'react';
import Link from 'next/link';
import ProductGrid from '@/app/components/ProductGrid';
import EmptyState from '@/app/components/EmptyState';
import CategoryHeader from '@/app/components/ui/CategoryHeader';
import {
    getHommeProductsByCategory,
    getHommeProductsByType,
    getUniqueTypesByCategory
} from '@/app/lib/cloudinaryHelper';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';

export default function HommeCategoryPage({ params }: PageProps) {
    const { slug } = use(params);
    // Unpack slug
    // slug[0] -> category (e.g. "vetements")
    // slug[1] -> type (e.g. "pantalons")
    const category = slug[0];
    const type = slug[1];

    let products = [];
    let title = "";
    let subCategories: string[] = [];

    if (type) {
        // Level 2: Category + Type (e.g. /homme/vetements/pantalons)
        products = getHommeProductsByType(category, type);
        title = `${type} Homme`;
    } else {
        // Level 1: Category only (e.g. /homme/vetements)
        products = getHommeProductsByCategory(category);
        title = `${category} Homme`;
        subCategories = getUniqueTypesByCategory(category);
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
                            { label: 'Homme', href: '/homme' },
                            ...(type ? [
                                { label: category, href: `/homme/${category}` },
                                { label: type, href: `/homme/${category}/${type}` }
                            ] : [
                                { label: category, href: `/homme/${category}` }
                            ])
                        ]}
                    />

                    {/* Sub-categories Navigation (only on Category page) */}
                    {!type && subCategories.length > 0 && (
                        <div className="flex overflow-x-auto gap-3 mb-8 pb-2 scrollbar-hide">
                            {subCategories.map((sub) => (
                                <Link
                                    key={sub}
                                    href={`/homme/${category}/${sub}`}
                                    className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-black hover:text-white transition-colors capitalize whitespace-nowrap flex-shrink-0"
                                >
                                    {sub}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Products Grid */}
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
