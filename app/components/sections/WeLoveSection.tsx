'use client';

import React from 'react';
import HomeProductSection, { Product } from '../ui/HomeProductSection';

interface WeLoveSectionProps {
    products: Product[];
}

export default function WeLoveSection({ products }: WeLoveSectionProps) {
    return (
        <HomeProductSection
            title="We Love"
            products={products}
            viewAllHref="/nouveautes?tag=we_love"
        />
    );
}
