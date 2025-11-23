import React from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import ProductGrid from '../components/ui/ProductGrid';
import { getProductsByCategory } from '../lib/data';

export default function SacsPage() {
    const products = getProductsByCategory('sacs');

    return (
        <main className="pt-[100px] pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
            <SectionTitle
                title="Sacs de Luxe"
                subtitle="Investissez dans des pièces intemporelles."
            />
            <ProductGrid products={products} />
        </main>
    );
}
