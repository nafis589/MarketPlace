import React from 'react';
import ProductListing from '@/app/components/ProductListing';

export default function NouveautesPage() {
    return (
        <ProductListing
            title="Nouveautés"
            breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Nouveautés', href: '/nouveautes' }]}
        />
    );
}
