import React from 'react';
import ProductCard from '../ui/ProductCard';
import { recentlyViewed } from '@/app/lib/data';
import Link from 'next/link';

const RecentlyViewed = () => {
    return (
        <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto border-t border-gray-100">
            <h2 className="text-2xl font-serif font-medium mb-8">Récemment consultés</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {recentlyViewed.map((product) => (
                    <Link key={product.id} href={`/product/${product.slug}`}>
                        <ProductCard product={product} />
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default RecentlyViewed;
