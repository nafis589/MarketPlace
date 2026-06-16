'use client';

import { use } from 'react';

import ProductListingPage from '@/app/components/ProductListingPage';
import ProductListingShell from '@/app/components/ProductListingShell';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: PageProps) {
  const { slug } = use(params);

  return (
    <ProductListingShell>
      <ProductListingPage
        categorySlug={slug}
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          {
            label: slug.charAt(0).toUpperCase() + slug.slice(1),
            href: `/categories/${slug}`,
          },
        ]}
        apiExtra={{ category: slug }}
        emptyMessage={`Oups ! Aucun produit trouvé dans cette catégorie pour le moment.`}
      />
    </ProductListingShell>
  );
}
