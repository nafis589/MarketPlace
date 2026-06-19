import React from 'react';
import Image from 'next/image';
import Button from '../ui/Button';
import Link from 'next/link';

const HeroBanner = () => {
    return (
        <section className="relative min-h-[calc(100vh-72px)] md:min-h-[calc(100vh-88px)] w-full overflow-hidden">
            <Image
                src="https://images.pexels.com/photos/18398399/pexels-photo-18398399.jpeg"
                alt="Marketplace — mode et lifestyle"
                fill
                className="object-cover object-center"
                priority
            />
            <div className="absolute inset-0 bg-black/45" />

            <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6">
                <div className="flex w-full max-w-3xl flex-col items-center justify-center text-center text-white">
                    <h1 className="mb-4 font-serif text-4xl font-medium leading-tight drop-shadow-lg md:text-6xl lg:text-7xl">
                        The Marketplace
                    </h1>
                    

                    <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link href="/nouveautes">
                            <Button variant="white" size="lg">
                                Découvrir les articles
                            </Button>
                        </Link>
                        
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;
