'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, MapPin } from 'lucide-react';
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

    // Construct a valid URL for the product
    // Assuming a structure like /product/[id] or similar. 
    // If not defined, we can point to a generic product page or keep it simple.
    // The user didn't specify the product detail link format, but previous history suggests /product/[id] or similar.
    // I will use /product/[id] for now.
    const productUrl = `/product/${product.id}`;

    return (
        <Link href={productUrl} className="group flex flex-col border-r border-b border-gray-200 p-4 relative bg-white hover:z-10">
            <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
                    <Heart className="w-4 h-4 text-gray-900" />
                </button>
            </div>

            <div className="relative aspect-[3/3.5] overflow-hidden mb-4 bg-gray-50">
                <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>

            <div className="flex flex-col gap-1">
                <div className="flex justify-between items-start">
                    <h3 className="font-serif text-lg font-medium text-gray-900">{brand}</h3>
                    <span className="font-semibold text-gray-900">{price} €</span>
                </div>

                <p className="text-sm text-gray-600 capitalize">{product.title}</p>

                <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                    <span className="bg-gray-100 px-2 py-1 rounded-sm uppercase">{size}</span>
                    <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {location}
                    </span>
                </div>
            </div>
        </Link>
    );
}
