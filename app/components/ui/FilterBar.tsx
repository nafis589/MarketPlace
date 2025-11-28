'use client';

import React from 'react';

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

const FilterButton: React.FC<FilterButtonProps> = ({ label, hasChevron = false, isActive = false }) => {
    return (
        <button className={`flex items-center justify-between border ${isActive ? 'border-black border-2 font-medium' : 'border-gray-900'} bg-white px-5 py-3 text-sm text-gray-900 hover:bg-gray-50 transition-colors whitespace-nowrap`}>
            <span>{label}</span>
            {hasChevron && <ChevronDown />}
        </button>
    );
};

export default function FilterBar() {
    return (
        <div className="flex overflow-x-auto gap-3 items-center pb-2 scrollbar-hide mb-8">
            <FilterButton label="Trier Par" hasChevron={true} />
            <FilterButton label="Black Friday" />
            <FilterButton label="Hors Douanes" />
            <FilterButton label="Designers" hasChevron={true} />
            <FilterButton label="Etat" hasChevron={true} />
            <FilterButton label="Tailles" hasChevron={true} />
            <FilterButton label="Couleurs" hasChevron={true} />
            <FilterButton label="Matières" hasChevron={true} />
        </div>
    );
}
