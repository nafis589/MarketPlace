import React from 'react';
import ProductListing from '@/app/components/ProductListing';
import { cloudinaryProducts } from '@/data/cloudinaryProducts';

export default function VintagePage() {
    // Simuler une sélection vintage
    const products = cloudinaryProducts
        .slice(200, 350)
        .map(p => ({
            id: p.id,
            brand: "Vintage Collection",
            category: p.category || "Vintage",
            price: Math.floor(Math.random() * 300) + 80,
            image: p.image,
            name: p.title,
            size: "M",
            currency: "€",
            type: p.type || "",
            condition: "Très bon état vintage"
        }));

    return (
        <ProductListing
            title="Vintage & Pre-owned"
            products={products as any}
            breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Vintage', href: '/vintage' }]}
        />
    );
}
