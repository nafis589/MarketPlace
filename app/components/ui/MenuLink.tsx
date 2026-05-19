'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MenuLinkProps {
    label: string;
    href: string;
    isActive: boolean;
    isSale?: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClick?: () => void;
}

const MenuLink: React.FC<MenuLinkProps> = ({
    label,
    href,
    isActive,
    isSale,
    onMouseEnter,
    onMouseLeave,
    onClick
}) => {
    const pathname = usePathname();
    const isCurrent = pathname === href || pathname.startsWith(`${href}/`);

    return (
        <div
            className="relative h-full flex items-center"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <Link
                href={href}
                onClick={onClick}
                className={`
          relative px-3 py-4 text-sm font-medium transition-colors duration-200 whitespace-nowrap
          ${isSale ? 'text-red-600 hover:text-red-700' : 'text-gray-800 hover:text-black'}
          ${isActive || isCurrent ? 'text-black' : ''}
        `}
            >
                {label}
                {/* Active Indicator */}
                {(isActive || isCurrent) && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black transform transition-transform duration-300" />
                )}
            </Link>
        </div>
    );
};

export default MenuLink;
