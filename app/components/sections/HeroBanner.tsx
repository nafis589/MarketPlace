import React from 'react';
import Image from 'next/image';
import Button from '../ui/Button';
import Link from 'next/link';

const HeroBanner = () => {
    return (
        <section className="relative h-[80vh] w-full overflow-hidden">
            <Image
                src="https://images.pexels.com/photos/18398399/pexels-photo-18398399.jpeg"
                alt="Hero Banner"
                fill
                className="object-cover object-center"
                priority
            />
            {/* Film noir renforcé */}
            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium mb-6 drop-shadow-lg max-w-4xl leading-tight">
                    Le luxe de seconde main,<br /> authentifié par nos experts.
                </h1>
                <p className="text-lg md:text-xl mb-8 max-w-2xl drop-shadow-md font-light">
                    Rejoignez notre communauté mondiale de passionnés de mode et découvrez des pièces uniques.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/nouveautes">
                        <Button variant="white" size="lg">Acheter maintenant</Button>
                    </Link>
                    <Link href="/nouveautes">
                        <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-black">Vendre une pièce</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;
