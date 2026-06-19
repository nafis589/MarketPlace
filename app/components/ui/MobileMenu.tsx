'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';
import { useUI } from '@/app/context/UIContext';
import MobileAccordion from './MobileAccordion';
import { CategoryWithChildren } from '../layout/MegaMenu';

const formatGroupTitle = (title: string) => {
    if (!title) return '';
    return title
        .split(' ')
        .map(word => {
            if (!word) return '';
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
};

interface MobileMenuProps {
    categories: CategoryWithChildren[];
    isOpen: boolean;
    onClose: () => void;
}

interface DynamicMobileMenuSectionProps {
    category: CategoryWithChildren;
    onClose: () => void;
}

const DynamicMobileMenuSection: React.FC<DynamicMobileMenuSectionProps> = ({ category, onClose }) => {
    const [activeGroup, setActiveGroup] = useState<string | null>(null);

    const toggleGroup = (title: string) => {
        setActiveGroup(activeGroup === title ? null : title);
    };

    // Group subcategories by column_group
    const groupedChildren = (category.children || []).reduce<Record<string, CategoryWithChildren[]>>((acc, child) => {
        const group = child.column_group || 'AUTRES';
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(child);
        return acc;
    }, {});

    const groups = Object.keys(groupedChildren);

    return (
        <div className="flex flex-col bg-white">
            {/* First element: Page d'accueil */}
            <div className="py-3 pl-8 pr-4 border-b border-gray-100 hover:bg-gray-50">
                <Link
                    href={`/categories/${category.slug}`}
                    className="block text-base font-normal text-gray-900 hover:text-black"
                    onClick={onClose}
                >
                    Page d'accueil {category.name.toLowerCase()}
                </Link>
            </div>

            {/* Subcategory Groups */}
            {groups.map((groupTitle) => (
                <MobileAccordion
                    key={groupTitle}
                    isOpen={activeGroup === groupTitle}
                    onToggle={() => toggleGroup(groupTitle)}
                    title={<span className="text-base font-medium text-gray-900">{formatGroupTitle(groupTitle)}</span>}
                    headerClassName="py-3 pl-8 pr-4 border-b border-gray-100 hover:bg-gray-50"
                    contentClassName="bg-white"
                >
                    <ul className="flex flex-col py-2">
                        {groupedChildren[groupTitle].map((subcat) => (
                            <li key={subcat.id}>
                                <Link
                                    href={`/categories/${category.slug}/${subcat.slug}`}
                                    className="block pl-12 pr-4 py-2 text-base text-gray-600 hover:text-black"
                                    onClick={onClose}
                                >
                                    {subcat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </MobileAccordion>
            ))}
        </div>
    );
};

const MobileMenu: React.FC<MobileMenuProps> = ({ categories = [], isOpen, onClose }) => {
    useLockBodyScroll(isOpen);
    const { openSearch } = useUI();

    const [activeMainItem, setActiveMainItem] = useState<string | null>(null);

    const toggleMainItem = (key: string) => {
        setActiveMainItem(activeMainItem === key ? null : key);
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 lg:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 bottom-0 w-full max-w-sm bg-white z-50 transform transition-transform duration-300 lg:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } flex flex-col`}
            >
                {/* Header */}
                <div className="p-4 flex justify-between items-center border-b border-gray-100 flex-shrink-0">
                    <div className="flex-1 text-center">
                        <span className="text-xl font-serif font-bold">
                            Marketplace
                        </span>
                    </div>
                    <button onClick={onClose} className="p-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 bg-gray-50 flex-shrink-0">
                    <div className="relative w-full">
                        <input
                            type="text"
                            readOnly
                            placeholder="Rechercher par marque, article..."
                            onFocus={(e) => {
                                e.target.blur();
                                onClose();
                                openSearch();
                            }}
                            onClick={() => {
                                onClose();
                                openSearch();
                            }}
                            className="w-full bg-white border border-gray-200 rounded-sm py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-black outline-none cursor-text"
                        />
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Navigation Content */}
                <div className="flex-1 overflow-y-auto pb-24">
                    {categories.map((category) => {
                        const hasSubMenu = category.children && category.children.length > 0;
                        const isActive = activeMainItem === category.slug;

                        return (
                            <div key={category.id} className="border-b border-gray-100">
                                {/* Level 1 Item */}
                                <div
                                    className={`flex justify-between items-center px-4 py-4 cursor-pointer transition-colors ${isActive ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                                    onClick={() => hasSubMenu ? toggleMainItem(category.slug) : onClose()}
                                >
                                    <Link
                                        href={`/categories/${category.slug}`}
                                        className={`text-base font-medium flex-1 text-gray-900 ${isActive ? 'underline underline-offset-4' : ''}`}
                                        onClick={(e) => {
                                            if (hasSubMenu) {
                                                e.preventDefault();
                                                toggleMainItem(category.slug);
                                            } else {
                                                onClose();
                                            }
                                        }}
                                    >
                                        {category.name}
                                    </Link>
                                    {hasSubMenu && (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                            stroke="currentColor"
                                            className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                        </svg>
                                    )}
                                </div>

                                {/* Level 2 Content */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isActive ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    {isActive && hasSubMenu && (
                                        <DynamicMobileMenuSection category={category} onClose={onClose} />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default MobileMenu;
