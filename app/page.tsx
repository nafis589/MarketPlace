import Header from './components/sections/Header';
import HeroBanner from './components/sections/HeroBanner';
import PromoSlider from './components/sections/PromoSlider';
import CategorySection from './components/sections/CategorySection';
import BestsellersSection from './components/sections/BestsellersSection';
import RecentlyViewed from './components/sections/RecentlyViewed';
import TopDeals from './components/sections/TopDeals';
import TrendingNow from './components/sections/TrendingNow';
import GiftsSelection from './components/sections/GiftsSelection';
import UserNewItems from './components/sections/UserNewItems';
import JournalSection from './components/sections/JournalSection';
import WeLoveSection from './components/sections/WeLoveSection';
import Footer from './components/sections/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white max-w-full overflow-x-clip">
      <Header />
      <div className="pt-[72px] md:pt-[88px]"> {/* Offset for fixed header */}
        <HeroBanner />
        <PromoSlider />
        <CategorySection />
        <BestsellersSection />
        <RecentlyViewed />
        <TopDeals />
        <TrendingNow />
        <GiftsSelection />
        <UserNewItems />
        <JournalSection />
        <WeLoveSection />
      </div>
      <Footer />
    </main>
  );
}
