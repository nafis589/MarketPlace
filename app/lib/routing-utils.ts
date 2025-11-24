import { megaMenuData, MenuCategoryData, SubLink } from './megamenu-data';

export interface PageMetadata {
    title: string;
    breadcrumbs: Array<{ label: string; href: string }>;
}

/**
 * Helper to capitalize words (e.g. "sac-a-main" -> "Sac A Main")
 */
export function unslugify(slug: string): string {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Finds metadata for a given path from the MegaMenuData.
 * If not found, falls back to generating it from the path segments.
 */
export function getPageMetadata(path: string): PageMetadata {
    // 1. Try to find exact match in megaMenuData
    let foundLabel: string | null = null;
    let foundCategoryTitle: string | null = null;

    // Normalize path to ensure it starts with / and no trailing /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    // Search in the data structure
    // This is a naive search, O(N) where N is total links. Given the size, it's fine.
    for (const [sectionKey, sectionData] of Object.entries(megaMenuData)) {
        // Check discover items
        if (sectionData.discover) {
            for (const item of sectionData.discover) {
                if (item.href === normalizedPath) {
                    foundLabel = item.label;
                    break;
                }
            }
        }

        if (foundLabel) break;

        // Check categories items
        for (const group of sectionData.categories) {
            for (const item of group.items) {
                if (item.href === normalizedPath) {
                    foundLabel = item.label;
                    foundCategoryTitle = group.title;
                    break;
                }
            }
            if (foundLabel) break;
        }
        if (foundLabel) break;
    }

    // 2. Construct Breadcrumbs
    const segments = normalizedPath.split('/').filter(Boolean);
    const breadcrumbs = segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        return {
            label: unslugify(segment), // Default label from slug
            href
        };
    });

    // If we found a specific label in the data, update the last breadcrumb and title
    if (foundLabel) {
        breadcrumbs[breadcrumbs.length - 1].label = foundLabel;
    }

    // Title logic
    const title = foundLabel || unslugify(segments[segments.length - 1] || 'Accueil');

    return {
        title,
        breadcrumbs
    };
}
