import React from 'react';
import ProductListing from '@/app/components/ProductListing';

export default function BijouxMontresPage() {
    return (
        <ProductListing
            title="Bijoux & Montres"
            breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Bijoux & Montres', href: '/bijoux-montres' }]}
        />
    );
}
