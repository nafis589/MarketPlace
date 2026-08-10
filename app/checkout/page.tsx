'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
    CircleCheckBig,
    ChevronDown,
    ChevronUp,
    Package,
    X,
    Loader2,
    ArrowRight,
    CreditCard,
    Truck,
} from 'lucide-react';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useUI } from '@/app/context/UIContext';
import { useToast } from '@/app/components/ui/Toast';
import { getLineTotal, hasOfferDiscount, cartApi, type CartItem, type CartItemVendor } from '@/lib/cart-api';
import { ordersApi, type StoreOrder } from '@/lib/orders-api';
import { ApiClientError } from '@/lib/api-client';
import { formatOrderRef } from '@/app/lib/order-utils';
import type { LocationSelectResult, CartShippingCalculateResult } from '@/lib/types';
import CheckoutOrderSummary from '@/app/components/checkout/CheckoutOrderSummary';
import { CardPaymentForm } from '@/app/components/checkout/CardPaymentForm';
import { formatPrice as formatFcfa } from '@/app/utils/formatPrice';
import { PRODUCT_IMAGE_PLACEHOLDER } from '@/app/lib/mapHomeProduct';
import { reverseGeocode } from '@/lib/nominatim';

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

type DeliveryFieldErrors = {
    firstName?: string;
    lastName?: string;
    phone?: string;
};

function validateDeliveryInfo(
    firstName: string,
    lastName: string,
    phone: string,
): DeliveryFieldErrors {
    const errors: DeliveryFieldErrors = {};
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const normalizedPhone = phone.trim().replace(/\s/g, '');

    if (!trimmedFirstName) {
        errors.firstName = 'Le prénom est requis';
    } else if (trimmedFirstName.length < 2) {
        errors.firstName = 'Minimum 2 caractères';
    }

    if (!trimmedLastName) {
        errors.lastName = 'Le nom est requis';
    } else if (trimmedLastName.length < 2) {
        errors.lastName = 'Minimum 2 caractères';
    }

    if (!normalizedPhone) {
        errors.phone = 'Le téléphone est requis';
    } else if (!/^(\+228|228)?[0-9]{8}$/.test(normalizedPhone)) {
        errors.phone = 'Numéro invalide (8 chiffres)';
    }

    return errors;
}

export default function CheckoutPage() {
    const router = useRouter();
    const { items, total, removeItem, refresh: refreshCart } = useCart();
    const { isLoggedIn, user } = useAuth();
    const { openLogin } = useUI();
    const { showToast } = useToast();

    const [step, setStep] = useState(1);

    // Step 2 form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');

    // Payment method selection
    type PaymentMethodType = 'CASH_ON_DELIVERY' | 'CARD';
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('CARD');
    const [cardOrderId, setCardOrderId] = useState<string | null>(null);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    // Step 2 shipping (carte + calcul backend)
    const [shippingResult, setShippingResult] = useState<CartShippingCalculateResult | null>(null);
    const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number; addressLabel: string | null } | null>(null);
    const [shippingRegionId, setShippingRegionId] = useState<string | null>(null);
    const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<DeliveryFieldErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [placedOrder, setPlacedOrder] = useState<StoreOrder | null>(null);
    const [confirmedShippingResult, setConfirmedShippingResult] = useState<CartShippingCalculateResult | null>(null);

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

    const recapShippingResult = step === 3 ? (confirmedShippingResult ?? shippingResult) : shippingResult;

    useEffect(() => {
        if (!user) return;
        setFirstName((prev) => prev || user.first_name || '');
        setLastName((prev) => prev || user.last_name || '');
        setPhone((prev) => prev || user.phone || '');
    }, [user]);

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
        setSelectedPosition({ lat: result.lat, lng: result.lng, addressLabel: null });
        setShippingResult(result.shipping);
        setShippingRegionId(result.regionId);
    };

    useEffect(() => {
        if (!selectedPosition) return;
        let cancelled = false;
        void reverseGeocode(selectedPosition.lat, selectedPosition.lng).then((name) => {
            if (!cancelled) {
                setSelectedPosition((prev) =>
                    prev ? { ...prev, addressLabel: name || null } : prev,
                );
            }
        });
        return () => {
            cancelled = true;
        };
    }, [selectedPosition?.lat, selectedPosition?.lng]);

    const totalItemsPrice = total;

    const canConfirm =
        shippingResult?.summary.can_checkout === true &&
        selectedPosition !== null &&
        !!firstName.trim() &&
        !!lastName.trim() &&
        !!phone.trim() &&
        !!shippingRegionId;

    const handleConfirmOrder = async () => {
        const errors = validateDeliveryInfo(firstName, lastName, phone);
        setFieldErrors(errors);
        if (Object.keys(errors).length > 0) return;

        if (!canConfirm || !selectedPosition || !shippingResult || !shippingRegionId) return;
        if (!isLoggedIn) {
            openLogin();
            return;
        }
        setIsSubmitting(true);
        setPaymentError(null);
        try {
            const { data: cartData } = await cartApi.getCart();
            if (cartData.items.length === 0) {
                showToast('Votre panier est vide. Ajoutez des articles avant de commander.');
                return;
            }

            const vendor_shippings = shippingResult.vendors
                .filter((v) => !v.shipping.error)
                .map((v) => ({
                    vendor_id: v.vendor_id,
                    shipping_fee: v.shipping.fee,
                    shipping_method: v.shipping.method,
                    shipping_distance_km: v.shipping.distanceKm ?? null,
                    shipping_detail: v.shipping.detail,
                }));

            const { data } = await ordersApi.placeOrder({
                payment_method: paymentMethod,
                shipping_address: {
                    first_name: firstName,
                    last_name: lastName,
                    phone,
                    notes: notes || null,
                    latitude: selectedPosition.lat,
                    longitude: selectedPosition.lng,
                    region_id: shippingRegionId,
                    address_label: selectedPosition.addressLabel || null,
                },
                vendor_shippings,
            });
            const order = data.orders[0] ?? null;
            setConfirmedShippingResult(shippingResult);
            setPlacedOrder(order);
            await refreshCart();
            setShowMobileForm(false);

            if (paymentMethod === 'CARD' && order) {
                // Monter le formulaire de paiement Stripe
                setCardOrderId(order.id);
            } else {
                setStep(3);
            }
        } catch (err) {
            const message =
                err instanceof ApiClientError
                    ? err.message
                    : 'Impossible de confirmer la commande';
            showToast(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePaymentSuccess = () => {
        if (placedOrder) {
            router.push(`/commandes/${placedOrder.id}?payment=success`);
        }
    };

    const handlePaymentError = (message: string) => {
        setPaymentError(message);
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
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span className="text-[13px] sm:text-[15px] font-semibold text-[#C0392B]">
                                                                        {formatFcfa(getLineTotal(item))}
                                                                    </span>
                                                                    {hasOfferDiscount(item) && (
                                                                        <span className="text-[12px] sm:text-[13px] text-[#AAAAAA] line-through">
                                                                            {formatFcfa(item.product.price * item.quantity)}
                                                                        </span>
                                                                    )}
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
                                onLocationSelect={handleLocationSelect}
                                onCalculatingChange={setIsCalculatingShipping}
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
                                            <span className="shrink-0 text-right">
                                                {hasOfferDiscount(item) && (
                                                    <span className="mr-1.5 text-[12px] text-[#AAAAAA] line-through">
                                                        {formatFcfa(item.product.price * item.quantity)}
                                                    </span>
                                                )}
                                                <span className="font-medium">{formatFcfa(lineTotal)}</span>
                                            </span>
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

                                {/* Payment method selection */}
                                <div className="space-y-3">
                                    <h3 className="text-[16px] font-bold text-[#1A1A1A]">
                                        Mode de paiement
                                    </h3>

                                    <div className="grid grid-cols-2 gap-3">
                                        {/* CARD option */}
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('CARD')}
                                            className={`relative flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 rounded-xl transition-all ${paymentMethod === 'CARD'
                                                    ? 'border-[#1A1A1A] bg-[#1A1A1A]/[0.04]'
                                                    : 'border-[#E0E0E0] bg-white hover:border-[#AAAAAA]'
                                                }`}
                                        >
                                            {paymentMethod === 'CARD' && (
                                                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </span>
                                            )}
                                            <CreditCard size={32} className={paymentMethod === 'CARD' ? 'text-[#1A1A1A]' : 'text-[#CCCCCC]'} strokeWidth={1.5} />
                                            <p className={`text-[11px] font-semibold tracking-wide ${paymentMethod === 'CARD' ? 'text-[#1A1A1A]' : 'text-[#AAAAAA]'}`}>
                                                Payer par carte
                                            </p>
                                        </button>

                                        {/* CASH_ON_DELIVERY option */}
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                                            className={`relative flex flex-col items-center justify-center gap-2 px-4 py-6 border-2 rounded-xl transition-all ${paymentMethod === 'CASH_ON_DELIVERY'
                                                    ? 'border-[#1A1A1A] bg-[#1A1A1A]/[0.04]'
                                                    : 'border-[#E0E0E0] bg-white hover:border-[#AAAAAA]'
                                                }`}
                                        >
                                            {paymentMethod === 'CASH_ON_DELIVERY' && (
                                                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#1A1A1A] flex items-center justify-center">
                                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </span>
                                            )}
                                            <Truck size={32} className={paymentMethod === 'CASH_ON_DELIVERY' ? 'text-[#1A1A1A]' : 'text-[#CCCCCC]'} strokeWidth={1.5} />
                                            <p className={`text-[11px] font-semibold tracking-wide ${paymentMethod === 'CASH_ON_DELIVERY' ? 'text-[#1A1A1A]' : 'text-[#AAAAAA]'}`}>
                                                Payer à la livraison
                                            </p>
                                        </button>
                                    </div>

                                    {/* Stripe form shown inline when CARD selected and order placed */}
                                    {paymentMethod === 'CARD' && cardOrderId && placedOrder && (
                                        <CardPaymentForm
                                            orderId={cardOrderId}
                                            totalAmount={placedOrder.total_amount}
                                            onPaymentSuccess={handlePaymentSuccess}
                                            onPaymentError={handlePaymentError}
                                        />
                                    )}
                                </div>

                                <hr className="border-[#E0E0E0]" />

                                {/* Personal info */}
                                <div className="space-y-4">
                                    <h3 className="text-[16px] font-bold text-[#1A1A1A]">
                                        Informations de livraison
                                    </h3>

                                    {/* Prénom + Nom */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1A1A1A]">
                                                Prénom <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={firstName}
                                                onChange={(e) => {
                                                    setFirstName(e.target.value);
                                                    if (fieldErrors.firstName) {
                                                        setFieldErrors((prev) => ({ ...prev, firstName: undefined }));
                                                    }
                                                }}
                                                placeholder="Entrez votre prénom"
                                                className={cx(
                                                    'w-full border px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-black transition-all bg-white text-[#1A1A1A] placeholder-[#C5C5C5]',
                                                    fieldErrors.firstName ? 'border-red-400' : 'border-[#D5D5D5]',
                                                )}
                                            />
                                            {fieldErrors.firstName && (
                                                <p className="text-[12px] text-red-600">{fieldErrors.firstName}</p>
                                            )}
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1A1A1A]">
                                                Nom <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={lastName}
                                                onChange={(e) => {
                                                    setLastName(e.target.value);
                                                    if (fieldErrors.lastName) {
                                                        setFieldErrors((prev) => ({ ...prev, lastName: undefined }));
                                                    }
                                                }}
                                                placeholder="Entrez votre nom"
                                                className={cx(
                                                    'w-full border px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-black transition-all bg-white text-[#1A1A1A] placeholder-[#C5C5C5]',
                                                    fieldErrors.lastName ? 'border-red-400' : 'border-[#D5D5D5]',
                                                )}
                                            />
                                            {fieldErrors.lastName && (
                                                <p className="text-[12px] text-red-600">{fieldErrors.lastName}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Téléphone */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1A1A1A]">
                                            Téléphone <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => {
                                                setPhone(e.target.value);
                                                if (fieldErrors.phone) {
                                                    setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                                                }
                                            }}
                                            placeholder="Entrez votre numéro de téléphone"
                                            className={cx(
                                                'w-full border px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-black transition-all bg-white text-[#1A1A1A] placeholder-[#C5C5C5]',
                                                fieldErrors.phone ? 'border-red-400' : 'border-[#D5D5D5]',
                                            )}
                                        />
                                        {fieldErrors.phone && (
                                            <p className="text-[12px] text-red-600">{fieldErrors.phone}</p>
                                        )}
                                    </div>

                                    {/* Notes */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1A1A1A]">
                                            Notes{' '}

                                        </label>
                                        <textarea
                                            rows={2}
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            placeholder="Entrez une note (étage, repère…)"
                                            className="w-full border border-[#D5D5D5] px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-black transition-all resize-none bg-white text-[#1A1A1A] placeholder-[#C5C5C5]"
                                        />
                                    </div>
                                </div>

                                <hr className="border-[#E0E0E0]" />

                                <CheckoutOrderSummary
                                    shippingResult={shippingResult}
                                    isCalculating={isCalculatingShipping}
                                />

                                {/* Show action buttons only when no card order is awaiting payment */}
                                {!cardOrderId && (
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setStep(1)}
                                            className="flex-1 border border-black bg-white text-black text-[15px] font-semibold py-4 hover:bg-gray-50 transition-colors"
                                        >
                                            ← Retour au panier
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => void handleConfirmOrder()}
                                            disabled={!canConfirm || isSubmitting}
                                            className="flex-1 bg-black text-white text-[15px] font-semibold py-4 hover:opacity-90 disabled:bg-[#CCCCCC] disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                                            {paymentMethod === 'CARD' ? 'Continuer vers le paiement' : 'Confirmer la commande'}
                                        </button>
                                    </div>
                                )}
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

                                    {selectedPosition && (
                                        <div className="bg-white border border-[#EBEBEB] px-4 py-3">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-[#BBBBBB] mb-1">Position de livraison</p>
                                            <p className="text-[13px] font-medium text-[#1A1A1A]">
                                                {selectedPosition.addressLabel || 'Localisation en cours…'}
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

                                <CheckoutOrderSummary
                                    shippingResult={recapShippingResult}
                                    title="Récapitulatif final"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
