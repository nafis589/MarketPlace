import React from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import ProductGrid from '../components/ui/ProductGrid';
import { getAllProducts } from '../lib/data';

export default function VintagePage() {
    // Mocking vintage selection
    const products = getAllProducts().filter((_, i) => i % 2 === 0);

    return (
        <main className="pt-[100px] pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
            <SectionTitle
                title="Vintage"
                subtitle="Des pièces rares qui ont une histoire."
            />
            <ProductGrid products={products} />
        </main>
    );
}
