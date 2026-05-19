'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MegaMenuImageItem {
    label: string;
    href: string;
    image?: string;
}

interface MegaMenuSection {
    title: string;
    items: MegaMenuImageItem[];
}

interface MegaMenuImagesProps {
    sections: MegaMenuSection[];
    isVisible: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const MegaMenuImages: React.FC<MegaMenuImagesProps> = ({ sections, isVisible, onMouseEnter, onMouseLeave }) => {
    return (
        <div
            className={`absolute left-0 right-0 w-full bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ease-in-out z-50 scrollbar-hide overflow-x-auto ${isVisible ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible pointer-events-none'
                }`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="px-4 md:px-8 py-8" style={{ width: "max-content", minWidth: "100%" }}>
                <div className="flex gap-8 flex-nowrap">
                    {sections.map((section, index) => (
                        <div key={index} className="w-72 flex-shrink-0">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 border-b pb-2 whitespace-nowrap">
                                {section.title}
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {section.items.map((item, itemIndex) => (
                                    <Link
                                        key={itemIndex}
                                        href={item.href}
                                        className="group flex flex-col gap-2"
                                    >
                                        {item.image && (
                                            <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden rounded-sm">
                                                <Image
                                                    src={item.image}
                                                    alt={item.label}
                                                    fill
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    sizes="150px"
                                                />
                                            </div>
                                        )}
                                        <span className="text-sm font-medium text-gray-900 group-hover:underline decoration-1 underline-offset-4 capitalize truncate block w-full">
                                            {item.label}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MegaMenuImages;
