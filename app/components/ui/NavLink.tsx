import Link from 'next/link';
import React from 'react';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    active?: boolean;
    className?: string;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children, active, className = '' }) => {
    return (
        <Link
            href={href}
            className={`text-sm font-medium transition-colors duration-200 hover:text-gray-600 ${active ? 'text-black' : 'text-gray-800'} ${className}`}
        >
            {children}
        </Link>
    );
};

export default NavLink;
