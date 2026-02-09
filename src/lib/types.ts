export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'ADMIN';
}

export interface Product {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  actualPriceCents: number;
  discountPriceCents: number;
  mainCategory: string;
  subCategory: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isFeatured?: boolean;
}

export interface CartItem {
  productId: string;
  qty: number;
  product?: Product; // Populated sometimes
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
}
