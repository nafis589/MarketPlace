'use client';

import React from 'react';
import HomeProductSection from '../ui/HomeProductSection';
import { getRandomProducts } from '@/app/utils/productMapper';

const TrendingNow = () => {
    const products = getRandomProducts(10);

    return (
        <HomeProductSection
            title="Tendances du moment"
            products={products}
        />
    );
};

export default TrendingNow;
