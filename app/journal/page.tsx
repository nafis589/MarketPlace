import React from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import JournalCard from '../components/ui/JournalCard';
import { journalArticles } from '../lib/data';

export default function JournalPage() {
    return (
        <main className="pt-[100px] pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
            <SectionTitle
                title="Le Journal"
                subtitle="Actualités, guides et tendances de la mode seconde main."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {journalArticles.map((article) => (
                    <JournalCard key={article.id} article={article} />
                ))}
                {/* Duplicating for demo purposes to fill the grid */}
                {journalArticles.map((article) => (
                    <JournalCard key={`dup-${article.id}`} article={{ ...article, id: article.id + 100 }} />
                ))}
            </div>
        </main>
    );
}
