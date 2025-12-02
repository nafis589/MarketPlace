import React from 'react';
import ProductListing from '@/app/components/ProductListing';

export default function SalePage() {
    return (
        <ProductListing
            title="Sale"
            breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Sale', href: '/sale' }]}
        />
    );
}
