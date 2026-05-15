import React from 'react';
import { Heart, Leaf } from 'lucide-react';
import { getProductDetails } from '@/app/utils/productUtils';

interface Product {
    id: number;
    brand: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: string;
    image: string;
    condition?: string;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const { size, location } = getProductDetails(String(product.id));

    return (
        <div className="group flex flex-col p-4 relative bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
            {/* Image */}
            <div className="relative aspect-[3/3.5] mb-3 w-full flex items-center justify-center overflow-hidden bg-gray-50">
                <img
                    src={product.image}
                    alt={product.name}
                    className="object-contain w-full h-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                />
                {product.discount && (
                    <div className="absolute bottom-0 left-0">
                        <span className="bg-[#3D0A0A] text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                            {product.discount}
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1 mt-1">
                {/* Brand + Heart */}
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-sm uppercase text-gray-900 tracking-wide truncate pr-2">
                        {product.brand}
                    </h3>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        className="shrink-0"
                        aria-label="Ajouter aux favoris"
                    >
                        <Heart className="w-5 h-5 text-gray-900 hover:text-red-500 transition-colors cursor-pointer" strokeWidth={1} />
                    </button>
                </div>

                {/* Name */}
                <p className="text-gray-600 text-sm truncate">{product.name}</p>

                {/* Size */}
                <p className="text-gray-500 text-sm mb-1">{size}</p>

                {/* Price */}
                <div className="mt-auto">
                    {product.originalPrice ? (
                        <div className="flex flex-col leading-tight">
                            <span className="text-gray-400 text-sm line-through decoration-1">{product.originalPrice} €</span>
                            <span className="text-[#D32F2F] font-bold text-base">{product.price} €</span>
                        </div>
                    ) : (
                        <span className="text-gray-900 font-bold text-base">{product.price} €</span>
                    )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                    <Leaf size={12} strokeWidth={2} className="rotate-45" />
                    <span>{location}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;