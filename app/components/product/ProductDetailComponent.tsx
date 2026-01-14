'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/app/types/product';

// --- Icons Components (SVG Inline) ---

const HeartIcon = () => (
    <svg className="w-5 h-5 text-gray-800 cursor-pointer hover:text-red-600 hover:fill-current transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

const InfoIcon = () => (
    <svg className="w-4 h-4 text-gray-400 ml-1 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PinIcon = () => (
    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
    </svg>
);

const ArrowDownIcon = () => (
    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

// --- Sub-Components ---

const Breadcrumb = ({ categories }: { categories: string[] }) => (
    <nav className="text-[10px] sm:text-xs text-gray-400 mb-6 flex flex-wrap gap-1 items-center" aria-label="Breadcrumb">
        <span>Accueil</span> <span>{'>'}</span>
        {categories.map((cat, index) => (
            <React.Fragment key={index}>
                <span className={index === categories.length - 1 ? 'text-gray-500' : ''}>{cat}</span>
                {index < categories.length - 1 && <span>{'>'}</span>}
            </React.Fragment>
        ))}
    </nav>
);

const ImageGallery = ({ images }: { images: string[] }) => {
    const [selectedImage, setSelectedImage] = useState<string>(images[0]);

    return (
        <div className="flex flex-col sm:flex-row gap-4 h-full">
            {/* Left Vertical Thumbnails */}
            <div className="flex sm:flex-col gap-2 order-2 sm:order-1 overflow-x-auto sm:overflow-y-auto no-scrollbar sm:h-[500px] min-w-[60px]">
                {images.map((img, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(img)}
                        aria-label={`View image ${index + 1}`}
                        className={`
              w-14 h-16 sm:w-16 sm:h-20 flex-shrink-0 border overflow-hidden
              ${selectedImage === img ? 'border-black' : 'border-transparent hover:border-gray-300'}
            `}
                    >
                        <Image src={img} alt={`Thumbnail ${index + 1}`} width={64} height={80} className="w-full h-full object-cover" />
                    </button>
                ))}
                {/* Bouton 'voir plus' simulé par une flèche comme sur l'image */}
                <button className="w-14 h-8 sm:w-16 flex items-center justify-center border border-gray-300 mt-1" aria-label="Show more images">
                    <ArrowDownIcon />
                </button>
            </div>

            {/* Main Image Display */}
            <div className="flex-1 order-1 sm:order-2 relative flex items-center justify-center bg-white min-h-[400px] sm:min-h-[500px]">
                <Image
                    src={selectedImage}
                    alt="Main Product"
                    width={500}
                    height={500}
                    className="max-w-full max-h-[500px] object-contain"
                    priority
                />
            </div>
        </div>
    );
};

import AuthModal from '@/app/components/auth/AuthModal';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';

// --- Main Component ---

interface ProductDetailProps {
    product: Product;
}

export default function ProductDetailComponent({ product }: ProductDetailProps) {
    const { isLoggedIn } = useAuth();
    const { addToCart } = useCart();
    const p = product;
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleAddToCart = () => {
        if (!isLoggedIn) {
            setIsAuthModalOpen(true);
        } else {
            addToCart(p);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            {/* Auth Modal */}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">

                <Breadcrumb categories={[...p.categories, p.title]} />

                {/* Header Centered */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-serif text-black mb-2">{p.brand}</h1>
                    <p className="text-lg text-gray-600">{p.title}</p>
                    {p.isBlackFriday && (
                        <div className="mt-3">
                            <span className="bg-[#420D09] text-white text-xs px-2 py-1 uppercase tracking-wide font-medium">
                                Black Friday
                            </span>
                        </div>
                    )}
                </div>

                {/* Layout Grid: Left (Gallery) - Right (Info) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">

                    {/* --- LEFT COLUMN: IMAGES --- */}
                    <div className="lg:col-span-7 relative">
                        {/* Like Counter floating top right of the image area */}
                        <div className="absolute top-0 right-0 sm:right-10 z-10 flex items-center gap-1 text-sm text-gray-600">
                            <span>{p.likes || 0}</span>
                            <HeartIcon />
                        </div>

                        <ImageGallery images={p.images} />
                    </div>

                    {/* --- RIGHT COLUMN: INFO --- */}
                    <div className="lg:col-span-5 bg-[#F9F9F9] p-6 sm:p-8 mt-8 lg:mt-0 rounded-sm">

                        {/* Seller Info */}
                        {p.seller && (
                            <div className="flex flex-col items-end mb-6">
                                <div className="relative">
                                    <Image
                                        src={p.seller.avatar || 'https://i.pravatar.cc/150?u=default'}
                                        alt={p.seller.name}
                                        width={48}
                                        height={48}
                                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Mis en par {p.seller.name}</p>
                            </div>
                        )}

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-4 text-xl">
                            {p.originalPrice && (
                                <span className="text-gray-400 line-through decoration-1">
                                    {p.currency}{p.originalPrice}
                                </span>
                            )}
                            <span className="text-[#D0021B] font-bold">
                                {p.currency}{p.price}
                            </span>
                            <InfoIcon />
                        </div>

                        {/* Details */}
                        <div className="space-y-3 mb-6 text-sm sm:text-base text-gray-900">
                            {p.size && (
                                <div className="flex items-baseline">
                                    <span className="font-medium min-w-[100px]">{p.size}</span>
                                    <a href="#" className="text-gray-500 text-xs underline ml-2">Guide des tailles</a>
                                </div>
                            )}

                            <div>
                                <span className="block">
                                    {p.condition} <span className="text-gray-400 text-xs underline ml-1 cursor-pointer">Voir plus</span>
                                </span>
                            </div>

                            <div className="flex gap-1">
                                {p.color && <span>{p.color}</span>}
                                {p.color && p.material && <span>,</span>}
                                {p.material && <span>{p.material}</span>}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <p className="text-sm text-gray-700 leading-relaxed">{p.description}</p>
                        </div>

                        {/* Affirm Placeholder */}
                        <div className="text-xs text-gray-500 mb-6 flex items-center flex-wrap gap-1">
                            Payez avec Affirm pour les commandes de plus de 50 {p.currency}.
                            <span className="font-bold text-black italic">affirm</span>
                            <InfoIcon />
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

                        {/* Footer Info */}
                        <div className="space-y-3 text-xs sm:text-sm text-gray-600">
                            {p.seller && (
                                <div className="flex items-start">
                                    <PinIcon />
                                    <div>
                                        <span>{p.seller.location} chez le vendeur {p.seller.name}</span>
                                        <a href="#" className="underline ml-1">Voir plus</a>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-start">
                                <CheckIcon />
                                <div>
                                    <span>Contrôle Qualité et Authentification optionnel</span>
                                    <a href="#" className="underline ml-1">Voir plus</a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
