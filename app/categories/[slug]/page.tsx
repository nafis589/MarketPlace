import ProductGrid from '@/app/components/ProductGrid';
import EmptyState from '@/app/components/EmptyState';
import CategoryHeader from '@/app/components/ui/CategoryHeader';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';
import { API_URL, safeServerFetch } from '@/app/lib/homeApi';
import type { ApiCategory, ApiProductListItem } from '@/app/lib/homeApi';
import { mapApiProductsToGridProducts } from '@/app/lib/mapProductGrid';

interface PageProps {
  params: Promise<{ slug: string }>;
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

async function fetchCategoryProducts(slug: string): Promise<ApiProductListItem[]> {
  const res = await safeServerFetch(
    `${API_URL}/api/store/categories/${slug}/products?limit=50`,
    { next: { revalidate: 900 } },
  );
  if (!res?.ok) return [];
  try {
    const json = (await res.json()) as { data?: ApiProductListItem[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [category, apiProducts] = await Promise.all([
    fetchCategory(slug),
    fetchCategoryProducts(slug),
  ]);

  const title = category?.name ?? slug.charAt(0).toUpperCase() + slug.slice(1);
  const products = mapApiProductsToGridProducts(apiProducts);

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
              { label: title, href: `/categories/${slug}` },
            ]}
          />

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <EmptyState
              message={`Oups ! Aucun produit trouvé dans la catégorie ${title} pour le moment.`}
            />
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
