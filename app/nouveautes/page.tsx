import React from 'react';
import ProductListing from '@/app/components/ProductListing';
import { getRecentProducts } from '@/app/lib/cloudinaryHelper';

export default function NouveautesPage() {
    const rawProducts = getRecentProducts(120); // More than 60 to test pagination
    const products = rawProducts.map(p => ({
        id: p.id,
        brand: "Friperie Luxe",
        category: p.category || "Nouveauté",
        price: Math.floor(Math.random() * 450) + 50,
        image: p.image,
        name: p.title,
        size: "M",
        currency: "€",
        type: p.type || ""
    }));

    return (
        <ProductListing
            title="Nouveautés"
            products={products as any}
            breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Nouveautés', href: '/nouveautes' }]}
        />
    );
}
