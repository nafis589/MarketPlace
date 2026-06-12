import type { ApiProductListItem } from './homeApi';
import { formatPrice } from '@/app/utils/formatPrice';
import { PRODUCT_IMAGE_PLACEHOLDER } from './mapHomeProduct';

const CONDITION_LABELS: Record<string, string> = {
  NEW: 'Neuf',
  VERY_GOOD: 'Très bon état',
  GOOD: 'Bon état',
  FAIR: 'État correct',
};

export interface GridProduct {
  id: string;
  brand: string;
  title: string;
  image: string;
  priceLabel: string;
  condition: string;
  vendorRegion: string;
}

export function mapApiProductToGridProduct(item: ApiProductListItem): GridProduct {
  const conditionLabel = item.condition
    ? (CONDITION_LABELS[item.condition] ?? item.condition)
    : '';

  return {
    id: item.id,
    brand: item.brand ?? '',
    title: item.title,
    image: item.primary_image ?? PRODUCT_IMAGE_PLACEHOLDER,
    priceLabel: formatPrice(item.price),
    condition: conditionLabel || item.size || '',
    vendorRegion: item.vendor_region ?? '',
  };
}

export function mapApiProductsToGridProducts(items: ApiProductListItem[]): GridProduct[] {
  return items.map(mapApiProductToGridProduct);
}
