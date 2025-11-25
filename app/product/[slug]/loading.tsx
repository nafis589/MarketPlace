/**
 * Loading State for Product Detail Page
 * Displays skeleton loaders while product data is being fetched
 */

export default function Loading() {
    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 pt-[88px] md:pt-[104px]">

                {/* Breadcrumb Skeleton */}
                <div className="mb-6 h-4 w-1/2 bg-gray-200 animate-pulse rounded" />

                {/* Header Skeleton */}
                <div className="text-center mb-8">
                    <div className="h-12 w-64 mx-auto bg-gray-200 animate-pulse rounded mb-2" />
                    <div className="h-6 w-48 mx-auto bg-gray-200 animate-pulse rounded" />
                </div>

                {/* Layout Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-8">

                    {/* Left Column: Image Gallery Skeleton */}
                    <div className="lg:col-span-7">
                        <div className="flex flex-col sm:flex-row gap-4">
                            {/* Thumbnails */}
                            <div className="flex sm:flex-col gap-2 order-2 sm:order-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="w-14 h-16 sm:w-16 sm:h-20 bg-gray-200 animate-pulse rounded" />
                                ))}
                            </div>

                            {/* Main Image */}
                            <div className="flex-1 order-1 sm:order-2 bg-gray-200 animate-pulse min-h-[400px] sm:min-h-[500px] rounded" />
                        </div>
                    </div>

                    {/* Right Column: Info Skeleton */}
                    <div className="lg:col-span-5 bg-[#F9F9F9] p-6 sm:p-8 mt-8 lg:mt-0 rounded-sm">

                        {/* Seller Info Skeleton */}
                        <div className="flex flex-col items-end mb-6">
                            <div className="w-12 h-12 rounded-full bg-gray-300 animate-pulse mb-2" />
                            <div className="h-3 w-32 bg-gray-300 animate-pulse rounded" />
                        </div>

                        {/* Price Skeleton */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-6 w-20 bg-gray-300 animate-pulse rounded" />
                            <div className="h-8 w-24 bg-gray-300 animate-pulse rounded" />
                        </div>

                        {/* Details Skeleton */}
                        <div className="space-y-3 mb-6">
                            <div className="h-5 w-full bg-gray-300 animate-pulse rounded" />
                            <div className="h-5 w-3/4 bg-gray-300 animate-pulse rounded" />
                            <div className="h-5 w-1/2 bg-gray-300 animate-pulse rounded" />
                        </div>

                        {/* Description Skeleton */}
                        <div className="mb-6 space-y-2">
                            <div className="h-4 w-full bg-gray-300 animate-pulse rounded" />
                            <div className="h-4 w-full bg-gray-300 animate-pulse rounded" />
                            <div className="h-4 w-2/3 bg-gray-300 animate-pulse rounded" />
                        </div>

                        {/* Affirm Skeleton */}
                        <div className="h-4 w-full bg-gray-300 animate-pulse rounded mb-6" />

                        {/* Buttons Skeleton */}
                        <div className="space-y-3 mb-8">
                            <div className="h-12 w-full bg-gray-300 animate-pulse rounded" />
                            <div className="h-12 w-full bg-gray-300 animate-pulse rounded" />
                        </div>

                        {/* Footer Info Skeleton */}
                        <div className="space-y-3">
                            <div className="h-4 w-full bg-gray-300 animate-pulse rounded" />
                            <div className="h-4 w-3/4 bg-gray-300 animate-pulse rounded" />
                        </div>

                    </div>
                </div>

                {/* Related Products Skeleton */}
                <div className="py-12">
                    <div className="h-8 w-48 mx-auto bg-gray-200 animate-pulse rounded mb-8" />
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-3">
                                <div className="aspect-[3/4] bg-gray-200 animate-pulse rounded" />
                                <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded" />
                                <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
