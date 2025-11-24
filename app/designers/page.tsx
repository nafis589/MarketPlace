import React from 'react';
import ProductListing from '@/app/components/ProductListing';

export default function DesignersPage() {
    return (
        <ProductListing
            title="Designers"
            breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'Designers', href: '/designers' }]}
        />
    );
}
