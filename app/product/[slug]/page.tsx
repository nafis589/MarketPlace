import { notFound } from 'next/navigation';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';
import ProductDetail from '@/app/components/product/ProductDetail';
import RecordRecentlyViewed from '@/app/components/product/RecordRecentlyViewed';
import { fetchProductById, fetchProductsList } from '@/app/lib/productsApi';
import { mapApiProductsToHomeProducts } from '@/app/lib/mapHomeProduct';
import { formatPrice } from '@/app/utils/formatPrice';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const CONDITION_LABELS: Record<string, string> = {
  NEW: 'Neuf',
  VERY_GOOD: 'Très bon état',
  GOOD: 'Bon état',
  FAIR: 'État correct',
};

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const productId = slug.replace(/^product-/, '');

  const apiProduct = await fetchProductById(productId);
  if (!apiProduct) notFound();

  let relatedProducts: ReturnType<typeof mapApiProductsToHomeProducts> = [];
  if (apiProduct.category_id) {
    const related = await fetchProductsList(
      { category_id: apiProduct.category_id, limit: 10 },
      900,
    );
    relatedProducts = mapApiProductsToHomeProducts(
      related.filter((p) => p.id !== apiProduct.id).slice(0, 10),
    );
  }

  const conditionLabel = apiProduct.condition
    ? (CONDITION_LABELS[apiProduct.condition] ?? apiProduct.condition)
    : '';

  const images =
    apiProduct.images.length > 0
      ? apiProduct.images.sort((a, b) => a.position - b.position).map((img) => img.url)
      : [];

  const product = {
    id: apiProduct.id,
    vendor_id: apiProduct.vendor_id,
    status: apiProduct.status,
    title: apiProduct.title,
    brand: apiProduct.brand ?? '',
    price: apiProduct.price,
    priceLabel: formatPrice(apiProduct.price),
    currency: 'FCFA',
    images,
    condition: conditionLabel,
    size: apiProduct.size ?? '',
    material: apiProduct.material ?? '',
    color: apiProduct.color ?? '',
    description: apiProduct.description ?? '',
    createdAt: apiProduct.created_at,
    vendorRegion: apiProduct.vendor_region ?? '',
    categoryPath: apiProduct.category_path ?? {
      universe: null,
      category: null,
      subcategory: null,
    },
    vendor: apiProduct.vendor,
  };

  return (
    <main className="min-h-screen bg-white font-sans">
      <RecordRecentlyViewed productId={productId} />
      <Header />
      <div className="pt-[100px] md:pt-[120px]">
        <ProductDetail product={product} relatedProducts={relatedProducts} />
      </div>
      <Footer />
    </main>
  );
}
