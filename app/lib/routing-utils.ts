/**
 * Helper to capitalize words (e.g. "sac-a-main" -> "Sac A Main")
 */
export function unslugify(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

