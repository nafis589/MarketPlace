import React from 'react';
import Image from 'next/image';

interface Article {
    id: number;
    title: string;
    category: string;
    date: string;
    image: string;
}

interface JournalCardProps {
    article: Article;
}

const JournalCard: React.FC<JournalCardProps> = ({ article }) => {
    return (
        <div className="flex flex-col gap-4 cursor-pointer group">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
                <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-xs uppercase tracking-wider text-gray-500">
                    <span className="font-semibold text-black">{article.category}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                </div>
                <h3 className="text-xl font-serif font-medium text-gray-900 group-hover:underline decoration-1 underline-offset-4">
                    {article.title}
                </h3>
            </div>
        </div>
    );
};

export default JournalCard;
