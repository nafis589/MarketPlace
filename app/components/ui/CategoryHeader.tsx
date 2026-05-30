'use client';

import React from 'react';
import Link from 'next/link';

// Composant pour l'icône Chevron (flèche vers le bas)
const ChevronDown = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="ml-2"
    >
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

interface FilterButtonProps {
    label: string;
    hasChevron?: boolean;
    isActive?: boolean;
}

// Composant Bouton de Filtre générique
const FilterButton: React.FC<FilterButtonProps> = ({ label, hasChevron = false, isActive = false }) => {
    return (
        <button className={`flex items-center justify-between border ${isActive ? 'border-black border-2 font-medium' : 'border-gray-900'} bg-white px-5 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors whitespace-nowrap`}>
            <span>{label}</span>
            {hasChevron && <ChevronDown />}
        </button>
    );
};

interface Breadcrumb {
    label: string;
    href: string;
}

interface CategoryHeaderProps {
    title: string;
    count: number;
    breadcrumbs: Breadcrumb[];
}

export default function CategoryHeader({ title, count, breadcrumbs }: CategoryHeaderProps) {
    return (
        <div className="w-full font-sans bg-white mb-8 -mt-2 md:mt-0">
            {/* Fil d'ariane (Breadcrumbs) */}
            <nav className="text-sm text-gray-500 mb-6 flex items-center capitalize">
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.href}>
                        {index > 0 && <span className="mx-2">›</span>}
                        <Link href={crumb.href} className="hover:underline cursor-pointer hover:text-black transition-colors">
                            {crumb.label}
                        </Link>
                    </React.Fragment>
                ))}
            </nav>

            {/* Titre et Compteur */}
            <div className="flex items-baseline mb-8">
                <h1 className="font-serif text-2xl md:text-3xl lg:text-5xl text-gray-900 tracking-tight capitalize">
                    {title}
                </h1>
                <span className="ml-4 text-gray-500 text-lg">
                    — {count} Résultats
                </span>
            </div>

            {/* Barre de Filtres */}
            <div className="flex overflow-x-auto gap-3 items-center pb-2 scrollbar-hide">
                {/* Trier Par */}
                <FilterButton label="Trier Par" hasChevron={true} />

                {/* Boutons simples */}
                <FilterButton label="Black Friday" />
                <FilterButton label="Hors Douanes" />

                {/* Catégorie (Sélectionnée - Exemple) */}
                {/* <FilterButton label="Catégorie (1)" hasChevron={true} isActive={true} /> */}

                {/* Autres filtres avec dropdown */}
                <FilterButton label="Designers" hasChevron={true} />
                <FilterButton label="Etat" hasChevron={true} />
                <FilterButton label="Tailles" hasChevron={true} />
                <FilterButton label="Couleurs" hasChevron={true} />
                <FilterButton label="Matières" hasChevron={true} />
            </div>
        </div>
    );
}
