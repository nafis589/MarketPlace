/**
 * Not Found Page for Product Routes
 * Displayed when a product slug doesn't exist
 */

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-serif mb-4 text-gray-900">404</h1>
                <h2 className="text-2xl font-medium mb-4 text-gray-700">Produit non trouvé</h2>
                <p className="text-gray-600 mb-8">
                    Désolé, le produit que vous recherchez n&apos;existe pas ou a été retiré de la vente.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="px-6 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors uppercase text-sm tracking-wide"
                    >
                        Retour à l&apos;accueil
                    </Link>
                    <Link
                        href="/nouveautes"
                        className="px-6 py-3 bg-white text-black border border-black font-medium hover:bg-gray-50 transition-colors uppercase text-sm tracking-wide"
                    >
                        Voir les nouveautés
                    </Link>
                </div>
            </div>
        </div>
    );
}
