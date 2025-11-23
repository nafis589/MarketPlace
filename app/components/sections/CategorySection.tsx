import React from 'react';
import CategoryCard from '../ui/CategoryCard';
import { categories } from '@/app/lib/data';
import Link from 'next/link';

const CategorySection = () => {
    return (
        <section className="py-16 md:py-24 px-4 md:px-8 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                <div>
                    <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Acheter par catégorie</h2>
                    <p className="text-gray-600 max-w-md">Explorez notre sélection de pièces de luxe authentifiées, triées pour vous.</p>
                </div>
                <Link href="/nouveautes" className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">Voir tout</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>
        </section>
    );
};

export default CategorySection;
