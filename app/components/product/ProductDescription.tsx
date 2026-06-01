'use client';

import React from 'react';

interface ProductDescriptionProps {
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

// --- Icons ---

const VerifiedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-500">
        <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.498 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.307 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-3.5 h-3.5 text-gray-500"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

export default function ProductDescription({ product }: ProductDescriptionProps) {
    // Mock seller data
    const seller = {
        name: "Designer",
        username: "@570Designer",
        avatar: null,
        shipping: "Expédie généralement en 2 jours",
        sold: 1058,
        shipped: 1023,
        cancelled: 35,
    };

    // Mock description data based on product
    const description = {
        paragraph: `Ce ${product.title} de la marque ${product.brand} incarne l'élégance intemporelle et le savoir-faire artisanal. Confectionné à partir de matériaux soigneusement sélectionnés, il allie confort et raffinement pour une silhouette sophistiquée. Idéal pour les occasions spéciales comme pour le quotidien, ce vêtement apportera une touche de luxe à votre garde-robe.`,
    };

    const details = [
        { label: "En ligne depuis le", value: "2026-05-07" },
        { label: "Univers", value: product.gender },
        { label: "Catégorie", value: product.category },
        { label: "Sous-catégorie", value: product.type },
        { label: "Designer", value: product.brand },
        { label: "État", value: "Très bon état"},
        { label: "Matière", value: "Coton" },
        { label: "Couleur", value: "Noir" },
        { label: "Taille", value: "L International", extra: "guide des tailles" },
        { label: "Localisation", value: "Italie chez le vendeur Luca" },
        { label: "Référence", value: "66741814" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            {/* ─── SECTION TITLE ─── */}
            <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4 md:mb-10">
                Description
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

                {/* ─── LEFT COLUMN: SELLER ─── */}
                <div className="lg:col-span-5">
                    {/* Section Title */}
                    <h3 className="text-[11px] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-6">
                        Vendeur
                    </h3>

                    {/* Seller Card */}
                    <div className="border border-[#e5e5e5] rounded-sm p-6 space-y-5">

                        {/* Avatar + Name + Follow */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-500 shrink-0 overflow-hidden">
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <p className="font-semibold text-sm text-gray-900">{seller.name}</p>
                                        <VerifiedIcon />
                                    </div>
                                    <p className="text-xs text-gray-500">{seller.username}</p>
                                </div>
                            </div>
                            <button className="px-5 py-2 text-xs font-semibold uppercase tracking-widest bg-black text-white hover:bg-gray-800 transition-colors rounded-full">
                                Suivre
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-[#e5e5e5]" />

                        {/* Shipping */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 shrink-0">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                            </svg>
                            <span>{seller.shipping}</span>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-[#e5e5e5]" />

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <p className="text-sm font-semibold text-gray-900">{seller.sold.toLocaleString()}</p>
                                <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-0.5">Vendus</p>
                            </div>
                            <div className="text-center border-x border-[#e5e5e5]">
                                <p className="text-sm font-semibold text-gray-900">{seller.shipped.toLocaleString()}</p>
                                <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-0.5">Expédiés</p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-semibold text-gray-900">{seller.cancelled.toLocaleString()}</p>
                                <p className="text-[11px] text-gray-400 uppercase tracking-wider mt-0.5">Annulés</p>
                            </div>
                        </div>
                    </div>

                    {/* Trust Message */}
                    <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5">
                        <CheckIcon className="w-3.5 h-3.5 text-gray-400" />
                        Achetez en toute confiance sur Marketplace
                    </p>
                </div>

                {/* ─── RIGHT COLUMN: DESCRIPTION ─── */}
                <div className="lg:col-span-7">
                    {/* Section Title */}
                    <h3 className="text-[11px] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-6">
                        Description
                    </h3>

                    {/* Description Card */}
                    <div className="border border-[#e5e5e5] rounded-sm p-8 lg:p-10 space-y-8">

                        {/* Paragraph */}
                        <div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {description.paragraph}
                            </p>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-[#e5e5e5]" />

                        {/* Details */}
                        <div>
                            <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-4">Détails</p>
                            <div className="space-y-3">
                                {details.map((detail, index) => (
                                    <div key={index} className="flex items-baseline gap-2 text-sm">
                                        <span className="text-gray-400 shrink-0 whitespace-nowrap">{detail.label} :</span>
                                        <span className="text-gray-800 font-medium">{detail.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-[#e5e5e5]" />

                        {/* Return Policy */}
                        <div className="flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 shrink-0 mt-0.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Retours acceptés sous 14 jours</p>
                                <p className="text-xs text-gray-500 mt-0.5">L&apos;article doit être retourné dans son état d&apos;origine avec toutes ses étiquettes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
