'use client';

import ProductCard from './ProductCard';

interface Product {
    id: string;
    title: string;
    image: string;
    category?: string | null;
    type?: string | null;
    folder?: string;
    gender?: string;
}

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border-t border-l border-gray-200">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
