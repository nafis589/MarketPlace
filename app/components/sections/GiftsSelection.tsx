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
            <div            className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide -mr-4 md:mr-0 md:grid md:grid-cols-3 lg:grid-cols-5">
                {gifts.map((gift) => (
                    <div key={gift.id} className="flex-shrink-0 w-40 md:w-auto">
                        <GiftCard gift={gift} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default GiftsSelection;
