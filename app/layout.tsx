import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Marketplace",
};

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { UIProvider } from "./context/UIContext";
import { ToastProvider } from "./components/ui/Toast";
import AppFrame from "./components/layout/AppFrame";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:9000";

async function getCategories() {
  try {
    const res = await fetch(`${API_URL}/api/store/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error(`Failed to fetch categories: ${res.status}`);
      return [];
    }
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getCategories();

  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-white text-black overflow-x-clip max-w-full">
        <AuthProvider>
          <CartProvider>
            <UIProvider>
              <ToastProvider>
                <AppFrame categories={categories}>{children}</AppFrame>
              </ToastProvider>
            </UIProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
