export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size?: string;
  color?: string;
  stock: number;
}

export interface Product {
  id: string;
  category_id?: string;
  category_name?: string;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  price_retail: number;
  price_original?: number;
  price_wholesale?: number;
  badge?: string;
  rating?: number;
  reviews_count?: number;
  images: string[];
  is_featured: boolean;
  is_active: boolean;
  stock?: number;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}
