import React from 'react';
import ProductListing from '@/app/components/ProductListing';

export default function EnfantPage() {
    return (
        <ProductListing
            title="Enfant"
            breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Enfant', href: '/enfant' }]}
        />
    );
}
