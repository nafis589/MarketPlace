'use client';

import React from 'react';
import HomeProductSection from '../ui/HomeProductSection';
import { weLoveProducts } from '@/app/data/homeSectionsData';

export default function WeLoveSection() {
    return (
        <HomeProductSection
            title="We Love"
            products={weLoveProducts}
        />
    );
}
