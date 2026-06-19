'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useUI } from '@/app/context/UIContext';
import { addToSearchHistory } from '@/app/lib/search-history';
import { fetchSearchSuggestions, type SearchSuggestion } from '@/app/lib/search-api';

import PopularSearches from './PopularSearches';
import RecentSearches from './RecentSearches';
import SearchInput from './SearchInput';
import SearchSuggestions from './SearchSuggestions';

export default function SearchPanel() {
  const { searchOpen, closeSearch } = useUI();
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);

  const hasQuery = query.trim().length > 0;

  useEffect(() => {
    if (!searchOpen) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) {
      setQuery('');
      setDebouncedQuery('');
      setSuggestions([]);
    }
  }, [searchOpen]);

  useEffect(() => {
    closeSearch();
  }, [pathname, closeSearch]);

  useEffect(() => {
    if (!searchOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [query, searchOpen]);

  useEffect(() => {
    if (!searchOpen || !debouncedQuery) {
      setSuggestions([]);
      setIsLoadingSuggestions(false);
      return;
    }

    let cancelled = false;
    setIsLoadingSuggestions(true);

    const load = async () => {
      const data = await fetchSearchSuggestions(debouncedQuery);
      if (!cancelled) {
        setSuggestions(data);
        setIsLoadingSuggestions(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, searchOpen]);

  const navigateToSearch = useCallback(
    (term: string) => {
      const trimmed = (term ?? '').trim();
      if (trimmed.length < 2) return;
      addToSearchHistory(trimmed);
      setHistoryRefreshKey((k) => k + 1);
      closeSearch();
      router.push(`/recherche?q=${encodeURIComponent(trimmed)}`);
    },
    [closeSearch, router],
  );

  const handleSubmit = useCallback(() => {
    navigateToSearch(query);
  }, [navigateToSearch, query]);

  if (!searchOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/10"
        onClick={closeSearch}
        aria-hidden
      />

      <div className="fixed inset-0 z-[61] flex flex-col bg-white lg:inset-auto lg:left-0 lg:top-0 lg:h-auto lg:max-h-[85vh] lg:w-[740px] lg:max-w-[70vw] lg:shadow-xl">
        <div className="px-4 pt-4 lg:px-6 lg:pt-5">
          <SearchInput
            ref={inputRef}
            value={query}
            onChange={setQuery}
            onSubmit={handleSubmit}
            onBack={closeSearch}
            onClose={closeSearch}
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-5 lg:px-6 lg:py-6">
          {hasQuery ? (
            <SearchSuggestions
              suggestions={suggestions}
              isLoading={isLoadingSuggestions}
              onSelect={navigateToSearch}
            />
          ) : (
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
              <RecentSearches onSelect={navigateToSearch} refreshKey={historyRefreshKey} />
              <div className="hidden lg:block">
                <PopularSearches onSelect={navigateToSearch} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
