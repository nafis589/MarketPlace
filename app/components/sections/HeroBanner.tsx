import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const HeroBanner = () => {
  return (
    <section className="relative mt-5 h-[200px] w-full overflow-hidden sm:mt-7 sm:h-[240px] md:mt-9 md:h-[280px] lg:h-[300px]">
      <Image
        src="https://images.pexels.com/photos/12951883/pexels-photo-12951883.jpeg"
        alt="Marketplace — achetez et vendez entre particuliers"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-white/25" />

      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 md:px-8">
        <div className="flex w-full max-w-3xl flex-col items-center justify-center text-center text-black">
          <h1 className="mb-4 max-w-[18rem] font-serif text-xl font-semibold leading-snug tracking-tight drop-shadow-sm sm:mb-5 sm:max-w-lg sm:text-2xl md:max-w-2xl md:text-3xl lg:text-4xl">
            Bienvenu sur Marketplace, Achetez et vendez entre particuliers
          </h1>

          <Link
            href="/nouveautes"
            className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-xs font-medium text-black shadow-sm transition-colors hover:bg-gray-100 sm:px-5 sm:py-2.5 sm:text-sm md:px-6 md:py-3"
          >
            <span>Explorer la marketplace</span>
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
