'use client';

import ProductListingPage from '@/app/components/ProductListingPage';
import ProductListingShell from '@/app/components/ProductListingShell';

export default function VintagePage() {
  return (
    <ProductListingShell>
      <ProductListingPage
        title="Vintage"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Vintage', href: '/vintage' },
        ]}
        apiExtra={{ sort: 'popularity' }}
        emptyMessage="Aucun produit trouvé."
      />
    </ProductListingShell>
  );
}
