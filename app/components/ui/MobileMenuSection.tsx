import React, { useState } from 'react';
import Link from 'next/link';
import MobileAccordion from './MobileAccordion';
import { MenuCategoryData } from '@/app/lib/megamenu-data';

interface MobileMenuSectionProps {
    data: MenuCategoryData;
    onClose: () => void;
}

const MobileMenuSection: React.FC<MobileMenuSectionProps> = ({ data, onClose }) => {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [isDiscoverOpen, setIsDiscoverOpen] = useState(true); // Default open
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(true); // Default open

    const toggleCategory = (title: string) => {
        setActiveCategory(activeCategory === title ? null : title);
    };

    return (
        <div className="flex flex-col">
            {/* Block 1: Découvrir */}
            {data.discover && data.discover.length > 0 && (
                <div className="mb-2">
                    <MobileAccordion
                        isOpen={isDiscoverOpen}
                        onToggle={() => setIsDiscoverOpen(!isDiscoverOpen)}
                        title={<span className="text-sm font-bold text-gray-500 uppercase tracking-widest">DÉCOUVRIR</span>}
                        headerClassName="py-3 px-4 bg-gray-50"
                        contentClassName="bg-white"
                    >
                        <ul className="flex flex-col">
                            {data.discover.map((item, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={item.href}
                                        className="block px-4 py-3 text-base text-gray-900 border-b border-gray-100 last:border-none hover:bg-gray-50"
                                        onClick={onClose}
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </MobileAccordion>
                </div>
            )}

            {/* Block 2: Catégories */}
            <div>
                <MobileAccordion
                    isOpen={isCategoriesOpen}
                    onToggle={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    title={<span className="text-sm font-bold text-gray-500 uppercase tracking-widest">CATÉGORIES</span>}
                    headerClassName="py-3 px-4 bg-gray-50"
                    contentClassName="bg-white"
                >
                    <div className="flex flex-col">
                        {data.categories.map((category, idx) => (
                            <MobileAccordion
                                key={idx}
                                isOpen={activeCategory === category.title}
                                onToggle={() => toggleCategory(category.title)}
                                title={<span className="text-base font-medium text-gray-900">{category.title}</span>}
                                headerClassName="px-4 py-3 border-b border-gray-100 hover:bg-gray-50"
                                contentClassName="bg-gray-50"
                            >
                                <ul className="flex flex-col pl-4">
                                    {category.items.map((subItem, subIdx) => (
                                        <li key={subIdx}>
                                            <Link
                                                href={subItem.href}
                                                className="block px-4 py-2 text-sm text-gray-600 hover:text-black"
                                                onClick={onClose}
                                            >
                                                {subItem.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </MobileAccordion>
                        ))}
                    </div>
                </MobileAccordion>
            </div>
        </div>
    );
};

export default MobileMenuSection;
