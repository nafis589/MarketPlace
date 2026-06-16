'use client';

import { use, useEffect, useState } from 'react';

import ProductListingPage from '@/app/components/ProductListingPage';
import ProductListingShell from '@/app/components/ProductListingShell';
import { fetchCategoryBySlug } from '@/app/lib/productsClient';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default function NouveautesCategoryPage({ params }: PageProps) {
  const { slug } = use(params);
  const categorySlug = slug[0];
  const subSlug = slug[1];
  const targetSlug = subSlug ?? categorySlug;

  const [title, setTitle] = useState(targetSlug);

  useEffect(() => {
    let cancelled = false;
    fetchCategoryBySlug(targetSlug).then((cat) => {
      if (cancelled) return;
      setTitle(cat?.name ?? targetSlug.charAt(0).toUpperCase() + targetSlug.slice(1));
    });
    return () => {
      cancelled = true;
    };
  }, [targetSlug]);

  const breadcrumbs = [
    { label: 'Accueil', href: '/' },
    { label: 'Nouveautés', href: '/nouveautes' },
    { label: title, href: `/nouveautes/${slug.join('/')}` },
  ];

  const apiExtra: Record<string, string> = subSlug
    ? { subcategory: subSlug }
    : { category: categorySlug };

  return (
    <ProductListingShell>
      <ProductListingPage
        title={title}
        breadcrumbs={breadcrumbs}
        apiExtra={apiExtra}
        emptyMessage="Aucun produit trouvé."
      />
    </ProductListingShell>
  );
}
