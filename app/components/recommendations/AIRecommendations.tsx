'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { getProductHistory } from '@/hooks/useProductHistory';
import { recommendationsApi, type RecoData } from '@/lib/recommendations-api';
import { mapApiProductsToHomeProducts } from '@/app/lib/mapHomeProduct';
import HomeProductSection from '@/app/components/ui/HomeProductSection';
import RecommendationsSkeleton from './RecommendationsSkeleton';

interface AIRecommendationsProps {
  contextProductId?: string;
  limit?: number;
  variant?: 'home' | 'product';
}

function resolveTitle(user: boolean, variant: 'home' | 'product'): string {
  if (variant === 'product') {
    return user ? 'Recommandés pour vous' : 'Vous pourriez aussi aimer';
  }
  return user ? 'Recommandés pour vous' : 'Vous pourriez aimer';
}

export default function AIRecommendations({
  contextProductId,
  limit = 8,
  variant = 'home',
}: AIRecommendationsProps) {
  const { user, isLoading: authLoading } = useAuth();
  const [data, setData] = useState<RecoData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        if (user) {
          const result = await recommendationsApi.getAi({
            limit,
            contextProductId,
          });
          if (!cancelled) setData(result);
        } else {
          const history = getProductHistory();
          if (!history.length) {
            if (!cancelled) setData(null);
            return;
          }
          const result = await recommendationsApi.postVisitor(history, limit);
          if (!cancelled) setData(result);
        }
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void fetchRecommendations();

    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoading, contextProductId, limit]);

  if (authLoading || loading) {
    return <RecommendationsSkeleton count={limit} />;
  }

  if (!data?.products?.length) return null;

  const products = mapApiProductsToHomeProducts(data.products);
  const title = resolveTitle(Boolean(user), variant);

  return (
    <div className="font-sans">


      <HomeProductSection
        title={
          <span className="inline-flex items-center gap-3">
            {title}
            {data.ai_generated && (
              <span className="">
                ✨
              </span>
            )}
          </span>
        }
        products={products}
      />
    </div>
  );
}
