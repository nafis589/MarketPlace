/**
 * Product Data & Helper Functions
 * Mock product data and functions to retrieve products by slug or category
 */

import { Product, Seller } from '../types/product';
import { createSlug } from '../utils/slug';

// Mock Sellers
const sellers: Seller[] = [
    { id: '1', name: 'Cathy', avatar: 'https://i.pravatar.cc/150?u=cathy', location: 'États-Unis', rating: 4.8, reviewCount: 234 },
    { id: '2', name: 'Sophie', avatar: 'https://i.pravatar.cc/150?u=sophie', location: 'France', rating: 4.9, reviewCount: 189 },
    { id: '3', name: 'Marc', avatar: 'https://i.pravatar.cc/150?u=marc', location: 'Belgique', rating: 4.7, reviewCount: 156 },
    { id: '4', name: 'Emma', avatar: 'https://i.pravatar.cc/150?u=emma', location: 'Suisse', rating: 4.9, reviewCount: 312 },
    { id: '5', name: 'Lucas', avatar: 'https://i.pravatar.cc/150?u=lucas', location: 'Canada', rating: 4.6, reviewCount: 98 },
    { id: '6', name: 'Isabelle', avatar: 'https://i.pravatar.cc/150?u=isabelle', location: 'France', rating: 5.0, reviewCount: 421 },
];

// Comprehensive Product Data
export const products: Product[] = [
    {
        id: '1',
        slug: createSlug('Baskets Polo Ralph Lauren en cuir', '1'),
        title: 'Baskets en cuir Polo Ralph Lauren',
        brand: 'Polo Ralph Lauren',
        price: 94,
        originalPrice: 104,
        currency: '$',
        condition: 'Jamais porté',
        description: 'Magnifiques baskets Polo Ralph Lauren en cuir noir. Ces chaussures intemporelles allient confort et élégance. Jamais portées, avec étiquettes d\'origine. Parfaites pour un look casual chic.',
        category: 'chaussures',
        categories: ['Homme', 'Chaussures', 'Baskets'],
        size: '11 US',
        color: 'Noir',
        material: 'Cuir',
        images: [
            'https://images.vestiairecollective.com/cdn-cgi/image/w=1000,q=80,f=auto,/produit/40470732-1_2.jpg',
            'https://images.vestiairecollective.com/cdn-cgi/image/w=1000,q=80,f=auto,/produit/40470732-2_2.jpg',
            'https://images.vestiairecollective.com/cdn-cgi/image/w=1000,q=80,f=auto,/produit/40470732-3_2.jpg',
            'https://images.vestiairecollective.com/cdn-cgi/image/w=1000,q=80,f=auto,/produit/40470732-4_2.jpg',
            'https://images.vestiairecollective.com/cdn-cgi/image/w=1000,q=80,f=auto,/produit/40470732-5_2.jpg',
        ],
        seller: sellers[0],
        likes: 7,
        isBlackFriday: true,
        discount: '-10%',
        gender: 'homme',
    },
    {
        id: '2',
        slug: createSlug('Sac Marmont Gucci', '2'),
        title: 'Sac Marmont',
        brand: 'Gucci',
        price: 1200,
        originalPrice: 1800,
        currency: '€',
        condition: 'Très bon état',
        description: 'Sac à bandoulière Gucci Marmont en cuir matelassé. Icône de la maison Gucci, ce sac allie luxe et praticité. Chaîne dorée réglable et logo GG emblématique.',
        category: 'sacs',
        categories: ['Femme', 'Sacs', 'Sacs à bandoulière'],
        size: 'Medium',
        color: 'Noir',
        material: 'Cuir matelassé',
        images: [
            'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
        ],
        seller: sellers[1],
        likes: 42,
        isBlackFriday: false,
        discount: '-33%',
        gender: 'femme',
    },
    {
        id: '3',
        slug: createSlug('Mocassins Prada', '3'),
        title: 'Mocassins',
        brand: 'Prada',
        price: 450,
        originalPrice: 750,
        currency: '€',
        condition: 'Bon état',
        description: 'Mocassins Prada classiques en cuir verni. Élégance italienne à son apogée. Légères traces d\'usage sur semelles, cuir en excellent état.',
        category: 'chaussures',
        categories: ['Homme', 'Chaussures', 'Mocassins'],
        size: '42 EUR',
        color: 'Bordeaux',
        material: 'Cuir verni',
        images: [
            'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
        ],
        seller: sellers[2],
        likes: 18,
        isBlackFriday: true,
        discount: '-40%',
        gender: 'homme',
    },
    {
        id: '4',
        slug: createSlug('Speedy 30 Louis Vuitton', '4'),
        title: 'Speedy 30',
        brand: 'Louis Vuitton',
        price: 850,
        originalPrice: 1100,
        currency: '€',
        condition: 'Excellent état',
        description: 'Le célèbre Speedy 30 de Louis Vuitton en toile monogramme. Un classique intemporel, parfait pour un usage quotidien. Cuir patiné avec élégance.',
        category: 'sacs',
        categories: ['Femme', 'Sacs', 'Sacs à main'],
        size: '30cm',
        color: 'Monogramme',
        material: 'Toile enduite',
        images: [
            'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1591561954555-607968c989ab?q=80&w=800&auto=format&fit=crop',
        ],
        seller: sellers[3],
        likes: 65,
        isBlackFriday: false,
        discount: '-23%',
        gender: 'femme',
    },
    {
        id: '5',
        slug: createSlug('Veste Tweed Chanel', '5'),
        title: 'Veste Tweed',
        brand: 'Chanel',
        price: 2500,
        originalPrice: 4500,
        currency: '€',
        condition: 'Comme neuf',
        description: 'Iconique veste en tweed Chanel. Boutons dorés emblématiques, doublure en soie. Pièce collector portée une seule fois. Taille 38 français.',
        category: 'vetements',
        categories: ['Femme', 'Vêtements', 'Vestes'],
        size: '38 FR',
        color: 'Noir et blanc',
        material: 'Tweed',
        images: [
            'https://images.unsplash.com/photo-1548624149-f321a75a9998?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
        ],
        seller: sellers[5],
        likes: 89,
        isBlackFriday: false,
        discount: '-44%',
        gender: 'femme',
    },
    {
        id: '6',
        slug: createSlug('Saddle Bag Dior', '6'),
        title: 'Saddle Bag',
        brand: 'Dior',
        price: 2100,
        originalPrice: 2900,
        currency: '€',
        condition: 'Très bon état',
        description: 'Le sac Saddle iconique de Dior. Design audacieux inspiré de l\'équitation. Bandoulière ajustable, fermoir magnétique CD.',
        category: 'sacs',
        categories: ['Femme', 'Sacs', 'Sacs à bandoulière'],
        size: 'Unique',
        color: 'Beige',
        material: 'Cuir',
        images: [
            'https://images.unsplash.com/photo-1591561954555-607968c989ab?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
        ],
        seller: sellers[1],
        likes: 53,
        isBlackFriday: true,
        discount: '-28%',
        gender: 'femme',
    },
    {
        id: '7',
        slug: createSlug('Carré soie Hermès', '7'),
        title: 'Carré de soie',
        brand: 'Hermès',
        price: 320,
        originalPrice: 450,
        currency: '€',
        condition: 'Bon état',
        description: 'Carré en soie Hermès 90x90cm. Motif équestre classique. Couleurs vives et éclatantes. Légères marques d\'usage aux coins.',
        category: 'accessoires',
        categories: ['Femme', 'Accessoires', 'Foulards'],
        size: '90x90 cm',
        color: 'Multicolore',
        material: 'Soie',
        images: [
            'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop',
        ],
        seller: sellers[4],
        likes: 24,
        isBlackFriday: false,
        discount: '-29%',
        gender: 'femme',
    },
    {
        id: '8',
        slug: createSlug('Baguette Fendi', '8'),
        title: 'Baguette',
        brand: 'Fendi',
        price: 1500,
        originalPrice: 2200,
        currency: '€',
        condition: 'Excellent état',
        description: 'Le célèbre sac Baguette de Fendi. Symbole des années 90, revisité. Logo FF, bandoulière courte pour porter sous le bras.',
        category: 'sacs',
        categories: ['Femme', 'Sacs', 'Sacs baguette'],
        size: 'Medium',
        color: 'Marron',
        material: 'Cuir',
        images: [
            'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop',
        ],
        seller: sellers[0],
        likes: 37,
        isBlackFriday: true,
        discount: '-32%',
        gender: 'femme',
    },
    {
        id: '9',
        slug: createSlug('Triple S Balenciaga', '9'),
        title: 'Triple S',
        brand: 'Balenciaga',
        price: 600,
        originalPrice: 895,
        currency: '€',
        condition: 'Bon état',
        description: 'Les iconiques baskets Triple S de Balenciaga. Semelle triple épaisse, design chunky emblématique. Légères traces d\'usage.',
        category: 'chaussures',
        categories: ['Homme', 'Chaussures', 'Baskets'],
        size: '43 EUR',
        color: 'Gris et blanc',
        material: 'Mesh et cuir',
        images: [
            'https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
        ],
        seller: sellers[4],
        likes: 28,
        isBlackFriday: false,
        discount: '-33%',
        gender: 'homme',
    },
    {
        id: '10',
        slug: createSlug('Sac Loulou Saint Laurent', '10'),
        title: 'Sac Loulou',
        brand: 'Saint Laurent',
        price: 1400,
        originalPrice: 1850,
        currency: '€',
        condition: 'Très bon état',
        description: 'Sac Loulou de Saint Laurent matelassé. Chaîne dorée iconique, cuir d\'agneau ultra-doux. Un incontournable de la marque.',
        category: 'sacs',
        categories: ['Femme', 'Sacs', 'Sacs à bandoulière'],
        size: 'Medium',
        color: 'Noir',
        material: 'Cuir d\'agneau',
        images: [
            'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1591561954555-607968c989ab?q=80&w=800&auto=format&fit=crop',
        ],
        seller: sellers[1],
        likes: 71,
        isBlackFriday: false,
        discount: '-24%',
        gender: 'femme',
    },
    {
        id: '11',
        slug: createSlug('Trench Coat Burberry', '11'),
        title: 'Trench Coat',
        brand: 'Burberry',
        price: 750,
        originalPrice: 1200,
        currency: '€',
        condition: 'Bon état',
        description: 'Trench-coat classique Burberry en gabardine. Doublure à carreaux iconique. Ceinture et épaulettes. Pièce intemporelle.',
        category: 'vetements',
        categories: ['Homme', 'Vêtements', 'Manteaux'],
        size: 'L',
        color: 'Beige',
        material: 'Gabardine',
        images: [
            'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
        ],
        seller: sellers[2],
        likes: 44,
        isBlackFriday: true,
        discount: '-38%',
        gender: 'homme',
    },
    {
        id: '12',
        slug: createSlug('Lunettes soleil Celine', '12'),
        title: 'Lunettes de soleil',
        brand: 'Celine',
        price: 220,
        originalPrice: 350,
        currency: '€',
        condition: 'Excellent état',
        description: 'Lunettes de soleil Celine oversize. Monture acétate, verres UV400. Style audacieux et glamour. Étui et chiffon inclus.',
        category: 'accessoires',
        categories: ['Femme', 'Accessoires', 'Lunettes'],
        size: 'Unique',
        color: 'Noir',
        material: 'Acétate',
        images: [
            'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop',
        ],
        seller: sellers[3],
        likes: 31,
        isBlackFriday: false,
        discount: '-37%',
        gender: 'femme',
    },
];

/**
 * Get product by slug
 */
export function getProductBySlug(slug: string): Product | undefined {
    return products.find(product => product.slug === slug);
}

/**
 * Get related products by category
 */
export function getRelatedProducts(category: string, excludeId: string, count: number = 4): Product[] {
    return products
        .filter(product => product.category === category && product.id !== excludeId)
        .slice(0, count);
}

/**
 * Get all products
 */
export function getAllProducts(): Product[] {
    return products;
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: string): Product[] {
    return products.filter(product => product.category === category);
}

/**
 * Get product slugs for static generation
 */
export function getAllProductSlugs(): string[] {
    return products.map(product => product.slug);
}
