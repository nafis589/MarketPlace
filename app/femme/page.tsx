import React from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import ProductGrid from '../components/ui/ProductGrid';
import { getAllProducts } from '../lib/data';

export default function FemmePage() {
    const products = getAllProducts().filter(p => p.category === 'vetements' || p.category === 'sacs' || p.category === 'chaussures');

    return (
        <main className="pt-[100px] pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
            <SectionTitle
                title="Femme"
                subtitle="La sélection mode femme : vêtements, sacs, chaussures et accessoires."
            />
            <ProductGrid products={products} />
        </main>
    );
}
