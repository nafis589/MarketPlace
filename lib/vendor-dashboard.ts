/** URL du dashboard vendeur (voir NEXT_PUBLIC_VENDOR_DASHBOARD_URL). */
export const VENDOR_DASHBOARD_URL =
  process.env.NEXT_PUBLIC_VENDOR_DASHBOARD_URL ?? 'http://localhost:3001';

/** Page d'authentification / onboarding vendeur (à créer côté dashboard). */
export const VENDOR_DASHBOARD_AUTH_URL = `${VENDOR_DASHBOARD_URL}/auth`;

export function redirectToVendorDashboard(): void {
  window.location.href = VENDOR_DASHBOARD_URL;
}

export function redirectToVendorDashboardAuth(): void {
  window.location.href = VENDOR_DASHBOARD_AUTH_URL;
}
