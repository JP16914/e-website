
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatCurrency } from '@/lib/formatters';
import { Star, ShoppingCart, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/products/${params.id}`);
        setProduct(data);
        try {
          // Fetch related
          const rel = await api.get(`/products/${params.id}/related`);
          setRelated(Array.isArray(rel.data) ? rel.data : (rel.data.items || []));
        } catch { }
      } catch (e) {
        console.error("Product not found", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [params.id]);

  if (loading) return <div className="container py-12 text-center text-muted-foreground animate-pulse">Loading product details...</div>;
  if (!product) return <div className="container py-12 text-center font-bold text-xl">Product Not Found</div>;

  const productId = product._id || product.id;

  const handleAddToCart = () => {
    if (productId) {
      addItem(!!user, productId, qty);
      alert('Added to cart!');
    }
  };

  const handleBuyNow = async () => {
    if (productId) {
      await addItem(!!user, productId, qty);
      router.push('/cart');
    }
  };

  const hasDiscount = product.discountPriceCents > 0;
  const currentPrice = hasDiscount ? product.discountPriceCents : product.actualPriceCents;
  const originalPrice = product.actualPriceCents;
  const discountParams = hasDiscount ? {
    amount: originalPrice - currentPrice,
    percent: Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  } : null;

  return (
    <div className="container py-8 bg-white min-h-screen">
      {/* Breadcrumb could go here */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Col: Images (5 cols width) */}
        <div className="lg:col-span-5 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails (Vertical on desktop) */}
          {product.images?.length > 1 && (
            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:h-[500px] no-scrollbar">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  onMouseEnter={() => setSelectedImage(i)}
                  className={`w-16 h-16 md:w-20 md:h-20 border rounded cursor-pointer p-1 ${selectedImage === i ? 'border-blue-600 ring-1 ring-blue-600' : 'border-gray-200 hover:border-gray-400'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </div>
              ))}
            </div>
          )}

          {/* Main Image */}
          <div className="flex-1 border rounded-lg p-4 bg-white flex items-center justify-center min-h-[400px] max-h-[600px]">
            <img
              src={product.images?.[selectedImage] || 'https://via.placeholder.com/600'}
              alt={product.name}
              className="max-w-full max-h-[500px] object-contain"
            />
          </div>
        </div>

        {/* Center Col: Details (4 cols width) */}
        <div className="lg:col-span-4 space-y-4">
          <h1 className="text-2xl md:text-3xl font-medium text-gray-900 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-2">
            <div className="flex items-center text-yellow-500 text-sm">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <a href="#reviews" className="text-blue-600 hover:underline text-sm font-medium">
              {product.reviewCount} ratings
            </a>
          </div>

          <div className="border-t border-b py-4 space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-red-600 text-3xl font-light">
                -{discountParams?.percent}%
              </span>
              <span className="text-3xl font-bold flex items-start">
                <span className="text-xs mt-1 mr-0.5">$</span>
                {formatCurrency(currentPrice).replace('$', '')}
              </span>
            </div>
            {hasDiscount && (
              <div className="text-sm text-gray-500">
                List Price: <span className="line-through">{formatCurrency(originalPrice)}</span>
              </div>
            )}
            <div className="text-sm">
              <span className="text-gray-700">Inclusive of all taxes</span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex gap-4 py-2">
            <div className="flex flex-col items-center text-center w-20">
              <div className="bg-gray-100 p-2 rounded-full mb-1">
                <Truck className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-xs text-blue-600">Free Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center w-20">
              <div className="bg-gray-100 p-2 rounded-full mb-1">
                <RotateCcw className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-xs text-blue-600">7 days Replacement</span>
            </div>
            <div className="flex flex-col items-center text-center w-20">
              <div className="bg-gray-100 p-2 rounded-full mb-1">
                <ShieldCheck className="w-5 h-5 text-gray-600" />
              </div>
              <span className="text-xs text-blue-600">Warranty Policy</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-bold text-lg mb-2">About this item</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
        </div>

        {/* Right Col: Buy Box (3 cols width) */}
        <div className="lg:col-span-3">
          <div className="border rounded-lg p-4 shadow-sm space-y-4 sticky top-4 bg-white">
            <div className="text-2xl font-bold">
              {formatCurrency(currentPrice)}
            </div>
            <div className="text-sm text-gray-600">
              <span className="text-blue-600">FREE delivery</span> <span className="font-bold">Monday, June 12</span>. Order within <span className="text-green-600">2 hrs 10 mins</span>.
            </div>
            <div className="text-lg text-green-700 font-medium">
              In Stock
            </div>

            <div className="space-y-3 pt-2">
              <QtySelector qty={qty} setQty={setQty} />

              <Button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black rounded-full font-medium" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button className="w-full bg-orange-400 hover:bg-orange-500 text-black rounded-full font-medium" onClick={handleBuyNow}>
                Buy Now
              </Button>
            </div>

            <div className="text-xs text-gray-500 pt-2 space-y-1">
              <div className="flex gap-2">
                <span className="w-20 text-gray-500">Ships from</span>
                <span className="text-gray-900">Amazon</span>
              </div>
              <div className="flex gap-2">
                <span className="w-20 text-gray-500">Sold by</span>
                <span className="text-blue-600 hover:underline cursor-pointer">Appario Retail Private Ltd</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="border-t mt-12 pt-8">
          <h2 className="text-2xl font-bold mb-6">Customers who viewed this item also viewed</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {related.map(p => <ProductCard key={p._id || p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function QtySelector({ qty, setQty }: { qty: number, setQty: (n: number) => void }) {
  return (
    <div className="flex items-center gap-2 border rounded-md bg-gray-50 px-2 py-1 w-fit shadow-sm">
      <span className="text-xs text-gray-600 font-medium">Qty:</span>
      <select
        value={qty}
        onChange={(e) => setQty(Number(e.target.value))}
        className="bg-transparent text-sm font-medium focus:outline-none"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </div>
  )
}
