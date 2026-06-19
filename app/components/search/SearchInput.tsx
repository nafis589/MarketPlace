'use client';

import { forwardRef, type FormEvent } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onBack?: () => void;
  onClose?: () => void;
  autoFocus?: boolean;
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { value, onChange, onSubmit, onBack, onClose, autoFocus },
  ref,
) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-3 border-b border-gray-300 pb-3">
      <button
        type="button"
        onClick={onBack}
        className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-700 lg:hidden"
        aria-label="Retour"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="hidden h-5 w-5 flex-shrink-0 text-gray-500 lg:block"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>

      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rechercher par marque, article..."
        autoFocus={autoFocus}
        className="min-w-0 flex-1 border-none bg-transparent text-base outline-none placeholder:text-gray-400 lg:text-sm [&::-webkit-search-cancel-button]:appearance-none"
      />

      <button
        type="button"
        onClick={onClose}
        className="hidden flex-shrink-0 p-1 text-gray-500 hover:text-black lg:inline-flex"
        aria-label="Fermer la recherche"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </form>
  );
});

export default SearchInput;
