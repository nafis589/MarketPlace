'use client';

import {
  homeHorizontalScroll,
  homeSectionBlock,
  homeSectionPadding,
  homeSectionShell,
} from '@/app/components/home/homeSectionStyles';

interface RecommendationsSkeletonProps {
  count?: number;
}

export default function RecommendationsSkeleton({ count = 8 }: RecommendationsSkeletonProps) {
  return (
    <section className={`bg-gray-50 font-sans ${homeSectionBlock} ${homeSectionPadding}`}>
      <div className={homeSectionShell}>
        <div className="mb-6 h-7 w-56 animate-pulse rounded bg-gray-200" />
        <div className="mb-4 h-4 w-full max-w-xl animate-pulse rounded bg-gray-100" />
        <div
          className={`${homeHorizontalScroll} items-stretch divide-x divide-gray-200 border border-gray-200 bg-white`}
        >
          {Array.from({ length: count }).map((_, index) => (
            <div
              key={index}
              className="flex w-[44vw] min-w-[148px] shrink-0 snap-start flex-col p-3 sm:w-[220px] sm:min-w-0 sm:p-4 md:w-[260px] lg:w-[280px] xl:w-1/5"
            >
              <div className="aspect-[3/3.5] w-full animate-pulse bg-gray-200" />
              <div className="mt-3 h-3 w-1/3 animate-pulse rounded bg-gray-200" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-gray-200" />
              <div className="mt-3 h-4 w-1/4 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
