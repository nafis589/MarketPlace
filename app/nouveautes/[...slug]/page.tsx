import ProductGrid from '@/app/components/ProductGrid';
import EmptyState from '@/app/components/EmptyState';
import CategoryHeader from '@/app/components/ui/CategoryHeader';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';
import { fetchCategoryProductsBySlug } from '@/app/lib/productsApi';
import { mapApiProductsToGridProducts } from '@/app/lib/mapProductGrid';
import { API_URL, safeServerFetch } from '@/app/lib/homeApi';
import type { ApiCategory } from '@/app/lib/homeApi';

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

async function fetchCategory(slug: string): Promise<ApiCategory | null> {
  const res = await safeServerFetch(`${API_URL}/api/store/categories/${slug}`, {
    next: { revalidate: 3600 },
  });
  if (!res?.ok) return null;
  try {
    const json = (await res.json()) as { data?: ApiCategory };
    return json.data ?? null;
  } catch {
    return null;
  }
}

export default async function NouveautesCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const categorySlug = slug[0];
  const subSlug = slug[1];
  const targetSlug = subSlug ?? categorySlug;

  const [category, { products: apiProducts }] = await Promise.all([
    fetchCategory(targetSlug),
    fetchCategoryProductsBySlug(targetSlug, { limit: 120 }),
  ]);

  const products = mapApiProductsToGridProducts(apiProducts);
  const title = category?.name ?? targetSlug.charAt(0).toUpperCase() + targetSlug.slice(1);

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
              { label: 'Nouveautés', href: '/nouveautes' },
              { label: title, href: `/nouveautes/${slug.join('/')}` },
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
