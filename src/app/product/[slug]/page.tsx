import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import RichText from "@/components/RichText";
import Stars from "@/components/Stars";
import { discountPercent, formatPrice } from "@/lib/format";
import { getProductBySlug, getProducts } from "@/lib/store";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  return {
    title: product?.name,
    description: product?.shortDescription,
    openGraph: product?.images[0] ? { images: [product.images[0].url] } : undefined,
  };
}

// Product detail page: everything here came from one GraphQL query (plus one more for related items).
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();

  // "You may also like": same category, but not this product.
  const { products: related } = await getProducts({
    category: product.categorySlug,
    excludeId: product.id,
    pageSize: 4,
  });

  const off = discountPercent(product.price, product.compareAtPrice);

  // JSON-LD helps search engines understand the page (this is the SEO part of a product page).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    brand: product.brand,
    image: product.images.map((i) => i.url),
    description: product.shortDescription,
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/shop">Shop</Link>
        {product.categorySlug && (
          <>
            {" / "}
            <Link href={`/category/${product.categorySlug}`}>{product.categoryName}</Link>
          </>
        )}
        {" / "}
        <span>{product.name}</span>
      </nav>

      <div className="product">
        <ProductGallery images={product.images} />

        <div className="product__info">
          {product.brand && <span className="badge">{product.brand}</span>}
          <h1>{product.name}</h1>
          <Stars rating={product.rating} reviewCount={product.reviewCount} />

          <p className="price price--big">
            <strong>{formatPrice(product.price)}</strong>
            {off > 0 && product.compareAtPrice && (
              <>
                <s>{formatPrice(product.compareAtPrice)}</s>
                <span className="tag tag--sale tag--inline">Save {off}%</span>
              </>
            )}
          </p>

          <p>{product.shortDescription}</p>

          <p className={product.inStock ? "stock stock--in" : "stock stock--out"}>
            {product.inStock ? "● In stock" : "● Out of stock"}
          </p>

          <AddToCartButton
            showQuantity
            disabled={!product.inStock}
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              imageUrl: product.images[0]?.url,
            }}
          />

          {product.tags.length > 0 && (
            <p className="product__tags">
              {product.tags.map((tag) => (
                <Link key={tag} href={`/search?q=${tag}`} className="chip">
                  {tag}
                </Link>
              ))}
            </p>
          )}
          {product.sku && <p className="product__sku">SKU: {product.sku}</p>}
        </div>
      </div>

      {product.description && (
        <section className="product__details">
          <h2>Details</h2>
          <RichText document={product.description} />
        </section>
      )}

      {related.length > 0 && (
        <section className="section--tight">
          <h2>You may also like</h2>
          <div className="grid grid--4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
