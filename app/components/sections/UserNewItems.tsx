'use client';

import React from 'react';
import HomeProductSection, { Product } from '../ui/HomeProductSection';

interface UserNewItemsProps {
    products: Product[];
}

const UserNewItems = ({ products }: UserNewItemsProps) => {
    return (
        <HomeProductSection
            title="Vos nouveautés"
            products={products}
            viewAllHref="/nouveautes?sort=newest"
        />
    );
};

export default UserNewItems;
