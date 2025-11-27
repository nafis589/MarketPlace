'use client';

import React from 'react';
import HomeProductSection from '../ui/HomeProductSection';
import { bestSellersProducts } from '@/app/data/homeSectionsData';

export default function BestsellersSection() {
    return (
        <HomeProductSection
            title="Nos best-sellers"
            products={bestSellersProducts}
        />
    );
}
