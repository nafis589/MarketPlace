'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductDescription from './ProductDescription';
import HomeProductSection, { type Product as HomeProduct } from '@/app/components/ui/HomeProductSection';
import RecentlyViewedClient from '@/app/components/home/RecentlyViewedClient';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/app/lib/mapHomeProduct';

export interface ProductDetailData {
  id: string;
  title: string;
  brand: string;
  price: number;
  priceLabel: string;
  currency: string;
  images: string[];
  condition: string;
  size: string;
  material: string;
  color: string;
  description: string;
  createdAt: string;
  vendorRegion: string;
  categoryPath: {
    universe: string | null;
    category: string | null;
    subcategory: string | null;
  };
  vendor: { shop_name: string; rating: number; total_sales: number };
}

interface ProductDetailProps {
  product: ProductDetailData;
  relatedProducts?: HomeProduct[];
}

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

import { useCart } from '@/app/context/CartContext';
import { useUI } from '@/app/context/UIContext';
import { useToast } from '@/app/components/ui/Toast';

export default function ProductDetail({ product, relatedProducts = [] }: ProductDetailProps) {
  const { addItem } = useCart();
  const { openCart } = useUI();
  const { showToast } = useToast();

  const galleryImages = useMemo(() => {
    const urls = product.images.filter(Boolean);
    return urls.length > 0 ? urls : [PRODUCT_IMAGE_PLACEHOLDER];
  }, [product.images]);

  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);

  const handleAddToCart = async () => {
    try {
      await addItem(product.id);
      showToast('Ajouté au panier ✓');
      openCart();
    } catch {
      showToast('Impossible d\'ajouter au panier');
    }
  };

  const attributes = [product.size, product.condition, product.color, product.material]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="bg-white font-sans text-gray-900">
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4 hidden md:block">
        <nav className="text-xs text-gray-500 flex items-center justify-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-black">Accueil</Link>
          <span>›</span>
          <Link href="/nouveautes" className="hover:text-black">Produits</Link>
          <span>›</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>
      </div>

      <div className="text-center py-2 mb-2 md:py-4 md:mb-4 px-4">
        <h1 className="font-serif text-3xl md:text-5xl mb-2 text-gray-900">{product.title}</h1>
        {product.brand && <p className="text-lg text-gray-600">{product.brand}</p>}
      </div>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 lg:pb-20">
        <div className="lg:col-span-7">
          <div className="hidden lg:flex gap-4">
            <div className="flex flex-col items-center gap-2 w-20 shrink-0">
              <button type="button" className="p-1 hover:bg-gray-100 rounded">
                <ChevronUp />
              </button>
              {galleryImages.map((src, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`w-16 h-16 border overflow-hidden transition-all ${selectedImage === src ? 'border-black ring-1 ring-black' : 'border-gray-200 hover:border-gray-400'}`}
                  onClick={() => setSelectedImage(src)}
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
              <button type="button" className="p-1 hover:bg-gray-100 rounded">
                <ChevronDown />
              </button>
            </div>

            <div className="flex-1 relative bg-gray-100 overflow-hidden min-h-[500px]">
              <div className="absolute top-0 right-0 p-4 flex items-center gap-1 z-10">
                <button type="button" className="hover:text-red-500">
                  <HeartIcon />
                </button>
              </div>
              <img
                src={selectedImage}
                alt={product.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="lg:hidden relative">
            <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
              <button type="button" className="text-gray-900 hover:text-red-500">
                <HeartIcon />
              </button>
            </div>
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide bg-gray-100 aspect-[3/4]">
              {galleryImages.map((src, idx) => (
                <div key={idx} className="snap-center shrink-0 w-full h-full relative">
                  <img src={src} alt={`${product.title} - ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-gray-50/50 p-6 lg:pl-10">
          <div className="flex justify-between items-start mb-6">
            <span className="text-2xl font-medium">{product.priceLabel}</span>
            <div className="flex flex-col items-end text-right">
              <p className="text-sm font-medium text-gray-900">{product.vendor.shop_name}</p>
              <p className="text-xs text-gray-500">
                {product.vendor.total_sales} ventes · ★ {product.vendor.rating.toFixed(1)}
              </p>
            </div>
          </div>

          {attributes && (
            <div className="space-y-2 mb-8 text-sm text-gray-800">
              <p className="font-medium text-base">{attributes}</p>
            </div>
          )}

          <div className="space-y-3 mb-8">
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-3 font-medium hover:bg-gray-800 transition-colors uppercase text-sm tracking-wide"
            >
              Ajouter au panier
            </button>
            <button
              type="button"
              className="w-full bg-white text-black border border-black py-3 font-medium hover:bg-gray-50 transition-colors uppercase text-sm tracking-wide"
            >
              Faire une offre
            </button>
          </div>
        </div>
      </div>

      <ProductDescription
        product={{
          id: product.id,
          description: product.description,
          brand: product.brand,
          condition: product.condition,
          size: product.size,
          material: product.material,
          color: product.color,
          createdAt: product.createdAt,
          vendorName: product.vendor.shop_name,
          vendorRegion: product.vendorRegion,
          vendorRating: product.vendor.rating,
          vendorTotalSales: product.vendor.total_sales,
          categoryPath: product.categoryPath,
        }}
      />

      {relatedProducts.length > 0 && (
        <HomeProductSection title="À découvrir" products={relatedProducts} viewAllHref="/nouveautes" />
      )}

      <RecentlyViewedClient />
    </div>
  );
}
