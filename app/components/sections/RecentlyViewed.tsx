'use client';

import React from 'react';
import HomeProductSection, { Product } from '../ui/HomeProductSection';

interface RecentlyViewedProps {
    products: Product[];
}

export default function RecentlyViewed({ products }: RecentlyViewedProps) {
    return (
        <HomeProductSection
            title="Récemment consultés"
            products={products}
        />
    );
}
