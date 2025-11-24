import React from 'react';
import ProductListing from '@/app/components/ProductListing';

export default function HommePage() {
    return (
        <ProductListing
            title="Homme"
            breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Homme', href: '/homme' }]}
        />
    );
}
