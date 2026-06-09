export type UserRole = 'BUYER' | 'VENDOR' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  avatar_url: string | null;
  phone: string | null;
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

export interface ShippingCalculateResponse {
  data: ShippingFeeResult;
}

export interface LocationSelectResult {
  lat: number;
  lng: number;
  shippingResult: ShippingFeeResult;
}
