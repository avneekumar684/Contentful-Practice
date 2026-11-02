import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EmptyState from "@/components/EmptyState";
import Pagination from "@/components/Pagination";
import Picture from "@/components/Picture";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import { getProductCategories, getProductCategory, getProducts } from "@/lib/store";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const category = await getProductCategory((await params).slug);
  return { title: category?.name, description: category?.description };
}

type SearchParams = { sort?: string; stock?: string; sale?: string; min?: string; max?: string; page?: string };

// /category/electronics -> products of that category only.
export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const page = Number(query.page) || 1;

  const category = await getProductCategory(slug);
  if (!category) notFound();

  const [categories, { products, total, pageCount }] = await Promise.all([
    getProductCategories(),
    getProducts({
      category: slug,
      sort: query.sort,
      inStockOnly: query.stock === "1",
      onSale: query.sale === "1",
      minPrice: query.min ? Number(query.min) : undefined,
      maxPrice: query.max ? Number(query.max) : undefined,
      page,
    }),
  ]);

  const { page: _page, ...filterParams } = query;
  void _page;

  return (
    <>
      <section className="category-hero">
        <div className="category-hero__image">
          <Picture image={category.image} sizes="100vw" priority />
        </div>
        <div className="container category-hero__text">
          <h1>{category.name}</h1>
          {category.description && <p>{category.description}</p>}
        </div>
      </section>

      <div className="container section">
        <ProductFilters
          hideCategory
          categories={categories}
          values={{
            sort: query.sort,
            inStock: query.stock === "1",
            sale: query.sale === "1",
            min: query.min,
            max: query.max,
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

        <Pagination basePath={`/category/${slug}`} page={page} pageCount={pageCount} params={filterParams} />
      </div>
    </>
  );
}
