'use client';

import { use, useEffect, useState } from 'react';

import ProductListingPage from '@/app/components/ProductListingPage';
import ProductListingShell from '@/app/components/ProductListingShell';
import { fetchCategoryBySlug } from '@/app/lib/productsClient';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export default function WeLoveCategoryPage({ params }: PageProps) {
  const { slug } = use(params);
  const categorySlug = slug[0];
  const subSlug = slug[1];
  const targetSlug = subSlug ?? categorySlug ?? slug[slug.length - 1];

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

  const apiExtra: Record<string, string> = {
    tag: 'we_love',
    ...(subSlug ? { subcategory: subSlug } : { category: categorySlug }),
  };

  return (
    <ProductListingShell>
      <ProductListingPage
        title={title}
        breadcrumbs={[
          { label: 'Accueil', href: '/' },
          { label: 'We Love', href: '/we-love' },
          { label: title, href: `/we-love/${slug.join('/')}` },
        ]}
        apiExtra={apiExtra}
        emptyMessage={`Aucun produit trouvé pour ${title}.`}
      />
    </ProductListingShell>
  );
}
