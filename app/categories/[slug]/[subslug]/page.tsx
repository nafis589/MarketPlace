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
        slug: string;
        subslug: string;
    }>;
}

export default function SubcategoryPage({ params }: PageProps) {
    const { slug, subslug } = use(params);
    
    // Fetch products filtered by the parent category slug and subcategory type slug
    const products = getProductsByFilter({
        category: slug,
        type: subslug
    });

    const categoryTitle = slug.charAt(0).toUpperCase() + slug.slice(1);
    const subcategoryTitle = subslug.charAt(0).toUpperCase() + subslug.slice(1);

    return (
        <main className="min-h-screen bg-white font-sans">
            <Header />
            <div className="pt-[100px] md:pt-[120px]">
                <div className="max-w-[1600px] mx-auto px-6 py-8">

                    <CategoryHeader
                        title={subcategoryTitle}
                        count={products.length}
                        breadcrumbs={[
                            { label: 'Accueil', href: '/' },
                            { label: categoryTitle, href: `/categories/${slug}` },
                            { label: subcategoryTitle, href: `/categories/${slug}/${subslug}` },
                        ]}
                    />

                    {/* Products Grid */}
                    {products.length > 0 ? (
                        <ProductGrid products={products} />
                    ) : (
                        <EmptyState message={`Oups ! Aucun produit trouvé dans la sous-catégorie ${subcategoryTitle} de la catégorie ${categoryTitle} pour le moment.`} />
                    )}

                </div>
            </div>
            <Footer />
        </main>
    );
}
