import { SORT_OPTIONS } from "@/lib/store";
import type { ProductCategory } from "@/lib/types";

type Props = {
  categories: ProductCategory[];
  values: { category?: string; sort?: string; inStock?: boolean; sale?: boolean; min?: string; max?: string };
  hideCategory?: boolean; // on a category page the category is already chosen
};

// A normal HTML form that submits with GET. The filters end up in the URL (?sort=price-asc&stock=1),
// so the filtered page can be bookmarked and shared, and no JavaScript is needed.
export default function ProductFilters({ categories, values, hideCategory }: Props) {
  return (
    <form className="filters" method="get">
      {!hideCategory && (
        <label>
          Category
          <select name="category" defaultValue={values.category ?? ""}>
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <label>
        Sort by
        <select name="sort" defaultValue={values.sort ?? "popular"}>
          {Object.entries(SORT_OPTIONS).map(([key, option]) => (
            <option key={key} value={key}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Min price
        <input type="number" name="min" min="0" placeholder="0" defaultValue={values.min} />
      </label>
      <label>
        Max price
        <input type="number" name="max" min="0" placeholder="200" defaultValue={values.max} />
      </label>

      <label className="filters__check">
        <input type="checkbox" name="stock" value="1" defaultChecked={values.inStock} />
        In stock only
      </label>
      <label className="filters__check">
        <input type="checkbox" name="sale" value="1" defaultChecked={values.sale} />
        On sale
      </label>

      <button className="button" type="submit">
        Apply
      </button>
    </form>
  );
}
