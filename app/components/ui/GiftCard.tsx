import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Gift {
    id: number;
    title: string;
    image: string;
}

interface GiftCardProps {
    gift: Gift;
}

const GiftCard: React.FC<GiftCardProps> = ({ gift }) => {
    return (
        <Link href="/nouveautes" className="relative block aspect-square w-full overflow-hidden group cursor-pointer bg-gray-100">
            <Image
                src={gift.image}
                alt={gift.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 20vw"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-xl font-serif font-medium tracking-wide text-center px-4 drop-shadow-lg border-b border-transparent group-hover:border-white pb-1 transition-all duration-300">
                    {gift.title}
                </h3>
            </div>
        </Link>
    );
};

export default GiftCard;
