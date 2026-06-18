'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
    LocateFixed,
    CircleCheckBig,
    ChevronDown,
    ChevronUp,
    Package,
    X,
    Loader2,
    ArrowRight,
} from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useUI } from '@/app/context/UIContext';
import { useToast } from '@/app/components/ui/Toast';
import { getLineTotal, type CartItem, type CartItemVendor } from '@/lib/cart-api';
import { ordersApi, type StoreOrder } from '@/lib/orders-api';
import { formatOrderRef } from '@/app/lib/order-utils';
import { DEMO_VENDOR_ID } from '@/lib/demo-vendor';
import type { LocationSelectResult, ShippingFeeError, ShippingMethod } from '@/lib/types';

const DeliveryMap = dynamic(() => import('@/app/components/checkout/DeliveryMap'), {
    ssr: false,
    loading: () => (
        <div className="h-[calc(100vh-62px)] bg-[#EFEFEF] flex items-center justify-center text-sm text-gray-400">
            Chargement de la carte…
        </div>
    ),
});

function cx(...classes: (string | boolean | undefined | null)[]) {
    return classes.filter(Boolean).join(' ');
}

import { formatPrice as formatFcfa } from '@/app/utils/formatPrice';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/app/lib/mapHomeProduct';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, total, removeItem, refresh: refreshCart } = useCart();
    const { isLoggedIn } = useAuth();
    const { openLogin } = useUI();
    const { showToast } = useToast();

    const [step, setStep] = useState(1);

    // Step 2 form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName]   = useState('');
    const [phone, setPhone]         = useState('');
    const [notes, setNotes]         = useState('');

    // Step 2 shipping (carte + calcul backend)
    const [shippingFee, setShippingFee]               = useState<number | null>(null);
    const [shippingMethod, setShippingMethod]         = useState<ShippingMethod | null>(null);
    const [shippingDistanceKm, setShippingDistanceKm] = useState<number | null>(null);
    const [shippingRegionId, setShippingRegionId]     = useState<string | null>(null);
    const [shippingError, setShippingError]           = useState<string | null>(null);
    const [selectedCoords, setSelectedCoords]         = useState<{ lat: number; lng: number } | null>(null);
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
    const [geolocateSignal, setGeolocateSignal]       = useState(0);
    const [isGeolocating, setIsGeolocating]           = useState(false);
    const [isSubmitting, setIsSubmitting]             = useState(false);
    const [placedOrder, setPlacedOrder]               = useState<StoreOrder | null>(null);
    const [orderSnapshot, setOrderSnapshot]           = useState<{
        lineCount: number;
        itemsSubtotal: number;
        shippingFee: number;
        grandTotal: number;
    } | null>(null);

    // Vendeur ciblé pour le calcul de livraison (panier mono-vendeur pour l'instant).
    const vendorId = DEMO_VENDOR_ID;

    const [sellerOpen, setSellerOpen] = useState<Record<string, boolean>>({});
    const isSellerOpen = (id: string) => sellerOpen[id] ?? false;
    const toggleSeller = (id: string) =>
        setSellerOpen((prev) => ({ ...prev, [id]: !isSellerOpen(id) }));

    const itemsByVendor = useMemo(() => {
        const groups: { vendorId: string; vendor: CartItemVendor | undefined; items: CartItem[] }[] = [];
        const indexByVendor = new Map<string, number>();

        for (const item of items) {
            const vendorId = item.product.vendor?.id ?? `unknown-${item.id}`;
            const existing = indexByVendor.get(vendorId);
            if (existing !== undefined) {
                groups[existing].items.push(item);
            } else {
                indexByVendor.set(vendorId, groups.length);
                groups.push({
                    vendorId,
                    vendor: item.product.vendor,
                    items: [item],
                });
            }
        }

        return groups;
    }, [items]);

    // Step 2 mobile : panneau formulaire en overlay plein écran
    const [showMobileForm, setShowMobileForm] = useState(false);

    // Sticky sidebar (étape 1) : collé en haut si le contenu tient dans l'écran ;
    // sinon on scrolle jusqu'au bas du bloc (bouton + padding) puis ça se fige.
    const HEADER_H = 62;
    const stickyBoxRef = useRef<HTMLDivElement>(null);
    const [stickyTop, setStickyTop] = useState(HEADER_H);

    useEffect(() => {
        if (step !== 1) return;
        const el = stickyBoxRef.current;
        if (!el) return;

        const recompute = () => {
            const boxH = el.offsetHeight;
            const available = window.innerHeight - HEADER_H;
            setStickyTop(boxH <= available ? HEADER_H : window.innerHeight - boxH);
        };

        recompute();
        const ro = new ResizeObserver(recompute);
        ro.observe(el);
        window.addEventListener('resize', recompute);
        return () => {
            ro.disconnect();
            window.removeEventListener('resize', recompute);
        };
    }, [step, items.length]);

    const handleLocationSelect = (result: LocationSelectResult) => {
        setSelectedCoords({ lat: result.lat, lng: result.lng });
        setShippingFee(result.shippingResult.fee);
        setShippingMethod(result.shippingResult.method);
        setShippingDistanceKm(result.shippingResult.distanceKm ?? null);
        setShippingRegionId(result.shippingResult.regionId ?? null);
        setShippingError(null);
    };

    const handleShippingError = (error: ShippingFeeError | null) => {
        if (error) {
            setShippingFee(null);
            setShippingMethod(null);
            setShippingDistanceKm(null);
            setShippingRegionId(null);
            setSelectedCoords(null);
            setShippingError(error.message);
        } else {
            setShippingError(null);
        }
    };

    const totalItemsPrice = total;
    const grandTotal = shippingFee !== null ? totalItemsPrice + shippingFee : null;
    const recapLineCount = orderSnapshot?.lineCount ?? items.length;
    const recapItemsSubtotal = orderSnapshot?.itemsSubtotal ?? totalItemsPrice;
    const recapShippingFee = orderSnapshot?.shippingFee ?? shippingFee;
    const recapGrandTotal =
        orderSnapshot?.grandTotal ??
        (placedOrder ? placedOrder.total_amount : grandTotal);
    const canConfirm = shippingFee !== null && !shippingError && selectedCoords !== null && !!phone.trim() && shippingMethod !== null;

    const handleConfirmOrder = async () => {
        if (!canConfirm || !selectedCoords || shippingFee === null || !shippingMethod) return;
        if (!isLoggedIn) {
            openLogin();
            return;
        }
        setIsSubmitting(true);
        try {
            const { data } = await ordersApi.placeOrder({
                payment_method: 'CASH_ON_DELIVERY',
                shipping_address: {
                    first_name: firstName,
                    last_name: lastName,
                    phone,
                    notes: notes || null,
                    latitude: selectedCoords.lat,
                    longitude: selectedCoords.lng,
                    region_id: shippingRegionId ?? '',
                },
                shipping_fee: shippingFee,
                shipping_method: shippingMethod,
                shipping_distance_km: shippingDistanceKm,
            });
            const order = data.orders[0] ?? null;
            setOrderSnapshot({
                lineCount: items.length,
                itemsSubtotal: total,
                shippingFee,
                grandTotal: total + shippingFee,
            });
            setPlacedOrder(order);
            await refreshCart();
            setShowMobileForm(false);
            setStep(3);
        } catch {
            showToast('Impossible de confirmer la commande');
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        Marketplace
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
                        step === 2 && 'flex flex-col lg:sticky lg:top-[62px] lg:h-[calc(100vh-62px)]',
                        step === 1 && 'bg-white px-4 sm:px-6 md:px-10 lg:px-14 py-6 md:py-10',
                        step === 3 && 'bg-white lg:sticky lg:top-[62px] lg:h-[calc(100vh-62px)] flex items-center justify-center py-12',
                    )}
                >

                    {/* ── STEP 1 : Panier ── */}
                    {step === 1 && (
                        <div className="max-w-2xl">
                            <h1 className="text-[20px] sm:text-[24px] md:text-[26px] font-bold text-[#1A1A1A] mb-3 md:mb-4 tracking-tight">
                                1. Panier
                            </h1>

                            {items.length === 0 ? (
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
                                    {itemsByVendor.map((group) => {
                                        const vendor = group.vendor;
                                        const sellerName = vendor?.shop_name ?? 'Vendeur';
                                        const sellerInitial = sellerName.charAt(0).toUpperCase();

                                        return (
                                        <div key={group.vendorId} className="py-3 space-y-4">

                                            {/* ── Seller (une fois par vendeur) ── */}
                                            <div className="space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-[48px] h-[48px] rounded-full bg-[#E5E5E5] flex items-center justify-center shrink-0 overflow-hidden">
                                                            <span className="text-[18px] font-bold text-[#888]">
                                                                {sellerInitial}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-[16px] text-[#1A1A1A] leading-tight">
                                                                {sellerName}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => toggleSeller(group.vendorId)}
                                                        className="flex items-center gap-1 text-[13px] text-[#1A1A1A] hover:opacity-60 transition-opacity whitespace-nowrap"
                                                    >
                                                        <span>
                                                            {isSellerOpen(group.vendorId) ? "Moins d'infos" : "Plus d'infos"}
                                                        </span>
                                                        {isSellerOpen(group.vendorId) ? (
                                                            <ChevronUp size={14} />
                                                        ) : (
                                                            <ChevronDown size={14} />
                                                        )}
                                                    </button>
                                                </div>

                                                {isSellerOpen(group.vendorId) && vendor && (
                                                    <div className="space-y-2 text-[12px] sm:text-[13px] text-[#555] pl-[64px]">
                                                        <div className="flex gap-8">
                                                            <span>{vendor.active_products} produit{vendor.active_products > 1 ? 's' : ''} en vente</span>
                                                            <span>{vendor.total_sales} produit{vendor.total_sales > 1 ? 's' : ''} vendu{vendor.total_sales > 1 ? 's' : ''}</span>
                                                        </div>
                                                        {vendor.region && (
                                                            <div className="flex items-center gap-1.5">
                                                                <svg className="w-3.5 h-3.5 text-[#555]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                <span>{vendor.region}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* ── Produits du vendeur ── */}
                                            <div className="space-y-4">
                                            {group.items.map((item) => (
                                            <div key={item.id} className="flex gap-4 sm:gap-5">

                                                {/* Image seule à gauche */}
                                                <div className="shrink-0">
                                                    <div className="w-[80px] h-[100px] sm:w-[96px] sm:h-[120px] bg-[#F8F8F8] border border-[#EBEBEB] overflow-hidden">
                                                        <img
                                                            src={item.product.primary_image || PRODUCT_IMAGE_PLACEHOLDER}
                                                            alt={item.product.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Droite : infos + X en haut, prix en bas */}
                                                <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[100px] sm:min-h-[120px]">
                                                    {/* Haut : texte + croix */}
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="space-y-0.5 sm:space-y-1 min-w-0">
                                                            <h3 className="font-bold text-[13px] sm:text-[15px] tracking-wide text-[#1A1A1A]">
                                                                {item.product.title}
                                                            </h3>
                                                            {item.quantity > 1 && (
                                                                <p className="text-[12px] sm:text-[14px] text-[#777]">Quantité : {item.quantity}</p>
                                                            )}
                                                        </div>
                                                        {/* Croix de suppression */}
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="shrink-0 w-6 h-6 flex items-center justify-center text-[#C0C0C0] hover:text-[#1A1A1A] transition-colors mt-0.5"
                                                            aria-label="Supprimer l'article"
                                                        >
                                                            <X size={15} strokeWidth={2} />
                                                        </button>
                                                    </div>
                                                    {/* Bas : prix */}
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[13px] sm:text-[15px] font-semibold text-[#C0392B]">
                                                            {formatFcfa(getLineTotal(item))}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            ))}
                                            </div>

                                        </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── STEP 2 : carte pleine surface (gauche desktop / plein écran mobile) ── */}
                    {step === 2 && (
                        <div className={cx(
                            'flex-1 relative min-h-[calc(100vh-62px)] lg:min-h-0 lg:h-full',
                            showMobileForm && 'max-lg:hidden',
                        )}>
                            <DeliveryMap
                                vendorId={vendorId}
                                onLocationSelect={handleLocationSelect}
                                onError={handleShippingError}
                                onCalculatingChange={setIsCalculatingShipping}
                                onGeolocatingChange={setIsGeolocating}
                                geolocateSignal={geolocateSignal}
                                fullscreen
                            />

                            {/* Bouton flèche — mobile : au-dessus de la carte et des overlays */}
                            <button
                                onClick={() => setShowMobileForm(true)}
                                className="lg:hidden absolute bottom-6 right-6 w-12 h-12 bg-black rounded-full flex items-center justify-center shadow-xl hover:opacity-80 transition-opacity active:scale-95 z-[1100]"
                                aria-label="Ouvrir le formulaire"
                            >
                                <ArrowRight size={20} className="text-white" />
                            </button>
                        </div>
                    )}

                    {/* ── STEP 3 : success visual (sticky, centered) ── */}
                    {step === 3 && (
                        <div className="flex flex-col items-center text-center px-10 max-w-sm mx-auto">
                            <div className="mb-8">
                                <CircleCheckBig size={88} strokeWidth={1.5} className="text-[#16A34A]" />
                            </div>
                            <h2 className="text-[20px] font-bold text-[#1A1A1A] leading-snug mb-2">
                                Votre commande est en bonne voie !
                            </h2>
                            {placedOrder && (
                                <p className="text-sm font-mono font-semibold text-[#1A1A1A] mb-2">
                                    {formatOrderRef(placedOrder.id)}
                                </p>
                            )}
                            <p className="text-[14px] text-[#666] font-light leading-relaxed mb-8">
                                Nous l&apos;avons transmise au vendeur pour validation et préparation de la livraison.
                            </p>
                            <div className="flex flex-col gap-3 w-full">
                                {placedOrder && (
                                    <button
                                        type="button"
                                        onClick={() => router.push(`/commandes/${placedOrder.id}`)}
                                        className="w-full bg-black text-white text-[15px] font-semibold py-3.5 hover:opacity-90"
                                    >
                                        Suivre ma commande
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => router.push('/')}
                                    className="w-full border border-black text-black text-[15px] font-semibold py-3.5 hover:bg-gray-50"
                                >
                                    Continuer les achats
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ════════════════════════════════
                    RIGHT COLUMN
                ════════════════════════════════ */}
                <div className="lg:col-span-5 order-2 lg:order-2 bg-[#F5F5F5]">

                    {/* ── STEP 1 right ── */}
                    {step === 1 && (
                        <div
                            ref={stickyBoxRef}
                            style={{ top: stickyTop }}
                            className="lg:sticky px-4 sm:px-6 md:px-9 lg:px-11 py-6 md:py-10 space-y-0"
                        >

                            <h2 className="text-[18px] font-bold text-[#1A1A1A] mb-4">
                                Sous-total
                            </h2>

                            <div className="space-y-3 mb-6">
                                {items.map((item) => {
                                    const lineTotal = getLineTotal(item);
                                    return (
                                        <div key={item.id} className="flex justify-between text-[14px] text-[#1A1A1A]">
                                            <span className="truncate pr-2">
                                                {item.product.title}
                                                {item.quantity > 1 ? ` × ${item.quantity}` : ''}
                                            </span>
                                            <span className="font-medium shrink-0">{formatFcfa(lineTotal)}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <hr className="border-[#E0E0E0] mb-6" />

                            <div className="flex justify-between items-baseline mb-7">
                                <span className="text-[16px] font-bold text-[#1A1A1A]">Sous-total</span>
                                <span className="text-[28px] font-bold text-[#1A1A1A]">
                                    {formatFcfa(totalItemsPrice)}
                                </span>
                            </div>
                            <p className="text-xs text-[#999] mb-6">Hors frais de livraison</p>

                            {/* CTA */}
                            <button
                                onClick={() => setStep(2)}
                                disabled={items.length === 0}
                                className="w-full bg-black text-white text-[15px] font-semibold py-4 transition-colors disabled:cursor-not-allowed disabled:bg-[#CCCCCC]"
                            >
                                Passer la commande
                            </button>
                        </div>
                    )}

                    {/* ── STEP 2 right : Infos de livraison + récap ── */}
                    {step === 2 && (
                        <div className={cx(
                            'lg:sticky lg:top-[62px] lg:max-h-[calc(100vh-62px)] lg:overflow-y-auto',
                            !showMobileForm
                                ? 'hidden lg:block'
                                : 'fixed inset-0 z-[1200] flex flex-col bg-[#F5F5F5] lg:relative lg:inset-auto lg:z-auto lg:flex-none',
                        )}>
                            {/* Bouton fermer — mobile uniquement */}
                            <div className="lg:hidden shrink-0 flex justify-end px-4 pt-4 pb-2 bg-[#F5F5F5]">
                                <button
                                    onClick={() => setShowMobileForm(false)}
                                    className="w-8 h-8 bg-white border border-[#E8E8E8] rounded-full flex items-center justify-center shadow-sm hover:bg-[#F0F0F0] transition-colors"
                                    aria-label="Fermer"
                                >
                                    <X size={14} strokeWidth={2} className="text-[#1A1A1A]" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-9 lg:px-11 py-4 lg:py-10 space-y-7">

                                {/* Personal info */}
                                <div className="space-y-4">
                                    <h3 className="text-[16px] font-bold text-[#1A1A1A]">
                                        Informations de livraison
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

                                    {/* Téléphone */}
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
                                            placeholder="Entrez une note (étage, repère…)"
                                            className="w-full border border-[#D5D5D5] px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-black transition-all resize-none bg-white text-[#1A1A1A] placeholder-[#C5C5C5]"
                                        />
                                    </div>

                                    {/* Ma position actuelle → déclenche la géoloc dans la carte */}
                                    <button
                                        type="button"
                                        onClick={() => setGeolocateSignal((s) => s + 1)}
                                        disabled={isGeolocating}
                                        className="w-full flex items-center justify-center gap-2 border border-[#D5D5D5] bg-white py-2.5 px-4 text-[14px] font-medium text-[#1A1A1A] hover:border-black transition-all disabled:cursor-wait disabled:opacity-70"
                                    >
                                        {isGeolocating ? (
                                            <Loader2 size={14} className="animate-spin" />
                                        ) : (
                                            <LocateFixed size={14} strokeWidth={1.5} />
                                        )}
                                        Ma position actuelle
                                    </button>
                                </div>

                                <hr className="border-[#E0E0E0]" />

                                {/* Order summary */}
                                <div className="space-y-4">
                                    <h3 className="text-[16px] font-bold text-[#1A1A1A]">
                                        Récapitulatif commande
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-[14px] text-[#1A1A1A]">
                                            <span>
                                                Articles ({items.length} article{items.length > 1 ? 's' : ''})
                                            </span>
                                            <span className="font-medium">{formatFcfa(totalItemsPrice)}</span>
                                        </div>

                                        <div className="flex justify-between text-[14px] text-[#1A1A1A]">
                                            <span>Livraison</span>
                                            {isCalculatingShipping ? (
                                                <span className="flex items-center gap-1.5 text-[#777]">
                                                    <Loader2 size={13} className="animate-spin" /> Calcul…
                                                </span>
                                            ) : shippingFee !== null ? (
                                                <span className="font-medium">{formatFcfa(shippingFee)}</span>
                                            ) : (
                                                <span className="text-[13px] text-[#999]">Sélectionnez une adresse</span>
                                            )}
                                        </div>

                                        <hr className="border-[#E0E0E0]" />

                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[15px] font-bold text-[#1A1A1A]">Total</span>
                                            <span className="text-[24px] font-bold text-[#1A1A1A]">
                                                {grandTotal !== null ? formatFcfa(grandTotal) : '—'}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleConfirmOrder}
                                        disabled={!canConfirm || isSubmitting}
                                        className="w-full bg-black text-white text-[15px] font-semibold py-4 hover:opacity-90 disabled:bg-[#CCCCCC] disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                                        Confirmer la commande
                                    </button>

                                    {!canConfirm && !shippingError && (
                                        <p className="text-center text-[12px] text-[#999]">
                                            {shippingFee === null
                                                ? 'Sélectionnez votre adresse sur la carte'
                                                : 'Renseignez votre numéro de téléphone'}
                                        </p>
                                    )}
                                    {shippingError && (
                                        <p className="text-center text-[12px] text-red-500">{shippingError}</p>
                                    )}

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

                    {/* ── STEP 3 right : récap de confirmation (lecture seule) ── */}
                    {step === 3 && (
                        <div className="lg:sticky lg:top-[62px]">
                            <div className="px-4 sm:px-6 md:px-9 lg:px-11 py-6 md:py-10 space-y-7">

                                {/* Infos de livraison */}
                                <div className="space-y-4">
                                    <h3 className="text-[16px] font-bold text-[#1A1A1A]">
                                        Informations de livraison
                                    </h3>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="bg-white border border-[#EBEBEB] px-4 py-3">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#BBBBBB] mb-1">Prénom</p>
                                            <p className="text-[14px] font-medium text-[#1A1A1A]">{firstName || '—'}</p>
                                        </div>
                                        <div className="bg-white border border-[#EBEBEB] px-4 py-3">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#BBBBBB] mb-1">Nom</p>
                                            <p className="text-[14px] font-medium text-[#1A1A1A]">{lastName || '—'}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white border border-[#EBEBEB] px-4 py-3">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#BBBBBB] mb-1">Téléphone</p>
                                        <p className="text-[14px] font-medium text-[#1A1A1A]">{phone || '—'}</p>
                                    </div>

                                    {selectedCoords && (
                                        <div className="bg-white border border-[#EBEBEB] px-4 py-3">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#BBBBBB] mb-1">Position de livraison</p>
                                            <p className="text-[13px] font-medium text-emerald-700">
                                                {selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}
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

                                <hr className="border-[#E0E0E0]" />

                                {/* Récapitulatif final */}
                                <div className="space-y-4">
                                    <h3 className="text-[16px] font-bold text-[#1A1A1A]">
                                        Récapitulatif final
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-[14px] text-[#1A1A1A]">
                                            <span>
                                                Articles ({recapLineCount} article{recapLineCount > 1 ? 's' : ''})
                                            </span>
                                            <span className="font-medium">{formatFcfa(recapItemsSubtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-[14px] text-[#1A1A1A]">
                                            <span>Livraison</span>
                                            <span className="font-medium">
                                                {recapShippingFee !== null ? formatFcfa(recapShippingFee) : '—'}
                                            </span>
                                        </div>
                                        <hr className="border-[#E0E0E0]" />
                                        <div className="flex justify-between items-baseline">
                                            <span className="text-[15px] font-bold text-[#1A1A1A]">Total</span>
                                            <span className="text-[24px] font-bold text-[#1A1A1A]">
                                                {recapGrandTotal !== null ? formatFcfa(recapGrandTotal) : '—'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
