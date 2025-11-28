'use client';

import React from 'react';
import HomeProductSection from '../ui/HomeProductSection';
import { getRandomProducts } from '@/app/utils/productMapper';

export default function RecentlyViewed() {
    const products = getRandomProducts(10);

    return (
        <HomeProductSection
            title="Récemment consultés"
            products={products}
        />
    );
}
