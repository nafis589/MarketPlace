import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
    id: number;
    name: string;
    slug: string;
    image: string;
}

interface CategoryCardProps {
    category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
    return (
        <Link href={`/categories/${category.slug}`} className="group block cursor-pointer">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
            </div>

            {/* Nom en dessous */}
            <h3 className="mt-2 truncate px-1 text-center font-serif text-sm font-medium sm:mt-3 sm:text-base md:text-lg">
                {category.name}
            </h3>
        </Link>
    );
};

export default CategoryCard;