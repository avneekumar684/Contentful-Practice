import type { Metadata } from "next";
import Link from "next/link";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { getProductCategories, getProducts } from "@/lib/store";

export const metadata: Metadata = { title: "Shop", description: "Browse all products." };

type SearchParams = { category?: string; sort?: string; stock?: string; sale?: string; min?: string; max?: string; page?: string };

// The shop. Every filter is a GraphQL `where` condition built in lib/store.ts.
export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [categories, { products, total, pageCount }] = await Promise.all([
    getProductCategories(),
    getProducts({
      category: params.category,
      sort: params.sort,
      inStockOnly: params.stock === "1",
      onSale: params.sale === "1",
      minPrice: params.min ? Number(params.min) : undefined,
      maxPrice: params.max ? Number(params.max) : undefined,
      page,
    }),
  ]);

  const { page: _page, ...filterParams } = params; // keep filters, drop the page number
  void _page;

  return (
    <div className="container section">
      <h1>Shop</h1>

      <nav className="chips" aria-label="Categories">
        <Link href="/shop" className={`chip ${!params.category ? "is-active" : ""}`}>
          All
        </Link>
        {categories.map((c) => (
          <Link key={c.slug} href={`/category/${c.slug}`} className="chip">
            {c.name}
          </Link>
        ))}
      </nav>

      <ProductFilters
        categories={categories}
        values={{
          category: params.category,
          sort: params.sort,
          inStock: params.stock === "1",
          sale: params.sale === "1",
          min: params.min,
          max: params.max,
        }}
      />

      <p className="section__intro">
        {total} product{total === 1 ? "" : "s"}
      </p>

      {products.length === 0 ? (
        <EmptyState message="No products match these filters." />
      ) : (
        <div className="grid grid--4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <Pagination basePath="/shop" page={page} pageCount={pageCount} params={filterParams} />
    </div>
  );
}
