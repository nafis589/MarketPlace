'use client';

import React from 'react';
import HomeProductSection from '../ui/HomeProductSection';
import { getRandomProducts } from '@/app/utils/productMapper';

export default function BestsellersSection() {
    const products = getRandomProducts(10);

    return (
        <HomeProductSection
            title="Nos best-sellers"
            products={products}
        />
    );
}
