'use client';

import React from 'react';
import HomeProductSection from '../ui/HomeProductSection';
import { homeProducts } from '@/app/data/homeSectionsData';

export default function RecentlyViewed() {
    return (
        <HomeProductSection
            title="Récemment consultés"
            products={homeProducts}
        />
    );
}
