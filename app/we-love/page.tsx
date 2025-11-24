import React from 'react';
import ProductListing from '@/app/components/ProductListing';

export default function WeLovePage() {
    return (
        <ProductListing
            title="We Love"
            breadcrumbs={[{ label: 'Accueil', href: '/' }, { label: 'We Love', href: '/we-love' }]}
        />
    );
}
