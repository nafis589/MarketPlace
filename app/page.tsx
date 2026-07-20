import Header from './components/sections/Header';
import HeroBanner from './components/sections/HeroBanner';import BestsellersSection from './components/sections/BestsellersSection';
import TopDeals from './components/sections/TopDeals';
import TrendingNow from './components/sections/TrendingNow';
import UserNewItems from './components/sections/UserNewItems';
import WeLoveSection from './components/sections/WeLoveSection';
import Footer from './components/sections/Footer';
import HomeCategorySection from './components/home/HomeCategorySection';
import RecentlyViewedClient from './components/home/RecentlyViewedClient';
import type { ApiCategory, ApiProductListItem } from '@/app/lib/homeApi';
import { API_URL, safeServerFetch } from '@/app/lib/homeApi';
import { mapApiProductsToHomeProducts } from '@/app/lib/mapHomeProduct';

async function parseProductList(res: Response | null): Promise<ApiProductListItem[]> {
  if (!res?.ok) return [];
  try {
    const json = (await res.json()) as { data?: ApiProductListItem[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

async function parseCategories(res: Response | null): Promise<ApiCategory[]> {
  if (!res?.ok) return [];
  try {
    const json = (await res.json()) as { data?: ApiCategory[] };
    return (json.data ?? []).filter((c) => c.parent_id === null);
  } catch {
    return [];
  }
}

async function fetchHomeData() {
  const [categoriesRes, bestsellersRes, newArrivalsRes, trendingRes, offersRes, weLoveRes] =
    await Promise.all([
      safeServerFetch(`${API_URL}/api/store/categories`, { next: { revalidate: 3600 } }),
      safeServerFetch(`${API_URL}/api/store/products?sort=popularity&limit=10`, {
        next: { revalidate: 900 },
      }),
      safeServerFetch(`${API_URL}/api/store/products?sort=newest&limit=10`, {
        next: { revalidate: 900 },
      }),
      safeServerFetch(`${API_URL}/api/store/trending`, { next: { revalidate: 3600 } }),
      safeServerFetch(`${API_URL}/api/store/products?tag=offer&limit=10`, {
        next: { revalidate: 1800 },
      }),
      safeServerFetch(`${API_URL}/api/store/products?tag=we_love&limit=10`, {
        next: { revalidate: 1800 },
      }),
    ]);

  const [categories, bestsellers, newArrivals, trending, offersFromTag, weLoveFromTag] =
    await Promise.all([
      parseCategories(categoriesRes),
      parseProductList(bestsellersRes),
      parseProductList(newArrivalsRes),
      parseProductList(trendingRes),
      parseProductList(offersRes),
      parseProductList(weLoveRes),
    ]);

  let offers = offersFromTag;
  if (offers.length === 0 && offersRes?.ok) {
    offers = await parseProductList(
      await safeServerFetch(`${API_URL}/api/store/products?sort=newest&limit=10`, {
        next: { revalidate: 1800 },
      }),
    );
  }

  let weLove = weLoveFromTag;
  if (weLove.length === 0 && weLoveRes?.ok) {
    weLove = await parseProductList(
      await safeServerFetch(`${API_URL}/api/store/products?sort=popularity&limit=10`, {
        next: { revalidate: 1800 },
      }),
    );
  }

  return { categories, bestsellers, newArrivals, trending, offers, weLove };
}

export default async function Home() {
  const { categories, bestsellers, newArrivals, trending, offers, weLove } =
    await fetchHomeData();

  const bestsellerProducts = mapApiProductsToHomeProducts(bestsellers);
  const offerProducts = mapApiProductsToHomeProducts(offers);
  const trendingProducts = mapApiProductsToHomeProducts(trending);
  const newArrivalProducts = mapApiProductsToHomeProducts(newArrivals);
  const weLoveProducts = mapApiProductsToHomeProducts(weLove);

  return (
    <main className="min-h-screen bg-white max-w-full overflow-x-clip">
      <Header />
      <div className="pt-[72px] md:pt-[88px]">
        <HeroBanner />
        {categories.length > 0 && <HomeCategorySection categories={categories} />}
        {bestsellerProducts.length > 0 && (
          <BestsellersSection products={bestsellerProducts} />
        )}
        <RecentlyViewedClient />
        {offerProducts.length > 0 && <TopDeals products={offerProducts} />}
        {trendingProducts.length > 0 && <TrendingNow products={trendingProducts} />}
        {newArrivalProducts.length > 0 && <UserNewItems products={newArrivalProducts} />}
        {weLoveProducts.length > 0 && <WeLoveSection products={weLoveProducts} />}
      </div>
      <Footer />
    </main>
  );
}
