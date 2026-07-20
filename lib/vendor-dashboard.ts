/** URL du dashboard vendeur (voir NEXT_PUBLIC_VENDOR_DASHBOARD_URL). */
export const VENDOR_DASHBOARD_URL =
  process.env.NEXT_PUBLIC_VENDOR_DASHBOARD_URL ?? 'http://localhost:3001';

/** Page de connexion vendeur sur le dashboard. */
export const VENDOR_DASHBOARD_AUTH_URL = `${VENDOR_DASHBOARD_URL}/login`;

export function redirectToVendorDashboard(): void {
  window.location.href = VENDOR_DASHBOARD_URL;
}

export function redirectToVendorDashboardAuth(): void {
  window.location.href = VENDOR_DASHBOARD_AUTH_URL;
}
