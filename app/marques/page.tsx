import React from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import Image from 'next/image';
import Link from 'next/link';
import { brands } from '../lib/data';

export default function MarquesPage() {
    return (
        <main className="pt-[100px] pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
            <SectionTitle
                title="Marques"
                subtitle="Retrouvez vos maisons de luxe préférées."
            />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {brands.map((brand) => (
                    <Link href={`/nouveautes?brand=${brand.name}`} key={brand.id} className="group block relative cursor-pointer">
                        <div className="relative aspect-[3/2] w-full overflow-hidden bg-gray-100 rounded-lg">
                            <Image
                                src={brand.image}
                                alt={brand.name}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
                                <h3 className="text-white text-xl md:text-2xl font-serif font-medium tracking-wide">{brand.name}</h3>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </main>
    );
}
