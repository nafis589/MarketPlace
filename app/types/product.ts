/**
 * Product Type Definitions
 * Type definitions for products, sellers, and related entities
 */

export interface Seller {
    id: string;
    name: string;
    avatar?: string;
    location?: string;
    rating?: number;
    reviewCount?: number;
}

export interface ProductImage {
    id: string;
    url: string;
    alt?: string;
}

export interface Product {
    id: string;
    slug: string;
    title: string;
    brand: string;
    price: number;
    originalPrice?: number;
    currency: string;
    condition: string;
    description: string;
    category: string;
    categories: string[];
    size?: string;
    color?: string;
    material?: string;
    images: string[];
    imageObjects?: ProductImage[];
    seller?: Seller;
    likes?: number;
    isBlackFriday?: boolean;
    discount?: string;
    createdAt?: string;
    gender?: 'homme' | 'femme' | 'enfant' | 'unisex';
}

export interface RelatedProductsProps {
    products: Product[];
    title?: string;
}
