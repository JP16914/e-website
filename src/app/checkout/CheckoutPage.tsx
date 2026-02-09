'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/dropdown-menu'; // improper import
import { formatCurrency } from '@/lib/formatters';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Check, Loader2 } from 'lucide-react';

// Address Schema
const addressSchema = z.object({
  street: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  zip: z.string().min(5),
  country: z.string().default('US'),
});

type AddressFormData = z.infer<typeof addressSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStore();
  const { items, subtotal, fetchCart } = useCartStore();

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isCreatingAddress, setIsCreatingAddress] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
  });

  // Redirect if guest
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login?return_to=/checkout');
    }
  }, [user, authLoading, router]);

  // Fetch addresses
  useEffect(() => {
    if (user) {
      api.get('/users/me/addresses').then(res => {
        const addrs = res.data.items || res.data || [];
        setAddresses(addrs);
        if (addrs.length > 0) setSelectedAddressId(addrs[0].id);
        else setIsCreatingAddress(true);
      }).catch(() => { });
      fetchCart(true);
    }
  }, [user, fetchCart]);

  const onAddressSubmit = async (data: AddressFormData) => {
    try {
      const res = await api.post('/users/me/addresses', data);
      const newAddr = res.data;
      setAddresses([...addresses, newAddr]);
      setSelectedAddressId(newAddr.id);
      setIsCreatingAddress(false);
    } catch (e) {
      alert('Failed to save address');
    }
  };

  const placeOrder = async () => {
    if (!selectedAddressId) return alert('Please select an address');
    setPlacingOrder(true);
    try {
      const res = await api.post('/orders', { addressId: selectedAddressId });
      router.push(`/order/success?orderId=${res.data.id}`);
    } catch (e: any) {
      if (e.response?.status === 409) { // Out of stock items
        alert('Some items are out of stock. Please review your cart.');
        router.push('/cart');
      } else {
        alert('Failed to place order.');
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  if (authLoading || !user) return <div className="p-8">Loading...</div>;

  return (
    <div className="container py-12 grid lg:grid-cols-2 gap-12">
      <div>
        <h2 className="text-2xl font-bold mb-6">1. Shipping Address</h2>

        {!isCreatingAddress && addresses.length > 0 ? (
          <div className="space-y-4">
            {addresses.map(addr => (
              <div key={addr.id}
                className={`border p-4 rounded-lg cursor-pointer flex justify-between items-center ${selectedAddressId === addr.id ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted'}`}
                onClick={() => setSelectedAddressId(addr.id)}
              >
                <div>
                  <p className="font-medium">{addr.street}</p>
                  <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zip}</p>
                </div>
                {selectedAddressId === addr.id && <Check className="text-primary h-5 w-5" />}
              </div>
            ))}
            <Button variant="outline" onClick={() => setIsCreatingAddress(true)} className="w-full">
              + Add New Address
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onAddressSubmit)} className="space-y-4 border p-6 rounded-lg bg-card">
            <h3 className="font-semibold">Add New Address</h3>
            <div>
              <Input placeholder="Street Address" {...register('street')} />
              {errors.street && <p className="text-red-500 text-xs">{errors.street.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input placeholder="City" {...register('city')} />
                {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
              </div>
              <div>
                <Input placeholder="State" {...register('state')} />
                {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input placeholder="ZIP Code" {...register('zip')} />
                {errors.zip && <p className="text-red-500 text-xs">{errors.zip.message}</p>}
              </div>
              <div>
                <Input placeholder="Country" {...register('country')} defaultValue="US" />
              </div>
            </div>
            <div className="flex gap-2">
              {addresses.length > 0 && (
                <Button type="button" variant="ghost" onClick={() => setIsCreatingAddress(false)}>Cancel</Button>
              )}
              <Button type="submit">Save Address</Button>
            </div>
          </form>
        )}

        <h2 className="text-2xl font-bold mt-12 mb-6">2. Payment Method</h2>
        <div className="border p-4 rounded-lg bg-muted/20">
          <p>Payment integration is mocked for this demo. <br />You will not be charged.</p>
        </div>
      </div>

      <div>
        <div className="bg-muted/10 p-6 rounded-lg border sticky top-24">
          <h2 className="text-xl font-bold mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6 max-h-96 overflow-y-auto pr-2">
            {items.map(item => (
              <div key={item.productId} className="flex gap-4 text-sm">
                <div className="w-16 h-16 bg-muted rounded overflow-hidden flex-shrink-0">
                  <img src={item.product?.images[0]} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-medium line-clamp-2">{item.product?.name}</p>
                  <p className="text-muted-foreground">Qty: {item.qty}</p>
                </div>
                <p className="font-bold">
                  {formatCurrency((item.product?.discountPriceCents || item.product?.actualPriceCents || 0) * item.qty)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Items ({items.reduce((a, b) => a + b.qty, 0)}):</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping & Handling:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between font-bold text-xl pt-2 border-t mt-2">
              <span>Order Total:</span>
              <span className="text-primary">{formatCurrency(subtotal)}</span>
            </div>
          </div>

          <Button className="w-full mt-6 size-lg font-bold" onClick={placeOrder} disabled={placingOrder || !selectedAddressId}>
            {placingOrder ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing Order...</> : 'Place Order'}
          </Button>
        </div>
      </div>
    </div>
  );
}
