'use client';

import { useEffect, useState } from 'react';

import { fetchPopularSearches } from '@/app/lib/search-api';

interface PopularSearchesProps {
  onSelect: (term: string) => void;
}

export default function PopularSearches({ onSelect }: PopularSearchesProps) {
  const [terms, setTerms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);
      const data = await fetchPopularSearches();
      if (!cancelled) {
        setTerms(data);
        setIsLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400">Populaires</h3>

      {isLoading ? (
        <div className="space-y-4 pt-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 w-32 animate-pulse rounded bg-gray-100" />
          ))}
        </div>
      ) : (
        <ul>
          {terms.map((term) => (
            <li key={term} className="py-2.5">
              <button
                type="button"
                onClick={() => onSelect(term)}
                className="text-left text-sm text-gray-900 hover:underline"
              >
                {term}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
