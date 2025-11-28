import { cloudinaryProducts } from '@/data/cloudinaryProducts';
import { Product } from '@/app/components/ui/HomeProductSection';

export const getRandomProducts = (count: number): Product[] => {
    const shuffled = [...cloudinaryProducts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(mapCloudinaryToProduct);
};

export const mapCloudinaryToProduct = (item: any): Product => {
    // Generate a random price between 50 and 500
    const price = Math.floor(Math.random() * 450) + 50;

    return {
        id: item.id,
        brand: "Friperie Luxe", // Default brand as it's not in the data
        name: item.title,
        size: ["XS", "S", "M", "L", "XL"][Math.floor(Math.random() * 5)], // Random size
        price: price,
        currency: "€",
        location: "Paris, France",
        imageUrl: item.image,
        badge: null,
        hasDuties: false
    };
};
