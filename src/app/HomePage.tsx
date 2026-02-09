'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featRes, dealsRes] = await Promise.all([
          api.get('/products?sort=rating&limit=4'),
          api.get('/products?sort=discount&limit=4')
        ]);

        const getProducts = (res: any) => Array.isArray(res.data) ? res.data : (res.data.products || res.data.items || []);

        setFeatured(getProducts(featRes));
        setDeals(getProducts(dealsRes));
      } catch (e) {
        console.error("Failed to load home data", e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container py-8 space-y-8 animate-pulse">
        <div className="h-40 bg-muted/50 rounded-lg" />
        <div className="grid grid-cols-4 gap-4">
          <div className="h-64 bg-muted/50 rounded-lg" />
          <div className="h-64 bg-muted/50 rounded-lg" />
          <div className="h-64 bg-muted/50 rounded-lg" />
          <div className="h-64 bg-muted/50 rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12 md:py-24">
        <div className="container flex flex-col items-center text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Shopping Redefined</h1>
          <p className="text-lg md:text-xl max-w-2xl opacity-90">
            Discover millions of products with fast shipping and exclusive deals every day.
          </p>
          <Link href="/products">
            <Button size="lg" variant="secondary" className="mt-4">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Deals Section */}
      <section className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Today's Deals</h2>
          <Link href="/products?sort=discount" className="text-primary hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {deals.length > 0 ? deals.map(p => <ProductCard key={p._id || p.id} product={p} />) : <p className="text-muted-foreground">No deals found.</p>}
        </div>
      </section>

      {/* Featured Section */}
      <section className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Top Rated Products</h2>
          <Link href="/products?sort=rating" className="text-primary hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.length > 0 ? featured.map(p => <ProductCard key={p._id || p.id} product={p} />) : <p className="text-muted-foreground">No products found.</p>}
        </div>
      </section>

      {/* Categories Grid (Static for visuals) */}
      <section className="container bg-secondary/20 py-12 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {['Electronics', 'Computers', 'Smart Home', 'Accessories', 'TV & Audio', 'Cameras'].map(cat => (
            <Link key={cat} href={`/products?category=${cat}`} className="bg-background hover:bg-muted transition-colors p-6 rounded-lg text-center shadow-sm border font-medium">
              {cat}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
