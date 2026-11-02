import Link from "next/link";
import Picture from "./Picture";
import Stars from "./Stars";
import AddToCartButton from "./AddToCartButton";
import { discountPercent, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductCard({ product }: { product: Product }) {
  const off = discountPercent(product.price, product.compareAtPrice);
  const href = `/product/${product.slug}`;

  return (
    <article className="product-card">
      <Link href={href} className="product-card__image">
        <Picture image={product.images[0]} sizes="(max-width: 700px) 50vw, 25vw" />
        {product.badge && <span className="tag">{product.badge}</span>}
        {off > 0 && <span className="tag tag--sale">-{off}%</span>}
      </Link>

      <div className="product-card__body">
        {product.brand && <span className="product-card__brand">{product.brand}</span>}
        <h3>
          <Link href={href}>{product.name}</Link>
        </h3>
        <Stars rating={product.rating} reviewCount={product.reviewCount} />
        <p className="price">
          <strong>{formatPrice(product.price)}</strong>
          {off > 0 && product.compareAtPrice && <s>{formatPrice(product.compareAtPrice)}</s>}
        </p>
        <AddToCartButton
          product={{
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            imageUrl: product.images[0]?.url,
          }}
          disabled={!product.inStock}
        />
      </div>
    </article>
  );
}
