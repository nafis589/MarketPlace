'use client';

import Image from 'next/image';

interface ProductCardImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  badge?: React.ReactNode;
  sold?: boolean;
}

export default function ProductCardImage({ src, alt, priority, badge, sold }: ProductCardImageProps) {
  const isDataUrl = src.startsWith('data:');

  return (
    <div className="relative mb-3 aspect-[4/5] w-full shrink-0 overflow-hidden bg-gray-100">
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized={isDataUrl}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className={`object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
          sold ? 'opacity-80' : ''
        }`}
        priority={priority}
      />
      {sold && (
        <>
          <div className="absolute inset-0 bg-gray-500/30" />
          <span className="absolute left-0 top-0 m-2 rounded-sm bg-gray-800/90 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            Vendu
          </span>
        </>
      )}
      {badge}
    </div>
  );
}
