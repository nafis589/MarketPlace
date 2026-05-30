'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Navigation,
    Check,
    ChevronDown,
    ChevronUp,
    Package,
    X,
    ArrowRight,
} from 'lucide-react';
import { useCart } from '@/app/context/CartContext';

function cx(...classes: (string | boolean | undefined | null)[]) {
    return classes.filter(Boolean).join(' ');
}

const CURRENCY = '€';
function formatPrice(price: number): string {
    return `${price.toFixed(2).replace('.', ',')} ${CURRENCY}`;
}

interface GeoLocation {
    lat: number;
    lng: number;
}

export default function CheckoutPage() {
    const { cartItems, removeFromCart } = useCart();

    const [step, setStep] = useState(1);

    // Step 2 form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName]   = useState('');
    const [email, setEmail]         = useState('');
    const [phone, setPhone]         = useState('');
    const [city, setCity]           = useState('');
    const [notes, setNotes]         = useState('');
    const [geolocation, setGeolocation] = useState<GeoLocation | null>(null);
    const [isLocating, setIsLocating]   = useState(false);
    const [isOrderConfirmed, setIsOrderConfirmed] = useState(false);

    // Per-item seller toggle — default false = collapsed ("Plus d'infos")
    const [sellerOpen, setSellerOpen] = useState<Record<number, boolean>>({});
    const isSellerOpen = (id: number) => sellerOpen[id] ?? false;
    const toggleSeller = (id: number) =>
        setSellerOpen((prev) => ({ ...prev, [id]: !isSellerOpen(id) }));

    // Right column price accordion — default false = collapsed
    const [showPriceDetails, setShowPriceDetails] = useState(false);

    // Step 2 mobile: show right-side form panel as overlay
    const [showMobileForm, setShowMobileForm] = useState(false);

    const handleGetLocation = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setGeolocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    setIsLocating(false);
                },
                () => {
                    setGeolocation({ lat: 48.8566, lng: 2.3522 });
                    setIsLocating(false);
                },
            );
        } else {
            setIsLocating(false);
        }
    };

    const totalItemsPrice = cartItems.reduce((acc, item) => acc + item.price, 0);
    const totalShipping   = cartItems.reduce((acc, item) => acc + (item.shippingFee ?? 5.9), 0);
    const serviceFee      = totalItemsPrice * 0.08;
    const finalTotal      = totalItemsPrice + totalShipping + serviceFee;

    /* ─── ORDER CONFIRMED ─── */
    if (isOrderConfirmed) {
        return (
            <main className="min-h-screen bg-white font-sans antialiased text-[#1A1A1A] flex items-center justify-center px-4">
                <div className="text-center max-w-md w-full py-20">
                    <div className="relative w-24 h-24 mx-auto mb-8">
                        <div className="absolute inset-0 bg-green-300 rounded-full opacity-30 scale-150 blur-xl" />
                        <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                            <Check size={38} strokeWidth={2.5} className="text-white" />
                        </div>
                    </div>
                    <h2 className="text-[22px] font-bold text-[#1A1A1A] mb-3">
                        Commande envoyée avec succès !
                    </h2>
                    <p className="text-[15px] text-[#666] font-light mb-1 leading-relaxed">
                        Nous l&apos;avons transmise à nos équipes et attendons la validation du vendeur pour finaliser votre livraison.
                    </p>
                    <p className="text-[#999] text-[13px] font-light mb-8">
                        Commande n° :{' '}
                        <span className="font-bold text-[#1A1A1A]">
                            #FP-{Date.now().toString(36).toUpperCase()}
                        </span>
                    </p>
                    <Link
                        href="/"
                        className="inline-block bg-black text-white px-8 py-4 text-[13px] font-bold uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                        Retour à l&apos;accueil
                    </Link>
                </div>
            </main>
        );
    }

    /* ─── MAIN ─── */
    return (
        <div className="min-h-screen bg-white font-sans antialiased text-[#1A1A1A]">

            {/* ── HEADER ── */}
            <header className="bg-white border-b border-[#E8E8E8] h-[62px] flex items-center px-6 md:px-10 relative sticky top-0 z-50">
                <div className="absolute left-1/2 -translate-x-1/2">
                    <Link
                        href="/"
                        className="font-serif text-[22px] md:text-[26px] font-black tracking-tight text-black select-none"
                    >
                        Friperie Luxe
                    </Link>
                </div>
                <div className="ml-auto" />
            </header>

            {/* ── MAIN GRID ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-62px)]">

                {/* ════════════════════════════════
                    LEFT COLUMN
                ════════════════════════════════ */}
                <div
                    className={cx(
                        'lg:col-span-7 order-1 lg:order-1',
                        step === 2 ? 'flex flex-col' : 'bg-white px-4 sm:px-6 md:px-10 lg:px-14 py-6 md:py-10',
                        step === 3 && 'bg-white lg:sticky lg:top-[62px] lg:h-[calc(100vh-62px)] flex items-center justify-center',
                    )}
                >

                    {/* ── STEP 1 : Panier ── */}
                    {step === 1 && (
                        <div className="max-w-2xl">
                            <h1 className="text-[20px] sm:text-[24px] md:text-[26px] font-bold text-[#1A1A1A] mb-6 md:mb-10 tracking-tight">
                                1. Panier
                            </h1>

                            {cartItems.length === 0 ? (
                                <div className="py-20 flex flex-col items-start gap-4">
                                    <Package size={40} strokeWidth={1} className="text-[#D5D5D5]" />
                                    <p className="text-[15px] text-[#AAAAAA] font-light">
                                        Votre panier est vide
                                    </p>
                                    <Link
                                        href="/"
                                        className="text-[14px] underline underline-offset-2 text-[#1A1A1A] hover:opacity-60 transition-opacity"
                                    >
                                        Découvrir nos articles
                                    </Link>
                                </div>
                            ) : (
                                <div className="divide-y divide-[#F0F0F0]">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="py-4 space-y-6">

                                            {/* ── Seller ── */}
                                            <div className="space-y-4">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-[48px] h-[48px] rounded-full bg-[#E5E5E5] flex items-center justify-center shrink-0 overflow-hidden">
                                                            <svg className="w-8 h-8 text-[#BBBBBB] mt-1" fill="currentColor" viewBox="0 0 24 24">
                                                                <path fillRule="evenodd" d="M12 12a5 5 0 100-10 5 5 0 000 10zm-7 9a7 7 0 0114 0H5z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-[16px] text-[#1A1A1A] leading-tight">
                                                                {item.seller?.username || 'friperie_luxe'}
                                                            </p>
                                                            <div className="flex items-center gap-1.5 mt-1">
                                                                <svg className="w-3.5 h-3.5 text-[#1A1A1A]" viewBox="0 0 24 24" fill="currentColor">
                                                                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                                                                </svg>
                                                                <span className="text-[13px] text-[#555]">
                                                                    {item.seller?.badge || 'Vendeur Expert'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Per-item toggle */}
                                                    <button
                                                        onClick={() => toggleSeller(item.id)}
                                                        className="flex items-center gap-1 text-[13px] text-[#1A1A1A] hover:opacity-60 transition-opacity whitespace-nowrap"
                                                    >
                                                        <span>
                                                            {isSellerOpen(item.id) ? "Moins d'infos" : "Plus d'infos"}
                                                        </span>
                                                        {isSellerOpen(item.id) ? (
                                                            <ChevronUp size={14} />
                                                        ) : (
                                                            <ChevronDown size={14} />
                                                        )}
                                                    </button>
                                                </div>

                                                {isSellerOpen(item.id) && (
                                                    <div className="space-y-2 text-[12px] sm:text-[13px] text-[#555] pl-[64px]">
                                                        <div className="flex gap-8">
                                                            <span>{item.seller?.itemsCount ?? 8} produits en vente</span>
                                                            <span>{item.seller?.salesCount ?? 30} produits vendus</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <svg className="w-3.5 h-3.5 text-[#555]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <span>{item.seller?.location || 'France'}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* ── Product row ── */}
                                            <div className="flex gap-4 sm:gap-5">

                                                {/* Image seule à gauche */}
                                                <div className="shrink-0">
                                                    <div className="w-[80px] h-[100px] sm:w-[96px] sm:h-[120px] bg-[#F8F8F8] border border-[#EBEBEB] overflow-hidden">
                                                        <img
                                                            src={item.image}
                                                            alt={item.title || item.brand}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Droite : infos + X en haut, prix en bas */}
                                                <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[100px] sm:min-h-[120px]">
                                                    {/* Haut : texte + croix */}
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="space-y-0.5 sm:space-y-1 min-w-0">
                                                            <h3 className="font-bold text-[13px] sm:text-[15px] tracking-wide uppercase text-[#1A1A1A]">
                                                                {item.brand}
                                                            </h3>
                                                            <p className="text-[12px] sm:text-[14px] text-[#333]">{item.title || item.type}</p>
                                                            <p className="text-[12px] sm:text-[14px] text-[#777]">Taille : {item.size}</p>
                                                        </div>
                                                        {/* Croix de suppression */}
                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="shrink-0 w-6 h-6 flex items-center justify-center text-[#C0C0C0] hover:text-[#1A1A1A] transition-colors mt-0.5"
                                                            aria-label="Supprimer l'article"
                                                        >
                                                            <X size={15} strokeWidth={2} />
                                                        </button>
                                                    </div>
                                                    {/* Bas : prix */}
                                                    <div className="flex items-center gap-2">
                                                        {item.originalPrice && (
                                                            <span className="text-[12px] sm:text-[14px] text-[#AAAAAA] line-through">
                                                                {formatPrice(item.originalPrice)}
                                                            </span>
                                                        )}
                                                        <span className="text-[13px] sm:text-[15px] font-semibold text-[#C0392B]">
                                                            {formatPrice(item.price)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── STEP 2 : div grise — plein écran sans margin ── */}
                    {step === 2 && (
                        <div className="flex-1 relative">
                            {/* La div grise remplit tout l'écran, sans aucun margin */}
                            <div className="h-full min-h-[calc(100vh-62px)] bg-[#EFEFEF]" />

                            {/* Bouton flèche — mobile uniquement pour ouvrir le formulaire */}
                            <button
                                onClick={() => setShowMobileForm(true)}
                                className="lg:hidden absolute bottom-6 right-6 w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-xl hover:opacity-80 transition-opacity active:scale-95"
                                aria-label="Ouvrir le formulaire"
                            >
                                <ArrowRight size={20} className="text-white" />
                            </button>
                        </div>
                    )}

                    {/* ── STEP 3 : success visual (sticky, centered) ── */}
                    {step === 3 && (
                        <div className="flex flex-col items-center text-center px-10 max-w-sm mx-auto">
                            {/* Green circle inspired by reference image */}
                            <div className="relative mb-8">
                                <div className="absolute inset-0 rounded-full bg-green-300 opacity-40 scale-[1.6] blur-2xl" />
                                <div className="relative w-[88px] h-[88px] bg-gradient-to-br from-[#4ADE80] to-[#16A34A] rounded-full flex items-center justify-center shadow-xl">
                                    <Check size={38} strokeWidth={2.5} className="text-white" />
                                </div>
                            </div>
                            <h2 className="text-[20px] font-bold text-[#1A1A1A] leading-snug mb-3">
                                Votre commande est en bonne voie !
                            </h2>
                            <p className="text-[14px] text-[#666] font-light leading-relaxed">
                                Nous l&apos;avons transmise à nos équipes et attendons la validation du vendeur pour finaliser votre livraison.
                            </p>
                        </div>
                    )}
                </div>

                {/* ════════════════════════════════
                    RIGHT COLUMN
                ════════════════════════════════ */}
                <div className="lg:col-span-5 order-2 lg:order-2 bg-[#F5F5F5]">

                    {/* ── STEP 1 right ── */}
                    {step === 1 && (
                        <div className="lg:sticky lg:top-[62px] px-4 sm:px-6 md:px-9 lg:px-11 py-6 md:py-10 space-y-0">

                            <h2 className="text-[18px] font-bold text-[#1A1A1A] mb-8">
                                Détails de la commande
                            </h2>

                            {/* Price details accordion */}
                            <div className="space-y-3 mb-6">
                                <button
                                    onClick={() => setShowPriceDetails(!showPriceDetails)}
                                    className="w-full flex items-center justify-between text-[14px] text-[#1A1A1A] hover:opacity-70 transition-opacity"
                                >
                                    <div className="flex items-center gap-1.5">
                                        <span className="font-medium">
                                            Détails du prix ({cartItems.length} article
                                            {cartItems.length > 1 ? 's' : ''})
                                        </span>
                                        {showPriceDetails ? (
                                            <ChevronUp size={14} className="text-[#555]" />
                                        ) : (
                                            <ChevronDown size={14} className="text-[#555]" />
                                        )}
                                    </div>
                                    <span className="font-medium">{formatPrice(totalItemsPrice)}</span>
                                </button>

                                {showPriceDetails && (
                                    <div className="space-y-4">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="space-y-1.5">
                                                <div className="flex justify-between text-[14px] text-[#1A1A1A]">
                                                    <span className="font-medium truncate pr-2">
                                                        {item.brand}, {item.title || item.type}
                                                    </span>
                                                    <span className="font-medium shrink-0">{formatPrice(item.price)}</span>
                                                </div>
                                                <div className="space-y-1 pl-4">
                                                    <div className="flex justify-between text-[13px] text-[#777]">
                                                        <span>Prix</span>
                                                        <span>{formatPrice(item.originalPrice ?? item.price)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-[13px] text-[#777]">
                                                        <span>Frais de service acheteur (TVA incl.)</span>
                                                        <span>{formatPrice(item.price * 0.08)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <hr className="border-[#E0E0E0] mb-6" />

                            {/* Total */}
                            <div className="flex justify-between items-baseline mb-7">
                                <span className="text-[16px] font-bold text-[#1A1A1A]">Total TTC</span>
                                <span className="text-[28px] font-bold text-[#1A1A1A]">
                                    {formatPrice(finalTotal)}
                                </span>
                            </div>

                            {/* CTA */}
                            <button
                                onClick={() => setStep(2)}
                                disabled={cartItems.length === 0}
                                className="w-full bg-[#B0B0B0] hover:bg-black text-white text-[15px] font-semibold py-4 transition-colors disabled:cursor-not-allowed disabled:bg-[#CCCCCC]"
                            >
                                Passer la commande
                            </button>
                        </div>
                    )}

                    {/* ── STEP 2 right : Infos perso + commande ── */}
                    {step === 2 && (
                        <div className={cx(
                            'lg:sticky lg:top-[62px] lg:overflow-y-auto lg:max-h-[calc(100vh-62px)]',
                            // Mobile : caché par défaut, overlay plein écran quand ouvert
                            !showMobileForm
                                ? 'hidden lg:block'
                                : 'fixed inset-0 z-50 overflow-y-auto bg-[#F5F5F5] lg:relative lg:inset-auto lg:z-auto',
                        )}>
                            {/* Bouton fermer — mobile uniquement */}
                            <div className="lg:hidden sticky top-0 z-10 bg-[#F5F5F5] flex justify-end px-4 pt-4 pb-1">
                                <button
                                    onClick={() => setShowMobileForm(false)}
                                    className="w-8 h-8 bg-white border border-[#E8E8E8] rounded-full flex items-center justify-center shadow-sm hover:bg-[#F0F0F0] transition-colors"
                                    aria-label="Fermer"
                                >
                                    <X size={14} strokeWidth={2} className="text-[#1A1A1A]" />
                                </button>
                            </div>
                            <div className="px-4 sm:px-6 md:px-9 lg:px-11 py-4 lg:py-10 space-y-7">

                                {/* Personal info */}
                                <div className="space-y-4">
                                    <h3 className="text-[16px] font-bold text-[#1A1A1A]">
                                        Informations personnelles
                                    </h3>

                                    {/* Prénom + Nom */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide">
                                                Prénom
                                            </label>
                                            <input
                                                type="text"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                placeholder="Entrez votre prénom"
                                                className="w-full border border-[#D5D5D5] px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-black transition-all bg-white text-[#1A1A1A] placeholder-[#C5C5C5]"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide">
                                                Nom
                                            </label>
                                            <input
                                                type="text"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                placeholder="Entrez votre nom"
                                                className="w-full border border-[#D5D5D5] px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-black transition-all bg-white text-[#1A1A1A] placeholder-[#C5C5C5]"
                                            />
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Entrez votre email"
                                            className="w-full border border-[#D5D5D5] px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-black transition-all bg-white text-[#1A1A1A] placeholder-[#C5C5C5]"
                                        />
                                    </div>

                                    {/* Téléphone + Ville */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide">
                                                Téléphone <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="Entrez votre numéro de téléphone"
                                                className="w-full border border-[#D5D5D5] px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-black transition-all bg-white text-[#1A1A1A] placeholder-[#C5C5C5]"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide">
                                                Ville <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                placeholder="Entrez votre ville"
                                                className="w-full border border-[#D5D5D5] px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-black transition-all bg-white text-[#1A1A1A] placeholder-[#C5C5C5]"
                                            />
                                        </div>
                                    </div>

                                    {/* Géolocalisation */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide">
                                            Géolocalisation
                                        </label>
                                        <button
                                            type="button"
                                            onClick={handleGetLocation}
                                            disabled={isLocating}
                                            className={cx(
                                                'w-full flex items-center justify-center gap-2 border py-2.5 px-4 text-[14px] font-medium transition-all',
                                                geolocation
                                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                                                    : 'bg-white border-[#D5D5D5] text-[#777] hover:border-black hover:text-black',
                                            )}
                                        >
                                            <Navigation size={14} strokeWidth={1.5} />
                                            {isLocating
                                                ? 'Localisation…'
                                                : geolocation
                                                  ? '✓ Position enregistrée'
                                                  : 'Utiliser ma position GPS'}
                                        </button>
                                        {geolocation && (
                                            <p className="text-[12px] text-emerald-600">
                                                Lat {geolocation.lat.toFixed(4)} · Lng {geolocation.lng.toFixed(4)}
                                            </p>
                                        )}
                                    </div>

                                    {/* Notes */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide">
                                            Notes{' '}
                                            <span className="font-normal normal-case text-[11px]">
                                                (optionnel)
                                            </span>
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Entrez une note"
                                            className="w-full border border-[#D5D5D5] px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-black transition-all resize-none bg-white text-[#1A1A1A] placeholder-[#C5C5C5]"
                                        />
                                    </div>
                                </div>

                                <hr className="border-[#E0E0E0]" />

                                {/* Order summary */}
                                <div className="space-y-4">
                                    <h3 className="text-[16px] font-bold text-[#1A1A1A]">
                                        Détails de la commande
                                    </h3>
                                    <div className="space-y-3">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="space-y-1">
                                                <div className="flex justify-between text-[14px] font-medium text-[#1A1A1A]">
                                                    <span className="truncate pr-2">
                                                        1 × {item.brand} ({item.title || item.type})
                                                    </span>
                                                    <span className="shrink-0">{formatPrice(item.price)}</span>
                                                </div>
                                                <div className="flex justify-between text-[12px] px-2 py-1">
                                                    <span className="flex items-center gap-1">
                                                        Livraison
                                                    </span>
                                                    <span>{formatPrice(item.shippingFee ?? 5.9)}</span>
                                                </div>
                                            </div>
                                        ))}

                                        <hr className="border-[#E0E0E0]" />

                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[15px] font-bold text-[#1A1A1A]">
                                                Total TTC
                                            </span>
                                            <span className="text-[24px] font-bold text-[#1A1A1A]">
                                                {formatPrice(finalTotal)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => { setStep(3); setShowMobileForm(false); }}
                                        disabled={!phone || !city}
                                        className="w-full bg-black text-white text-[15px] font-semibold py-4 hover:opacity-90 disabled:bg-[#CCCCCC] disabled:cursor-not-allowed transition-all"
                                    >
                                        Vérifier la commande →
                                    </button>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="w-full text-center text-[13px] text-[#BBBBBB] hover:text-[#1A1A1A] hover:underline underline-offset-2 py-1 transition-colors"
                                    >
                                        ← Retour au panier
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── STEP 3 right : infos de confirmation + récap ── */}
                    {step === 3 && (
                        <div className="lg:sticky lg:top-[62px] lg:overflow-y-auto lg:max-h-[calc(100vh-62px)]">
                            <div className="px-4 sm:px-6 md:px-9 lg:px-11 py-6 md:py-10 space-y-7">

                                {/* Personal info confirmation */}
                                <div className="space-y-4">
                                    <h3 className="text-[16px] font-bold text-[#1A1A1A]">
                                        Informations de livraison
                                    </h3>

                                    {/* Prénom + Nom */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white border border-[#EBEBEB] px-4 py-3">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#BBBBBB] mb-1">Prénom</p>
                                            <p className="text-[14px] font-medium text-[#1A1A1A]">
                                                {firstName || '—'}
                                            </p>
                                        </div>
                                        <div className="bg-white border border-[#EBEBEB] px-4 py-3">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#BBBBBB] mb-1">Nom</p>
                                            <p className="text-[14px] font-medium text-[#1A1A1A]">
                                                {lastName || '—'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Email */}
                                    <div className="bg-white border border-[#EBEBEB] px-4 py-3">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#BBBBBB] mb-1">Email</p>
                                        <p className="text-[14px] font-medium text-[#1A1A1A]">{email || '—'}</p>
                                    </div>

                                    {/* Téléphone + Ville */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white border border-[#EBEBEB] px-4 py-3">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#BBBBBB] mb-1">Téléphone</p>
                                            <p className="text-[14px] font-medium text-[#1A1A1A]">{phone || '—'}</p>
                                        </div>
                                        <div className="bg-white border border-[#EBEBEB] px-4 py-3">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#BBBBBB] mb-1">Ville</p>
                                            <p className="text-[14px] font-medium text-[#1A1A1A]">{city || '—'}</p>
                                        </div>
                                    </div>

                                    {/* GPS + Notes côte à côte si les deux */}
                                    {(geolocation || notes) && (
                                        <div className={cx(
                                            'gap-3',
                                            geolocation && notes ? 'grid grid-cols-2' : 'block',
                                        )}>
                                            {geolocation && (
                                                <div className="bg-white border border-[#EBEBEB] px-4 py-3">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#BBBBBB] mb-1">Position GPS</p>
                                                    <p className="text-[13px] font-medium text-emerald-700">
                                                        {geolocation.lat.toFixed(4)}, {geolocation.lng.toFixed(4)}
                                                    </p>
                                                </div>
                                            )}
                                            {notes && (
                                                <div className="bg-white border border-[#EBEBEB] px-4 py-3">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#BBBBBB] mb-1">Notes</p>
                                                    <p className="text-[13px] text-[#555] italic">&ldquo;{notes}&rdquo;</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <hr className="border-[#E0E0E0]" />

                                {/* Récapitulatif final */}
                                <div className="space-y-4">
                                    <h3 className="text-[16px] font-bold text-[#1A1A1A]">
                                        Récapitulatif final
                                    </h3>
                                    <div className="space-y-3">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex justify-between text-[14px] font-medium text-[#1A1A1A]">
                                                <span className="truncate pr-2">
                                                    1 × {item.brand} ({item.title || item.type})
                                                </span>
                                                <span className="shrink-0">{formatPrice(item.price)}</span>
                                            </div>
                                        ))}
                                        
                                        <hr className="border-[#E0E0E0]" />
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[15px] font-bold text-[#1A1A1A]">Total TTC</span>
                                            <span className="text-[24px] font-bold text-[#1A1A1A]">{formatPrice(finalTotal)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsOrderConfirmed(true)}
                                        className="w-full bg-black hover:bg-black text-white text-[15px] font-semibold py-4 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Check size={16} strokeWidth={3} />
                                        Confirmer la commande
                                    </button>
                                    <button
                                        onClick={() => setStep(2)}
                                        className="w-full text-center text-[13px] text-[#BBBBBB] hover:text-[#1A1A1A] hover:underline underline-offset-2 py-1 transition-colors"
                                    >
                                        ← Modifier mes informations
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
