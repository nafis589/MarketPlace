'use client';

import React, { use } from 'react';
import ProductGrid from '@/app/components/ProductGrid';
import EmptyState from '@/app/components/EmptyState';
import CategoryHeader from '@/app/components/ui/CategoryHeader';
import { getProductsByCategory } from '@/app/lib/cloudinaryHelper';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function CategoryPage({ params }: PageProps) {
    const { slug } = use(params);
    const products = getProductsByCategory(slug);
    const title = slug.charAt(0).toUpperCase() + slug.slice(1);

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
                            { label: title, href: `/categories/${slug}` },
                        ]}
                    />

                    {/* Products Grid */}
                    {products.length > 0 ? (
                        <ProductGrid products={products} />
                    ) : (
                        <EmptyState message={`Oups ! Aucun produit trouvé dans la catégorie ${title} pour le moment.`} />
                    )}

                </div>
            </div>
            <Footer />
        </main>
    );
}
