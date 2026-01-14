import React from 'react';
import ProductListing from '@/app/components/ProductListing';
import { getProductsByFilter } from '@/app/lib/cloudinaryHelper';

export default function BijouxMontresPage() {
    const rawProducts = [
        ...getProductsByFilter({ category: 'bijoux' }),
        ...getProductsByFilter({ category: 'montres' })
    ];

    const products = rawProducts.map(p => ({
        id: p.id,
        brand: "Friperie Luxe",
        category: p.category || "Accessoires",
        price: Math.floor(Math.random() * 950) + 150,
        image: p.image,
        name: p.title,
        size: "Unique",
        currency: "€",
        type: p.type || ""
    }));

    return (
        <ProductListing
            title="Bijoux & Montres"
            products={products as any}
            breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Bijoux & Montres', href: '/bijoux-montres' }]}
        />
    );
}
