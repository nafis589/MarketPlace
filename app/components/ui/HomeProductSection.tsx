'use client';

import React, { useRef } from 'react';
import { ChevronRight, Heart, Leaf } from 'lucide-react';
import Link from 'next/link';

// --- Types ---
export type BadgeType = 'BLACK_FRIDAY' | 'WE_LOVE' | null;

export interface Product {
    id: number | string;
    brand: string;
    name: string;
    size: string;
    price: number;
    oldPrice?: number; // Prix barré
    currency: string;
    location: string;
    imageUrl: string;
    badge: BadgeType;
    hasDuties?: boolean; // Mention "+ Duties"
}

// --- Composant Badge ---
const ProductBadge = ({ type }: { type: BadgeType }) => {
    if (type === 'BLACK_FRIDAY') {
        return (
            <span className="bg-[#3D0A0A] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                Black Friday
            </span>
        );
    }
    if (type === 'WE_LOVE') {
        return (
            <span className="bg-white text-gray-800 border border-gray-300 text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                We Love
            </span>
        );
    }
    return null;
};

interface HomeProductSectionProps {
    title: string;
    products: Product[];
}

// --- Composant Principal ---
export default function HomeProductSection({ title, products }: HomeProductSectionProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-gray-50 py-10 px-6 font-sans">

            {/* Titre */}
            <h2 className="text-4xl font-serif text-[#0B1E3B] mb-6">
                {title}
            </h2>

            {/* Conteneur Carousel (Relatif pour positionner la flèche) */}
            <div className="relative max-w-[1600px] mx-auto group/section">

                {/* Grille de produits (Scrollable) */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide bg-white border border-gray-200 divide-x divide-gray-200"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/product/product-${product.id}`}
                            className="snap-start shrink-0 w-1/2 sm:w-[280px] md:w-[300px] xl:w-1/5 group relative p-4 flex flex-col hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[3/3.5] mb-3 w-full flex items-center justify-center overflow-hidden">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                />

                                {/* Badge positionné en bas à gauche de l'image */}
                                {product.badge && (
                                    <div className="absolute bottom-0 left-0">
                                        <ProductBadge type={product.badge} />
                                    </div>
                                )}
                            </div>

                            {/* Infos Produit */}
                            <div className="flex flex-col gap-1 mt-1">

                                {/* Marque + Coeur */}
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-sm uppercase text-gray-900 tracking-wide truncate pr-2">
                                        {product.brand}
                                    </h3>
                                    <Heart className="w-5 h-5 text-gray-900 hover:text-red-500 transition-colors cursor-pointer shrink-0" strokeWidth={1} />
                                </div>

                                {/* Nom */}
                                <p className="text-gray-600 text-sm truncate">{product.name}</p>

                                {/* Taille */}
                                <p className="text-gray-500 text-sm mb-1">{product.size}</p>

                                {/* Prix */}
                                <div className="mt-auto">
                                    {product.oldPrice ? (
                                        <div className="flex flex-col leading-tight">
                                            <span className="text-gray-400 text-sm line-through decoration-1">
                                                {product.currency}{product.oldPrice}
                                            </span>
                                            <span className="text-[#D32F2F] font-bold text-base">
                                                {product.currency}{product.price}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-gray-900 font-bold text-base">
                                                {product.currency}{product.price}
                                            </span>
                                            {product.hasDuties && (
                                                <span className="text-gray-500 text-sm">+ Duties</span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Localisation */}
                                <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                                    <Leaf size={12} strokeWidth={2} className="rotate-45" />
                                    <span>{product.location}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Bouton "Suivant" (Flèche) */}
                <button
                    onClick={scrollRight}
                    className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-white border border-black w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors shadow-sm hidden lg:flex"
                    aria-label="Voir plus"
                >
                    <ChevronRight size={20} strokeWidth={1} />
                </button>

            </div>
        </div>
    );
}
