import React from 'react';
import Link from 'next/link';

export interface CategoryWithChildren {
    id: string;
    name: string;
    slug: string;
    parent_id: string | null;
    column_group: string | null;
    image_url: string | null;
    position: number;
    children: CategoryWithChildren[];
}

interface MegaMenuProps {
    category: CategoryWithChildren;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({ category, onMouseEnter, onMouseLeave }) => {
    // Group subcategories by column_group
    const groupedChildren = (category.children || []).reduce<Record<string, CategoryWithChildren[]>>((acc, child) => {
        const group = child.column_group || 'AUTRES';
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(child);
        return acc;
    }, {});

    const groups = Object.keys(groupedChildren);

    return (
        <div
            className="absolute left-0 right-0 w-full bg-white border-t border-gray-100 shadow-lg transition-all duration-300 ease-in-out z-50 scrollbar-hide overflow-x-auto opacity-100 translate-y-0 visible"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="px-4 md:px-8 py-8" style={{ width: "max-content", minWidth: "100%" }}>
                <div className="flex gap-8 flex-nowrap">
                    {/* First column: Page d'accueil */}
                    <div className="flex flex-col gap-4 w-56 flex-shrink-0">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 whitespace-nowrap">
                            PAGE D'ACCUEIL
                        </h3>
                        <ul className="flex flex-col gap-2">
                            <li>
                                <Link
                                    href={`/categories/${category.slug}`}
                                    className="text-sm text-gray-600 hover:underline transition-colors duration-200 block truncate"
                                >
                                    Mode {category.name}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Subsequent columns per group */}
                    {groups.map((groupTitle) => (
                        <div key={groupTitle} className="flex flex-col gap-4 w-56 flex-shrink-0">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 whitespace-nowrap">
                                {groupTitle}
                            </h3>
                            <ul className="flex flex-col gap-2">
                                {groupedChildren[groupTitle].map((subcat) => (
                                    <li key={subcat.id}>
                                        <Link
                                            href={`/categories/${category.slug}/${subcat.slug}`}
                                            className="text-sm text-gray-600 hover:text-black hover:underline transition-colors duration-200 block truncate"
                                        >
                                            {subcat.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MegaMenu;
