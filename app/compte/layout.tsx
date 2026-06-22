'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';
import { useAuth } from '@/app/context/AuthContext';
import { useUI } from '@/app/context/UIContext';

const NAV = [
  { href: '/compte/offres', label: 'Mes offres' },
  { href: '/commandes', label: 'Mes commandes' },
  { href: '/messages', label: 'Messages' },
];

export default function CompteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isLoading, logout } = useAuth();
  const { openLogin } = useUI();

  useEffect(() => {
    if (!isLoading && !user) openLogin();
  }, [isLoading, user, openLogin]);

  return (
    <main className="min-h-screen bg-white font-sans">
      <Header />
      {isLoading || !user ? (
        <div className="flex min-h-[50vh] items-center justify-center pt-[120px]">
          <p className="text-sm text-gray-500">Chargement…</p>
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 pt-[120px] md:grid-cols-[220px_minmax(0,1fr)] md:px-6">
          <aside className="hidden md:block">
            <p className="mb-4 text-xs font-medium uppercase tracking-wide text-gray-400">Mon compte</p>
            <nav className="space-y-1">
              {NAV.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={() => void logout()}
                className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                Déconnexion
              </button>
            </nav>
          </aside>
          <div>{children}</div>
        </div>
      )}
      <Footer />
    </main>
  );
}
