import { cloudinaryProducts } from '@/data/cloudinaryProducts';

export interface CloudinaryProduct {
    id: string;
    title: string;
    gender: string;
    category: string | null;
    type: string | null;
    image: string;
    folder: string;
}

export const getHommeProducts = () => {
    return cloudinaryProducts.filter(p => p.gender === 'homme');
};

export const getHommeProductsByCategory = (category: string) => {
    return cloudinaryProducts.filter(p => p.gender === 'homme' && p.category === category);
};

export const getHommeProductsByType = (category: string, type: string) => {
    return cloudinaryProducts.filter(p => p.gender === 'homme' && p.category === category && p.type === type);
};

export const getUniqueCategories = () => {
    const products = getHommeProducts();
    const categories = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(categories) as string[];
};

export const getUniqueTypesByCategory = (category: string) => {
    const products = getHommeProductsByCategory(category);
    const types = new Set(products.map(p => p.type).filter(Boolean));
    return Array.from(types) as string[];
};

// Helper to get one representative image per category/type for menus
export const getCategoryImages = () => {
    const categories = getUniqueCategories();
    return categories.map(cat => {
        const product = cloudinaryProducts.find(p => p.gender === 'homme' && p.category === cat);
        return {
            label: cat,
            image: product?.image,
            href: `/homme/${cat}`
        };
    });
};

export const getProductsByCategory = (category: string) => {
    return cloudinaryProducts.filter(p => p.category === category);
};

// --- FEMME ---
export const getFemmeProducts = () => {
    return cloudinaryProducts.filter(p => p.gender === 'femme');
};

export const getFemmeProductsByCategory = (category: string) => {
    return cloudinaryProducts.filter(p => p.gender === 'femme' && p.category === category);
};

export const getFemmeProductsByType = (category: string, type: string) => {
    return cloudinaryProducts.filter(p => p.gender === 'femme' && p.category === category && p.type === type);
};

export const getUniqueFemmeTypesByCategory = (category: string) => {
    const products = getFemmeProductsByCategory(category);
    const types = new Set(products.map(p => p.type).filter(Boolean));
    return Array.from(types) as string[];
};

// --- ENFANT ---
export const getEnfantProducts = () => {
    return cloudinaryProducts.filter(p => p.gender === 'enfant');
};

export const getEnfantProductsByCategory = (category: string) => {
    return cloudinaryProducts.filter(p => p.gender === 'enfant' && p.category === category);
};

export const getEnfantProductsByType = (category: string, type: string) => {
    return cloudinaryProducts.filter(p => p.gender === 'enfant' && p.category === category && p.type === type);
};

export const getRecentProducts = (count: number = 100) => {
    // For now just taking the last ones since we don't have dates
    return [...cloudinaryProducts].slice(-count);
};

export const getProductsByFilter = (filters: {
    gender?: string,
    category?: string,
    type?: string
}) => {
    return cloudinaryProducts.filter(p => {
        if (filters.gender && p.gender !== filters.gender) return false;
        if (filters.category && p.category !== filters.category) return false;
        if (filters.type && p.type !== filters.type) return false;
        return true;
    });
};
