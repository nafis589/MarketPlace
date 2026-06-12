'use client';

import Link from 'next/link';
import ProductCardContent from './ProductCardContent';

interface Product {
  id: string;
  brand: string;
  title: string;
  image: string;
  priceLabel: string;
  condition: string;
  vendorRegion: string;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const productUrl = `/product/product-${product.id}`;

  return (
    <Link
      href={productUrl}
      className="group flex flex-col h-full border-r border-b border-gray-200 p-4 relative bg-white hover:bg-gray-50 transition-colors"
    >
      <div className="relative aspect-[3/3.5] mb-3 w-full overflow-hidden bg-gray-100 shrink-0">
        <img
          src={product.image}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <ProductCardContent
        brand={product.brand}
        title={product.title}
        condition={product.condition}
        region={product.vendorRegion}
        price={
          <span className="text-gray-900 font-bold text-base">{product.priceLabel}</span>
        }
      />
    </Link>
  );
}
