'use client';

import React from 'react';
import MegaMenuImages from '@/app/components/ui/MegaMenuImages';
import { getUniqueCategories, getUniqueTypesByCategory, cloudinaryProducts } from '@/app/lib/cloudinaryHelper';

interface HommeMegaMenuProps {
    isVisible: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

const HommeMegaMenu: React.FC<HommeMegaMenuProps> = ({ isVisible, onMouseEnter, onMouseLeave }) => {
    // Dynamically build the menu structure from Cloudinary data
    const categories = getUniqueCategories();

    const sections = categories.map(cat => {
        // Get top 4 types for this category to show as sub-links
        const types = getUniqueTypesByCategory(cat).slice(0, 4);

        // Find a representative image for the category
        const product = cloudinaryProducts.find(p => p.gender === 'homme' && p.category === cat);

        return {
            title: cat,
            items: [
                {
                    label: "Tout voir",
                    href: `/homme/${cat}`,
                    image: product?.image // Use the product image for the "All" link
                },
                ...types.map(type => ({
                    label: type,
                    href: `/homme/${cat}/${type}`
                }))
            ]
        };
    });

    // Add a "Discover" section if needed, or just use the generated sections
    // For this example, we'll limit to the first 4 categories to fit the layout
    const displaySections = sections.slice(0, 5);

    return (
        <MegaMenuImages
            sections={displaySections}
            isVisible={isVisible}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        />
    );
};

export default HommeMegaMenu;
