'use client';

import React from 'react';
import CloudinaryProductCard from './CloudinaryProductCard';
import { CloudinaryProduct } from '@/app/lib/cloudinaryHelper';

interface CloudinaryProductGridProps {
    products: CloudinaryProduct[];
    emptyMessage?: string;
}

const CloudinaryProductGrid: React.FC<CloudinaryProductGridProps> = ({
    products,
    emptyMessage = "Aucun produit trouvé dans cette catégorie."
}) => {
    if (products.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-gray-500 text-lg">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
            {products.map((product) => (
                <CloudinaryProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default CloudinaryProductGrid;
