import React from 'react';
import Image from 'next/image';

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
    return (
        <div className="group relative flex flex-col gap-2 cursor-pointer">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                />
                <div className="absolute top-2 right-2 z-10">
                    <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                    </button>
                </div>
                {product.discount && (
                    <div className="absolute bottom-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1">
                        {product.discount}
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-0.5">
                <h3 className="text-sm font-bold text-gray-900">{product.brand}</h3>
                <p className="text-sm text-gray-600 truncate">{product.name}</p>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-medium">{product.price} €</span>
                    {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">{product.originalPrice} €</span>
                    )}
                </div>
                {product.condition && (
                    <p className="text-xs text-gray-500 mt-1">{product.condition}</p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;