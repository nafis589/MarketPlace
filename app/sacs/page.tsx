import React from 'react';
import ProductListing from '@/app/components/ProductListing';
import { getProductsByFilter } from '@/app/lib/cloudinaryHelper';

export default function SacsPage() {
    const rawProducts = getProductsByFilter({ category: 'sacs' });
    const products = rawProducts.map(p => ({
        id: p.id,
        brand: "Friperie Luxe",
        category: p.category || "Sacs",
        price: Math.floor(Math.random() * 450) + 50,
        image: p.image,
        name: p.title,
        size: "M",
        currency: "€",
        type: p.type || ""
    }));

    return (
        <ProductListing
            title="Sacs"
            products={products as any}
            breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Sacs', href: '/sacs' }]}
        />
    );
}
