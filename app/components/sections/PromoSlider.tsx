'use client';

import React from 'react';

const PromoSlider = () => {
    return (
        <div className="relative w-full bg-black text-white py-3 overflow-hidden">
            <div className="flex animate-marquee">
                {/* Premier groupe */}
                <div className="flex items-center whitespace-nowrap flex-shrink-0">
                    <span className="mx-8 text-sm font-medium tracking-widest uppercase">Livraison offerte dès 200€ d'achat</span>
                    <span className="mx-8 text-sm font-medium tracking-widest uppercase">•</span>
                    <span className="mx-8 text-sm font-medium tracking-widest uppercase">Authentification garantie</span>
                    <span className="mx-8 text-sm font-medium tracking-widest uppercase">•</span>
                    <span className="mx-8 text-sm font-medium tracking-widest uppercase">Paiement en 3x ou 4x sans frais</span>
                    <span className="mx-8 text-sm font-medium tracking-widest uppercase">•</span>
                    <span className="mx-8 text-sm font-medium tracking-widest uppercase">Nouveautés chaque jour</span>
                    <span className="mx-8 text-sm font-medium tracking-widest uppercase">•</span>
                </div>
                {/* Duplication pour animation continue */}
                <div className="flex items-center whitespace-nowrap flex-shrink-0" aria-hidden="true">
                    <span className="mx-8 text-sm font-medium tracking-widest uppercase">Livraison offerte dès 200€ d'achat</span>
                    <span className="mx-8 text-sm font-medium tracking-widest uppercase">•</span>
                    <span className="mx-8 text-sm font-medium tracking-widest uppercase">Authentification garantie</span>
                    <span className="mx-8 text-sm font-medium tracking-widest uppercase">•</span>
                    <span className="mx-8 text-sm font-medium tracking-widest uppercase">Paiement en 3x ou 4x sans frais</span>
                    <span className="mx-8 text-sm font-medium tracking-widest uppercase">•</span>
                    <span className="mx-8 text-sm font-medium tracking-widest uppercase">Nouveautés chaque jour</span>
                    <span className="mx-8 text-sm font-medium tracking-widest uppercase">•</span>
                </div>
            </div>
        </div>
    );
};

export default PromoSlider;
