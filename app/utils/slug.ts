/**
 * Slug Generation Utility
 * Creates URL-friendly slugs from product titles
 */

/**
 * Remove accents and special characters from a string
 */
export function removeAccents(str: string): string {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Create a URL-friendly slug from a title and optional ID
 * @param title - The product title
 * @param id - Optional product ID to append for uniqueness
 * @returns A URL-friendly slug
 * 
 * @example
 * createSlug("Sac à main Chanel", "123") // returns "sac-a-main-chanel-123"
 */
export function createSlug(title: string, id?: string): string {
    const cleanTitle = removeAccents(title)
        .toLowerCase()
        .trim()
        // Replace spaces and special characters with hyphens
        .replace(/[^a-z0-9]+/g, '-')
        // Remove leading/trailing hyphens
        .replace(/^-+|-+$/g, '');

    return id ? `${cleanTitle}-${id}` : cleanTitle;
}

/**
 * Extract product ID from slug
 * @param slug - The product slug
 * @returns The product ID or null
 * 
 * @example
 * getIdFromSlug("sac-a-main-chanel-123") // returns "123"
 */
export function getIdFromSlug(slug: string): string | null {
    const parts = slug.split('-');
    const lastPart = parts[parts.length - 1];

    // Check if the last part is a number
    if (/^\d+$/.test(lastPart)) {
        return lastPart;
    }

    return null;
}

/**
 * Validate if a string is a valid slug
 */
export function isValidSlug(slug: string): boolean {
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
