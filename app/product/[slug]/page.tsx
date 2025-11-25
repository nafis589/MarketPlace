import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Header from '@/app/components/sections/Header';
import Footer from '@/app/components/sections/Footer';
import ProductDetailComponent from '@/app/components/product/ProductDetailComponent';
import RelatedProducts from '@/app/components/product/RelatedProducts';
import { getProductBySlug, getRelatedProducts, getAllProductSlugs } from '@/app/lib/products';

// Generate static params for all product slugs
export async function generateStaticParams() {
    const slugs = getAllProductSlugs();

    return slugs.map((slug) => ({
        slug: slug,
    }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const product = getProductBySlug(slug);

    if (!product) {
        return {
            title: 'Produit non trouvé',
            description: 'Le produit que vous recherchez n\'existe pas.',
        };
    }

    // Get first 160 characters of description for meta description
    const metaDescription = product.description.length > 160
        ? product.description.substring(0, 157) + '...'
        : product.description;

    return {
        title: `${product.brand} - ${product.title} | FriperieLuxe`,
        description: metaDescription,
        openGraph: {
            title: `${product.brand} - ${product.title}`,
            description: metaDescription,
            images: [
                {
                    url: product.images[0],
                    width: 1200,
                    height: 630,
                    alt: `${product.brand} ${product.title}`,
                },
            ],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${product.brand} - ${product.title}`,
            description: metaDescription,
            images: [product.images[0]],
        },
    };
}

// Main Page Component
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const product = getProductBySlug(slug);

    // If product not found, show 404
    if (!product) {
        notFound();
    }

    // Get related products based on category
    const relatedProducts = getRelatedProducts(product.category, product.id, 4);

    return (
        <main className="min-h-screen bg-white">
            <Header />

            {/* Offset for fixed header */}
            <div className="pt-[72px] md:pt-[88px]">
                <ProductDetailComponent product={product} />

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <RelatedProducts products={relatedProducts} title="Produits similaires" />
                )}
            </div>

            <Footer />
        </main>
    );
}
