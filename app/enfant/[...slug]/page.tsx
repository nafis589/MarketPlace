import React from 'react';

import ProductListing from '@/app/components/ProductListing';
import { getPageMetadata } from '@/app/lib/routing-utils';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

import { getEnfantProductsByCategory, getEnfantProductsByType } from '@/app/lib/cloudinaryHelper';

export default async function EnfantCategoryPage({ params }: PageProps) {
    const resolvedParams = await params;
    const { slug } = resolvedParams;
    const path = `/enfant/${slug.join('/')}`;
    const metadata = getPageMetadata(path);

    const category = slug[0];
    const type = slug[1];

    let rawProducts = [];
    if (type) {
        rawProducts = getEnfantProductsByType(category, type);
    } else {
        rawProducts = getEnfantProductsByCategory(category);
    }

    const products = rawProducts.map(p => ({
        id: p.id,
        brand: "Friperie Luxe",
        category: p.category || "",
        price: Math.floor(Math.random() * 450) + 50,
        image: p.image,
        name: p.title,
        size: "M",
        currency: "€",
        type: p.type || ""
    }));

    return (
        <ProductListing
            title={metadata.title}
            breadcrumbs={metadata.breadcrumbs}
            products={products as any}
        />
    );
}
