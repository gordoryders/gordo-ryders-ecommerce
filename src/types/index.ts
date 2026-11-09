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
  badge_color?: "orange" | "red" | "emerald" | "purple" | "blue";
  rating?: number;
  reviews_count?: number;
  images: string[];
  specs?: { label: string; value: string }[];
  is_featured: boolean;
  is_active: boolean;
  is_new_arrival?: boolean;
  is_limited_edition?: boolean;
  stock?: number;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor?: string;
  quantity: number;
}

export interface LookbookAlbum {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  tag: string;
  coverImage: string;
  images: string[];
  description: string;
  productSlugs: string[];
}

export interface Order {
  id: string;
  guideNumber: string;
  carrier: "Inter Rapidísimo" | "Servientrega" | "Envia" | "Coordinadora";
  customerName: string;
  customerPhone: string;
  city: string;
  total: number;
  itemsCount: number;
  status: "empacado" | "recolectado" | "en_transito" | "en_reparto" | "entregado";
  date: string;
  productsSummary: string;
}

export interface AdminMetrics {
  totalViews: number;
  whatsappClicks: number;
  wholesaleInquiries: number;
  simulatedRevenue: number;
  activeOrders: number;
}
