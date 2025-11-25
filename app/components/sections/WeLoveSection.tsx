import React from 'react';
import ProductCard from '../ui/ProductCard';
import { weLove } from '@/app/lib/data';
import Link from 'next/link';

const WeLoveSection = () => {
    return (
        <section className="py-16 px-4 md:px-8 bg-[#f5f5f0]">
            <div className="max-w-[1600px] mx-auto">
                <div className="text-center mb-12">
                    <span className="text-sm uppercase tracking-widest text-gray-500 mb-2 block">Sélection de l'équipe</span>
                    <h2 className="text-3xl md:text-4xl font-serif font-medium">We Love</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {weLove.map((product) => (
                        <Link key={product.id} href={`/product/${product.slug}`}>
                            <ProductCard product={product} />
                        </Link>
                    ))}
                </div>
                <div className="mt-12 text-center">
                    <Link href="/nouveautes" className="inline-block px-8 py-3 bg-white border border-black text-black hover:bg-black hover:text-white transition-colors duration-300 uppercase text-sm tracking-widest font-medium">Voir la sélection</Link>
                </div>
            </div>
        </section>
    );
};

export default WeLoveSection;
