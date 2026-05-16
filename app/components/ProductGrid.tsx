'use client';

import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import Pagination from './ui/Pagination';

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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 60;

    const totalPages = Math.ceil(products.length / itemsPerPage);

    const currentProducts = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return products.slice(startIndex, startIndex + itemsPerPage);
    }, [products, currentPage, itemsPerPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="flex flex-col gap-12">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 border-t border-l border-gray-200 -mx-6 md:mx-0">
                {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
