'use client';

import React from 'react';
import HomeProductSection from '../ui/HomeProductSection';
import { getRandomProducts } from '@/app/utils/productMapper';

const UserNewItems = () => {
    const products = getRandomProducts(10);

    return (
        <HomeProductSection
            title="Vos nouveautés"
            products={products}
        />
    );
};

export default UserNewItems;
