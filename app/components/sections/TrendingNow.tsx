import React from 'react';
import ProductCard from '../ui/ProductCard';
import { trendingItems } from '@/app/lib/data';
import Link from 'next/link';

const TrendingNow = () => {
    return (
        <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-end mb-8">
                <h2 className="text-3xl font-serif font-medium">Tendances du moment</h2>
                <Link href="/nouveautes" className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">Voir tout</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {trendingItems.map((product) => (
                    <Link key={product.id} href={`/product/${product.slug}`}>
                        <ProductCard product={product} />
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default TrendingNow;
