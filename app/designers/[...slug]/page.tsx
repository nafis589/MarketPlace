'use client';

import React, { use } from 'react';
import ProductGrid from '@/app/components/ProductGrid';
import EmptyState from '@/app/components/EmptyState';
import CategoryHeader from '@/app/components/ui/CategoryHeader';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';
import { unslugify } from '@/app/lib/routing-utils';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export default function DesignersCategoryPage({ params }: PageProps) {
    const { slug } = use(params);
    const title = unslugify(slug[slug.length - 1]);

    return (
        <main className="min-h-screen bg-white font-sans">
            <Header />
            <div className="pt-[100px] md:pt-[120px]">
                <div className="max-w-[1600px] mx-auto px-6 py-8">
                    <CategoryHeader
                        title={title}
                        count={0}
                        breadcrumbs={[
                            { label: 'Accueil', href: '/' },
                            { label: 'Designers', href: '/designers' },
                            { label: title, href: `/designers/${slug.join('/')}` }
                        ]}
                    />
                    <EmptyState message={`Aucun produit trouvé pour ${title}.`} />
                </div>
            </div>
            <Footer />
        </main>
    );
}
