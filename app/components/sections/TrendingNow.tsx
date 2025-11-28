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
        />
    );
};

export default TrendingNow;
