'use client';

import Link from 'next/link';
import { X } from 'lucide-react';

import { FILTER_LABELS, formatFilterValue } from '@/app/lib/filterLabels';

interface ActiveFilterPillsProps {
  filters: { key: string; value: string }[];
  onRemove: (key: string) => void;
}

export default function ActiveFilterPills({ filters, onRemove }: ActiveFilterPillsProps) {
  if (filters.length === 0) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {filters.map(({ key, value }) => (
        <button
          key={key}
          type="button"
          onClick={() => onRemove(key)}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-sm text-gray-800 hover:bg-gray-100"
        >
          <span>
            {FILTER_LABELS[key] ?? key} : {formatFilterValue(key, value)}
          </span>
          <X className="size-3.5" />
        </button>
      ))}
    </div>
  );
}

interface ListingBreadcrumb {
  label: string;
  href: string;
}

export function ProductListingHeader({
  title,
  total,
  breadcrumbs,
  isLoading,
  hideResultCount,
  titleClassName,
}: {
  title: string;
  total: number;
  breadcrumbs: ListingBreadcrumb[];
  isLoading?: boolean;
  hideResultCount?: boolean;
  titleClassName?: string;
}) {
  return (
    <div className="mb-8 w-full font-sans">
      <nav className="mb-6 flex items-center text-sm capitalize text-gray-500">
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.href} className="flex items-center">
            {index > 0 && <span className="mx-2">›</span>}
            <Link href={crumb.href} className="transition-colors hover:text-black hover:underline">
              {crumb.label}
            </Link>
          </span>
        ))}
      </nav>

      <div className="mb-8 flex items-baseline">
        <h1 className={`font-serif text-2xl tracking-tight text-gray-900 md:text-3xl lg:text-5xl ${titleClassName ?? 'capitalize'}`}>
          {title}
        </h1>
        {!hideResultCount && (
          <span className="ml-4 text-lg text-gray-500">
            — {isLoading ? '…' : total} Résultats
          </span>
        )}
      </div>
    </div>
  );
}
