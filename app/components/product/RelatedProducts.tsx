'use client';

import React from 'react';
import { Product } from '@/app/types/product';
import ProductCard from '@/app/components/ui/ProductCard';
import Link from 'next/link';

interface RelatedProductsProps {
    products: Product[];
    title?: string;
}

export default function RelatedProducts({ products, title = "Produits similaires" }: RelatedProductsProps) {
    if (products.length === 0) {
        return null;
    }

    // Transform Product to ProductCard format
    const transformedProducts = products.map(product => ({
        id: parseInt(product.id),
        brand: product.brand,
        name: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        image: product.images[0],
        condition: product.condition,
        slug: product.slug,
    }));

    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <h2 className="text-2xl sm:text-3xl font-serif mb-8 text-center">{title}</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {transformedProducts.map((product) => (
                        <Link
                            key={product.id}
                            href={`/product/${product.slug}`}
                            className="block"
                        >
                            <ProductCard product={product} />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
