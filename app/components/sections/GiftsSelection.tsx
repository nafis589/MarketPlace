import React from 'react';
import GiftCard from '../ui/GiftCard';
import { gifts } from '@/app/lib/data';

const GiftsSelection = () => {
    return (
        <section className="py-16 px-4 md:px-8 max-w-[1600px] mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-medium mb-4">Le Guide Cadeaux</h2>
                <p className="text-gray-600">Trouvez le cadeau parfait pour vos proches.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {gifts.map((gift) => (
                    <GiftCard key={gift.id} gift={gift} />
                ))}
            </div>
        </section>
    );
};

export default GiftsSelection;
