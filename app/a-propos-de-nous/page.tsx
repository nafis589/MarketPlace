'use client';

import React from 'react';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white font-sans">
            <Header />
            <div className="pt-[100px] md:pt-[120px]">
                <div className="max-w-[1200px] mx-auto px-6 py-12">
                    <h1 className="text-4xl font-serif mb-8 text-gray-900">À propos de nous</h1>
                    <div className="prose max-w-none text-gray-600">
                        <p className="mb-6">
                            Bienvenue chez FriperieLuxe, votre destination privilégiée pour la mode de seconde main authentifiée.
                        </p>
                        <p className="mb-6">
                            Notre mission est de rendre le luxe accessible tout en promouvant une consommation plus durable et responsable.
                            Chaque pièce est soigneusement sélectionnée et vérifiée par nos experts pour garantir son authenticité et sa qualité.
                        </p>
                        <p>
                            Nous croyons que chaque vêtement a une histoire et mérite une seconde vie. Rejoignez notre communauté de passionnés de mode.
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
