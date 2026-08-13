'use client';

import { useEffect, useRef, useState } from 'react';
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
  // Ref pour éviter les doubles appels dus aux re-rendus React (remplace le flag `cancelled`)
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (authLoading) return;

    // Annuler toute requête précédente encore en cours
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        if (user) {
          // Utilisateur connecté → recommandations IA personnalisées
          const result = await recommendationsApi.getAi(
            { limit, contextProductId },
            controller.signal,
          );
          if (!controller.signal.aborted) setData(result);
        } else {
          const history = getProductHistory();

          if (!history.length) {
            // Visiteur sans historique → trending directement, pas d'appel IA
            const result = await recommendationsApi.getTrending(limit, controller.signal);
            if (!controller.signal.aborted) setData(result);
          } else {
            // Visiteur avec historique → recommandations basées sur les produits vus
            const result = await recommendationsApi.postVisitor(
              history,
              limit,
              controller.signal,
            );
            if (!controller.signal.aborted) setData(result);
          }
        }
      } catch (err: any) {
        // Ignorer l'erreur d'abort (re-render React normal)
        if (err?.name !== 'AbortError') {
          console.warn('Recommandations indisponibles', err);
          if (!controller.signal.aborted) setData(null);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void fetchRecommendations();

    // Cleanup : annuler la requête si le composant se démonte
    return () => {
      controller.abort();
    };
  }, [user?.id, authLoading, contextProductId, limit]); // dépendances stables

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
