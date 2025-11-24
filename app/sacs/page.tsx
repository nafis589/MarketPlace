import React from 'react';
import ProductListing from '@/app/components/ProductListing';

export default function SacsPage() {
    return (
        <ProductListing
            title="Sacs"
            breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Sacs', href: '/sacs' }]}
        />
    );
}
