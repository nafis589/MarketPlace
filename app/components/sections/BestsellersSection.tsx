import React from 'react';
import ProductCard from '../ui/ProductCard';
import { bestsellers } from '@/app/lib/data';
import Link from 'next/link';

const BestsellersSection = () => {
    return (
        <section className="py-16 bg-gray-50 px-4 md:px-8">
            <div className="max-w-[1600px] mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Nos Best-sellers</h2>
                    <p className="text-gray-600">Les pièces les plus convoitées du moment.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
                    {bestsellers.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/nouveautes" className="inline-block px-8 py-3 border border-black text-black hover:bg-black hover:text-white transition-colors duration-300 uppercase text-sm tracking-widest font-medium">Voir plus de best-sellers</Link>
                </div>
            </div>
        </section>
    );
};

export default BestsellersSection;
