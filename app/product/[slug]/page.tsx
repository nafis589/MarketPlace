'use client';

import React, { use } from 'react';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';
import ProductDetail from '@/app/components/product/ProductDetail';
import { cloudinaryProducts } from '@/data/cloudinaryProducts';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function ProductPage({ params }: PageProps) {
    const { slug } = use(params);

    // Parse slug to find product
    // Slug format from ProductListing: product-{id}
    // Or just check if slug contains the ID
    const productId = slug.replace('product-', '');
    const productData = cloudinaryProducts.find(p => p.id === productId);

    if (!productData) {
        notFound();
    }

    // Map to ProductDetail props
    // We generate some random data for fields missing in Cloudinary
    const product = {
        id: productData.id,
        title: productData.title,
        brand: "Marketplace", // Default brand
        name: productData.title,
        price: 69, // Default or random price
        currency: "€",
        image: productData.image,
        category: productData.category || 'vetements',
        type: productData.type || 'general',
        gender: productData.gender || 'homme'
    };

    return (
        <main className="min-h-screen bg-white font-sans">
            <Header />
            <div className="pt-[100px] md:pt-[120px]">
                <ProductDetail product={product} />
            </div>
            <Footer />
        </main>
    );
}
