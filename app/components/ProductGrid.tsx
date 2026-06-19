'use client';

import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import Pagination from './ui/Pagination';

interface Product {
    id: string;
    brand: string;
    title: string;
    image: string;
    priceLabel: string;
    condition: string;
    vendorRegion: string;
    sold?: boolean;
}

interface ProductGridProps {
    products: Product[];
    pagination?: {
        currentPage: number;
        totalPages: number;
        onPageChange: (page: number) => void;
        disableNext?: boolean;
    };
}

export default function ProductGrid({ products, pagination }: ProductGridProps) {
    const [internalPage, setInternalPage] = useState(1);
    const itemsPerPage = 60;

    const useExternalPagination = Boolean(pagination);

    const totalPages = useExternalPagination
        ? pagination!.totalPages
        : Math.ceil(products.length / itemsPerPage);

    const currentPage = useExternalPagination ? pagination!.currentPage : internalPage;

    const currentProducts = useMemo(() => {
        if (useExternalPagination) return products;
        const startIndex = (currentPage - 1) * itemsPerPage;
        return products.slice(startIndex, startIndex + itemsPerPage);
    }, [products, currentPage, itemsPerPage, useExternalPagination]);

    const handlePageChange = (page: number) => {
        if (useExternalPagination) {
            pagination!.onPageChange(page);
        } else {
            setInternalPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const canGoNext = useExternalPagination
        ? !pagination?.disableNext && currentPage < totalPages
        : currentPage < totalPages;

    return (
        <div className="flex flex-col gap-12">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 border-t border-l border-gray-200 -mx-6 md:mx-0 items-stretch">
                {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    disableNext={useExternalPagination ? !canGoNext : currentPage >= totalPages}
                />
            )}
        </div>
    );
}
