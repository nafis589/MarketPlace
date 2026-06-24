'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';
import MenuLink from '../ui/MenuLink';
import MegaMenu, { CategoryWithChildren } from './MegaMenu';

import MobileMenu from '../ui/MobileMenu';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useUI } from '@/app/context/UIContext';
import { useChat } from '@/app/context/ChatContext';
import { useNotifications } from '@/app/context/NotificationContext';
import { handleSellArticleClick } from '@/lib/sell-article';
import AuthModal from '@/app/components/auth/AuthModal';
import UserMenu from '@/app/components/auth/UserMenu';
import CartPopover from '@/app/components/cart/CartPopover';

interface NavbarProps {
    categories: CategoryWithChildren[];
}

const Navbar: React.FC<NavbarProps> = ({ categories = [] }) => {
    const { isLoggedIn, user, isUserMenuOpen, openUserMenu, closeUserMenu } = useAuth();
    const { openLogin, openLoginForSell, openRegister, openCart, openSearch, closeSearch, closeAll, openNotif, closeNotif } = useUI();
    const { isCartOpen, setIsCartOpen, count } = useCart();
    const { totalUnread: messageUnread } = useChat();
    const { unreadCount: notificationsUnread } = useNotifications();

    const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const pathname = usePathname();

    // Handle Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setHoveredSlug(null);
        setIsMobileMenuOpen(false);
        setIsCartOpen(false);
        closeUserMenu();
        closeSearch();
        closeNotif();
    }, [pathname, closeUserMenu, setIsCartOpen, closeSearch, closeNotif]);

    // Handle Hover with Delay to prevent flickering
    const handleMouseEnter = (slug: string) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setHoveredSlug(slug);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setHoveredSlug(null);
        }, 150); // Small delay for better UX
    };

    const handleCartClick = () => {
        if (isCartOpen) closeAll();
        else openCart();
    };

    const onSellArticleClick = () => {
        handleSellArticleClick({ isLoggedIn, user, openLoginForSell });
    };

    const totalNotifBadge = notificationsUnread + messageUnread;

    const handleNotifClick = () => {
        openNotif();
    };

    return (
        <>
            <AuthModal />
            <nav
                className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-300 border-b border-gray-100 max-w-full ${isScrolled ? 'shadow-sm' : ''
                    }`}
                onMouseLeave={handleMouseLeave}
            >
                <div className="container mx-auto px-4 md:px-8 max-w-full">

                    {/* Top Row: Search - Logo - Actions */}
                    <div className="flex items-center justify-between py-4 gap-4">

                        {/* Mobile Menu Button (Visible only on mobile) */}
                        <button
                            className="lg:hidden p-2 -ml-2"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                        </button>

                        {/* Left: Search Bar (Hidden on mobile, visible on desktop) */}
                        <div className="hidden lg:flex flex-1 max-w-md">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    readOnly
                                    placeholder="Rechercher par marque, article..."
                                    onFocus={(e) => {
                                        e.target.blur();
                                        openSearch();
                                    }}
                                    onClick={openSearch}
                                    className="w-full bg-gray-100 border-none rounded-sm py-2.5 pl-10 pr-4 text-sm focus:ring-1 focus:ring-black outline-none transition-all cursor-text"
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </div>
                        </div>

                        {/* Center: Logo */}
                        <div className="flex-shrink-0 flex-1 lg:flex-none text-center lg:text-left">
                            <Link href="/" className="text-2xl md:text-3xl font-serif font-bold tracking-tighter">
                                Marketplace
                            </Link>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center justify-end flex-1 gap-6">
                            <button
                                type="button"
                                onClick={onSellArticleClick}
                                className="hidden lg:inline-flex items-center justify-center px-6 py-2 text-sm font-bold bg-black text-white hover:bg-gray-800 border border-black transition-all duration-300"
                            >
                                Vendre un article
                            </button>

                            <div className="hidden lg:flex items-center gap-4 text-sm font-medium text-gray-700">
                                {isLoggedIn ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => isUserMenuOpen ? closeUserMenu() : openUserMenu()}
                                            className="flex items-center hover:opacity-80 transition-opacity"
                                        >
                                            <div className="w-9 h-9 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                </svg>
                                            </div>
                                        </button>
                                        <UserMenu variant="desktop" />
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={openLogin}
                                            className="hover:text-black transition-colors"
                                        >Se connecter</button>
                                        <button
                                            onClick={openRegister}
                                            className="hover:text-black transition-colors"
                                        >S&apos;inscrire</button>
                                    </>
                                )}
                            </div>

                            <div className="relative">
                                <button
                                    onClick={handleNotifClick}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                                    aria-label="Notifications"
                                >
                                    <Bell className="w-6 h-6" strokeWidth={1.75} />
                                    {totalNotifBadge > 0 && (
                                        <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] min-w-4 h-4 px-0.5 flex items-center justify-center rounded-full">
                                            {totalNotifBadge > 99 ? '99+' : totalNotifBadge}
                                        </span>
                                    )}
                                </button>
                            </div>

                            <div className="relative">
                                <button
                                    onClick={handleCartClick}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 5c.07.286-.06.586-.343.648a.75.75 0 01-.343 0l-1.263-5a.75.75 0 01.343-.648zM3.75 21h16.5M4.5 3h15M9 3v2.25M15 3v2.25" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6a3 3 0 00-3-3h-3a3 3 0 00-3 3v4.5m13.5 0h-15v9a2.25 2.25 0 002.25 2.25h10.5A2.25 2.25 0 0019.5 19.5v-9z" />
                                    </svg>
                                    {count > 0 && (
                                        <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] min-w-4 h-4 px-0.5 flex items-center justify-center rounded-full">
                                            {count > 9 ? '9+' : count}
                                        </span>
                                    )}
                                </button>

                                <CartPopover isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
                            </div>
                        </div>
                    </div>

                    {/* Bottom Row: Navigation Links */}
                    <div className="hidden lg:flex items-center justify-center gap-1 pb-0 overflow-x-auto scrollbar-hide flex-nowrap">
                        {categories.map((category) => (
                            <MenuLink
                                key={category.id}
                                label={category.name}
                                href={`/categories/${category.slug}`}
                                isActive={hoveredSlug === category.slug}
                                onMouseEnter={() => handleMouseEnter(category.slug)}
                                onMouseLeave={() => { }} // Handled by parent nav
                            />
                        ))}
                    </div>
                </div>

                {/* Mega Menu Container (Desktop) */}
                <div className="relative">
                    {hoveredSlug && (() => {
                        const activeCategory = categories.find(c => c.slug === hoveredSlug);
                        if (!activeCategory || !activeCategory.children || activeCategory.children.length === 0) return null;
                        return (
                            <MegaMenu
                                category={activeCategory}
                                onMouseEnter={() => handleMouseEnter(hoveredSlug)}
                                onMouseLeave={handleMouseLeave}
                            />
                        );
                    })()}
                </div>

                {/* Mobile Menu Component */}
                <MobileMenu categories={categories} isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            </nav>

            {/* Bottom Navigation Bar (Mobile Only) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 lg:hidden pb-safe max-w-full">
                <div className="flex justify-around items-center h-16 max-w-full">
                    <Link href="/" className="flex flex-col items-center justify-center w-full h-full text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        <span className="text-[10px] font-medium">Accueil</span>
                    </Link>

                    <Link href="/favoris" className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                        <span className="text-[10px] font-medium">Favoris</span>
                    </Link>

                    <button
                        type="button"
                        onClick={onSellArticleClick}
                        className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-gray-900"
                    >
                        <div className="mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-medium">Vendre</span>
                    </button>

                    <button
                        type="button"
                        onClick={handleNotifClick}
                        className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-gray-900 relative"
                    >
                        <Bell className="w-6 h-6 mb-1" strokeWidth={1.75} />
                        <span className="text-[10px] font-medium">Notifications</span>
                        {totalNotifBadge > 0 && (
                            <span className="absolute top-2 right-[30%] bg-red-500 text-white text-[10px] min-w-4 h-4 px-0.5 flex items-center justify-center rounded-full">
                                {totalNotifBadge > 99 ? '99+' : totalNotifBadge}
                            </span>
                        )}
                    </button>

                    <div className="relative w-full h-full">
                        <button
                            onClick={() => isLoggedIn ? openUserMenu() : openLogin()}
                            className="flex flex-col items-center justify-center w-full h-full text-gray-500 hover:text-gray-900"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mb-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                            <span className="text-[10px] font-medium">Moi</span>
                        </button>
                        <UserMenu variant="mobile" />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
