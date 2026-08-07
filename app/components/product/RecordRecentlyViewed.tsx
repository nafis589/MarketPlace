'use client';

import { useEffect } from 'react';
import { recordRecentlyViewed } from '@/app/components/home/recordRecentlyViewed';
import { trackProductView } from '@/hooks/useProductHistory';

export default function RecordRecentlyViewed({ productId }: { productId: string }) {
  useEffect(() => {
    if (!productId) return;
    recordRecentlyViewed(productId);
    trackProductView(productId);
  }, [productId]);
  return null;
}
