import type { Product } from '@/app/components/ui/HomeProductSection';
import type { ApiProductListItem } from './homeApi';

const CONDITION_LABELS: Record<string, string> = {
  NEW: 'Neuf',
  VERY_GOOD: 'Très bon état',
  GOOD: 'Bon état',
  FAIR: 'État correct',
};

export const PRODUCT_IMAGE_PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="700"%3E%3Crect fill="%23e5e7eb" width="600" height="700"/%3E%3C/svg%3E';

export const CATEGORY_IMAGE_PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect fill="%23e5e7eb" width="400" height="500"/%3E%3C/svg%3E';

/** Recommended upload ratio for product cards: 3:3.5 (portrait), min 600×700 px, JPG/WebP */
export const PRODUCT_IMAGE_ASPECT = '3 / 3.5';

export function mapApiProductToHomeProduct(item: ApiProductListItem): Product {
  const conditionLabel = item.condition
    ? (CONDITION_LABELS[item.condition] ?? item.condition)
    : '';

  return {
    id: item.id,
    brand: item.brand ?? '',
    name: item.title,
    size: conditionLabel || item.size || '',
    price: item.price,
    currency: 'FCFA',
    location: item.vendor_region ?? '',
    imageUrl: item.primary_image ?? PRODUCT_IMAGE_PLACEHOLDER,
    badge: null,
    hasDuties: false,
  };
}

export function mapApiProductsToHomeProducts(items: ApiProductListItem[]): Product[] {
  return items.map(mapApiProductToHomeProduct);
}
