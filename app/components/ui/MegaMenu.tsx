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
            className={`absolute left-0 right-0 w-full bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ease-in-out z-50 scrollbar-hide overflow-x-auto ${isVisible ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible pointer-events-none'
                }`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="px-4 md:px-8 py-8" style={{ width: "max-content", minWidth: "100%" }}>
                <div className="flex gap-8 flex-nowrap">
                    {columns.map((column, index) => (
                        <div key={index} className="flex flex-col gap-4 w-56 flex-shrink-0">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 whitespace-nowrap">
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
