'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import SearchPanel from '@/app/components/search/SearchPanel';
import type { CategoryWithChildren } from './MegaMenu';

interface AppFrameProps {
  categories: CategoryWithChildren[];
  children: React.ReactNode;
}

const CHROMELESS_PREFIXES = ['/checkout'];

export default function AppFrame({ categories, children }: AppFrameProps) {
  const pathname = usePathname();
  const hideChrome = CHROMELESS_PREFIXES.some((p) => pathname?.startsWith(p));

  return (
    <>
      {!hideChrome && <Navbar categories={categories} />}
      {!hideChrome && <SearchPanel />}
      {children}
    </>
  );
}
