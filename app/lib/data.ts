import { createSlug } from '../utils/slug';

export const categories = [
    { id: 1, name: "Sacs", slug: "sacs", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop" },
    { id: 2, name: "Chaussures", slug: "chaussures", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop" },
    { id: 3, name: "Vêtements", slug: "vetements", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" },
    { id: 4, name: "Accessoires", slug: "accessoires", image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop" },
    { id: 5, name: "Bijoux", slug: "bijoux", image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop" },
];

export const brands = [
    { id: 1, name: "Gucci", image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop" },
    { id: 2, name: "Prada", image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop" },
    { id: 3, name: "Louis Vuitton", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop" },
    { id: 4, name: "Chanel", image: "https://images.unsplash.com/photo-1548624149-f321a75a9998?q=80&w=800&auto=format&fit=crop" },
    { id: 5, name: "Dior", image: "https://images.unsplash.com/photo-1591561954555-607968c989ab?q=80&w=800&auto=format&fit=crop" },
    { id: 6, name: "Hermès", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800&auto=format&fit=crop" },
    { id: 7, name: "Fendi", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop" },
    { id: 8, name: "Balenciaga", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop" },
    { id: 9, name: "Saint Laurent", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop" },
    { id: 10, name: "Burberry", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop" },
    { id: 11, name: "Celine", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop" },
    { id: 12, name: "Loewe", image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop" },
];

export const bestsellers = [
    { id: 1, brand: "Gucci", name: "Sac Marmont", price: 1200, originalPrice: 1800, image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop", condition: "Très bon état", category: "sacs", slug: createSlug("Sac Marmont Gucci", "2") },
    { id: 2, brand: "Prada", name: "Mocassins", price: 450, originalPrice: 750, image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=800&auto=format&fit=crop", condition: "Bon état", category: "chaussures", slug: createSlug("Mocassins Prada", "3") },
    { id: 3, brand: "Louis Vuitton", name: "Speedy 30", price: 850, originalPrice: 1100, image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop", condition: "Excellent état", category: "sacs", slug: createSlug("Speedy 30 Louis Vuitton", "4") },
    { id: 4, brand: "Chanel", name: "Veste Tweed", price: 2500, originalPrice: 4500, image: "https://images.unsplash.com/photo-1548624149-f321a75a9998?q=80&w=800&auto=format&fit=crop", condition: "Comme neuf", category: "vetements", slug: createSlug("Veste Tweed Chanel", "5") },
    { id: 5, brand: "Dior", name: "Saddle Bag", price: 2100, originalPrice: 2900, image: "https://images.unsplash.com/photo-1591561954555-607968c989ab?q=80&w=800&auto=format&fit=crop", condition: "Très bon état", category: "sacs", slug: createSlug("Saddle Bag Dior", "6") },
    { id: 6, brand: "Hermès", name: "Carré de soie", price: 320, originalPrice: 450, image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800&auto=format&fit=crop", condition: "Bon état", category: "accessoires", slug: createSlug("Carré soie Hermès", "7") },
    { id: 7, brand: "Fendi", name: "Baguette", price: 1500, originalPrice: 2200, image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop", condition: "Excellent état", category: "sacs", slug: createSlug("Baguette Fendi", "8") },
    { id: 8, brand: "Balenciaga", name: "Triple S", price: 600, originalPrice: 895, image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop", condition: "Bon état", category: "chaussures", slug: createSlug("Triple S Balenciaga", "9") },
];

export const recentlyViewed = [
    { id: 9, brand: "Saint Laurent", name: "Sac Loulou", price: 1400, image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop", condition: "Très bon état", category: "sacs", slug: createSlug("Sac Loulou Saint Laurent", "10") },
    { id: 10, brand: "Burberry", name: "Trench Coat", price: 750, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop", condition: "Bon état", category: "vetements", slug: createSlug("Trench Coat Burberry", "11") },
    { id: 11, brand: "Celine", name: "Lunettes de soleil", price: 220, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop", condition: "Excellent état", category: "accessoires", slug: createSlug("Lunettes soleil Celine", "12") },
    { id: 12, brand: "Loewe", name: "Puzzle Bag", price: 1800, image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop", condition: "Comme neuf", category: "sacs", slug: createSlug("Puzzle Bag Loewe", "13") },
];

export const topDeals = [
    { id: 13, brand: "Jacquemus", name: "Le Chiquito", price: 350, originalPrice: 550, discount: "-36%", image: "https://images.unsplash.com/photo-1591561954555-607968c989ab?q=80&w=800&auto=format&fit=crop", condition: "Très bon état", category: "sacs", slug: createSlug("Le Chiquito Jacquemus", "14") },
    { id: 14, brand: "Isabel Marant", name: "Bottes", price: 280, originalPrice: 590, discount: "-52%", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop", condition: "Bon état", category: "chaussures", slug: createSlug("Bottes Isabel Marant", "15") },
    { id: 15, brand: "Acne Studios", name: "Écharpe", price: 120, originalPrice: 200, discount: "-40%", image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop", condition: "Excellent état", category: "accessoires", slug: createSlug("Écharpe Acne Studios", "16") },
    { id: 16, brand: "Ganni", name: "Robe", price: 150, originalPrice: 280, discount: "-46%", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop", condition: "Comme neuf", category: "vetements", slug: createSlug("Robe Ganni", "17") },
];

export const trendingItems = [
    { id: 17, brand: "Miu Miu", name: "Mini Jupe", price: 550, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop", condition: "Très bon état", category: "vetements", slug: createSlug("Mini Jupe Miu Miu", "18") },
    { id: 18, brand: "Diesel", name: "Sac 1DR", price: 380, image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop", condition: "Excellent état", category: "sacs", slug: createSlug("Sac 1DR Diesel", "19") },
    { id: 19, brand: "Coperni", name: "Swipe Bag", price: 420, image: "https://images.unsplash.com/photo-1591561954555-607968c989ab?q=80&w=800&auto=format&fit=crop", condition: "Bon état", category: "sacs", slug: createSlug("Swipe Bag Coperni", "20") },
    { id: 20, brand: "Courrèges", name: "Veste Vinyle", price: 650, image: "https://images.unsplash.com/photo-1548624149-f321a75a9998?q=80&w=800&auto=format&fit=crop", condition: "Comme neuf", category: "vetements", slug: createSlug("Veste Vinyle Courrèges", "21") },
];

export const gifts = [
    { id: 1, title: "Pour Elle", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" },
    { id: 2, title: "Pour Lui", image: "https://images.unsplash.com/photo-1617137968427-85924c809a29?q=80&w=800&auto=format&fit=crop" },
    { id: 3, title: "Montres", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop" },
    { id: 4, title: "Sacs Iconiques", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop" },
    { id: 5, title: "Petits Prix", image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop" },
];

export const userNewItems = [
    { id: 21, username: "Sophie", brand: "Chloe", name: "Sac Faye", price: 600, time: "Il y a 5 min", image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop", category: "sacs", slug: createSlug("Sac Faye Chloe", "22") },
    { id: 22, username: "Marc", brand: "Rolex", name: "Datejust", price: 5500, time: "Il y a 12 min", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop", category: "accessoires", slug: createSlug("Datejust Rolex", "23") },
    { id: 23, username: "Emma", brand: "Maje", name: "Robe Soirée", price: 95, time: "Il y a 20 min", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop", category: "vetements", slug: createSlug("Robe Soirée Maje", "24") },
    { id: 24, username: "Lucas", brand: "Nike", name: "Dunk Low", price: 180, time: "Il y a 35 min", image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=800&auto=format&fit=crop", category: "chaussures", slug: createSlug("Dunk Low Nike", "25") },
];

export const journalArticles = [
    { id: 1, title: "Les tendances sacs de 2024", category: "Tendance", date: "23 Nov 2023", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop" },
    { id: 2, title: "Comment authentifier un sac de luxe ?", category: "Guide", date: "20 Nov 2023", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=800&auto=format&fit=crop" },
    { id: 3, title: "L'histoire du sac Birkin", category: "Histoire", date: "15 Nov 2023", image: "https://images.unsplash.com/photo-1591561954555-607968c989ab?q=80&w=800&auto=format&fit=crop" },
    { id: 4, title: "Mode durable : pourquoi acheter seconde main ?", category: "Écologie", date: "10 Nov 2023", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop" },
];

export const weLove = [
    { id: 25, brand: "Bottega Veneta", name: "Cassette", price: 1900, image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?q=80&w=800&auto=format&fit=crop", condition: "Comme neuf", category: "sacs", slug: createSlug("Cassette Bottega Veneta", "26") },
    { id: 26, brand: "Cartier", name: "Tank Watch", price: 2800, image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop", condition: "Très bon état", category: "accessoires", slug: createSlug("Tank Watch Cartier", "27") },
    { id: 27, brand: "Toteme", name: "Manteau Laine", price: 550, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop", condition: "Excellent état", category: "vetements", slug: createSlug("Manteau Laine Toteme", "28") },
    { id: 28, brand: "Chanel", name: "Ballerines", price: 600, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop", condition: "Bon état", category: "chaussures", slug: createSlug("Ballerines Chanel", "29") },
];

// Helper to aggregate all products
export const allProducts = [
    ...bestsellers,
    ...recentlyViewed,
    ...topDeals,
    ...trendingItems,
    ...userNewItems,
    ...weLove,
];

export const getProductsByCategory = (slug: string) => {
    return allProducts.filter(product => product.category === slug);
};

export const getAllProducts = () => {
    return allProducts;
};
