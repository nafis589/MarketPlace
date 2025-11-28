'use client';

import React from 'react';
import HomeProductSection, { Product } from '../ui/HomeProductSection';

interface TopDealsProps {
    products: Product[];
}

const TopDeals = ({ products }: TopDealsProps) => {
    return (
        <HomeProductSection
            title="Offres Exceptionnelles"
            products={products}
        />
    );
};

export default TopDeals;
