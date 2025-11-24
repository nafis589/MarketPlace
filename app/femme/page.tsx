import React from 'react';
import ProductListing from '@/app/components/ProductListing';

export default function FemmePage() {
    return (
        <ProductListing
            title="Femme"
            breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Femme', href: '/femme' }]}
        />
    );
}
