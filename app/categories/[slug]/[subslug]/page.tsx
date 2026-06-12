import ProductGrid from '@/app/components/ProductGrid';
import EmptyState from '@/app/components/EmptyState';
import CategoryHeader from '@/app/components/ui/CategoryHeader';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';
import { API_URL, safeServerFetch } from '@/app/lib/homeApi';
import type { ApiCategory, ApiProductListItem } from '@/app/lib/homeApi';
import { mapApiProductsToGridProducts } from '@/app/lib/mapProductGrid';

interface PageProps {
  params: Promise<{ slug: string; subslug: string }>;
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

async function fetchSubcategoryProducts(subslug: string): Promise<ApiProductListItem[]> {
  const res = await safeServerFetch(
    `${API_URL}/api/store/categories/${subslug}/products?limit=50`,
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

export default async function SubcategoryPage({ params }: PageProps) {
  const { slug, subslug } = await params;

  const [parentCategory, subCategory, apiProducts] = await Promise.all([
    fetchCategory(slug),
    fetchCategory(subslug),
    fetchSubcategoryProducts(subslug),
  ]);

  const categoryTitle =
    parentCategory?.name ?? slug.charAt(0).toUpperCase() + slug.slice(1);
  const subcategoryTitle =
    subCategory?.name ?? subslug.charAt(0).toUpperCase() + subslug.slice(1);
  const products = mapApiProductsToGridProducts(apiProducts);

  return (
    <main className="min-h-screen bg-white font-sans">
      <Header />
      <div className="pt-[100px] md:pt-[120px]">
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <CategoryHeader
            title={subcategoryTitle}
            count={products.length}
            breadcrumbs={[
              { label: 'Accueil', href: '/' },
              { label: categoryTitle, href: `/categories/${slug}` },
              { label: subcategoryTitle, href: `/categories/${slug}/${subslug}` },
            ]}
          />

          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <EmptyState
              message={`Oups ! Aucun produit trouvé dans la sous-catégorie ${subcategoryTitle} de la catégorie ${categoryTitle} pour le moment.`}
            />
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
