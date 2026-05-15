import React from 'react';
import ProductGrid from '@/app/components/ProductGrid';
import EmptyState from '@/app/components/EmptyState';
import CategoryHeader from '@/app/components/ui/CategoryHeader';
import { getRecentProducts } from '@/app/lib/cloudinaryHelper';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';

export default function NouveautesPage() {
    const products = getRecentProducts(120);

    return (
        <main className="min-h-screen bg-white font-sans">
            <Header />
            <div className="pt-[100px] md:pt-[120px]">
                <div className="max-w-[1600px] mx-auto px-6 py-8">

                    <CategoryHeader
                        title="Nouveautés"
                        count={products.length}
                        breadcrumbs={[
                            { label: 'Accueil', href: '/' },
                            { label: 'Nouveautés', href: '/nouveautes' }
                        ]}
                    />

                    {/* Products Grid */}
                    {products.length > 0 ? (
                        <ProductGrid products={products} />
                    ) : (
                        <EmptyState message="Aucun produit trouvé dans Nouveautés." />
                    )}

                </div>
            </div>
            <Footer />
        </main>
    );
}
