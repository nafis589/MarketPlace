import React from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import ProductGrid from '../components/ui/ProductGrid';
import { getAllProducts } from '../lib/data';

export default function HommePage() {
    // Mocking filtering for men, just taking some items for now as data is limited
    const products = getAllProducts().slice(4, 10);

    return (
        <main className="pt-[100px] pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
            <SectionTitle
                title="Homme"
                subtitle="L'élégance au masculin : pièces iconiques et tendances."
            />
            <ProductGrid products={products} />
        </main>
    );
}
