export type UserRole = 'BUYER' | 'VENDOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  avatar_url: string | null;
  phone: string | null;
  vendorId?: string | null;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface AuthResponse {
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ProfileResponse {
  data: User;
}

export type ShippingMethod = 'PER_KM' | 'FIXED';

export interface ShippingFeeError {
  code: 'LOCATION_OUTSIDE_TOGO' | 'REGION_NOT_COVERED' | 'VENDOR_SHIPPING_NOT_SET' | 'SHIPPING_CONFIG_INVALID';
  message: string;
  region?: string;
  coveredRegions?: string[];
}

export interface ShippingFeeResult {
  fee: number;
  method: ShippingMethod | null;
  regionId?: string;
  distanceKm?: number;
  detail?: string;
  error?: ShippingFeeError;
}

export interface CartShippingItemSummary {
  product_id: string;
  title: string;
  quantity: number;
  price: number;
}

export interface CartVendorShipping {
  vendor_id: string;
  shop_name: string;
  items: CartShippingItemSummary[];
  items_total: number;
  shipping: {
    fee: number;
    method: ShippingMethod;
    distanceKm?: number;
    detail: string;
    error?: ShippingFeeError;
  };
}

export interface CartShippingSummary {
  items_total: number;
  shipping_total: number;
  grand_total: number;
  has_errors: boolean;
  can_checkout: boolean;
}

export interface CartShippingCalculateResult {
  vendors: CartVendorShipping[];
  summary: CartShippingSummary;
}

export interface ShippingCalculateResponse {
  data: CartShippingCalculateResult;
}

export interface LocationSelectResult {
  lat: number;
  lng: number;
  shipping: CartShippingCalculateResult;
  regionId: string | null;
}
