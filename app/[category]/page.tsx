import React from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import ProductGrid from '../components/ui/ProductGrid';
import { getAllProducts } from '../lib/data';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
    const { category } = await params;

    // Simple mapping to display a nice title
    const formatTitle = (slug: string) => {
        return slug
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // In a real app, we would fetch products based on the category/slug
    // For now, we show all products or filter if possible
    const products = getAllProducts();

    return (
        <main className="pt-[100px] pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
            <SectionTitle
                title={formatTitle(category)}
                subtitle={`Découvrez notre sélection pour ${formatTitle(category)}.`}
            />

            {products.length > 0 ? (
                <ProductGrid products={products} />
            ) : (
                <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">Aucun article trouvé pour le moment.</p>
                </div>
            )}
        </main>
    );
}
