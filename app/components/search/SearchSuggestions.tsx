'use client';

import { LayoutGrid, Search, Tag } from 'lucide-react';

import type { SearchSuggestion } from '@/app/lib/search-api';

interface SearchSuggestionsProps {
  suggestions: SearchSuggestion[];
  isLoading: boolean;
  onSelect: (term: string) => void;
}

function SuggestionIcon({ type }: { type: SearchSuggestion['type'] }) {
  const className = 'h-4 w-4 flex-shrink-0 text-gray-400';
  if (type === 'brand') return <Tag className={className} />;
  if (type === 'category') return <LayoutGrid className={className} />;
  return <Search className={className} />;
}

function suggestionTypeLabel(type: SearchSuggestion['type']) {
  if (type === 'brand') return 'Marque';
  if (type === 'category') return 'Catégorie';
  return null;
}

export default function SearchSuggestions({ suggestions, isLoading, onSelect }: SearchSuggestionsProps) {
  if (isLoading) {
    return (
      <div className="space-y-2 py-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded bg-gray-50" />
        ))}
      </div>
    );
  }

  if (suggestions.length === 0) {
    return <p className="py-4 text-sm text-gray-500">Aucune suggestion</p>;
  }

  return (
    <ul className="divide-y divide-gray-100">
      {suggestions.map((item) => {
        const typeLabel = suggestionTypeLabel(item.type);
        return (
          <li key={`${item.type}-${item.label}`}>
            <button
              type="button"
              onClick={() => onSelect(item.label)}
              className="flex w-full items-center gap-3 px-1 py-3 text-left hover:bg-gray-50"
            >
              <SuggestionIcon type={item.type} />
              <span className="flex-1 truncate text-sm text-gray-900">{item.label}</span>
              <span className="flex flex-shrink-0 items-center gap-2 text-xs text-gray-400">
                {typeLabel && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 uppercase tracking-wide">
                    {typeLabel}
                  </span>
                )}
                {item.count > 0 && (
                  <span>
                    {item.count} {item.count > 1 ? 'articles' : 'article'}
                  </span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
