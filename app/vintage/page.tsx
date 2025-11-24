import React from 'react';
import ProductListing from '@/app/components/ProductListing';

export default function VintagePage() {
    return (
        <ProductListing
            title="Vintage"
            breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Vintage', href: '/vintage' }]}
        />
    );
}
