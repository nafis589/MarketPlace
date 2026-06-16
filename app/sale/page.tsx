'use client';

import ProductListingPage from '@/app/components/ProductListingPage';
import ProductListingShell from '@/app/components/ProductListingShell';

export default function SalePage() {
  return (
    <ProductListingShell>
      <ProductListingPage
        title="Archives & Promos"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Sale', href: '/sale' },
        ]}
        apiExtra={{ tag: 'offer' }}
        emptyMessage="Aucun produit trouvé."
      />
    </ProductListingShell>
  );
}
