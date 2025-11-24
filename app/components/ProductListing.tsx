import React from 'react';

// --- Types ---
export interface Product {
    id: number;
    brand: string;
    category: string;
    size: string;
    price: number;
    imageUrl: string;
    currency: string;
}

// --- Mock Data (Basé sur votre image) ---
const PRODUCTS: Product[] = [
    {
        id: 1,
        brand: 'CHROME HEARTS',
        category: 'Chemise',
        size: 'S International',
        price: 575,
        currency: '$',
        imageUrl: 'https://images.vestiairecollective.com/cdn-cgi/image/w=500,h=500,f=auto,q=80/produit/40562627-1_1.jpg', // Placeholder ou URL réelle si dispo
    },
    {
        id: 2,
        brand: 'BURBERRY',
        category: 'Chemise',
        size: 'XXL International',
        price: 249,
        currency: '$',
        imageUrl: 'https://images.vestiairecollective.com/cdn-cgi/image/w=500,h=500,f=auto,q=80/produit/40498711-1_1.jpg',
    },
    {
        id: 3,
        brand: 'BODE',
        category: 'Chemise',
        size: 'S International',
        price: 279,
        currency: '$',
        imageUrl: 'https://images.vestiairecollective.com/cdn-cgi/image/w=500,h=500,f=auto,q=80/produit/38983465-1_1.jpg',
    },
    {
        id: 4,
        brand: 'HERON PRESTON',
        category: 'Chemise',
        size: 'M International',
        price: 96,
        currency: '$',
        imageUrl: 'https://images.vestiairecollective.com/cdn-cgi/image/w=500,h=500,f=auto,q=80/produit/39924322-1_1.jpg',
    },
];

const FILTERS = [
    { label: 'Trier Par', hasDropdown: true },
    { label: 'Black Friday', hasDropdown: false },
    { label: 'Hors Douanes', hasDropdown: false },
    { label: 'Catégorie (1)', hasDropdown: true, isActive: true },
    { label: 'Designers', hasDropdown: true },
    { label: 'Etat', hasDropdown: true },
    { label: 'Tailles', hasDropdown: true },
    { label: 'Couleurs', hasDropdown: true },
    { label: 'Matières', hasDropdown: true },
];

// --- Icons Components (Simple SVG) ---
const ChevronDown = () => (
    <svg className="w-3 h-3 ml-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const HeartIcon = () => (
    <svg className="w-5 h-5 text-gray-900 cursor-pointer hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

const BookmarkIcon = () => (
    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

// --- UI Components ---

// 1. Bouton de filtre réutilisable
interface FilterChipProps {
    label: string;
    hasDropdown?: boolean;
    isActive?: boolean;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, hasDropdown, isActive }) => {
    return (
        <button
            className={`
        flex items-center px-4 py-2.5 text-sm whitespace-nowrap transition-all
        bg-white border 
        ${isActive ? 'border-2 border-black font-medium' : 'border-gray-300 hover:border-gray-400 text-gray-700'}
      `}
        >
            {label}
            {hasDropdown && <ChevronDown />}
        </button>
    );
};

// 2. Carte Produit réutilisable
const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
    return (
        <div className="flex flex-col p-4 group cursor-pointer">
            {/* Zone Image */}
            <div className="relative w-full aspect-[4/5] flex items-center justify-center mb-4 overflow-hidden">
                {/* Placeholder pour l'image - Remplacer src par product.imageUrl */}
                <img
                    src={product.imageUrl}
                    alt={product.brand}
                    className="object-contain w-full h-full max-h-64 group-hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Infos Produit */}
            <div className="mt-auto space-y-1">
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm text-black uppercase tracking-wide">
                        {product.brand}
                    </h3>
                    <HeartIcon />
                </div>

                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="text-sm text-gray-500">{product.size}</p>

                <div className="pt-2">
                    <span className="font-bold text-base text-gray-900">
                        {product.currency}{product.price}
                    </span>
                </div>
            </div>
        </div>
    );
};

interface ProductListingProps {
    title?: string;
    breadcrumbs?: Array<{ label: string; href: string }>;
}

// --- Main Layout ---
export default function ProductListing({ title = "Chemises", breadcrumbs }: ProductListingProps) {
    return (
        <div className="min-h-screen bg-white font-sans">
            <div className="max-w-[1600px] mx-auto px-6 py-8">

                {/* Breadcrumbs (Optional) */}
                {breadcrumbs && (
                    <nav className="flex text-sm text-gray-500 mb-4">
                        {breadcrumbs.map((crumb, index) => (
                            <span key={crumb.href} className="flex items-center">
                                {index > 0 && <span className="mx-2">/</span>}
                                <a href={crumb.href} className="hover:text-black transition-colors">
                                    {crumb.label}
                                </a>
                            </span>
                        ))}
                    </nav>
                )}

                {/* Header Title */}
                <h1 className="text-4xl font-serif mb-6 text-gray-900 capitalize">{title}</h1>

                {/* Filters Section */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                    {FILTERS.map((filter, index) => (
                        <FilterChip
                            key={index}
                            label={filter.label}
                            hasDropdown={filter.hasDropdown}
                            isActive={filter.isActive}
                        />
                    ))}
                </div>

                {/* Sub-Filters Actions */}
                <div className="flex flex-col gap-4 mb-8">
                    <button className="text-sm font-medium text-black underline underline-offset-4 hover:text-gray-700 w-fit">
                        Tous les filtres +
                    </button>

                    <button className="flex items-center text-sm text-gray-500 hover:text-black transition-colors w-fit">
                        <BookmarkIcon />
                        <span className="underline decoration-gray-400 underline-offset-2">Enregistrer</span>
                    </button>
                </div>

                {/* Product Grid */}
                <div className="border-t border-gray-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border-b border-gray-200">
                        {PRODUCTS.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
