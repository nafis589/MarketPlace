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
        <Link href={`/categories/${category.slug}`} className="group block relative cursor-pointer">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
                <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-serif font-medium tracking-wide drop-shadow-md">{category.name}</h3>
                </div>
            </div>
        </Link>
    );
};

export default CategoryCard;
