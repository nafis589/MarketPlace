import React from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import ProductGrid from '../components/ui/ProductGrid';
import { getAllProducts } from '../lib/data';

export default function NouveautesPage() {
    const products = getAllProducts().slice(0, 12); // Just taking a mix for demo

    return (
        <main className="pt-[100px] pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
            <SectionTitle
                title="Nouveautés"
                subtitle="Découvrez les dernières pépites dénichées par notre communauté."
            />
            <ProductGrid products={products} />
        </main>
    );
}
