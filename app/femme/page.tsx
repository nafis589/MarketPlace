import React from 'react';
import ProductListing from '@/app/components/ProductListing';
import { cloudinaryProducts } from '@/data/cloudinaryProducts';

export default function FemmePage() {
    // Simuler le mapping vers le type Product attendu par ProductListing
    const products = cloudinaryProducts
        .filter(p => p.gender === 'femme')
        .map(p => ({
            id: Number(p.id.slice(0, 8)), // Simulation ID numérique
            brand: "Friperie Luxe",
            category: p.category || "Vêtements",
            price: Math.floor(Math.random() * 450) + 50,
            image: p.image,
            name: p.title,
            size: "M",
            currency: "€",
            type: p.type || ""
        }));

    return (
        <ProductListing
            title="Femme"
            products={products as any}
            breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Femme', href: '/femme' }]}
        />
    );
}
