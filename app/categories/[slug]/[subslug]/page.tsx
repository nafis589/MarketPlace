'use client';

import { use, useEffect, useState } from 'react';

import ProductListingPage from '@/app/components/ProductListingPage';
import ProductListingShell from '@/app/components/ProductListingShell';
import { fetchCategoryBySlug } from '@/app/lib/productsClient';

interface PageProps {
  params: Promise<{ slug: string; subslug: string }>;
}

export default function SubcategoryPage({ params }: PageProps) {
  const { slug, subslug } = use(params);
  const [parentName, setParentName] = useState(slug);
  const [subName, setSubName] = useState(subslug);

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchCategoryBySlug(slug), fetchCategoryBySlug(subslug)]).then(
      ([parent, sub]) => {
        if (cancelled) return;
        if (parent?.name) setParentName(parent.name);
        if (sub?.name) setSubName(sub.name);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [slug, subslug]);

  return (
    <ProductListingShell>
      <ProductListingPage
        title={subName}
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: parentName, href: `/categories/${slug}` },
          { label: subName, href: `/categories/${slug}/${subslug}` },
        ]}
        apiExtra={{ subcategory: subslug }}
        emptyMessage={`Oups ! Aucun produit trouvé dans cette sous-catégorie pour le moment.`}
      />
    </ProductListingShell>
  );
}
