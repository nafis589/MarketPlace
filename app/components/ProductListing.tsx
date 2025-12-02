'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import EmptyState from '@/app/components/EmptyState';
import CategoryHeader from '@/app/components/ui/CategoryHeader';

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

    return (
        <Link href={`/product/${productSlug}`} className="group block h-full">
            <div className="relative bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                {/* Zone Image - Fixed aspect ratio */}
                <div className="relative w-full aspect-[3/4] bg-gray-50 overflow-hidden">
                    <Image
                        src={productImage}
                        alt={product.brand}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                    />
                    {/* Heart Icon - positioned top right */}
                    <div className="absolute top-3 right-3 z-10">
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                            }}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-sm"
                            aria-label="Ajouter aux favoris"
                        >
                            <svg className="w-4 h-4 text-gray-800 hover:text-red-600 hover:fill-current transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Infos Produit */}
                <div className="p-4 flex flex-col gap-1.5 flex-grow bg-white">
                    <h3 className="font-bold text-sm text-black uppercase tracking-wide line-clamp-1">
                        {product.brand}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-2">{product.name || product.category}</p>

                    {product.condition && (
                        <p className="text-xs text-gray-500">{product.condition}</p>
                    )}

                    {product.size && (
                        <p className="text-sm text-gray-500">{product.size}</p>
                    )}

                    <div className="mt-auto pt-2 border-t border-gray-100">
                        <span className="font-bold text-base text-gray-900">
                            {product.price} {product.currency || '€'}
                        </span>
                    </div>
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

// --- Main Layout ---
export default function ProductListing({
    title = "Tous les produits",
    breadcrumbs,
    categoryFilter,
    products = []
}: ProductListingProps & { products?: Product[] }) {
    // Use passed products


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
                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState message={`Aucun produit trouvé pour ${title}.`} />
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
