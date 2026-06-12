'use client';

import React from 'react';

interface ProductDescriptionProps {
  product: {
    id: string;
    title: string;
    brand: string;
    price: number;
    currency: string;
    description?: string;
    condition?: string;
    size?: string;
    material?: string;
    color?: string;
    vendorName?: string;
    vendorRating?: number;
    vendorTotalSales?: number;
  };
}

const VerifiedIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-500">
    <path
      fillRule="evenodd"
      d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.498 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.307 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
      clipRule="evenodd"
    />
  </svg>
);

export default function ProductDescription({ product }: ProductDescriptionProps) {
  const sellerName = product.vendorName ?? 'Vendeur';

  const details = [
    product.brand ? { label: 'Marque', value: product.brand } : null,
    product.condition ? { label: 'État', value: product.condition } : null,
    product.size ? { label: 'Taille', value: product.size } : null,
    product.material ? { label: 'Matière', value: product.material } : null,
    product.color ? { label: 'Couleur', value: product.color } : null,
    { label: 'Référence', value: product.id.slice(0, 8).toUpperCase() },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <h2 className="font-serif text-3xl md:text-4xl text-gray-900 mb-4 md:mb-10">Description</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-5">
          <h3 className="text-[11px] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-6">
            Vendeur
          </h3>

          <div className="flex items-start gap-4 mb-8">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-serif shrink-0">
              {sellerName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">{sellerName}</span>
                <VerifiedIcon />
              </div>
              {product.vendorRating != null && (
                <p className="text-sm text-gray-500">
                  Note {product.vendorRating.toFixed(1)}
                  {product.vendorTotalSales != null ? ` · ${product.vendorTotalSales} ventes` : ''}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {product.description ? (
            <p className="text-gray-700 leading-relaxed mb-10 whitespace-pre-line">{product.description}</p>
          ) : (
            <p className="text-gray-500 mb-10">Aucune description disponible pour ce produit.</p>
          )}

          {details.length > 0 && (
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-[11px] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-6">
                Détails
              </h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {details.map(({ label, value }) => (
                  <div key={label} className="flex justify-between sm:block gap-4">
                    <dt className="text-sm text-gray-500">{label}</dt>
                    <dd className="text-sm font-medium text-gray-900 sm:mt-1">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
