'use client';

import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatCurrency } from '@/lib/formatters';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useEffect } from 'react';

export default function CartPage() {
  const { items, count, subtotal, updateItem, removeItem, clearCart, isLoading, fetchCart } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchCart(!!user);
  }, [user, fetchCart]);

  const handleCheckout = () => {
    if (!user) {
      const proceed = window.confirm('You need to be signed in to proceed to checkout. Would you like to log in now?');
      if (proceed) {
        window.location.href = '/auth/login?return_to=/checkout';
      }
    } else {
      window.location.href = '/checkout';
    }
  };

  if (items.length === 0 && !isLoading) {
    return (
      <div className="container py-24 text-center flex flex-col items-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <Trash2 className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Looks like you haven't added anything to your cart yet.
        </p>
        <Link href="/products">
          <Button size="lg">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart <span className="text-muted-foreground text-lg font-normal">({count} products)</span></h1>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          {items.map(item => (
            <div key={item.productId} className="group relative flex gap-6 border p-4 rounded-lg bg-card hover:border-primary/50 transition-colors">
              <div className="w-32 h-32 bg-muted rounded-md overflow-hidden flex-shrink-0 border">
                <img
                  src={item.product?.images?.[0] || 'https://via.placeholder.com/150'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  alt={item.product?.name || 'Product'}
                />
              </div>

              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="flex justify-between items-start">
                  <div>
                    <Link href={`/products/${item.productId}`} className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
                      {item.product?.name || 'Loading Product...'}
                    </Link>
                    <p className="text-sm text-muted-foreground capitalize mt-1">
                      {item.product?.mainCategory}
                    </p>
                  </div>
                  <p className="font-bold text-xl ml-4">
                    {formatCurrency(item.product?.discountPriceCents || item.product?.actualPriceCents || 0)}
                  </p>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-muted-foreground">Qty:</label>
                    <div className="flex items-center border rounded-md h-9 bg-background">
                      <button
                        className="px-3 hover:bg-accent h-full flex items-center justify-center disabled:opacity-50"
                        onClick={() => updateItem(!!user, item.productId, Math.max(1, item.qty - 1))}
                        disabled={item.qty <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">{item.qty}</span>
                      <button
                        className="px-3 hover:bg-accent h-full flex items-center justify-center disabled:opacity-50"
                        onClick={() => updateItem(!!user, item.productId, Math.min(99, item.qty + 1))}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 -mr-2"
                    onClick={() => removeItem(!!user, item.productId)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <Button variant="outline" size="sm" onClick={() => clearCart(!!user)}>
              Clear Shopping Cart
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 bg-muted/20 sticky top-24 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping estimate</span>
                <span className="italic">Calc at checkou</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax estimate</span>
                <span className="italic">Calc at checkout</span>
              </div>
            </div>

            <div className="border-t border-dashed my-4" />

            <div className="flex justify-between items-baseline mb-8">
              <span className="font-bold text-lg">Order Total</span>
              <span className="font-bold text-2xl text-primary">{formatCurrency(subtotal)}</span>
            </div>

            <Button className="w-full h-12 text-lg shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>

            <div className="mt-4 text-xs text-center text-muted-foreground">
              <p>Secure Checkout powered by Stripe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
