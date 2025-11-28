'use client';

import React from 'react';
import HomeProductSection from '../ui/HomeProductSection';
import { getRandomProducts } from '@/app/utils/productMapper';

export default function WeLoveSection() {
    const products = getRandomProducts(10);

    return (
        <HomeProductSection
            title="We Love"
            products={products}
        />
    );
}
