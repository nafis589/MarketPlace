'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { MessageCircle, Heart } from 'lucide-react';
import ProductDescription from './ProductDescription';
import HomeProductSection, { type Product as HomeProduct } from '@/app/components/ui/HomeProductSection';
import RecentlyViewedClient from '@/app/components/home/RecentlyViewedClient';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/app/lib/mapHomeProduct';

export interface ProductDetailData {
  id: string;
  vendor_id?: string;
  status?: string;
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

const HeartIcon = ({ filled, animating }: { filled?: boolean; animating?: boolean }) => (
  <Heart
    className={`h-5 w-5 transition-all duration-200 ${
      filled ? 'fill-red-500 text-red-500' : 'text-current'
    } ${animating ? 'scale-125' : ''}`}
    strokeWidth={1.5}
  />
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
import { useAuth } from '@/app/context/AuthContext';
import { useChat } from '@/app/context/ChatContext';
import { VENDOR_DASHBOARD_URL } from '@/lib/vendor-dashboard';
import OfferModal from '@/app/components/offers/OfferModal';
import { useFavoriteToggle } from '@/app/hooks/useFavoriteToggle';

export default function ProductDetail({ product, relatedProducts = [] }: ProductDetailProps) {
  const { addItem } = useCart();
  const { openCart, openLogin } = useUI();
  const { showToast } = useToast();
  const { user, isLoggedIn } = useAuth();
  const { openChatWithVendor, starting: chatStarting } = useChat();
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const { isFavorite, animating, handleFavoriteClick } = useFavoriteToggle(product.id);

  const isOwnProduct =
    user?.role === 'VENDOR' &&
    !!user?.vendorId &&
    !!product.vendor_id &&
    user.vendorId === product.vendor_id;

  const handleManageProduct = () => {
    window.open(`${VENDOR_DASHBOARD_URL}/products/${product.id}`, '_blank');
  };

  const handleStartOffer = () => {
    if (isSold || isOwnProduct) return;
    if (!isLoggedIn) {
      openLogin();
      return;
    }
    setOfferModalOpen(true);
  };

  const handleStartChat = async () => {
    if (!isLoggedIn) {
      openLogin();
      return;
    }
    if (!product.vendor_id) return;
    try {
      await openChatWithVendor(product.vendor_id, product.id);
    } catch {
      showToast('Impossible de démarrer la conversation');
    }
  };

  const galleryImages = useMemo(() => {
    const urls = product.images.filter(Boolean);
    return urls.length > 0 ? urls : [PRODUCT_IMAGE_PLACEHOLDER];
  }, [product.images]);

  const [selectedImage, setSelectedImage] = useState(galleryImages[0]);

  const isSold = product.status === 'SOLD';
  const hasRelated = relatedProducts.length > 0;

  const handleAddToCart = async () => {
    if (isSold) return;
    try {
      await addItem(product.id);
      showToast('Ajouté au panier ✓');
      openCart();
    } catch {
      showToast('Impossible d\'ajouter au panier');
    }
  };

  const scrollToSimilar = () => {
    document.getElementById('similar-products')?.scrollIntoView({ behavior: 'smooth' });
  };

  const SoldBadge = () => (
    <div className="absolute left-0 top-0 z-20 m-4 rounded-sm bg-red-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-md">
      Vendu
    </div>
  );

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
              {isSold && <SoldBadge />}
              {!isOwnProduct && (
                <div className="absolute top-0 right-0 p-4 flex items-center gap-1 z-10">
                  <button type="button" className="hover:text-red-500" onClick={handleFavoriteClick}>
                    <HeartIcon filled={isFavorite} animating={animating} />
                  </button>
                </div>
              )}
              <img
                src={selectedImage}
                alt={product.title}
                className={`absolute inset-0 w-full h-full object-cover ${isSold ? 'opacity-70' : ''}`}
              />
            </div>
          </div>

          <div className="lg:hidden relative">
            {isSold && <SoldBadge />}
            {!isOwnProduct && (
              <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                <button type="button" className="text-gray-900 hover:text-red-500" onClick={handleFavoriteClick}>
                  <HeartIcon filled={isFavorite} animating={animating} />
                </button>
              </div>
            )}
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide bg-gray-100 aspect-[3/4]">
              {galleryImages.map((src, idx) => (
                <div key={idx} className="snap-center shrink-0 w-full h-full relative">
                  <img src={src} alt={`${product.title} - ${idx + 1}`} className={`absolute inset-0 w-full h-full object-cover ${isSold ? 'opacity-70' : ''}`} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-gray-50/50 p-6 lg:pl-10">
          <div className="flex justify-between items-start mb-6">
            <span className="text-2xl font-medium">{product.priceLabel}</span>
            {product.vendor_id ? (
              <Link
                href={`/vendeur/${product.vendor_id}`}
                className="flex flex-col items-end text-right group/vendor"
              >
                <p className="text-sm font-medium text-gray-900 group-hover/vendor:underline">
                  {product.vendor.shop_name}
                </p>
                <p className="text-xs text-gray-500">
                  {product.vendor.total_sales} ventes · ★ {product.vendor.rating.toFixed(1)}
                </p>
              </Link>
            ) : (
              <div className="flex flex-col items-end text-right">
                <p className="text-sm font-medium text-gray-900">{product.vendor.shop_name}</p>
                <p className="text-xs text-gray-500">
                  {product.vendor.total_sales} ventes · ★ {product.vendor.rating.toFixed(1)}
                </p>
              </div>
            )}
          </div>

          {attributes && (
            <div className="space-y-2 mb-8 text-sm text-gray-800">
              <p className="font-medium text-base">{attributes}</p>
            </div>
          )}

          <div className="space-y-3 mb-8">
            {isOwnProduct ? (
              <div className="p-4">
                <p className="text-sm text-gray-700">
                  Ceci est votre article. Gérez-le depuis votre espace vendeur.
                </p>
                <button
                  type="button"
                  onClick={handleManageProduct}
                  className="mt-3 w-full bg-black py-3 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-gray-800"
                >
                  Gérer cet article →
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isSold}
                  className={`w-full py-3 font-medium uppercase text-sm tracking-wide transition-colors ${
                    isSold
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  Ajouter au panier
                </button>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleStartOffer}
                    disabled={isSold}
                    className={`flex-1 py-3 font-medium uppercase text-sm tracking-wide transition-colors border ${
                      isSold
                        ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                        : 'bg-white text-black border-black hover:bg-gray-50'
                    }`}
                  >
                    Faire une offre
                  </button>
                  <button
                    type="button"
                    onClick={handleStartChat}
                    disabled={chatStarting}
                    aria-label="Contacter le vendeur"
                    title="Contacter le vendeur"
                    className="flex w-14 shrink-0 items-center justify-center border border-black text-black transition-colors hover:bg-gray-50 disabled:opacity-60"
                  >
                    <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
                  </button>
                </div>

                {isSold && (
                  <div className="pt-2 text-sm">
                    <p className="font-medium text-gray-900">Cet article a déjà été vendu.</p>
                    {hasRelated && (
                      <button
                        type="button"
                        onClick={scrollToSimilar}
                        className="mt-1 font-medium text-black underline underline-offset-2 hover:text-gray-700"
                      >
                        Découvrez des articles similaires ↓
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <ProductDescription
        product={{
          id: product.id,
          vendorId: product.vendor_id,
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

      {hasRelated && (
        <div id="similar-products" className="scroll-mt-[120px]">
          <HomeProductSection
            title={isSold ? 'Articles similaires' : 'À découvrir'}
            products={relatedProducts}
            viewAllHref="/nouveautes"
          />
        </div>
      )}

      <RecentlyViewedClient />

      <OfferModal
        open={offerModalOpen}
        product={{
          id: product.id,
          title: product.title,
          brand: product.brand,
          price: product.price,
          priceLabel: product.priceLabel,
          condition: product.condition,
          image: galleryImages[0] ?? null,
        }}
        onClose={() => setOfferModalOpen(false)}
        onSuccess={() => showToast('Offre envoyée ! Le vendeur a 48h pour répondre.')}
      />
    </div>
  );
}
