'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/products/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

export default function ProductsListPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Parse current filters
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || '';
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const minRating = searchParams.get('minRating') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams.toString());
        if (!params.get('limit')) params.set('limit', '20');

        const { data } = await api.get(`/products?${params.toString()}`);
        setProducts(Array.isArray(data) ? data : (data.products || data.items || []));
      } catch (e) {
        console.error("Failed to fetch products", e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const updateFilter = useCallback((name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value);
    else params.delete(name);
    params.delete('page');
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-semibold mb-4">Price Range</h3>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Min"
            value={minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)}
            type="number"
            className="w-20"
          />
          <span>-</span>
          <Input
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)}
            type="number"
            className="w-20"
          />
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Rating</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={minRating === rating.toString()}
                onChange={() => updateFilter('minRating', rating.toString())}
                className="accent-primary"
              />
              <span className="text-sm">{rating} stars & up</span>
            </label>
          ))}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={!minRating}
              onChange={() => updateFilter('minRating', '')}
              className="accent-primary"
            />
            <span className="text-sm">Any rating</span>
          </label>
        </div>
      </div>

      <div>
        <Button variant="outline" className="w-full" onClick={() => router.push(pathname)}>
          Clear Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className="container py-8 flex gap-8">
      <div className="lg:hidden w-full mb-4">
        <Button onClick={() => setShowMobileFilters(!showMobileFilters)} variant="outline" className="w-full">
          <Filter className="mr-2 h-4 w-4" /> Filters
        </Button>
        {showMobileFilters && (
          <div className="mt-4 p-4 border rounded-md bg-background">
            <FilterSidebar />
          </div>
        )}
      </div>

      <aside className="w-64 hidden lg:block sticky top-24 h-fit">
        <FilterSidebar />
      </aside>

      <div className="flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold capitalize">
            {category || searchParams.get('q') ? `Results for "${category || searchParams.get('q')}"` : 'All Products'}
            <span className="text-muted-foreground text-sm font-normal ml-2">({products.length} items)</span>
          </h1>

          <select
            className="border rounded-md p-2 bg-background text-sm min-w-[180px]"
            value={sort}
            onChange={(e) => updateFilter('sort', e.target.value)}
          >
            <option value="">Sort by: Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Avg. Customer Review</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-muted rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length > 0 ? (
              products.map(p => <ProductCard key={p._id || p.id} product={p} />)
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                <p className="text-lg">No products found matching your criteria.</p>
                <Button variant="link" onClick={() => router.push('/products')}>Clear all filters</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
