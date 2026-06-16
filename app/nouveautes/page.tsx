'use client';

import ProductListingPage from '@/app/components/ProductListingPage';
import ProductListingShell from '@/app/components/ProductListingShell';

export default function NouveautesPage() {
  return (
    <ProductListingShell>
      <ProductListingPage
        title="Nouveautés"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'Nouveautés', href: '/nouveautes' },
        ]}
        emptyMessage="Aucun produit trouvé dans Nouveautés."
      />
    </ProductListingShell>
  );
}
