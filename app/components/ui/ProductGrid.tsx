import React from 'react';
import ProductCard from './ProductCard';

interface Product {
    id: number;
    brand: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    image: string;
    condition?: string;
}

interface ProductGridProps {
    products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;
