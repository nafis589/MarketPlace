import type { User } from '@/lib/types';
import { redirectToVendorDashboard, redirectToVendorDashboardAuth } from '@/lib/vendor-dashboard';

/** Gère le clic « Vendre un article » selon l'état de connexion. */
export function handleSellArticleClick(options: {
  isLoggedIn: boolean;
  user: User | null;
  openLoginForSell: () => void;
}): void {
  const { isLoggedIn, user, openLoginForSell } = options;

  if (!isLoggedIn) {
    openLoginForSell();
    return;
  }

  if (user?.role === 'VENDOR') {
    redirectToVendorDashboard();
    return;
  }

  if (user?.role === 'BUYER') {
    redirectToVendorDashboardAuth();
  }
}

/** Après login réussi depuis le flux « vendre » (utilisateur était déconnecté). */
export function handlePostLoginSellIntent(user: User, clearLoginIntent: () => void): boolean {
  clearLoginIntent();

  if (user.role === 'VENDOR') {
    redirectToVendorDashboard();
    return true;
  }

  if (user.role === 'BUYER') {
    redirectToVendorDashboardAuth();
    return true;
  }

  return false;
}
