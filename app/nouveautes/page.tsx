import ProductGrid from '@/app/components/ProductGrid';
import EmptyState from '@/app/components/EmptyState';
import CategoryHeader from '@/app/components/ui/CategoryHeader';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';
import { fetchProductsList } from '@/app/lib/productsApi';
import { mapApiProductsToGridProducts } from '@/app/lib/mapProductGrid';

interface PageProps {
  searchParams: Promise<{
    sort?: string;
    tag?: string;
    page?: string;
  }>;
}

export default async function NouveautesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sort = params.sort ?? 'newest';
  const tag = params.tag;

  let apiProducts = await fetchProductsList(
    { sort, tag, limit: 120, page: Number(params.page ?? 1) },
    900,
  );

  if (apiProducts.length === 0 && tag) {
    apiProducts = await fetchProductsList(
      { sort: tag === 'we_love' ? 'popularity' : 'newest', limit: 120 },
      900,
    );
  }

  const products = mapApiProductsToGridProducts(apiProducts);

  const title = tag === 'offer' ? 'Offres exceptionnelles' : tag === 'we_love' ? 'We Love' : 'Nouveautés';

  return (
    <main className="min-h-screen bg-white font-sans">
      <Header />
      <div className="pt-[100px] md:pt-[120px]">
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <CategoryHeader
            title={title}
            count={products.length}
            breadcrumbs={[
              { label: 'Accueil', href: '/' },
              { label: title, href: '/nouveautes' },
            ]}
          />

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
