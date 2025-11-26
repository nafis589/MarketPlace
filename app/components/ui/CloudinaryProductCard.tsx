'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CloudinaryProduct } from '@/app/lib/cloudinaryHelper';

interface CloudinaryProductCardProps {
    product: CloudinaryProduct;
}

const CloudinaryProductCard: React.FC<CloudinaryProductCardProps> = ({ product }) => {
    return (
        <Link href={`/produit/${product.id}`} className="group block h-full">
            <div className="relative bg-white border border-gray-200 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                {/* Image Container - Aspect Ratio 3:4 */}
                <div className="relative w-full aspect-[3/4] bg-gray-50 overflow-hidden">
                    <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                        loading="lazy"
                    />
                    {/* Heart Icon */}
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

                {/* Product Info */}
                <div className="p-4 flex flex-col gap-1.5 flex-grow bg-white">
                    <h3 className="font-bold text-sm text-black uppercase tracking-wide line-clamp-1">
                        {product.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs text-gray-500 capitalize">
                        <span>{product.category}</span>
                        {product.type && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span>{product.type}</span>
                            </>
                        )}
                    </div>

                    <div className="mt-auto pt-2 border-t border-gray-100">
                        <span className="font-bold text-base text-gray-900">
                            Nous consulter
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default CloudinaryProductCard;
