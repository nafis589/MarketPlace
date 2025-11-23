import React, { useState } from 'react';
import Link from 'next/link';
import MobileMenuSection from './MobileMenuSection';
import { navItems } from '@/app/lib/navigation';
import { megaMenuData } from '@/app/lib/megamenu-data';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
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
                            FRIPERIE<span className="font-light italic">LUXE</span>
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
                            placeholder="Rechercher par marque, article..."
                            className="w-full bg-white border border-gray-200 rounded-sm py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-black outline-none"
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
                    {navItems.map((item) => {
                        const hasSubMenu = megaMenuData[item.key] || megaMenuData['default'];
                        const isActive = activeMainItem === item.key;

                        return (
                            <div key={item.key} className="border-b border-gray-100">
                                {/* Level 1 Item */}
                                <div
                                    className={`flex justify-between items-center px-4 py-4 cursor-pointer transition-colors ${isActive ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                                    onClick={() => hasSubMenu ? toggleMainItem(item.key) : onClose()}
                                >
                                    <Link
                                        href={item.href}
                                        className={`text-base font-medium flex-1 ${item.isSale ? 'text-red-600' : 'text-gray-900'}`}
                                        onClick={(e) => {
                                            if (hasSubMenu) {
                                                e.preventDefault();
                                                toggleMainItem(item.key);
                                            } else {
                                                onClose();
                                            }
                                        }}
                                    >
                                        {item.label}
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

                                {/* Level 2 Content (Discover + Categories) */}
                                <div
                                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isActive ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                >
                                    {isActive && hasSubMenu && (
                                        <MobileMenuSection data={hasSubMenu} onClose={onClose} />
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
