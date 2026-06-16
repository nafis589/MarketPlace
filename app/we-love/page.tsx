'use client';

import ProductListingPage from '@/app/components/ProductListingPage';
import ProductListingShell from '@/app/components/ProductListingShell';

export default function WeLovePage() {
  return (
    <ProductListingShell>
      <ProductListingPage
        title="We Love"
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'We Love', href: '/we-love' },
        ]}
        apiExtra={{ tag: 'we_love' }}
        emptyMessage="Aucun produit trouvé."
      />
    </ProductListingShell>
  );
}
