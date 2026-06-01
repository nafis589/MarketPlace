'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

// --- Icons Components (SVG) ---

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

const ChevronUp = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
    </svg>
);

const ChevronDown = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

import AuthModal from '@/app/components/auth/AuthModal';
import ProductDescription from './ProductDescription';
import RecentlyViewed from '@/app/components/sections/RecentlyViewed';
import HomeProductSection from '@/app/components/ui/HomeProductSection';
import { cloudinaryProducts } from '@/data/cloudinaryProducts';
import { getRandomProducts, mapCloudinaryToProduct } from '@/app/utils/productMapper';

interface ProductDetailProps {
    product: {
        id: string;
        title: string;
        brand: string;
        name: string;
        price: number;
        currency: string;
        image: string;
        category: string;
        type: string;
        gender: string;
    };
}

import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';

export default function ProductDetail({ product }: ProductDetailProps) {
    const { isLoggedIn } = useAuth();
    const { addToCart } = useCart();

    // Use product data or fallbacks
    const [selectedImage, setSelectedImage] = useState(product.image);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Create thumbnails from the same image for demo purposes since we only have one
    const thumbnails = [product.image, product.image, product.image, product.image];

    const handleAddToCart = () => {
        if (!isLoggedIn) {
            setIsAuthModalOpen(true);
        } else {
            addToCart(product);
        }
    };

    // Produits de la même catégorie pour la section "À découvrir"
    const relatedProducts = useMemo(() => {
        const sameCategory = cloudinaryProducts.filter(p => p.category === product.category && p.id !== product.id);
        // Mélanger et prendre 10 produits max
        const shuffled = [...sameCategory].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 10).map(mapCloudinaryToProduct);
    }, [product.category, product.id]);

    // Produits aléatoires pour "Récemment consultés"
    const recentlyViewedProducts = useMemo(() => getRandomProducts(10), []);

    return (
        <div className="bg-white font-sans text-gray-900">
            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 pt-8 pb-4 hidden md:block">
                <nav className="text-xs text-gray-500 flex items-center justify-center gap-2 flex-wrap">
                    <Link href="/" className="hover:text-black">Accueil</Link>
                    <span>›</span>
                    <Link href={`/${product.gender}`} className="hover:text-black capitalize">{product.gender}</Link>
                    <span>›</span>
                    <Link href={`/${product.gender}/${product.category}`} className="hover:text-black capitalize">{product.category}</Link>
                    <span>›</span>
                    <Link href={`/${product.gender}/${product.category}/${product.type}`} className="hover:text-black capitalize">{product.type}</Link>
                    <span>›</span>
                    <span className="text-gray-900 capitalize">{product.title}</span>
                </nav>
            </div>

            {/* Main Header */}
            <div className="text-center py-2 mb-2 md:py-4 md:mb-4">
                <h1 className="font-serif text-5xl mb-2 text-gray-900 capitalize">{product.brand || "Marketplace"}</h1>
                <p className="text-lg text-gray-600 capitalize">{product.title}</p>
            </div>

            {/* Content Grid */}
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 lg:pb-20">

                {/* Left Column: Image Gallery */}
                <div className="lg:col-span-7">

                    {/* Desktop View */}
                    <div className="hidden lg:flex gap-4">
                        {/* Thumbnails Sidebar */}
                        <div className="flex flex-col items-center gap-2 w-20 shrink-0">
                            <button className="p-1 hover:bg-gray-100 rounded">
                                <ChevronUp />
                            </button>
                            {thumbnails.map((src, idx) => (
                                <div
                                    key={idx}
                                    className={`w-16 h-16 border cursor-pointer overflow-hidden transition-all ${selectedImage === src ? 'border-black ring-1 ring-black' : 'border-gray-200 hover:border-gray-400'}`}
                                    onClick={() => setSelectedImage(src)}
                                >
                                    <img src={src} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                                </div>
                            ))}
                            <button className="p-1 hover:bg-gray-100 rounded">
                                <ChevronDown />
                            </button>
                        </div>

                        {/* Main Image Area */}
                        <div className="flex-1 relative bg-gray-50 flex items-center justify-center min-h-[500px]">
                            {/* Like Counter */}
                            <div className="absolute top-0 right-0 p-4 flex items-center gap-1 z-10">
                                <span className="text-sm">1</span>
                                <button className="hover:text-red-500">
                                    <HeartIcon />
                                </button>
                            </div>

                            <img
                                src={selectedImage}
                                alt={product.title}
                                className="max-h-[600px] object-contain mix-blend-multiply transition-opacity duration-300"
                            />
                        </div>
                    </div>

                    {/* Mobile View - Horizontal Scroll Carousel */}
                    <div className="lg:hidden relative">
                        {/* Like Counter Overlay */}
                        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                            <span className="text-xs font-medium">1</span>
                            <button className="text-gray-900 hover:text-red-500">
                                <HeartIcon />
                            </button>
                        </div>

                        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide bg-gray-50 aspect-[3/4]">
                            {thumbnails.map((src, idx) => (
                                <div key={idx} className="snap-center shrink-0 w-full h-full flex items-center justify-center relative p-4">
                                    <img
                                        src={src}
                                        alt={`${product.title} - view ${idx + 1}`}
                                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Scroll Indicator (Optional visual cue) */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 pointer-events-none">
                            {thumbnails.map((_, idx) => (
                                <div key={idx} className="w-1.5 h-1.5 rounded-full bg-gray-300/80" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Product Details */}
                <div className="lg:col-span-5 bg-gray-50/50 p-6 lg:pl-10">

                    {/* Price & Seller */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-medium">{product.price} {product.currency}</span>
                        </div>

                        <div className="flex flex-col items-end">
                            {/* Seller Avatar Placeholder */}
                            <div className="w-10 h-10 bg-gray-200 rounded-full mb-1 flex items-center justify-center text-gray-400">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <p className="text-xs text-gray-500">Mis en vente par <span className="text-gray-700">InfiniteDrip</span></p>
                        </div>
                    </div>

                    {/* Attributes */}
                    <div className="space-y-4 mb-8 text-sm text-gray-800">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-base">L International</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="font-medium text-base">Jamais porté</span>
                        </div>

                        <div className="font-medium text-base">
                            Noir, Coton
                        </div>
                    </div>


                    {/* Action Buttons */}
                    <div className="space-y-3 mb-8">
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors uppercase text-sm tracking-wide"
                        >
                            Ajouter au panier
                        </button>
                        <button className="w-full bg-white text-black border border-black py-3 font-medium hover:bg-gray-50 transition-colors uppercase text-sm tracking-wide">
                            Faire une offre
                        </button>
                    </div>

                </div>
            </div>

            {/* Product Description Section */}
            <ProductDescription product={product} />

            {/* À découvrir - Produits de la même catégorie */}
            {relatedProducts.length > 0 && (
                <HomeProductSection
                    title="À découvrir"
                    products={relatedProducts}
                />
            )}

            {/* Récemment consultés */}
            <RecentlyViewed products={recentlyViewedProducts} />
        </div>
    );
}
