import type { OrderStatus } from '@/lib/orders-api';
import type { StoreOrder, StoreOrderDetail } from '@/lib/orders-api';
import { formatPrice } from '@/app/utils/formatPrice';

export function formatOrderRef(orderId: string): string {
  return `CMD-${orderId.replace(/-/g, '').slice(0, 8).toUpperCase()}`;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: 'En attente',
  CONFIRMED: 'Confirmée',
  PREPARING: 'En préparation',
  SHIPPED: 'Expédiée',
  DELIVERED: 'Livrée',
  CANCELLED: 'Annulée',
  RETURNED: 'Retournée',
};

export function getOrderStatusLabel(status: OrderStatus): string {
  return STATUS_LABELS[status];
}

export function getOrderStatusBadgeClass(status: OrderStatus): string {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  switch (status) {
    case 'DELIVERED':
      return `${base} bg-green-100 text-green-700`;
    case 'SHIPPED':
    case 'PREPARING':
      return `${base} bg-blue-100 text-blue-700`;
    case 'CONFIRMED':
      return `${base} bg-indigo-100 text-indigo-700`;
    case 'PENDING':
      return `${base} bg-amber-100 text-amber-700`;
    case 'CANCELLED':
    case 'RETURNED':
      return `${base} bg-red-100 text-red-600`;
    default:
      return `${base} bg-gray-100 text-gray-600`;
  }
}

/** 0 = Commandé, 1 = Confirmé, 2 = Expédié, 3 = Livré; -1 = annulé */
export function getTimelineStep(status: OrderStatus): number {
  switch (status) {
    case 'PENDING':
      return 0;
    case 'CONFIRMED':
    case 'PREPARING':
      return 1;
    case 'SHIPPED':
      return 2;
    case 'DELIVERED':
      return 3;
    case 'CANCELLED':
    case 'RETURNED':
      return -1;
    default:
      return 0;
  }
}

export const TIMELINE_STEPS = ['Commandé', 'Confirmé', 'Expédié', 'Livré'] as const;

export function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatOrderDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function getItemsSubtotal(order: StoreOrder | StoreOrderDetail): number {
  if ('items' in order && order.items.length > 0) {
    return order.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  }
  return order.total_amount - order.shipping_fee;
}

export function formatShippingMethodLabel(order: StoreOrder | StoreOrderDetail): string {
  if (order.shipping_method === 'PER_KM' && order.shipping_distance_km != null) {
    return `Livraison au km (${order.shipping_distance_km.toLocaleString('fr-FR')} km)`;
  }
  return 'Tarif fixe';
}

export function formatShippingSummary(order: StoreOrder | StoreOrderDetail): string {
  return `${formatShippingMethodLabel(order)} — ${formatPrice(order.shipping_fee)}`;
}

export { formatPrice };
