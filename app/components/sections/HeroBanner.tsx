import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronDown } from 'lucide-react';

const HeroBanner = () => {
  return (
    <section className="relative min-h-[calc(100vh-72px)] w-full overflow-hidden md:min-h-[calc(100vh-88px)]">
      <Image
        src="https://images.pexels.com/photos/18398399/pexels-photo-18398399.jpeg"
        alt="Marketplace — mode et lifestyle"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black/35" />

      <div className="absolute inset-0 flex items-center justify-center px-2 sm:px-6">
        <div className="flex w-full max-w-[95%] flex-col items-center justify-center text-center text-white md:max-w-4xl">
          <h1 className="mb-8 w-full font-serif text-5xl font-semibold leading-[1.02] tracking-tight drop-shadow-lg sm:text-6xl md:text-6xl lg:text-7xl">
            Level up your style with our summer collections
          </h1>

          <Link
            href="/nouveautes"
            className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-medium text-black transition-colors hover:bg-gray-100"
          >
            <span>Découvrir les articles</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      
    </section>
  );
};

export default HeroBanner;
