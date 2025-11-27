export const BRANDS = ["Gucci", "Prada", "Saint Laurent", "Dior", "Balenciaga", "Louis Vuitton", "Hermès", "Celine", "Burberry", "Fendi"];
export const SIZES = ["S", "M", "L", "XL", "48", "50", "52", "40", "42", "44"];
export const LOCATIONS = ["Paris, France", "Milan, Italie", "Londres, UK", "New York, USA", "Berlin, Allemagne", "Madrid, Espagne", "Tokyo, Japon"];

export function getProductDetails(id: string) {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }

    const brandIndex = Math.abs(hash) % BRANDS.length;
    const sizeIndex = Math.abs(hash) % SIZES.length;
    const locationIndex = Math.abs(hash) % LOCATIONS.length;
    const price = (Math.abs(hash) % 950) + 50; // 50 to 1000

    return {
        brand: BRANDS[brandIndex],
        size: SIZES[sizeIndex],
        location: LOCATIONS[locationIndex],
        price
    };
}
