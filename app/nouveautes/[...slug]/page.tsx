import React from 'react';
import ProductListing from '@/app/components/ProductListing';
import { getPageMetadata } from '@/app/lib/routing-utils';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export default async function NouveautesCategoryPage({ params }: PageProps) {
    const resolvedParams = await params;
    const path = `/nouveautes/${resolvedParams.slug.join('/')}`;
    const metadata = getPageMetadata(path);

    return (
        <ProductListing
            title={metadata.title}
            breadcrumbs={metadata.breadcrumbs}
        />
    );
}
