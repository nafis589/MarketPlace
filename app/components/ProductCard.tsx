'use client';

import Link from 'next/link';
import { Heart, Leaf } from 'lucide-react';
import { getProductDetails } from '@/app/utils/productUtils';

interface Product {
    id: string;
    title: string;
    image: string;
    category?: string | null;
    type?: string | null;
    folder?: string;
}

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { brand, size, location, price } = getProductDetails(product.id);
    const productUrl = `/product/${product.id}`;

    return (
        <Link href={productUrl} className="group flex flex-col border-r border-b border-gray-200 p-4 relative bg-white hover:bg-gray-50 transition-colors">
            {/* Image */}
            <div className="relative aspect-[3/3.5] mb-3 w-full flex items-center justify-center overflow-hidden bg-gray-50">
                <img
                    src={product.image}
                    alt={product.title}
                    className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                />
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1 mt-1">
                {/* Brand + Heart */}
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm uppercase text-gray-900 tracking-wide truncate pr-2">
                        {brand}
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
                <p className="text-gray-600 text-sm truncate">{product.title}</p>

                {/* Size */}
                <p className="text-gray-500 text-sm mb-1">{size}</p>

                {/* Price */}
                <div className="mt-auto">
                    <span className="text-gray-900 font-bold text-base">{price} €</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                    <Leaf size={12} strokeWidth={2} className="rotate-45" />
                    <span>{location}</span>
                </div>
            </div>
        </Link>
    );
}
