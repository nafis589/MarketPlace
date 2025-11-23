import React from 'react';
import JournalCard from '../ui/JournalCard';
import { journalArticles } from '@/app/lib/data';
import Link from 'next/link';

const JournalSection = () => {
    return (
        <section className="py-20 px-4 md:px-8 max-w-[1600px] mx-auto">
            <div className="flex justify-between items-end mb-12">
                <h2 className="text-4xl font-serif font-medium">Le Journal</h2>
                <Link href="/journal" className="text-sm font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">Lire tous les articles</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {journalArticles.map((article) => (
                    <JournalCard key={article.id} article={article} />
                ))}
            </div>
        </section>
    );
};

export default JournalSection;
