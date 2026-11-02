// Everything the shop needs from Contentful, loaded with GraphQL.
// Each function asks only for the fields the UI shows, which keeps responses small and fast.
import { graphql } from "./graphql";
import type { Img, Product, ProductCategory } from "./types";

// A GraphQL "fragment" is a reusable list of fields. Every product card uses this same list.
const PRODUCT_FIELDS = `
  fragment ProductFields on Product {
    sys { id }
    name
    slug
    sku
    brand
    price
    compareAtPrice
    shortDescription
    description { json }
    tags
    rating
    reviewCount
    inStock
    featured
    badge
    category { name slug }
    imagesCollection(limit: 6) { items { url width height title } }
  }
`;

// What GraphQL gives us back (raw), before we tidy it up.
type RawProduct = Omit<Product, "id" | "images" | "description" | "categoryName" | "categorySlug" | "tags"> & {
  sys: { id: string };
  tags: string[] | null;
  description: { json: Product["description"] } | null;
  category: { name: string; slug: string } | null;
  imagesCollection: { items: Img[] } | null;
};

// Turn the raw GraphQL shape into the simple Product type the components use.
function toProduct(raw: RawProduct): Product {
  const { sys, description, category, imagesCollection, tags, ...rest } = raw;
  return {
    ...rest,
    id: sys.id,
    description: description?.json,
    categoryName: category?.name,
    categorySlug: category?.slug,
    tags: tags ?? [],
    images: imagesCollection?.items ?? [],
  };
}

// ---------- sorting ----------
export const SORT_OPTIONS = {
  popular: { label: "Most popular", order: "reviewCount_DESC" },
  newest: { label: "Newest", order: "sys_firstPublishedAt_DESC" },
  "price-asc": { label: "Price: low to high", order: "price_ASC" },
  "price-desc": { label: "Price: high to low", order: "price_DESC" },
  rating: { label: "Best rated", order: "rating_DESC" },
} as const;
export type SortKey = keyof typeof SORT_OPTIONS;

export type ProductQuery = {
  category?: string; // category slug
  featured?: boolean;
  onSale?: boolean;
  inStockOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  excludeId?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
};

export const PAGE_SIZE = 8;

// The main product query. The `where` object is how GraphQL filters in Contentful.
export async function getProducts(options: ProductQuery = {}) {
  const pageSize = options.pageSize ?? PAGE_SIZE;
  const page = Math.max(1, options.page ?? 1);

  const where: Record<string, unknown> = {};
  if (options.category) where.category = { slug: options.category };
  if (options.featured) where.featured = true;
  if (options.onSale) where.compareAtPrice_exists = true;
  if (options.inStockOnly) where.inStock = true;
  if (options.minPrice !== undefined) where.price_gte = options.minPrice;
  if (options.maxPrice !== undefined) where.price_lte = options.maxPrice;
  if (options.excludeId) where.sys = { id_not: options.excludeId };
  if (options.search) {
    where.OR = [
      { name_contains: options.search },
      { shortDescription_contains: options.search },
      { brand_contains: options.search },
    ];
  }

  const sort = SORT_OPTIONS[(options.sort as SortKey) ?? "popular"] ?? SORT_OPTIONS.popular;

  const query = `
    ${PRODUCT_FIELDS}
    query Products($where: ProductFilter, $order: [ProductOrder], $limit: Int, $skip: Int) {
      productCollection(where: $where, order: $order, limit: $limit, skip: $skip) {
        total
        items { ...ProductFields }
      }
    }
  `;

  try {
    const data = await graphql<{ productCollection: { total: number; items: RawProduct[] } }>(query, {
      where,
      order: [sort.order],
      limit: pageSize,
      skip: (page - 1) * pageSize,
    });
    return {
      products: data.productCollection.items.map(toProduct),
      total: data.productCollection.total,
      pageCount: Math.max(1, Math.ceil(data.productCollection.total / pageSize)),
    };
  } catch (err) {
    console.error("Contentful GraphQL: products failed:", err);
    return { products: [] as Product[], total: 0, pageCount: 1 };
  }
}

export async function getProductBySlug(slug: string) {
  const query = `
    ${PRODUCT_FIELDS}
    query ProductBySlug($slug: String!) {
      productCollection(where: { slug: $slug }, limit: 1) {
        items { ...ProductFields }
      }
    }
  `;
  try {
    const data = await graphql<{ productCollection: { items: RawProduct[] } }>(query, { slug });
    const raw = data.productCollection.items[0];
    return raw ? toProduct(raw) : null;
  } catch (err) {
    console.error("Contentful GraphQL: product failed:", err);
    return null;
  }
}

export async function getProductCategories() {
  const query = `
    query Categories {
      productCategoryCollection(order: name_ASC) {
        items { sys { id } name slug description image { url width height title } }
      }
    }
  `;
  try {
    const data = await graphql<{
      productCategoryCollection: {
        items: { sys: { id: string }; name: string; slug: string; description?: string; image?: Img }[];
      };
    }>(query);
    return data.productCategoryCollection.items.map(
      ({ sys, ...rest }): ProductCategory => ({ id: sys.id, ...rest })
    );
  } catch (err) {
    console.error("Contentful GraphQL: categories failed:", err);
    return [] as ProductCategory[];
  }
}

export async function getProductCategory(slug: string) {
  const all = await getProductCategories();
  return all.find((c) => c.slug === slug) ?? null;
}
