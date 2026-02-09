'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils'; // utility for classnames

const CATEGORIES = [
  'Electronics',
  'Computers',
  'Smart Home',
  'Accessories'
];

export function CategoryNav() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  return (
    <nav className="border-b bg-muted/40 overflow-x-auto">
      <div className="container flex h-10 items-center gap-6 text-sm overflow-x-auto no-scrollbar">
        <Link
          href="/products"
          className={cn(
            "whitespace-nowrap hover:text-primary transition-colors font-medium",
            !currentCategory && "text-primary"
          )}
        >
          All
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/products?category=${encodeURIComponent(cat)}`}
            className={cn(
              "whitespace-nowrap hover:text-primary transition-colors font-medium",
              currentCategory === cat ? "text-primary" : "text-muted-foreground"
            )}
          >
            {cat}
          </Link>
        ))}
      </div>
    </nav>
  );
}
