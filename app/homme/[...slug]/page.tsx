'use client';

import React, { use } from 'react';
import Link from 'next/link';
import CloudinaryProductGrid from '@/app/components/ui/CloudinaryProductGrid';
import {
    getHommeProductsByCategory,
    getHommeProductsByType,
    getUniqueTypesByCategory
} from '@/app/lib/cloudinaryHelper';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export default function HommeCategoryPage({ params }: PageProps) {
    const { slug } = use(params);
    // Unpack slug
    // slug[0] -> category (e.g. "vetements")
    // slug[1] -> type (e.g. "pantalons")
    const category = slug[0];
    const type = slug[1];

    let products = [];
    let title = "";
    let subCategories: string[] = [];

    if (type) {
        // Level 2: Category + Type (e.g. /homme/vetements/pantalons)
        products = getHommeProductsByType(category, type);
        title = `${type} Homme`;
    } else {
        // Level 1: Category only (e.g. /homme/vetements)
        products = getHommeProductsByCategory(category);
        title = `${category} Homme`;
        subCategories = getUniqueTypesByCategory(category);
    }

    return (
        <div className="min-h-screen bg-white font-sans">
            <div className="max-w-[1600px] mx-auto px-6 py-8">

                {/* Breadcrumbs */}
                <nav className="flex text-sm text-gray-500 mb-4 capitalize">
                    <Link href="/" className="hover:text-black transition-colors">Accueil</Link>
                    <span className="mx-2">/</span>
                    <Link href="/homme" className="hover:text-black transition-colors">Homme</Link>
                    <span className="mx-2">/</span>
                    {type ? (
                        <>
                            <Link href={`/homme/${category}`} className="hover:text-black transition-colors">{category}</Link>
                            <span className="mx-2">/</span>
                            <span className="text-black font-medium">{type}</span>
                        </>
                    ) : (
                        <span className="text-black font-medium">{category}</span>
                    )}
                </nav>

                {/* Header Title */}
                <h1 className="text-4xl font-serif mb-8 text-gray-900 capitalize">{title}</h1>

                {/* Sub-categories Navigation (only on Category page) */}
                {!type && subCategories.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-8">
                        {subCategories.map((sub) => (
                            <Link
                                key={sub}
                                href={`/homme/${category}/${sub}`}
                                className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700 hover:bg-black hover:text-white transition-colors capitalize"
                            >
                                {sub}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Products Grid */}
                <CloudinaryProductGrid products={products} />

            </div>
        </div>
    );
}
