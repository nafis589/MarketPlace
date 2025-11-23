'use client';

import React from 'react';

const PromoSlider = () => {
    return (
        <div className="bg-black text-white py-3 overflow-hidden whitespace-nowrap">
            <div className="animate-marquee inline-block">
                <span className="mx-8 text-sm font-medium tracking-widest uppercase">Livraison offerte dès 200€ d'achat</span>
                <span className="mx-8 text-sm font-medium tracking-widest uppercase">•</span>
                <span className="mx-8 text-sm font-medium tracking-widest uppercase">Authentification garantie</span>
                <span className="mx-8 text-sm font-medium tracking-widest uppercase">•</span>
                <span className="mx-8 text-sm font-medium tracking-widest uppercase">Paiement en 3x ou 4x sans frais</span>
                <span className="mx-8 text-sm font-medium tracking-widest uppercase">•</span>
                <span className="mx-8 text-sm font-medium tracking-widest uppercase">Nouveautés chaque jour</span>
                <span className="mx-8 text-sm font-medium tracking-widest uppercase">•</span>
                <span className="mx-8 text-sm font-medium tracking-widest uppercase">Livraison offerte dès 200€ d'achat</span>
                <span className="mx-8 text-sm font-medium tracking-widest uppercase">•</span>
                <span className="mx-8 text-sm font-medium tracking-widest uppercase">Authentification garantie</span>
            </div>
        </div>
    );
};

export default PromoSlider;
