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

    const toggleCategory = (title: string) => {
        setActiveCategory(activeCategory === title ? null : title);
    };

    const toTitleCase = (str: string) => {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return (
        <div className="flex flex-col bg-white">
            {/* Block 1: Découvrir */}
            {data.discover && data.discover.length > 0 && (
                <MobileAccordion
                    isOpen={activeCategory === 'discover'}
                    onToggle={() => toggleCategory('discover')}
                    title={<span className="text-base font-medium text-gray-900">Découvrir</span>}
                    headerClassName="py-3 pl-8 pr-4 border-b border-gray-100 hover:bg-gray-50"
                    contentClassName="bg-white"
                >
                    <ul className="flex flex-col py-2">
                        {data.discover.map((item, idx) => (
                            <li key={idx}>
                                <Link
                                    href={item.href}
                                    className="block pl-12 pr-4 py-2 text-base text-black hover:text-black"
                                    onClick={onClose}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </MobileAccordion>
            )}

            {/* Block 2: Catégories */}
            {data.categories.map((category, idx) => (
                <MobileAccordion
                    key={idx}
                    isOpen={activeCategory === category.title}
                    onToggle={() => toggleCategory(category.title)}
                    title={<span className="text-base font-medium text-gray-900">{toTitleCase(category.title)}</span>}
                    headerClassName="py-3 pl-8 pr-4 border-b border-gray-100 hover:bg-gray-50"
                    contentClassName="bg-white"
                >
                    <ul className="flex flex-col py-2">
                        {category.items.map((subItem, subIdx) => (
                            <li key={subIdx}>
                                <Link
                                    href={subItem.href}
                                    className="block pl-12 pr-4 py-2 text-base text-gray-600 hover:text-black"
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
    );
};

export default MobileMenuSection;
