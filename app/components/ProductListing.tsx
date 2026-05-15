'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Leaf } from 'lucide-react';
import EmptyState from '@/app/components/EmptyState';
import CategoryHeader from '@/app/components/ui/CategoryHeader';
import { getProductDetails } from '@/app/utils/productUtils';

import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';

// ... Types ...
export interface Product {
    id: number;
    brand: string;
    category: string;
    size?: string;
    price: number;
    imageUrl?: string;
    image?: string;
    currency?: string;
    slug?: string;
    condition?: string;
    name?: string;
}

const BookmarkIcon = () => (
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

// --- UI Components ---

// 2. Carte Produit réutilisable
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    const productSlug = product.slug || `product-${product.id}`;
    const productImage = product.imageUrl || product.image || 'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop';
    const { location } = getProductDetails(String(product.id));

    return (
        <Link href={`/product/${productSlug}`} className="group flex flex-col p-4 relative bg-white border border-gray-200 hover:bg-gray-50 transition-colors h-full">
            {/* Image */}
            <div className="relative aspect-[3/3.5] mb-3 w-full flex items-center justify-center overflow-hidden bg-gray-50">
                <img
                    src={productImage}
                    alt={product.brand}
                    className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1 mt-1 flex-grow">
                {/* Brand + Heart */}
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm uppercase text-gray-900 tracking-wide truncate pr-2">
                        {product.brand}
                    </h3>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className="shrink-0"
                        aria-label="Ajouter aux favoris"
                    >
                        <Heart className="w-5 h-5 text-gray-900 hover:text-red-500 transition-colors cursor-pointer" strokeWidth={1} />
                    </button>
                </div>

                {/* Name */}
                <p className="text-gray-600 text-sm truncate">{product.name || product.category}</p>

                {/* Size */}
                {product.size && (
                    <p className="text-gray-500 text-sm mb-1">{product.size}</p>
                )}

                {/* Price */}
                <div className="mt-auto">
                    <span className="text-gray-900 font-bold text-base">{product.price} {product.currency || '€'}</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                    <Leaf size={12} strokeWidth={2} className="rotate-45" />
                    <span>{location}</span>
                </div>
            </div>
        </Link>
    );
};

interface ProductListingProps {
    title?: string;
    breadcrumbs?: Array<{ label: string; href: string }>;
    categoryFilter?: string;
}

import Pagination from '@/app/components/ui/Pagination';
import { useState, useMemo } from 'react';

// --- Main Layout ---
export default function ProductListing({
    title = "Tous les produits",
    breadcrumbs,
    categoryFilter,
    products = []
}: ProductListingProps & { products?: Product[] }) {
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
        <main className="min-h-screen bg-white font-sans">
            <Header />
            <div className="pt-[100px] md:pt-[120px]">
                <div className="max-w-[1600px] mx-auto px-6 py-8">

                    <CategoryHeader
                        title={title}
                        count={products.length}
                        breadcrumbs={breadcrumbs || []}
                    />

                    {/* Sub-Filters Actions */}
                    <div className="flex flex-col gap-4 mb-8">
                        <button className="text-sm font-medium text-black underline underline-offset-4 hover:text-gray-700 w-fit">
                            Tous les filtres +
                        </button>

                        <button className="flex items-center text-sm text-gray-500 hover:text-black transition-colors w-fit">
                            <BookmarkIcon />
                            <span className="underline decoration-gray-400 underline-offset-2">Enregistrer</span>
                        </button>
                    </div>

                    {/* Product Grid - With uniform sizing and borders */}
                    {currentProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-12">
                                {currentProducts.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    ) : (
                        <EmptyState message={`Aucun produit trouvé pour ${title}.`} />
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
