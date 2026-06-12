'use client';

import { useEffect } from 'react';
import { recordRecentlyViewed } from '@/app/components/home/recordRecentlyViewed';

export default function RecordRecentlyViewed({ productId }: { productId: string }) {
  useEffect(() => {
    if (productId) recordRecentlyViewed(productId);
  }, [productId]);
  return null;
}
