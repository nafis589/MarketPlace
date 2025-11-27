'use client';

import React from 'react';
import Link from 'next/link';
import CloudinaryProductGrid from '@/app/components/ui/CloudinaryProductGrid';
import { getHommeProducts, getCategoryImages } from '@/app/lib/cloudinaryHelper';

import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';

export default function HommePage() {
    const products = getHommeProducts();
    const categories = getCategoryImages();

    return (
        <main className="min-h-screen bg-white font-sans">
            <Header />
            <div className="pt-[72px] md:pt-[88px]">
                <div className="max-w-[1600px] mx-auto px-6 py-8">

                    {/* Breadcrumbs */}
                    <nav className="flex text-sm text-gray-500 mb-4">
                        <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
                        <span className="mx-2">/</span>
                        <span className="text-black font-medium">Homme</span>
                    </nav>

                    {/* Header Title */}
                    <h1 className="text-4xl font-serif mb-8 text-gray-900">Mode Homme</h1>

                    {/* Categories Navigation */}
                    <div className="mb-12">
                        <h2 className="text-xl font-bold mb-6">Parcourir par catégorie</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {categories.map((cat) => (
                                <Link
                                    key={cat.label}
                                    href={cat.href}
                                    className="group block text-center"
                                >
                                    <div className="relative w-full aspect-square bg-gray-100 rounded-full overflow-hidden mb-3 mx-auto border border-transparent group-hover:border-gray-300 transition-all">
                                        {cat.image && (
                                            <img
                                                src={cat.image}
                                                alt={cat.label}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        )}
                                    </div>
                                    <span className="text-sm font-medium uppercase tracking-wide group-hover:underline underline-offset-4">
                                        {cat.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* All Products Grid */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-6">Tous les produits ({products.length})</h2>
                        <CloudinaryProductGrid products={products} />
                    </div>

                </div>
            </div>
            <Footer />
        </main>
    );
}
