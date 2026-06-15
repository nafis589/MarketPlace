'use client';

import React, { useMemo, useState } from 'react';
import { Info } from 'lucide-react';

interface ProductDescriptionProps {
  product: {
    id: string;
    description?: string;
    brand?: string;
    condition?: string;
    size?: string;
    material?: string;
    color?: string;
    createdAt?: string;
    vendorName?: string;
    vendorRegion?: string;
    vendorRating?: number;
    vendorTotalSales?: number;
    categoryPath?: {
      universe: string | null;
      category: string | null;
      subcategory: string | null;
    };
  };
}

const DESCRIPTION_PREVIEW_LENGTH = 280;

function formatOnlineDate(value?: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function vendorHandle(name?: string): string {
  if (!name) return '@vendeur';
  const slug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '');
  return `@${slug || 'vendeur'}`;
}

function DetailLine({
  label,
  value,
  suffix,
}: {
  label: string;
  value?: string | null;
  suffix?: React.ReactNode;
}) {
  if (!value) return null;
  return (
    <p className="text-sm text-gray-900 leading-relaxed">
      - {label} : {value}
      {suffix}
    </p>
  );
}

export default function ProductDescription({ product }: ProductDescriptionProps) {
  const [expanded, setExpanded] = useState(false);

  const description = product.description?.trim() ?? '';
  const isLong = description.length > DESCRIPTION_PREVIEW_LENGTH;
  const visibleDescription =
    isLong && !expanded
      ? `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}…`
      : description;

  const onlineDate = formatOnlineDate(product.createdAt);
  const sellerName = product.vendorName ?? 'Vendeur';
  const sellerHandle = vendorHandle(product.vendorName);
  const totalSales = product.vendorTotalSales ?? 0;

  const locationLabel = useMemo(() => {
    if (product.vendorRegion && product.vendorName) {
      return `${product.vendorRegion} chez le vendeur ${product.vendorName}`;
    }
    if (product.vendorRegion) return product.vendorRegion;
    if (product.vendorName) return `chez le vendeur ${product.vendorName}`;
    return null;
  }, [product.vendorName, product.vendorRegion]);

  const reference = product.id.replace(/-/g, '').slice(0, 8).toUpperCase();

  const attributeBullets = [
    product.size ? `Taille ${product.size}` : null,
    product.material ? `Matière : ${product.material}` : null,
    product.color ? `Couleur : ${product.color}` : null,
    product.condition ? `État : ${product.condition}` : null,
  ].filter(Boolean) as string[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Vendeur */}
        <div className="lg:col-span-5">
          <h2 className="text-xs font-bold tracking-[0.2em] text-gray-900 uppercase mb-6">
            Vendeur
          </h2>

          <div className="border border-gray-200 bg-white">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-serif shrink-0">
                  {sellerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{sellerName}</p>
                  <p className="text-sm text-gray-500">{sellerHandle}</p>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3 rounded-full border border-black text-sm font-medium hover:bg-gray-50 transition-colors mb-6"
              >
                Suivre
              </button>

              <p className="text-sm text-gray-700">
                Expédie généralement en <span className="font-bold">2 jours</span>
              </p>
            </div>

            <div className="border-t border-gray-200 px-6 py-4 flex items-stretch justify-between gap-4 relative">
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-bold">{totalSales}</span> articles vendus
                </p>
                {product.vendorRating != null && (
                  <p className="text-xs text-gray-500 mt-1">
                    Note {product.vendorRating.toFixed(1)} / 5
                  </p>
                )}
              </div>
              <div className="w-px bg-gray-200 shrink-0" />
              <div className="flex-1 text-sm text-gray-700">
                <p>
                  <span className="font-bold">{totalSales}</span> expédiés
                </p>
                <p className="mt-1 text-gray-500">0 annulés</p>
              </div>
              <Info
                size={16}
                strokeWidth={1.5}
                className="absolute bottom-4 right-4 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="lg:col-span-7">
          <h2 className="text-xs font-bold tracking-[0.2em] text-gray-900 uppercase mb-6">
            Description
          </h2>

          {description ? (
            <>
              <p className="text-sm text-gray-900 leading-relaxed whitespace-pre-line">
                {visibleDescription}
              </p>

              {attributeBullets.length > 0 && (
                <ul className="mt-4 space-y-1 text-sm text-gray-900">
                  {attributeBullets.map((item) => (
                    <li key={item}>* {item}</li>
                  ))}
                </ul>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-gray-900">
                {isLong && (
                  <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    className="font-semibold underline underline-offset-2 hover:text-gray-600"
                  >
                    {expanded ? 'Lire moins' : 'Lire plus'}
                  </button>
                )}
                {isLong && <span className="text-gray-400">|</span>}
                
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">Aucune description disponible pour ce produit.</p>
          )}

          <hr className="my-10 border-gray-200" />

          <h3 className="text-xs font-bold tracking-[0.2em] text-gray-900 uppercase mb-6">Détails</h3>

          <div className="space-y-2">
            <DetailLine label="En ligne depuis le" value={onlineDate} />
            <DetailLine label="Univers" value={product.categoryPath?.universe} />
            <DetailLine label="Catégorie" value={product.categoryPath?.category} />
            <DetailLine label="Sous-catégorie" value={product.categoryPath?.subcategory} />
            <DetailLine label="Designer" value={product.brand} />
            <DetailLine
              label="État"
              value={product.condition}
              
            />
            <DetailLine label="Matière" value={product.material} />
            <DetailLine label="Couleur" value={product.color} />
            <DetailLine
              label="Taille"
              value={product.size}
              
            />
            <DetailLine label="Localisation" value={locationLabel} />
            <DetailLine label="Référence" value={reference} />
          </div>
        </div>
      </div>
    </div>
  );
}
