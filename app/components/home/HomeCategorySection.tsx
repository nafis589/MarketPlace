import React from 'react';
import CategoryCard from '../ui/CategoryCard';
import type { ApiCategory } from '@/app/lib/homeApi';
import { CATEGORY_IMAGE_PLACEHOLDER } from '@/app/lib/mapHomeProduct';
import {
  homeHorizontalScroll,
  homeSectionBlock,
  homeSectionHeader,
  homeSectionPadding,
  homeSectionShell,
  homeSectionSubtitle,
  homeSectionTitle,
} from './homeSectionStyles';

interface HomeCategorySectionProps {
  categories: ApiCategory[];
}

const HomeCategorySection = ({ categories }: HomeCategorySectionProps) => {
  if (categories.length === 0) return null;

  return (
    <section className={`bg-white ${homeSectionBlock} ${homeSectionPadding}`}>
      <div className={homeSectionShell}>
        <div className={homeSectionHeader}>
          <h2 className={`${homeSectionTitle} mb-2 sm:mb-3`}>Acheter par catégorie</h2>
          <p className={homeSectionSubtitle}>
            Explorez notre sélection d&apos;articles uniques, triés pour vous.
          </p>
        </div>

        <div
          className={`${homeHorizontalScroll} gap-3 pb-1 sm:gap-4 sm:pb-2`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="w-[132px] shrink-0 snap-start sm:w-[180px] md:w-[200px] lg:w-[220px]"
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
      </div>
    </section>
  );
};

export default HomeCategorySection;
