import React from 'react';
import SectionTitle from '../../components/ui/SectionTitle';
import ProductGrid from '../../components/ui/ProductGrid';
import { getProductsByCategory, categories } from '../../lib/data';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return categories.map((category) => ({
        slug: category.slug,
    }));
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;
    const category = categories.find((c) => c.slug === slug);

    if (!category) {
        notFound();
    }

    const products = getProductsByCategory(slug);

    return (
        <main className="pt-[100px] pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
            <SectionTitle
                title={category.name}
                subtitle={`Découvrez notre sélection de ${category.name.toLowerCase()}.`}
            />
            {products.length > 0 ? (
                <ProductGrid products={products} />
            ) : (
                <p className="text-gray-500 text-lg">Aucun article trouvé dans cette catégorie pour le moment.</p>
            )}
        </main>
    );
}
