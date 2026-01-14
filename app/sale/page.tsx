import React from 'react';
import ProductListing from '@/app/components/ProductListing';
import { cloudinaryProducts } from '@/data/cloudinaryProducts';

export default function SalePage() {
    // Get random products for sale
    const products = cloudinaryProducts
        .slice(0, 150)
        .map(p => ({
            id: p.id,
            brand: "Friperie Luxe",
            category: p.category || "Promo",
            price: Math.floor(Math.random() * 200) + 20,
            image: p.image,
            name: p.title,
            size: "M",
            currency: "€",
            type: p.type || "",
            condition: "Excellent état"
        }));

    return (
        <ProductListing
            title="Archives & Promos"
            products={products as any}
            breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Sale', href: '/sale' }]}
        />
    );
}
