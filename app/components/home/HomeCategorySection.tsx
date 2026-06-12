import React from 'react';
import CategoryCard from '../ui/CategoryCard';
import type { ApiCategory } from '@/app/lib/homeApi';
import { CATEGORY_IMAGE_PLACEHOLDER } from '@/app/lib/mapHomeProduct';

interface HomeCategorySectionProps {
  categories: ApiCategory[];
}

const HomeCategorySection = ({ categories }: HomeCategorySectionProps) => {
  if (categories.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-4 md:px-8 max-w-[1600px] mx-auto">
      <div className="mb-12">
        <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Acheter par catégorie</h2>
        <p className="text-gray-600 max-w-md">
          Explorez notre sélection de pièces de luxe authentifiées, triées pour vous.
        </p>
      </div>

      <div
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pb-4 -mr-4 md:mr-0"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category, index) => (
          <div
            key={category.id}
            className="snap-start shrink-0 w-40 sm:w-[200px] md:w-[220px]"
          >
            <CategoryCard
              category={{
                id: index + 1,
                name: category.name,
                slug: category.slug,
                image: category.image_url ?? CATEGORY_IMAGE_PLACEHOLDER,
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default HomeCategorySection;
