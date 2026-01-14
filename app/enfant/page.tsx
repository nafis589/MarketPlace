import React from 'react';
import ProductListing from '@/app/components/ProductListing';
import { getEnfantProducts } from '@/app/lib/cloudinaryHelper';

export default function EnfantPage() {
    const rawProducts = getEnfantProducts();
    const products = rawProducts.map(p => ({
        id: p.id,
        brand: "Friperie Luxe",
        category: p.category || "",
        price: Math.floor(Math.random() * 450) + 50,
        image: p.image,
        name: p.title,
        size: "M",
        currency: "€",
        type: p.type || ""
    }));

    return (
        <ProductListing
            title="Enfant"
            products={products as any}
            breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Enfant', href: '/enfant' }]}
        />
    );
}
