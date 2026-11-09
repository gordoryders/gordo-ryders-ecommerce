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

export interface HeroBanner {
  id: string;
  tag: string;
  title: string;
  highlight: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  secondaryText?: string;
  secondaryLink?: string;
  bgImage: string;
  accentColor?: string;
  isActive: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId?: string;
  date: string;
  customerName: string;
  customerNitOrCedula: string;
  customerPhone: string;
  customerEmail: string;
  customerCity: string;
  customerAddress?: string;
  carrier: string;
  guideNumber: string;
  items: {
    productName: string;
    sku: string;
    size?: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  paymentMethod: "Wompi (Bancolombia)" | "Mercado Pago" | "PSE / Nequi" | "Transferencia Directa";
  paymentStatus: "pagado" | "pendiente" | "anulado";
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  type: "detal" | "mayorista";
  authProvider?: "Google Workspace" | "Correo / Magic Link";
  avatarUrl?: string;
  ordersCount: number;
  totalSpent: number;
  registrationDate: string;
  status: "activo" | "verificado" | "bloqueado";
  notes?: string;
  recentOrders?: string[];
}

export interface WholesaleInquiry {
  id: string;
  businessName: string;
  contactName: string;
  nitOrCedula: string;
  phone: string;
  city: string;
  productsInterest: string;
  estimatedUnits: number;
  date: string;
  status: "nuevo" | "catalogo_enviado" | "en_negociacion" | "cerrado" | "descartado";
  notes?: string;
}

export interface StoreSettings {
  whatsappSales: string;
  whatsappWholesale: string;
  instagramHandle: string;
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  email: string;
  address: string;
  city: string;
  schedule: string;
  mapsUrl: string;
}

export interface AdminMetrics {
  totalViews: number;
  whatsappClicks: number;
  wholesaleInquiries: number;
  simulatedRevenue: number;
  activeOrders: number;
}
