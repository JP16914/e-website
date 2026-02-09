'use client';

import { Product } from '@/lib/types';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Star } from 'lucide-react';
import Link from 'next/link';

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const productId = product._id || product.id;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (productId) addItem(!!user, productId, 1);
  };

  const hasDiscount = product.discountPriceCents > 0;
  const price = hasDiscount ? product.discountPriceCents : product.actualPriceCents;

  return (
    <Link href={`/products/${productId}`} className="group relative flex flex-col justify-between rounded-lg border p-4 hover:shadow-lg transition-shadow bg-card h-full">
      <div className="aspect-square relative bg-muted rounded-md overflow-hidden mb-3">
        {/* Use generic placeholder if empty */}
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform"
        />
        {hasDiscount && (
          <span className="absolute top-2 right-2 bg-destructive text-destructive-foreground text-xs font-bold px-2 py-1 rounded">
            Save {Math.round(((product.actualPriceCents - product.discountPriceCents) / product.actualPriceCents) * 100)}%
          </span>
        )}
      </div>

      <div className="space-y-2 flex-1 relative">
        <h3 className="font-medium line-clamp-2 text-sm sm:text-base h-[3rem]">{product.name}</h3>

        <div className="flex items-center gap-1 text-sm text-yellow-500">
          <Star className="w-3 h-3 fill-current" />
          <Star className="w-3 h-3 fill-current" />
          <Star className="w-3 h-3 fill-current" />
          <Star className="w-3 h-3 fill-current" />
          <span className="text-foreground font-semibold">{product.rating?.toFixed(1) || '0.0'}</span>
          <span className="text-muted-foreground text-xs ml-1">({product.reviewCount || 0})</span>
        </div>

        <div className="mt-2 flex items-baseline gap-2 flex-wrap">
          <span className="font-bold text-lg">{formatCurrency(price)}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through decoration-destructive">
              {formatCurrency(product.actualPriceCents)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 pt-2 border-t">
        <Button className="w-full" onClick={handleAddToCart} size="sm">
          Add to Cart
        </Button>
      </div>
    </Link>
  );
}
