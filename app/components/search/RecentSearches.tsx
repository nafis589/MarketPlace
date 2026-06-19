'use client';

import { useEffect, useState } from 'react';

import { getSearchHistory, removeFromSearchHistory } from '@/app/lib/search-history';

interface RecentSearchesProps {
  onSelect: (term: string) => void;
  refreshKey?: number;
}

export default function RecentSearches({ onSelect, refreshKey = 0 }: RecentSearchesProps) {
  const [items, setItems] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setItems(getSearchHistory());
  }, [refreshKey]);

  const handleRemove = (term: string) => {
    removeFromSearchHistory(term);
    const next = getSearchHistory();
    setItems(next);
    if (next.length === 0) setEditing(false);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-start justify-between">
        <h3 className="inline-block border-b border-gray-900 pb-1 text-xs font-medium uppercase tracking-wide text-gray-400">
          Recherches récentes
        </h3>
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => setEditing((v) => !v)}
            className="text-sm font-bold text-black hover:underline"
          >
            {editing ? 'Terminer' : 'Modifier'}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-gray-500">Aucune recherche récente</p>
      ) : (
        <ul className="flex-1 overflow-y-auto lg:max-h-[55vh]">
          {items.map((term) => (
            <li key={term} className="flex items-center justify-between gap-3 py-2.5">
              <button
                type="button"
                onClick={() => onSelect(term)}
                className="flex-1 text-left text-sm text-gray-900 hover:underline"
              >
                {term}
              </button>
              {editing ? (
                <button
                  type="button"
                  onClick={() => handleRemove(term)}
                  className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-700"
                  aria-label={`Supprimer ${term}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <span className="flex-shrink-0 p-1 text-gray-400" aria-hidden>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
