import React from 'react';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';
import ProductListing from '@/app/components/ProductListing';
import { getPageMetadata } from '@/app/lib/routing-utils';

interface PageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export default async function FemmeCategoryPage({ params }: PageProps) {
    const resolvedParams = await params;
    const path = `/femme/${resolvedParams.slug.join('/')}`;
    const metadata = getPageMetadata(path);

    return (
        <main className="min-h-screen bg-white">
            <Header />
            <div className="pt-[72px] md:pt-[88px]">
                <ProductListing
                    title={metadata.title}
                    breadcrumbs={metadata.breadcrumbs}
                />
            </div>
            <Footer />
        </main>
    );
}
