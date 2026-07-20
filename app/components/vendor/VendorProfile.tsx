'use client';

import { useEffect, useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';

import ProductGrid from '@/app/components/ProductGrid';
import EmptyState from '@/app/components/EmptyState';
import { mapApiProductsToGridProducts } from '@/app/lib/mapProductGrid';
import { useAuth } from '@/app/context/AuthContext';
import { useUI } from '@/app/context/UIContext';
import { VENDOR_DASHBOARD_URL } from '@/lib/vendor-dashboard';
import {
  fetchVendorProfile,
  fetchVendorProducts,
  fetchFollowStatus,
  followVendor,
  unfollowVendor,
  type VendorProfile as VendorProfileData,
} from '@/app/lib/vendor-api';

type TabKey = 'active' | 'sold';

interface VendorProfileProps {
  vendorId: string;
}

function formatMemberSince(iso: string): string {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date);
}

export default function VendorProfile({ vendorId }: VendorProfileProps) {
  const { isLoggedIn, user } = useAuth();
  const { openLogin } = useUI();

  const isOwnShop = user?.role === 'VENDOR' && !!user?.vendorId && user.vendorId === vendorId;

  const handleEditShop = () => {
    window.open(`${VENDOR_DASHBOARD_URL}/profile`, '_blank');
  };

  const [profile, setProfile] = useState<VendorProfileData | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followPending, setFollowPending] = useState(false);

  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [page, setPage] = useState(1);

  const [products, setProducts] = useState<ReturnType<typeof mapApiProductsToGridProducts>>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(24);
  const [gridLoading, setGridLoading] = useState(true);

  const [activeTotal, setActiveTotal] = useState<number | null>(null);
  const [soldTotal, setSoldTotal] = useState<number | null>(null);

  // Load profile + header counts + follow status
  useEffect(() => {
    let cancelled = false;
    setProfileLoading(true);
    setNotFound(false);

    const load = async () => {
      const data = await fetchVendorProfile(vendorId);
      if (cancelled) return;
      if (!data) {
        setNotFound(true);
        setProfileLoading(false);
        return;
      }
      setProfile(data);
      setFollowersCount(data.followers_count);
      setProfileLoading(false);

      const [activeRes] = await Promise.all([
        fetchVendorProducts(vendorId, 'ACTIVE', 1, 1),
      ]);
      if (cancelled) return;
      setActiveTotal(activeRes.total);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [vendorId]);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsFollowing(false);
      return;
    }
    let cancelled = false;
    fetchFollowStatus(vendorId).then((status) => {
      if (!cancelled) setIsFollowing(status);
    });
    return () => {
      cancelled = true;
    };
  }, [vendorId, isLoggedIn]);

  // Load products for the active tab / page
  useEffect(() => {
    let cancelled = false;
    setGridLoading(true);

    const load = async () => {
      const status = activeTab === 'active' ? 'ACTIVE' : 'SOLD';
      const res = await fetchVendorProducts(vendorId, status, page, 24);
      if (cancelled) return;
      const mapped = mapApiProductsToGridProducts(res.products).map((p) => ({
        ...p,
        sold: activeTab === 'sold',
      }));
      setProducts(mapped);
      setTotal(res.total);
      setLimit(res.limit);
      if (activeTab === 'active') setActiveTotal(res.total);
      else setSoldTotal(res.total);
      setGridLoading(false);
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [vendorId, activeTab, page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const handleTabChange = (tab: TabKey) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setPage(1);
  };

  const handlePageChange = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFollowToggle = async () => {
    if (!isLoggedIn) {
      openLogin();
      return;
    }
    if (followPending) return;
    setFollowPending(true);

    const wasFollowing = isFollowing;
    // Optimistic update
    setIsFollowing(!wasFollowing);
    setFollowersCount((c) => c + (wasFollowing ? -1 : 1));

    const result = wasFollowing ? await unfollowVendor(vendorId) : await followVendor(vendorId);
    if (result) {
      setIsFollowing(result.isFollowing);
      setFollowersCount(result.followers_count);
    } else {
      // Revert on failure
      setIsFollowing(wasFollowing);
      setFollowersCount((c) => c + (wasFollowing ? 1 : -1));
    }
    setFollowPending(false);
  };

  const memberSince = useMemo(
    () => (profile ? formatMemberSince(profile.member_since) : ''),
    [profile],
  );

  if (notFound) {
    return (
      <div className="mx-auto max-w-[1600px] px-6 py-20">
        <EmptyState message="Ce vendeur est introuvable ou n'est plus actif." />
      </div>
    );
  }

  const initial = profile?.shop_name?.charAt(0).toUpperCase() ?? '?';

  return (
    <div className="font-sans">
      {/* Banner */}
      {profile?.shop_banner ? (
        <div className="h-32 w-full overflow-hidden bg-gray-100 md:h-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={profile.shop_banner} alt="" className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="h-16 w-full bg-gradient-to-r from-gray-100 to-gray-50 md:h-24" />
      )}

      <div className="mx-auto max-w-[1600px] px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col gap-6 border-b border-white py-6 md:flex-row md:items-start md:justify-between md:py-8">
          <div className="flex gap-4 md:gap-6">
            <div className="-mt-12 h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-white bg-gray-200 shadow-sm md:-mt-16 md:h-32 md:w-32">
              {profile?.shop_logo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={profile.shop_logo} alt={profile.shop_name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-gray-500 md:text-4xl">
                  {initial}
                </div>
              )}
            </div>

            <div className="min-w-0 pt-2">
              {profileLoading ? (
                <div className="space-y-2">
                  <div className="h-7 w-40 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
                </div>
              ) : (
                <>
                  <h1 className="font-serif text-2xl text-gray-900 md:text-3xl">{profile?.shop_name}</h1>
                  {profile?.region && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                      <MapPin size={14} strokeWidth={2} className="shrink-0" />
                      {profile.region}
                    </p>
                  )}
                  <p className="mt-2 text-sm text-gray-900">
                    <span className="font-bold">{activeTotal ?? '…'}</span> articles en vente
                    <span className="mx-2 text-gray-300">·</span>
                    <span className="font-bold">{profile?.total_sales ?? '…'}</span> vendu
                    {(profile?.total_sales ?? 0) > 1 ? 's' : ''}
                  </p>
                  {profile?.description && (
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-600">
                      {profile.description}
                    </p>
                  )}
                  {memberSince && (
                    <p className="mt-2 text-xs text-gray-400">Membre depuis {memberSince}</p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Stats + follow */}
          <div className="flex items-center gap-6 rounded-lg border border-gray-200 px-5 py-4 md:self-start">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{followersCount}</p>
              <p className="text-xs text-gray-500">Abonnés</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">{profile?.following_count ?? 0}</p>
              <p className="text-xs text-gray-500">Abonnements</p>
            </div>
            {isOwnShop ? (
              <button
                type="button"
                onClick={handleEditShop}
                className="rounded-full border border-black bg-black px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-gray-800"
              >
                Modifier ma boutique →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFollowToggle}
                disabled={followPending}
                className={`rounded-full border px-6 py-2 text-sm font-bold transition-colors disabled:opacity-60 ${
                  isFollowing
                    ? 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    : 'border-black bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isFollowing ? 'Suivi' : 'Suivre'}
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-gray-200">
          <button
            type="button"
            onClick={() => handleTabChange('active')}
            className={`-mb-px border-b-2 py-4 text-sm font-medium transition-colors ${
              activeTab === 'active'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Articles en vente
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('sold')}
            className={`-mb-px border-b-2 py-4 text-sm font-medium transition-colors ${
              activeTab === 'sold'
                ? 'border-black text-black'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            Déjà vendus
          </button>
        </div>

        {/* Grid */}
        <div className="py-8">
          {gridLoading ? (
            <div className="grid grid-cols-2 border-l border-t border-gray-200 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse border-r border-b border-gray-200 bg-gray-100" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <ProductGrid
              products={products}
              pagination={{
                currentPage: page,
                totalPages,
                onPageChange: handlePageChange,
                disableNext: page * limit >= total,
              }}
            />
          ) : (
            <EmptyState
              message={
                activeTab === 'active'
                  ? "Ce vendeur n'a aucun article en vente pour le moment."
                  : "Ce vendeur n'a encore rien vendu."
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
