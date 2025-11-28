'use client';

import React from 'react';
import HomeProductSection, { Product } from '../ui/HomeProductSection';

interface BestsellersSectionProps {
    products: Product[];
}

export default function BestsellersSection({ products }: BestsellersSectionProps) {
    return (
        <HomeProductSection
            title="Nos best-sellers"
            products={products}
        />
    );
}
