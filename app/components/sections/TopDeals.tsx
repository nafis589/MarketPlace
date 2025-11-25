import React from 'react';
import ProductCard from '../ui/ProductCard';
import { topDeals } from '@/app/lib/data';
import Link from 'next/link';

const TopDeals = () => {
    return (
        <section className="py-16 px-4 md:px-8 bg-red-50/30">
            <div className="max-w-[1600px] mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-serif font-medium text-red-900">Offres Exceptionnelles</h2>
                    <Link href="/nouveautes" className="text-red-700 font-medium hover:underline">Jusqu'à -70% &rarr;</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {topDeals.map((product) => (
                        <Link key={product.id} href={`/product/${product.slug}`}>
                            <ProductCard product={product} />
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TopDeals;
