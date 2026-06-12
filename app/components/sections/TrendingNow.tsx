'use client';

import React from 'react';
import HomeProductSection, { Product } from '../ui/HomeProductSection';

interface TrendingNowProps {
    products: Product[];
}

const TrendingNow = ({ products }: TrendingNowProps) => {
    return (
        <HomeProductSection
            title="Tendances du moment"
            products={products}
            viewAllHref="/nouveautes?sort=popularity"
        />
    );
};

export default TrendingNow;
