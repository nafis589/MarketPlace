'use client';

import React from 'react';
import HomeProductSection from '../ui/HomeProductSection';
import { getRandomProducts } from '@/app/utils/productMapper';

const TopDeals = () => {
    const products = getRandomProducts(10);

    return (
        <HomeProductSection
            title="Offres Exceptionnelles"
            products={products}
        />
    );
};

export default TopDeals;
