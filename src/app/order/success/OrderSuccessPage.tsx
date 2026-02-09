'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { fetchCart, clearCart } = useCartStore();

  useEffect(() => {
    fetchCart(true);
  }, [fetchCart]);

  return (
    <div className="container py-24 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
      <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-8 text-green-600">
        <CheckCircle className="h-12 w-12" />
      </div>
      <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Thank you for your purchase. Your order ID is <span className="font-mono font-bold text-foreground">{orderId || 'N/A'}</span>.
      </p>
      <div className="flex gap-4">
        {orderId && (
          <Link href={`/account/orders/${orderId}`}>
            <Button variant="outline">View Order</Button>
          </Link>
        )}
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}
