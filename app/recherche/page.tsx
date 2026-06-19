'use client';

import SearchResultsPage from '@/app/components/SearchResultsPage';
import ProductListingShell from '@/app/components/ProductListingShell';

export default function RecherchePage() {
  return (
    <ProductListingShell>
      <SearchResultsPage />
    </ProductListingShell>
  );
}
