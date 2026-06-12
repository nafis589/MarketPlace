import ProductGrid from '@/app/components/ProductGrid';
import EmptyState from '@/app/components/EmptyState';
import CategoryHeader from '@/app/components/ui/CategoryHeader';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';
import { fetchProductsList } from '@/app/lib/productsApi';
import { mapApiProductsToGridProducts } from '@/app/lib/mapProductGrid';

export default async function SalePage() {
  let apiProducts = await fetchProductsList({ tag: 'offer', limit: 120 }, 900);
  if (apiProducts.length === 0) {
    apiProducts = await fetchProductsList({ sort: 'newest', limit: 120 }, 900);
  }
  const products = mapApiProductsToGridProducts(apiProducts);

  return (
    <main className="min-h-screen bg-white font-sans">
      <Header />
      <div className="pt-[100px] md:pt-[120px]">
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <CategoryHeader
            title="Archives & Promos"
            count={products.length}
            breadcrumbs={[
              { label: 'Accueil', href: '/' },
              { label: 'Sale', href: '/sale' },
            ]}
          />
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <EmptyState message="Aucun produit trouvé." />
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
