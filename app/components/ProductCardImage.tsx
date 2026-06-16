'use client';

import Image from 'next/image';

interface ProductCardImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  badge?: React.ReactNode;
}

export default function ProductCardImage({ src, alt, priority, badge }: ProductCardImageProps) {
  const isDataUrl = src.startsWith('data:');

  return (
    <div className="relative mb-3 aspect-[3/4] w-full shrink-0 overflow-hidden bg-gray-100">
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized={isDataUrl}
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
        priority={priority}
      />
      {badge}
    </div>
  );
}
