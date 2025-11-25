import React from 'react';
import Link from 'next/link';
import { MegaMenuColumn } from '@/app/lib/megamenu-data';

interface MegaMenuProps {
    columns: MegaMenuColumn[];
    isVisible: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ columns, isVisible, onMouseEnter, onMouseLeave }) => {
    return (
        <div
            className={`absolute left-0 right-0 w-full max-w-full bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ease-in-out z-50 ${isVisible ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
                }`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="container mx-auto px-4 md:px-8 py-8 max-w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {columns.map((column, index) => (
                        <div key={index} className="flex flex-col gap-4 min-w-0">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 truncate">
                                {column.title}
                            </h3>
                            <ul className="flex flex-col gap-2">
                                {column.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>
                                        <Link
                                            href={item.href}
                                            className="text-sm text-gray-600 hover:text-black hover:underline transition-colors duration-200 block truncate"
                                        >
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MegaMenu;
