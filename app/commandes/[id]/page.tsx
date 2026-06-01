'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
    ArrowLeft,
    Download,
    Minus,
    Plus,
    X,
    CheckCircle2,
    Circle,
    Package,
    PackageCheck,
    Truck,
    Home,
} from 'lucide-react';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';
import { ORDERS, type OrderItem, type OrderStatus } from '@/app/lib/ordersData';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatPrice(n: number) {
    return n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
}

function formatDateLong(s: string) {
    return new Date(s).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ─── Stepper config ───────────────────────────────────────────────────────────

interface Step {
    label: string;
    icon: React.ReactNode;
}

const STEPS: Step[] = [
    { label: 'Commande passée',   icon: <Package  className="w-4 h-4" /> },
    { label: 'Préparation',       icon: <Package  className="w-4 h-4" /> },
    { label: 'En transit',        icon: <Truck    className="w-4 h-4" /> },
    { label: 'En livraison',      icon: <Truck    className="w-4 h-4" /> },
    { label: 'Livré',             icon: <Home     className="w-4 h-4" /> },
];

function stepIndexFromStatus(status: OrderStatus): number {
    switch (status) {
        case 'En attente': return 0;
        case 'En transit': return 2;
        case 'Livré':      return 4;
        case 'Annulé':     return -1;
        default:           return 0;
    }
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function statusBadge(s: OrderStatus) {
    const base = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold';
    switch (s) {
        case 'Livré':      return <span className={`${base} bg-green-100 text-green-700`}>{s}</span>;
        case 'En transit': return <span className={`${base} bg-blue-100 text-blue-700`}>{s}</span>;
        case 'En attente': return <span className={`${base} bg-amber-100 text-amber-700`}>{s}</span>;
        case 'Annulé':     return <span className={`${base} bg-red-100 text-red-600`}>{s}</span>;
    }
}

// ─── Quantity row ─────────────────────────────────────────────────────────────

function QtyRow({ item, disabled }: { item: OrderItem; disabled: boolean }) {
    const [qty, setQty] = useState(item.quantity);
    return (
        <div className="flex items-center gap-2">
            <button
                onClick={() => setQty(q => Math.max(1, q - 1))}
                disabled={disabled || qty <= 1}
                className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center text-sm font-medium tabular-nums">
                {String(qty).padStart(2, '0')}
            </span>
            <button
                onClick={() => setQty(q => q + 1)}
                disabled={disabled}
                className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <Plus className="w-3 h-3" />
            </button>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function CommandeDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const order  = ORDERS.find(o => o.id === id);

    if (!order) notFound();

    const activeStep = stepIndexFromStatus(order.status);
    const isLocked   = order.status === 'Livré' || order.status === 'Annulé';

    const subtotal  = order.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const total     = subtotal + order.shipping - order.discount;

    return (
        <main>
            <Header />

            <div className="pt-[100px] md:pt-[120px] min-h-screen bg-white">
                <div className="max-w-[900px] mx-auto px-4 md:px-8 py-8 md:py-12">

                    {/* ── Back link ── */}
                    <Link
                        href="/commandes"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-black transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour aux commandes
                    </Link>

                    {/* ── Hero title ── */}
                    <div className="text-center mb-10">
                        <h1 className="text-2xl md:text-3xl font-serif font-medium tracking-tight mb-2">
                            Suivi de commande
                        </h1>
                        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                            Suivez en temps réel l&apos;avancement de votre commande, de la confirmation jusqu&apos;à la livraison à votre adresse.
                        </p>
                    </div>

                    {/* ── Order details card ── */}
                    <section className="border border-gray-200 rounded-2xl p-5 md:p-7 mb-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-semibold">Détails de la commande</h2>
                            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-lg hover:bg-gray-800 transition-colors">
                                <Download className="w-3.5 h-3.5" />
                                Télécharger la facture
                            </button>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">N° commande</p>
                                <p className="font-mono font-semibold text-black leading-tight">{order.id}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Date de commande</p>
                                <p className="font-medium text-black">{formatDateLong(order.date)}</p>
                            </div>
                            {order.deliveredDate && (
                                <div>
                                    <p className="text-xs text-gray-400 mb-1">Date de livraison</p>
                                    <p className="font-medium text-black">{formatDateLong(order.deliveredDate)}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Nb d&apos;articles</p>
                                <p className="font-medium text-black">{order.items.length} article{order.items.length > 1 ? 's' : ''}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Statut</p>
                                {statusBadge(order.status)}
                            </div>
                        </div>
                    </section>

                    {/* ── Tracking stepper ── */}
                    {order.status !== 'Annulé' && (
                        <section className="border border-gray-200 rounded-2xl p-5 md:p-7 mb-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-base font-semibold">Suivi de livraison</h2>
                                <span className="font-mono text-xs text-gray-400">{order.trackingNumber}</span>
                            </div>

                            {/* Desktop stepper */}
                            <div className="hidden sm:flex items-start relative">
                                {/* Progress line background */}
                                <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200" />
                                {/* Progress line fill */}
                                <div
                                    className="absolute top-4 left-4 h-0.5 bg-black transition-all duration-500"
                                    style={{ width: `calc(${(activeStep / (STEPS.length - 1)) * 100}% - 2rem)` }}
                                />

                                {STEPS.map((step, i) => {
                                    const done    = i < activeStep;
                                    const current = i === activeStep;
                                    return (
                                        <div key={step.label} className="relative flex-1 flex flex-col items-center gap-2">
                                            {/* Circle */}
                                            <div className={`
                                                w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 transition-all
                                                ${done    ? 'bg-black border-black text-white'      : ''}
                                                ${current ? 'bg-black border-black text-white ring-4 ring-black/10' : ''}
                                                ${!done && !current ? 'bg-white border-gray-300 text-gray-400' : ''}
                                            `}>
                                                {done ? (
                                                    <CheckCircle2 className="w-4 h-4" />
                                                ) : (
                                                    <span className="text-xs font-bold">{i + 1}</span>
                                                )}
                                            </div>
                                            {/* Label */}
                                            <p className={`text-xs font-medium text-center leading-tight ${current || done ? 'text-black' : 'text-gray-400'}`}>
                                                {step.label}
                                            </p>
                                            {/* Date */}
                                            {(done || current) && (
                                                <p className="text-xs text-gray-400 text-center">
                                                    {formatDateLong(i === STEPS.length - 1 && order.deliveredDate
                                                        ? order.deliveredDate
                                                        : order.date)}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Mobile stepper (vertical) */}
                            <div className="flex sm:hidden flex-col gap-0">
                                {STEPS.map((step, i) => {
                                    const done    = i < activeStep;
                                    const current = i === activeStep;
                                    const last    = i === STEPS.length - 1;
                                    return (
                                        <div key={step.label} className="flex items-start gap-3">
                                            {/* Column: circle + vertical line */}
                                            <div className="flex flex-col items-center flex-shrink-0">
                                                <div className={`
                                                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                                                    ${done    ? 'bg-black border-black text-white' : ''}
                                                    ${current ? 'bg-black border-black text-white ring-4 ring-black/10' : ''}
                                                    ${!done && !current ? 'bg-white border-gray-300 text-gray-400' : ''}
                                                `}>
                                                    {done ? (
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    ) : (
                                                        <span className="text-xs font-bold">{i + 1}</span>
                                                    )}
                                                </div>
                                                {!last && (
                                                    <div className={`w-0.5 h-8 mt-1 ${done ? 'bg-black' : 'bg-gray-200'}`} />
                                                )}
                                            </div>

                                            {/* Text */}
                                            <div className="pb-6">
                                                <p className={`text-sm font-medium ${current || done ? 'text-black' : 'text-gray-400'}`}>
                                                    {step.label}
                                                </p>
                                                {(done || current) && (
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {formatDateLong(i === STEPS.length - 1 && order.deliveredDate
                                                            ? order.deliveredDate
                                                            : order.date)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    )}

                    {/* Annulé banner */}
                    {order.status === 'Annulé' && (
                        <section className="border border-red-200 bg-red-50 rounded-2xl p-5 md:p-7 mb-6 flex items-center gap-3">
                            <X className="w-5 h-5 text-red-500 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-red-700">Commande annulée</p>
                                <p className="text-xs text-red-500 mt-0.5">Cette commande a été annulée. Le remboursement a été traité.</p>
                            </div>
                        </section>
                    )}

                    {/* ── Items ── */}
                    <section className="border border-gray-200 rounded-2xl overflow-hidden mb-6">
                        <div className="px-5 md:px-7 py-5 border-b border-gray-100">
                            <h2 className="text-base font-semibold">Articles de la commande</h2>
                        </div>

                        {/* Desktop table header */}
                        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-7 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            <span>Produit</span>
                            <span>Taille</span>
                            <span>Quantité</span>
                            <span>Prix</span>
                            <span className="w-5" />
                        </div>

                        <div className="divide-y divide-gray-100">
                            {order.items.map(item => (
                                <div key={item.id} className="px-5 md:px-7 py-4">
                                    {/* Desktop row */}
                                    <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center">
                                        {/* Product */}
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                                                {item.image}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium leading-snug">{item.name}</p>
                                                <p className="text-xs text-gray-400 mt-0.5">Réf. {item.productId}</p>
                                            </div>
                                        </div>
                                        {/* Size */}
                                        <span className="text-sm text-gray-600">{item.size}</span>
                                        {/* Qty */}
                                        <QtyRow item={item} disabled={isLocked} />
                                        {/* Price */}
                                        <span className="text-sm font-semibold">{formatPrice(item.unitPrice)}</span>
                                        {/* Remove */}
                                        <button
                                            disabled={isLocked}
                                            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Mobile row */}
                                    <div className="flex md:hidden gap-3">
                                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                                            {item.image}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <p className="text-sm font-medium leading-snug">{item.name}</p>
                                                <button
                                                    disabled={isLocked}
                                                    className="text-gray-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-400 mb-3">Réf. {item.productId}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-xs text-gray-500">
                                                    <span>Taille : <strong className="text-black">{item.size}</strong></span>
                                                </div>
                                                <QtyRow item={item} disabled={isLocked} />
                                            </div>
                                            <p className="text-sm font-semibold mt-2">{formatPrice(item.unitPrice)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Price summary ── */}
                    <section className="border border-gray-200 rounded-2xl p-5 md:p-7">
                        <div className="flex flex-col gap-3 text-sm max-w-xs ml-auto">
                            <div className="flex items-center justify-between text-gray-500">
                                <span>Sous-total</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between text-gray-500">
                                <span>Livraison</span>
                                <span>{order.shipping === 0 ? 'Offerte' : formatPrice(order.shipping)}</span>
                            </div>
                            {order.discount > 0 && (
                                <div className="flex items-center justify-between text-green-600">
                                    <span>Réduction</span>
                                    <span>− {formatPrice(order.discount)}</span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-3 flex items-center justify-between font-semibold text-base">
                                <span>Total</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                        </div>
                    </section>

                </div>
            </div>

            <Footer />
        </main>
    );
}
