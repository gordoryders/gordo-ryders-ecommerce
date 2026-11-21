"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, CartItem, Order, LookbookAlbum, CustomerUser, WholesaleInquiry, StoreSettings, HeroBanner, Invoice, Category, ProductCombo, SupportChatSession, ChatMessage } from "@/types";
import { PRODUCTS, LOOKBOOK_ALBUMS } from "@/data/products";
import { supabase, isSupabaseConfigured, signInWithGoogle, signOutUser } from "@/lib/supabaseClient";

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: "cat-cascos",
    name: "Cascos",
    slug: "cascos",
    description: "Cascos integrales, abatibles y cross homologados ECE 22.06 y DOT",
    icon: "Shield",
  },
  {
    id: "cat-guantes",
    name: "Guantes",
    slug: "guantes",
    description: "Guantes de protección urbana y pista con tecnología touch screen",
    icon: "Hand",
  },
  {
    id: "cat-impermeables",
    name: "Impermeables",
    slug: "impermeables",
    description: "Trajes 100% siliconados termosellados de alta resistencia",
    icon: "CloudRain",
  },
  {
    id: "cat-protecciones",
    name: "Protecciones",
    slug: "protecciones",
    description: "Rodilleras, coderas articuladas de acero y petos",
    icon: "ShieldCheck",
  },
  {
    id: "cat-chaquetas",
    name: "Chaquetas",
    slug: "chaquetas",
    description: "Chaquetas térmicas y de protección con insertos CE Nivel 2",
    icon: "Flame",
  },
  {
    id: "cat-accesorios",
    name: "Accesorios",
    slug: "accesorios",
    description: "Soportes portacelular antivibración CNC, candados y sliders",
    icon: "Smartphone",
  },
];

const DEFAULT_COMBOS: ProductCombo[] = [
  {
    id: "combo-1",
    name: "Combo Rutero ICH 3110 + Guantes Proviker",
    slug: "combo-rutero-ich-3110",
    tag: "COMBO RUTERO ICH 3110",
    badgeColor: "orange",
    description: "Casco Abatible ICH 3110 Doble Visor Top Speed DOT + Guantes Proviker Ref E44 Touch Screen + Soporte CNC Antivibración.",
    productIds: ["ich-3110-ts", "proviker-e44", "soporte-cnc"],
    originalPrice: 399900,
    price: 349000,
    savingsAmount: 50900,
    image: "/products/cascos/ich-3110-top-speed.jpg",
    isActive: true,
  },
  {
    id: "combo-2",
    name: "Pack Ciudad Scooter: Casco ICH 501 + Soporte CNC",
    slug: "pack-ciudad-scooter-ich-501",
    tag: "AHORRA $31.000 COP",
    badgeColor: "emerald",
    description: "Casco Abierto Urbano ICH 501 Jet Beige Vintage con visor anti-scratch + Soporte CNC Antivibración de Smartphone.",
    productIds: ["ich-501-beige", "soporte-cnc"],
    originalPrice: 220000,
    price: 189000,
    savingsAmount: 31000,
    image: "/products/cascos/ich-501-beige.jpg",
    isActive: true,
  },
  {
    id: "combo-3",
    name: "Combo Viajero Extremo: Casco ICH 3110 + Impermeable",
    slug: "combo-viajero-ich-3110",
    tag: "EDICIÓN VIAJERA",
    badgeColor: "red",
    description: "Casco Abatible ICH 3110 Racing Naranja Neón Sport + Impermeable Enterizo Siliconado con Tula Hermética.",
    productIds: ["ich-3110-ktm", "imp-siliconado"],
    originalPrice: 368900,
    price: 329000,
    savingsAmount: 39900,
    image: "/products/cascos/ich-3110-ktm-orange.jpg",
    isActive: true,
  },
];

const DEFAULT_BANNERS: HeroBanner[] = [
  {
    id: "banner-1",
    tag: "NUEVO INGRESO • EDICIÓN TOP SPEED 2026",
    title: "CASCOS ABATIBLES ICH 3110",
    highlight: "DOBLE VISOR HOMOLOGADO",
    subtitle: "Mentonera modular con accionamiento de un solo toque y gafas solares internas retráctiles. Certificación estadounidense DOT FMVSS 218 y NTC 4533 para rodar seguro por toda Colombia.",
    buttonText: "VER CASCOS ABATIBLES",
    buttonLink: "/categoria/cascos",
    secondaryText: "Cotizar por WhatsApp",
    secondaryLink: "https://wa.me/573000000000?text=Hola,%20quiero%20cotizar%20el%20Casco%20Abatible%20ICH%203110%20Doble%20Visor",
    bgImage: "/products/cascos/ich-3110-top-speed.jpg",
    accentColor: "from-orange-500 via-amber-400 to-yellow-400",
    isActive: true,
  },
  {
    id: "banner-2",
    tag: "TEMPORADA DE LLUVIAS • 100% SILICONADO",
    title: "TRAJES IMPERMEABLES DE ALTO RENDIMIENTO",
    highlight: "CERO FILTRACIONES GARANTIZADO",
    subtitle: "Costuras termoselladas reforzadas en entrepierna, cremallera hermética con solapa y reflectivos 3M de alta visibilidad nocturna. Incluye zapatones y tula compacta para viaje.",
    buttonText: "VER TRAJES IMPERMEABLES",
    buttonLink: "/categoria/impermeables",
    secondaryText: "Pedir por WhatsApp",
    secondaryLink: "https://wa.me/573000000000?text=Hola,%20quiero%20pedir%20el%20traje%20impermeable%20siliconado",
    bgImage: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1920&q=80",
    accentColor: "from-cyan-400 via-blue-500 to-teal-300",
    isActive: true,
  },
  {
    id: "banner-3",
    tag: "PROTECCIÓN CERTIFICADA • TOUCH SCREEN ACTIVO",
    title: "GUANTES URBANOS PROVIKER REF E44",
    highlight: "MÁXIMO AGARRE & NUDILLOS RÍGIDOS",
    subtitle: "Protecciones ergonómicas contra impacto, palma antiderrapante con absorción de vibración y tecnología táctil capacitiva para operar tu smartphone o GPS en marcha.",
    buttonText: "VER GUANTES PROVIKER",
    buttonLink: "/categoria/guantes",
    secondaryText: "Elegir mi Talla",
    secondaryLink: "https://wa.me/573000000000?text=Hola,%20quiero%20asesoría%20de%20tallas%20para%20los%20Guantes%20Proviker%20E44",
    bgImage: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1920&q=80",
    accentColor: "from-emerald-400 via-green-400 to-lime-300",
    isActive: true,
  },
  {
    id: "banner-4",
    tag: "VENTA AL POR MAYOR • DISTRIBUIDORES COLOMBIA",
    title: "PRECIOS DE BODEGA AL POR MAYOR",
    highlight: "DESDE 6 UNIDADES • HASTA 40% MARGEN",
    subtitle: "Suministro directo de fábrica con más de 300 referencias listas para despacho nacional. Cascos ICH por docena y guantes Proviker con rentabilidad garantizada.",
    buttonText: "PORTAL MAYORISTAS B2B",
    buttonLink: "/mayoristas",
    secondaryText: "Descargar Catálogo PDF",
    secondaryLink: "https://wa.me/573000000000?text=Hola%20Gordo%20Ryders,%20deseo%20el%20catálogo%20mayorista%20B2B",
    bgImage: "/products/cascos/ich-3110-ktm-orange.jpg",
    accentColor: "from-yellow-400 via-amber-300 to-orange-400",
    isActive: true,
  },
];

const DEFAULT_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "FACT-GR-2026-40291",
    orderId: "ord-gr-1024",
    date: "Hoy, 08:30 AM",
    customerName: "Michael Tovar",
    customerNitOrCedula: "1.020.849.201",
    customerPhone: "3161492880",
    customerEmail: "tobarmichael212@gmail.com",
    customerCity: "Bogotá D.C., Cundinamarca",
    customerAddress: "Carrera 7 # 72-41, Chapinero",
    carrier: "Inter Rapidísimo",
    guideNumber: "INT-7029410",
    items: [
      {
        productName: "Casco Abatible ICH 3110 Doble Visor Top Speed DOT",
        sku: "ICH-3110-TS",
        size: "L",
        quantity: 1,
        unitPrice: 249900,
        subtotal: 249900,
      },
    ],
    subtotal: 249900,
    shippingCost: 0,
    tax: 0,
    total: 249900,
    paymentMethod: "Wompi (Bancolombia)",
    paymentStatus: "pagado",
  },
  {
    id: "inv-2",
    invoiceNumber: "FACT-GR-2026-40292",
    orderId: "ord-gr-1025",
    date: "Hoy, 10:45 AM",
    customerName: "Michael Tovar",
    customerNitOrCedula: "1.020.849.201",
    customerPhone: "3161492880",
    customerEmail: "tobarmichael212@gmail.com",
    customerCity: "Bogotá D.C., Cundinamarca",
    customerAddress: "Carrera 7 # 72-41, Chapinero",
    carrier: "Inter Rapidísimo",
    guideNumber: "INT-7491028",
    items: [
      {
        productName: "Guantes Urbanos Proviker Ref E44",
        sku: "G-PROV-E44",
        size: "M",
        quantity: 2,
        unitPrice: 85000,
        subtotal: 170000,
      },
    ],
    subtotal: 170000,
    shippingCost: 0,
    tax: 0,
    total: 170000,
    paymentMethod: "Wompi (Bancolombia)",
    paymentStatus: "pagado",
  },

];

const DEFAULT_USERS: CustomerUser[] = [
  {
    id: "usr-michael",
    name: "Michael Tovar",
    email: "tobarmichael212@gmail.com",
    phone: "3161492880",
    city: "Bogotá D.C.",
    department: "Cundinamarca",
    documentType: "CC",
    cedulaOrNit: "1.020.849.201",
    address: "Carrera 7 # 72-41",
    neighborhood: "Chapinero",
    deliveryNotes: "Edificio Torre Central, Apto 502 (Dejar en portería)",
    type: "detal",
    authProvider: "Google Workspace",
    ordersCount: 2,
    totalSpent: 419900,
    registrationDate: "Hoy",
    status: "activo",
    notes: "Usuario oficial registrado. Comprador frecuente verificado.",
    recentOrders: ["ord-gr-1024", "ord-gr-1025"],
  },

];

const DEFAULT_WHOLESALE_INQUIRIES: WholesaleInquiry[] = [];

const DEFAULT_SETTINGS: StoreSettings = {
  whatsappSales: "+57 300 000 0000",
  whatsappWholesale: "+57 310 000 0000",
  instagramHandle: "@gordoryders.co",
  instagramUrl: "https://instagram.com/gordoryders.co",
  facebookUrl: "https://facebook.com/gordoryders",
  tiktokUrl: "https://tiktok.com/@gordoryders",
  youtubeUrl: "https://youtube.com/@gordoryders",
  email: "contacto@gordoryders.com",
  address: "Sector comercial de repuestos y accesorios moteros, Bogotá D.C.",
  city: "Bogotá D.C.",
  schedule: "Lunes a Sábado: 8:00 AM - 6:30 PM (Jornada continua)",
  mapsUrl: "https://maps.google.com/?q=Bogota+Gordo+Ryders",
};

export function getAutoOrderStatus(order: Order): "empacado" | "recolectado" | "en_transito" | "en_reparto" | "entregado" | "cancelado" {
  if (order.status === "cancelado") return "cancelado";
  if (order.isManualStatus) return order.status;

  const now = Date.now();
  const created = order.createdAtTimestamp || (now - 1000 * 60 * 60 * 6);
  const elapsedHours = (now - created) / (1000 * 60 * 60);

  if (elapsedHours < 2) return "empacado";
  if (elapsedHours < 8) return "recolectado";
  if (elapsedHours < 24) return "en_transito";
  if (elapsedHours < 48) return "en_reparto";
  return "entregado";
}

const DEFAULT_ORDERS: Order[] = [
  {
    id: "ord-gr-1024",
    invoiceNumber: "FACT-GR-2026-40291",
    guideNumber: "INT-7029410",
    carrier: "Inter Rapidísimo",
    customerName: "Michael Tovar",
    customerEmail: "tobarmichael212@gmail.com",
    customerPhone: "3161492880",
    customerCedulaOrNit: "1.020.849.201",
    customerAddress: "Carrera 7 # 72-41 - Chapinero",
    city: "Bogotá D.C., Cundinamarca",
    total: 249900,
    itemsCount: 1,
    status: "en_reparto",
    date: "Hoy, 08:30 AM",
    productsSummary: "1x Casco Abatible ICH 3110 Doble Visor Top Speed (Talla L)",
    paymentMethod: "Wompi (Bancolombia)",
    paymentStatus: "pagado",
    createdAtTimestamp: Date.now() - 1000 * 60 * 60 * 28,
  },
  {
    id: "ord-gr-1025",
    invoiceNumber: "FACT-GR-2026-40292",
    guideNumber: "INT-7491028",
    carrier: "Inter Rapidísimo",
    customerName: "Michael Tovar",
    customerEmail: "tobarmichael212@gmail.com",
    customerPhone: "3161492880",
    customerCedulaOrNit: "1.020.849.201",
    customerAddress: "Carrera 7 # 72-41 - Chapinero",
    city: "Bogotá D.C., Cundinamarca",
    total: 170000,
    itemsCount: 2,
    status: "empacado",
    date: "Hoy, 10:45 AM",
    productsSummary: "2x Guantes Urbanos Proviker Ref E44 (Talla M)",
    paymentMethod: "Wompi (Bancolombia)",
    paymentStatus: "pagado",
    createdAtTimestamp: Date.now() - 1000 * 60 * 45,
  },

];

const DEFAULT_SUPPORT_CHATS: SupportChatSession[] = [];

interface StoreContextType {
  // Cart
  cartItems: CartItem[];
  addToCart: (product: Product, size?: string, color?: string, quantity?: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  removeItem: (index: number) => void;
  clearCart: () => void;
  totalCartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // City & Modals
  userCity: string;
  setUserCity: (city: string) => void;
  isLocationOpen: boolean;
  setIsLocationOpen: (open: boolean) => void;
  isTrackingOpen: boolean;
  setIsTrackingOpen: (open: boolean) => void;
  isContactOpen: boolean;
  setIsContactOpen: (open: boolean) => void;

  // Products (Admin Synced)
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Albums (Lookbooks)
  albums: LookbookAlbum[];
  addAlbum: (album: LookbookAlbum) => void;
  updateAlbum: (album: LookbookAlbum) => void;
  deleteAlbum: (id: string) => void;

  // Orders & Tracking (Admin Synced)
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (id: string) => void;
  getOrderByGuide: (guide: string) => Order | undefined;
  createManualOrder: (orderData: Partial<Order>) => Order;

  // Users & Customers (Admin Synced)
  users: CustomerUser[];
  addUser: (user: CustomerUser) => void;
  updateUser: (user: CustomerUser) => void;
  deleteUser: (id: string) => void;
  banUser: (userId: string, reason?: string) => void;
  unbanUser: (userId: string) => void;

  // Wholesale B2B Inquiries (Admin Synced)
  wholesaleInquiries: WholesaleInquiry[];
  addWholesaleInquiry: (inquiry: WholesaleInquiry) => void;
  updateWholesaleInquiry: (inquiry: WholesaleInquiry) => void;
  deleteWholesaleInquiry: (id: string) => void;

  // Store Settings & Socials (Admin Synced)
  settings: StoreSettings;
  updateSettings: (settings: StoreSettings) => void;

  // Hero Banners / Slider Announcements (Admin Synced)
  banners: HeroBanner[];
  addBanner: (banner: HeroBanner) => void;
  updateBanner: (banner: HeroBanner) => void;
  deleteBanner: (id: string) => void;

  // Categories (Admin Synced)
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;

  // Combos & Packs (Admin Synced)
  combos: ProductCombo[];
  addCombo: (combo: ProductCombo) => void;
  updateCombo: (combo: ProductCombo) => void;
  deleteCombo: (id: string) => void;

  // Product Offers Helper
  setProductOffer: (
    productId: string,
    offer: {
      isActive: boolean;
      price: number;
      durationType: "permanent" | "hours" | "days";
      durationValue?: number;
      expiresAt?: string;
      badgeText?: string;
    }
  ) => void;

  // Invoices & Official Bills (Admin Synced)
  invoices: Invoice[];
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceByNumber: (invoiceNumber: string) => Invoice | undefined;

  // Auth & Customer Profile (Mercado Libre Style)
  currentUser: CustomerUser | null;
  setCurrentUser: (user: CustomerUser | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, name?: string) => Promise<void>;
  updateUserProfile: (profileData: Partial<CustomerUser>) => void;
  logout: () => void;

  // B2B Wholesale Functions
  requestWholesaleAccount: (data: {
    businessName: string;
    businessType: "almacen_repuestos" | "taller_motos" | "tienda_accesorios" | "concesionario" | "distribuidor_digital";
    nitOrRut?: string;
    city: string;
    phone: string;
    addressOrSocial: string;
  }) => void;
  approveWholesaleUser: (userId: string) => void;
  rejectWholesaleUser: (userId: string) => void;

  // Analytics
  whatsappClicks: number;
  trackWhatsAppClick: (label?: string) => void;
  productViews: number;
  trackProductView: () => void;

  // Live Chat Support & Inbox (WhatsApp Web / Stake Support Style)
  supportChats: SupportChatSession[];
  activeChatSessionId: string | null;
  setActiveChatSessionId: (id: string | null) => void;
  sendMessageFromUser: (
    chatId: string,
    text: string,
    senderName?: string,
    customerInfo?: Partial<SupportChatSession>,
    productCard?: any,
    orderCard?: any
  ) => void;
  sendMessageFromBot: (
    chatId: string,
    text: string,
    botName?: string,
    customerInfo?: Partial<SupportChatSession>,
    productCard?: any,
    orderCard?: any,
    options?: { label: string; action: string; payload?: any }[]
  ) => void;
  sendMessageFromAgent: (chatId: string, text: string, agentName?: string) => void;
  markChatStatus: (chatId: string, status: "bot" | "needs_human" | "agent_replying" | "resolved") => void;
  requestHumanAgent: (chatId: string) => void;
  deleteChatSession: (chatId: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userCity, setUserCity] = useState("Bogotá D.C.");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Auth & Profile Modals & State
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Dynamic admin synced products
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [albums, setAlbums] = useState<LookbookAlbum[]>(LOOKBOOK_ALBUMS);
  const [orders, setOrders] = useState<Order[]>(DEFAULT_ORDERS);
  const [users, setUsers] = useState<CustomerUser[]>(DEFAULT_USERS);
  const [wholesaleInquiries, setWholesaleInquiries] = useState<WholesaleInquiry[]>(DEFAULT_WHOLESALE_INQUIRIES);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [banners, setBanners] = useState<HeroBanner[]>(DEFAULT_BANNERS);
  const [invoices, setInvoices] = useState<Invoice[]>(DEFAULT_INVOICES);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [combos, setCombos] = useState<ProductCombo[]>(DEFAULT_COMBOS);
  const [whatsappClicks, setWhatsappClicks] = useState<number>(38);
  const [productViews, setProductViews] = useState<number>(342);
  const [supportChats, setSupportChats] = useState<SupportChatSession[]>(DEFAULT_SUPPORT_CHATS);
  const [activeChatSessionId, setActiveChatSessionId] = useState<string | null>(null);

  // Client-side initialization from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("gr_cart");
      if (savedCart) setCartItems(JSON.parse(savedCart));

      const savedCity = localStorage.getItem("gr_user_city");
      if (savedCity) setUserCity(savedCity);

      const CATALOG_VERSION = "2026_real_ich_v6";
      const savedVersion = localStorage.getItem("gr_catalog_version");

      if (savedVersion !== CATALOG_VERSION) {
        setProducts(PRODUCTS);
        setCombos(DEFAULT_COMBOS);
        setBanners(DEFAULT_BANNERS);
        setAlbums(LOOKBOOK_ALBUMS);
        localStorage.setItem("gr_admin_products", JSON.stringify(PRODUCTS));
        localStorage.setItem("gr_admin_combos", JSON.stringify(DEFAULT_COMBOS));
        localStorage.setItem("gr_admin_banners", JSON.stringify(DEFAULT_BANNERS));
        localStorage.setItem("gr_admin_albums", JSON.stringify(LOOKBOOK_ALBUMS));
        localStorage.setItem("gr_catalog_version", CATALOG_VERSION);
      } else {
        const savedProducts = localStorage.getItem("gr_admin_products");
        if (savedProducts) setProducts(JSON.parse(savedProducts));

        const savedAlbums = localStorage.getItem("gr_admin_albums");
        if (savedAlbums) setAlbums(JSON.parse(savedAlbums));

        const savedBanners = localStorage.getItem("gr_admin_banners");
        if (savedBanners) setBanners(JSON.parse(savedBanners));

        const savedCombos = localStorage.getItem("gr_admin_combos");
        if (savedCombos) setCombos(JSON.parse(savedCombos));
      }

      const savedOrders = localStorage.getItem("gr_admin_orders");
      if (savedOrders) {
        try {
          const parsedOrders: Order[] = JSON.parse(savedOrders);
          // Purge mock orders
          const realOrders = parsedOrders.filter(o => 
            !o.customerName?.includes("Diamante") &&
            !o.customerEmail?.includes("motoseldiamante") &&
            o.customerName !== "Carlos Mendoza" &&
            o.customerName !== "Alejandro Gómez"
          );
          const finalOrders = realOrders.length > 0 ? realOrders : DEFAULT_ORDERS;
          setOrders(finalOrders);
          localStorage.setItem("gr_admin_orders", JSON.stringify(finalOrders));
        } catch {
          setOrders(DEFAULT_ORDERS);
        }
      } else {
        setOrders(DEFAULT_ORDERS);
      }

      const savedUsers = localStorage.getItem("gr_admin_users");
      if (savedUsers) {
        try {
          const parsedUsers: CustomerUser[] = JSON.parse(savedUsers);
          // Purge any fake users
          const cleanUsers = parsedUsers.filter(u => 
            !u.name?.includes("Diamante") &&
            !u.email?.includes("motoseldiamante") &&
            u.name !== "Carlos Mario Restrepo" && 
            u.name !== "Paola Andrea Parada" &&
            u.name !== "Alejandro Gómez"
          );
          const hasMichael = cleanUsers.some((u) => u.email?.toLowerCase() === "tobarmichael212@gmail.com");
          const finalUsers = hasMichael ? cleanUsers : [DEFAULT_USERS[0], ...cleanUsers];
          setUsers(finalUsers);
          localStorage.setItem("gr_admin_users", JSON.stringify(finalUsers));
        } catch {
          setUsers(DEFAULT_USERS);
        }
      } else {
        setUsers(DEFAULT_USERS);
      }

      const savedWholesale = localStorage.getItem("gr_admin_wholesale");
      if (savedWholesale) {
        try {
          const parsedW = JSON.parse(savedWholesale);
          const cleanW = parsedW.filter((w: any) => 
            !w.businessName?.includes("Valle") && 
            !w.businessName?.includes("La 33") && 
            !w.businessName?.includes("Mundo Motero")
          );
          setWholesaleInquiries(cleanW);
          localStorage.setItem("gr_admin_wholesale", JSON.stringify(cleanW));
        } catch {}
      }

      const savedSettings = localStorage.getItem("gr_admin_settings");
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedInvoices = localStorage.getItem("gr_admin_invoices");
      if (savedInvoices) {
        try {
          const parsedInvoices: Invoice[] = JSON.parse(savedInvoices);
          const cleanInvoices = parsedInvoices.filter(inv => 
            !inv.customerName?.includes("Diamante") &&
            !inv.customerEmail?.includes("motoseldiamante") &&
            inv.customerName !== "Carlos Mario Restrepo" &&
            inv.customerName !== "Alejandro Gómez"
          );
          const finalInvoices = cleanInvoices.length > 0 ? cleanInvoices : DEFAULT_INVOICES;
          setInvoices(finalInvoices);
          localStorage.setItem("gr_admin_invoices", JSON.stringify(finalInvoices));
        } catch {
          setInvoices(DEFAULT_INVOICES);
        }
      } else {
        setInvoices(DEFAULT_INVOICES);
      }

      const savedCategories = localStorage.getItem("gr_admin_categories");
      if (savedCategories) setCategories(JSON.parse(savedCategories));

      const savedCombos = localStorage.getItem("gr_admin_combos");
      if (savedCombos) setCombos(JSON.parse(savedCombos));

      const savedClicks = localStorage.getItem("gr_wa_clicks");
      if (savedClicks) setWhatsappClicks(Number(savedClicks));

      const savedViews = localStorage.getItem("gr_views");
      if (savedViews) setProductViews(Number(savedViews));

      const savedUser = localStorage.getItem("gr_current_user");
      if (savedUser) setCurrentUser(JSON.parse(savedUser));

      const savedChats = localStorage.getItem("gr_support_chats");
      if (savedChats) {
        setSupportChats(JSON.parse(savedChats));
      } else {
        localStorage.setItem("gr_support_chats", JSON.stringify(DEFAULT_SUPPORT_CHATS));
      }
    } catch {
      // ignore
    }

    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const u = session.user;
          const mapped: CustomerUser = {
            id: u.id,
            name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0] || "Motero Gordo Ryders",
            email: u.email || "",
            phone: u.user_metadata?.phone || "",
            city: u.user_metadata?.city || "Bogotá D.C.",
            department: u.user_metadata?.department || "Cundinamarca",
            type: "detal",
            authProvider: "Google Workspace",
            avatarUrl: u.user_metadata?.avatar_url || u.user_metadata?.picture || undefined,
            ordersCount: 0,
            totalSpent: 0,
            registrationDate: "Hoy",
            status: "verificado",
          };
          setCurrentUser((prev) => (prev ? { ...mapped, ...prev } : mapped));
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          const u = session.user;
          const mapped: CustomerUser = {
            id: u.id,
            name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0] || "Motero Gordo Ryders",
            email: u.email || "",
            phone: u.user_metadata?.phone || "",
            city: u.user_metadata?.city || "Bogotá D.C.",
            department: u.user_metadata?.department || "Cundinamarca",
            type: "detal",
            authProvider: "Google Workspace",
            avatarUrl: u.user_metadata?.avatar_url || u.user_metadata?.picture || undefined,
            ordersCount: 0,
            totalSpent: 0,
            registrationDate: "Hoy",
            status: "verificado",
          };
          setCurrentUser((prev) => {
            const finalUser = prev ? { ...mapped, ...prev } : mapped;
            try {
              localStorage.setItem("gr_current_user", JSON.stringify(finalUser));
            } catch {}
            return finalUser;
          });
        } else if (event === "SIGNED_OUT") {
          setCurrentUser(null);
          try {
            localStorage.removeItem("gr_current_user");
          } catch {}
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  // Cross-tab live support chat sync
  useEffect(() => {
    const handleStorageUpdate = (e: StorageEvent) => {
      if (e.key === "gr_support_chats" && e.newValue) {
        try {
          setSupportChats(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorageUpdate);
    return () => window.removeEventListener("storage", handleStorageUpdate);
  }, []);

  // Sync Cart
  useEffect(() => {
    try {
      localStorage.setItem("gr_cart", JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const handleSetUserCity = (city: string) => {
    setUserCity(city);
    try {
      localStorage.setItem("gr_user_city", city);
    } catch {
      // ignore
    }
  };

  const addToCart = (
    product: Product,
    size: string = "M",
    color: string = "Negro Mate",
    quantity: number = 1
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      }

      return [
        ...prev,
        {
          product,
          selectedSize: size,
          selectedColor: color,
          quantity,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (index: number, quantity: number) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const copy = [...prev];
      copy[index].quantity = quantity;
      return copy;
    });
  };

  const removeItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Product Admin Operations
  const addProduct = (newProduct: Product) => {
    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      try {
        localStorage.setItem("gr_admin_products", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
      try {
        localStorage.setItem("gr_admin_products", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem("gr_admin_products", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Albums Lookbook Operations
  const addAlbum = (newAlbum: LookbookAlbum) => {
    setAlbums((prev) => {
      const updated = [newAlbum, ...prev];
      try {
        localStorage.setItem("gr_admin_albums", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateAlbum = (updatedAlbum: LookbookAlbum) => {
    setAlbums((prev) => {
      const updated = prev.map((a) => (a.id === updatedAlbum.id ? updatedAlbum : a));
      try {
        localStorage.setItem("gr_admin_albums", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteAlbum = (id: string) => {
    setAlbums((prev) => {
      const updated = prev.filter((a) => a.id !== id);
      try {
        localStorage.setItem("gr_admin_albums", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Orders Admin Operations
  const addOrder = (newOrder: Order) => {
    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      try {
        localStorage.setItem("gr_admin_orders", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateOrder = (updatedOrder: Order) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
      try {
        localStorage.setItem("gr_admin_orders", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => {
      const updated = prev.filter((o) => o.id !== id);
      try {
        localStorage.setItem("gr_admin_orders", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const getOrderByGuide = (guide: string): Order | undefined => {
    const clean = guide.trim().toUpperCase();
    const found = orders.find((o) => o.guideNumber.toUpperCase() === clean || o.id.toUpperCase() === clean);
    if (!found) return undefined;
    return {
      ...found,
      status: getAutoOrderStatus(found),
    };
  };

  const createManualOrder = (orderData: Partial<Order>): Order => {
    const orderNumber = `ORD-GR-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceNumber = `FACT-GR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const autoGuide = `INT-${Math.floor(7000000 + Math.random() * 2000000)}`;
    const dateStr = new Intl.DateTimeFormat("es-CO", { dateStyle: "medium", timeStyle: "short" }).format(new Date());

    const newOrder: Order = {
      id: orderNumber.toLowerCase(),
      invoiceNumber: invoiceNumber,
      guideNumber: orderData.guideNumber || autoGuide,
      carrier: orderData.carrier || "Inter Rapidísimo",
      customerName: orderData.customerName || "Cliente Mostrador",
      customerEmail: orderData.customerEmail || "cliente@gordoryders.com",
      customerPhone: orderData.customerPhone || "3000000000",
      customerCedulaOrNit: orderData.customerCedulaOrNit || "1.000.000.000",
      customerAddress: orderData.customerAddress || "Entrega en Local / Mostrador",
      city: orderData.city || "Bogotá D.C., Cundinamarca",
      total: orderData.total || 0,
      itemsCount: orderData.itemsCount || 1,
      status: "empacado",
      date: dateStr,
      productsSummary: orderData.productsSummary || "Productos Venta Mostrador",
      paymentMethod: orderData.paymentMethod || "Wompi (Bancolombia)",
      paymentStatus: orderData.paymentStatus || "pagado",
      createdAtTimestamp: Date.now(),
    };

    addOrder(newOrder);

    // Also generate linked invoice
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invoiceNumber,
      orderId: orderNumber,
      date: dateStr,
      customerName: newOrder.customerName,
      customerNitOrCedula: newOrder.customerCedulaOrNit || "Consumidor Final",
      customerPhone: newOrder.customerPhone,
      customerEmail: newOrder.customerEmail || "cliente@gordoryders.com",
      customerCity: newOrder.city,
      customerAddress: newOrder.customerAddress,
      carrier: newOrder.carrier,
      guideNumber: newOrder.guideNumber,
      items: [
        {
          productName: newOrder.productsSummary,
          sku: "VENTA-MANUAL",
          quantity: newOrder.itemsCount,
          unitPrice: newOrder.total,
          subtotal: newOrder.total,
        },
      ],
      subtotal: newOrder.total,
      shippingCost: 0,
      tax: 0,
      total: newOrder.total,
      paymentMethod: newOrder.paymentMethod as any,
      paymentStatus: newOrder.paymentStatus === "pagado" ? "pagado" : "pendiente",
    };
    addInvoice(newInvoice);

    return newOrder;
  };

  // Users Operations
  const addUser = (newUser: CustomerUser) => {
    setUsers((prev) => {
      const updated = [newUser, ...prev];
      try {
        localStorage.setItem("gr_admin_users", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateUser = (updatedUser: CustomerUser) => {
    setUsers((prev) => {
      const updated = prev.map((u) => (u.id === updatedUser.id ? updatedUser : u));
      try {
        localStorage.setItem("gr_admin_users", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => {
      const updated = prev.filter((u) => u.id !== id);
      try {
        localStorage.setItem("gr_admin_users", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const banUser = (userId: string, reason: string = "Bloqueado por administración") => {
    setUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: "bloqueado" as const,
            notes: u.notes ? `${u.notes} | 🚫 BLOQUEADO: ${reason}` : `🚫 BLOQUEADO: ${reason}`,
          };
        }
        return u;
      });
      try {
        localStorage.setItem("gr_admin_users", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const unbanUser = (userId: string) => {
    setUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            status: "activo" as const,
          };
        }
        return u;
      });
      try {
        localStorage.setItem("gr_admin_users", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Wholesale Operations
  const addWholesaleInquiry = (inquiry: WholesaleInquiry) => {
    setWholesaleInquiries((prev) => {
      const updated = [inquiry, ...prev];
      try {
        localStorage.setItem("gr_admin_wholesale", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateWholesaleInquiry = (updated: WholesaleInquiry) => {
    setWholesaleInquiries((prev) => {
      const list = prev.map((item) => (item.id === updated.id ? updated : item));
      try {
        localStorage.setItem("gr_admin_wholesale", JSON.stringify(list));
      } catch {}
      return list;
    });
  };

  const deleteWholesaleInquiry = (id: string) => {
    setWholesaleInquiries((prev) => {
      const list = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem("gr_admin_wholesale", JSON.stringify(list));
      } catch {}
      return list;
    });
  };

  // Settings Operations
  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    try {
      localStorage.setItem("gr_admin_settings", JSON.stringify(newSettings));
    } catch {}
  };

  // Banners Operations
  const addBanner = (newBanner: HeroBanner) => {
    setBanners((prev) => {
      const updated = [newBanner, ...prev];
      try {
        localStorage.setItem("gr_admin_banners", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateBanner = (updatedBanner: HeroBanner) => {
    setBanners((prev) => {
      const updated = prev.map((b) => (b.id === updatedBanner.id ? updatedBanner : b));
      try {
        localStorage.setItem("gr_admin_banners", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteBanner = (id: string) => {
    setBanners((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      try {
        localStorage.setItem("gr_admin_banners", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Invoices Operations
  const addInvoice = (newInvoice: Invoice) => {
    setInvoices((prev) => {
      const updated = [newInvoice, ...prev];
      try {
        localStorage.setItem("gr_admin_invoices", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices((prev) => {
      const updated = prev.map((inv) => (inv.id === updatedInvoice.id ? updatedInvoice : inv));
      try {
        localStorage.setItem("gr_admin_invoices", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev) => {
      const updated = prev.filter((inv) => inv.id !== id);
      try {
        localStorage.setItem("gr_admin_invoices", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const getInvoiceByNumber = (num: string): Invoice | undefined => {
    const clean = num.trim().toUpperCase();
    return invoices.find((inv) => inv.invoiceNumber.toUpperCase() === clean);
  };

  // Categories Operations
  const addCategory = (newCat: Category) => {
    setCategories((prev) => {
      const updated = [...prev, newCat];
      try {
        localStorage.setItem("gr_admin_categories", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateCategory = (updatedCat: Category) => {
    setCategories((prev) => {
      const updated = prev.map((c) => (c.id === updatedCat.id ? updatedCat : c));
      try {
        localStorage.setItem("gr_admin_categories", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem("gr_admin_categories", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Combos Operations
  const addCombo = (newCombo: ProductCombo) => {
    setCombos((prev) => {
      const updated = [newCombo, ...prev];
      try {
        localStorage.setItem("gr_admin_combos", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const updateCombo = (updatedCombo: ProductCombo) => {
    setCombos((prev) => {
      const updated = prev.map((c) => (c.id === updatedCombo.id ? updatedCombo : c));
      try {
        localStorage.setItem("gr_admin_combos", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteCombo = (id: string) => {
    setCombos((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      try {
        localStorage.setItem("gr_admin_combos", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Product Offer Helper
  const setProductOffer = (
    productId: string,
    offer: {
      isActive: boolean;
      price: number;
      durationType: "permanent" | "hours" | "days";
      durationValue?: number;
      expiresAt?: string;
      badgeText?: string;
    }
  ) => {
    setProducts((prev) => {
      const updated = prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          offer_is_active: offer.isActive,
          offer_price: offer.price,
          offer_duration_type: offer.durationType,
          offer_duration_value: offer.durationValue,
          offer_expires_at: offer.expiresAt,
          offer_badge_text: offer.badgeText || (offer.isActive ? "OFERTA RELÁMPAGO" : undefined),
        };
      });
      try {
        localStorage.setItem("gr_admin_products", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  // Auth & Customer Profile (Mercado Libre Style)
  // Auth & Customer Profile (Mercado Libre Style) Operations
  const loginWithGoogle = async () => {
    if (isSupabaseConfigured()) {
      await signInWithGoogle();
      return;
    }
    // High-fidelity fallback / demo for immediate test
    const demoGoogleUser: CustomerUser = {
      id: `usr-google-${Date.now()}`,
      name: "Michael Ryder (Google)",
      email: "michael.motero@gmail.com",
      phone: "3124567890",
      city: "Bogotá D.C.",
      department: "Cundinamarca",
      documentType: "CC",
      cedulaOrNit: "1.020.849.201",
      address: "Carrera 7 # 72-41",
      neighborhood: "Chapinero Alto",
      deliveryNotes: "Edificio Torre Central, Apto 502 (Dejar en portería)",
      type: "detal",
      authProvider: "Google Workspace",
      avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      ordersCount: 2,
      totalSpent: 419900,
      registrationDate: "Hoy",
      status: "verificado",
      notes: "Cuenta verificada con Google OAuth 2.0",
    };
    setCurrentUser(demoGoogleUser);
    try {
      localStorage.setItem("gr_current_user", JSON.stringify(demoGoogleUser));
    } catch {}
    addUser(demoGoogleUser);
    setIsAuthModalOpen(false);
  };

  const loginWithEmail = async (email: string, name?: string) => {
    const userDisplayName = name?.trim() || email.split("@")[0] || "Motero Gordo Ryders";
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    const targetUser: CustomerUser = existing || {
      id: `usr-email-${Date.now()}`,
      name: userDisplayName,
      email: email,
      phone: "3000000000",
      city: userCity || "Bogotá D.C.",
      department: "Cundinamarca",
      documentType: "CC",
      cedulaOrNit: "",
      address: "",
      neighborhood: "",
      type: "detal",
      authProvider: "Correo / Magic Link",
      ordersCount: 0,
      totalSpent: 0,
      registrationDate: "Hoy",
      status: "activo",
      notes: "Registro rápido por correo",
    };
    setCurrentUser(targetUser);
    try {
      localStorage.setItem("gr_current_user", JSON.stringify(targetUser));
    } catch {}
    if (!existing) addUser(targetUser);
    setIsAuthModalOpen(false);
  };

  const updateUserProfile = (profileData: Partial<CustomerUser>) => {
    if (!currentUser) return;
    const updated: CustomerUser = { ...currentUser, ...profileData };
    setCurrentUser(updated);
    try {
      localStorage.setItem("gr_current_user", JSON.stringify(updated));
    } catch {}
    updateUser(updated);
  };

  const logout = () => {
    signOutUser();
    setCurrentUser(null);
    try {
      localStorage.removeItem("gr_current_user");
    } catch {}
    setIsProfileModalOpen(false);
  };

  // B2B Wholesale Functions
  const requestWholesaleAccount = (data: {
    businessName: string;
    businessType: "almacen_repuestos" | "taller_motos" | "tienda_accesorios" | "concesionario" | "distribuidor_digital";
    nitOrRut?: string;
    city: string;
    phone: string;
    addressOrSocial: string;
  }) => {
    if (!currentUser) return;
    const updatedUser: CustomerUser = {
      ...currentUser,
      b2bStatus: "pendiente",
      businessName: data.businessName,
      businessType: data.businessType,
      b2bNitOrRut: data.nitOrRut,
      city: data.city,
      phone: data.phone,
      b2bAddressOrSocial: data.addressOrSocial,
    };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem("gr_current_user", JSON.stringify(updatedUser));
    } catch {}
    updateUser(updatedUser);

    // Also register an inquiry in wholesale pipeline so Admin gets it immediately
    const newInquiry: WholesaleInquiry = {
      id: `wh-${Date.now()}`,
      businessName: data.businessName,
      contactName: currentUser.name,
      nitOrCedula: data.nitOrRut || currentUser.cedulaOrNit || "Pendiente",
      phone: data.phone,
      city: data.city,
      productsInterest: `Solicitud de Cuenta Distribuidor B2B (${data.businessType.replace("_", " ").toUpperCase()})`,
      estimatedUnits: 12,
      date: "Hoy, " + new Intl.DateTimeFormat("es-CO", { timeStyle: "short" }).format(new Date()),
      status: "nuevo",
      notes: `Almacén/Local: ${data.addressOrSocial}. Solicitó estatus de distribuidor B2B desde su perfil.`,
    };
    addWholesaleInquiry(newInquiry);
  };

  const approveWholesaleUser = (userId: string) => {
    const code = `GR-B2B-${Math.floor(100 + Math.random() * 900)}`;
    setUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            type: "mayorista" as const,
            b2bStatus: "aprobado" as const,
            b2bCode: code,
            b2bDiscountTier: 1 as const,
          };
        }
        return u;
      });
      try {
        localStorage.setItem("gr_admin_users", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (currentUser && currentUser.id === userId) {
      const updatedUser: CustomerUser = {
        ...currentUser,
        type: "mayorista",
        b2bStatus: "aprobado",
        b2bCode: code,
        b2bDiscountTier: 1,
      };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem("gr_current_user", JSON.stringify(updatedUser));
      } catch {}
    }
  };

  const rejectWholesaleUser = (userId: string) => {
    setUsers((prev) => {
      const updated = prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            b2bStatus: "rechazado" as const,
          };
        }
        return u;
      });
      try {
        localStorage.setItem("gr_admin_users", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (currentUser && currentUser.id === userId) {
      const updatedUser: CustomerUser = {
        ...currentUser,
        b2bStatus: "rechazado",
      };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem("gr_current_user", JSON.stringify(updatedUser));
      } catch {}
    }
  };

  // Analytics Operations
  const trackWhatsAppClick = () => {
    setWhatsappClicks((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem("gr_wa_clicks", String(next));
      } catch {}
      return next;
    });
  };

  const trackProductView = () => {
    setProductViews((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem("gr_views", String(next));
      } catch {}
      return next;
    });
  };

  // Support Chats Operations (WhatsApp Web / Stake Support Style)
  const sendMessageFromUser = (
    chatId: string,
    text: string,
    senderName: string = "Visitante",
    customerInfo?: Partial<SupportChatSession>,
    productCard?: any,
    orderCard?: any
  ) => {
    setSupportChats((prev) => {
      const timeNow = new Intl.DateTimeFormat("es-CO", { hour: "numeric", minute: "numeric", hour12: true }).format(new Date());
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sender: "user",
        senderName,
        text,
        timestamp: timeNow,
        productCard,
        orderCard,
      };

      const existingIndex = prev.findIndex((c) => c.id === chatId);
      let updated: SupportChatSession[];

      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        const updatedSession: SupportChatSession = {
          ...existing,
          customerName: customerInfo?.customerName || existing.customerName || senderName,
          customerEmail: customerInfo?.customerEmail || existing.customerEmail,
          customerPhone: customerInfo?.customerPhone || existing.customerPhone,
          customerCity: customerInfo?.customerCity || existing.customerCity,
          customerType: customerInfo?.customerType || existing.customerType,
          currentProductViewed: customerInfo?.currentProductViewed || existing.currentProductViewed,
          lastMessageText: text,
          lastMessageTime: `Hoy, ${timeNow}`,
          unreadCountForAdmin: existing.unreadCountForAdmin + 1,
          messages: [...existing.messages, newMsg],
        };
        updated = [updatedSession, ...prev.filter((_, idx) => idx !== existingIndex)];
      } else {
        const newSession: SupportChatSession = {
          id: chatId,
          customerName: customerInfo?.customerName || senderName,
          customerEmail: customerInfo?.customerEmail || "",
          customerPhone: customerInfo?.customerPhone || "",
          customerCity: customerInfo?.customerCity || userCity || "Colombia",
          customerType: customerInfo?.customerType || "detal",
          status: "bot",
          unreadCountForAdmin: 1,
          unreadCountForUser: 0,
          lastMessageText: text,
          lastMessageTime: `Hoy, ${timeNow}`,
          createdAt: `Hoy, ${timeNow}`,
          currentProductViewed: customerInfo?.currentProductViewed,
          messages: [newMsg],
        };
        updated = [newSession, ...prev];
      }

      try {
        localStorage.setItem("gr_support_chats", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const sendMessageFromBot = (
    chatId: string,
    text: string,
    botName: string = "Asistente Gordo Ryders",
    customerInfo?: Partial<SupportChatSession>,
    productCard?: any,
    orderCard?: any,
    options?: { label: string; action: string; payload?: any }[]
  ) => {
    setSupportChats((prev) => {
      const timeNow = new Intl.DateTimeFormat("es-CO", { hour: "numeric", minute: "numeric", hour12: true }).format(new Date());
      const newMsg: ChatMessage = {
        id: `msg-bot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sender: "bot",
        senderName: botName,
        text,
        timestamp: timeNow,
        productCard,
        orderCard,
        options,
      };

      const existingIndex = prev.findIndex((c) => c.id === chatId);
      let updated: SupportChatSession[];

      if (existingIndex >= 0) {
        const existing = prev[existingIndex];
        const updatedSession: SupportChatSession = {
          ...existing,
          customerName: customerInfo?.customerName || existing.customerName,
          customerEmail: customerInfo?.customerEmail || existing.customerEmail,
          customerPhone: customerInfo?.customerPhone || existing.customerPhone,
          customerCity: customerInfo?.customerCity || existing.customerCity,
          customerType: customerInfo?.customerType || existing.customerType,
          currentProductViewed: customerInfo?.currentProductViewed || existing.currentProductViewed,
          lastMessageText: text,
          lastMessageTime: `Hoy, ${timeNow}`,
          messages: [...existing.messages, newMsg],
        };
        updated = [updatedSession, ...prev.filter((_, idx) => idx !== existingIndex)];
      } else {
        const newSession: SupportChatSession = {
          id: chatId,
          customerName: customerInfo?.customerName || "Visitante Web",
          customerEmail: customerInfo?.customerEmail || "",
          customerPhone: customerInfo?.customerPhone || "",
          customerCity: customerInfo?.customerCity || userCity || "Colombia",
          customerType: customerInfo?.customerType || "detal",
          status: "bot",
          unreadCountForAdmin: 0,
          unreadCountForUser: 0,
          lastMessageText: text,
          lastMessageTime: `Hoy, ${timeNow}`,
          createdAt: `Hoy, ${timeNow}`,
          currentProductViewed: customerInfo?.currentProductViewed,
          messages: [newMsg],
        };
        updated = [newSession, ...prev];
      }

      try {
        localStorage.setItem("gr_support_chats", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const sendMessageFromAgent = (
    chatId: string,
    text: string,
    agentName: string = "Edwin Bernal (Asesor Oficial Gordo Ryders)"
  ) => {
    setSupportChats((prev) => {
      const timeNow = new Intl.DateTimeFormat("es-CO", { hour: "numeric", minute: "numeric", hour12: true }).format(new Date());
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        sender: "agent",
        senderName: agentName,
        text,
        timestamp: timeNow,
      };

      const existingIndex = prev.findIndex((c) => c.id === chatId);
      if (existingIndex === -1) return prev;

      const existing = prev[existingIndex];
      const updatedSession: SupportChatSession = {
        ...existing,
        status: "agent_replying",
        unreadCountForAdmin: 0,
        unreadCountForUser: existing.unreadCountForUser + 1,
        lastMessageText: text,
        lastMessageTime: `Hoy, ${timeNow}`,
        messages: [...existing.messages, newMsg],
      };

      const updated = [updatedSession, ...prev.filter((_, idx) => idx !== existingIndex)];
      try {
        localStorage.setItem("gr_support_chats", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const requestHumanAgent = (chatId: string) => {
    setSupportChats((prev) => {
      const timeNow = new Intl.DateTimeFormat("es-CO", { hour: "numeric", minute: "numeric", hour12: true }).format(new Date());
      const botTransferMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: "bot",
        text: "🔔 Solicitud enviada a Edwin y al equipo de soporte de Gordo Ryders en vivo. Por favor espera unos momentos, te responderemos en esta misma pantalla 🟢",
        timestamp: timeNow,
      };

      const updated = prev.map((c) => {
        if (c.id === chatId) {
          return {
            ...c,
            status: "needs_human" as const,
            unreadCountForAdmin: c.unreadCountForAdmin + 1,
            lastMessageText: "🔥 Requiere asesor humano en vivo",
            lastMessageTime: `Hoy, ${timeNow}`,
            messages: [...c.messages, botTransferMsg],
          };
        }
        return c;
      });

      try {
        localStorage.setItem("gr_support_chats", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const markChatStatus = (chatId: string, status: "bot" | "needs_human" | "agent_replying" | "resolved") => {
    setSupportChats((prev) => {
      const updated = prev.map((c) => (c.id === chatId ? { ...c, status, unreadCountForAdmin: 0 } : c));
      try {
        localStorage.setItem("gr_support_chats", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const deleteChatSession = (chatId: string) => {
    setSupportChats((prev) => {
      const updated = prev.filter((c) => c.id !== chatId);
      try {
        localStorage.setItem("gr_support_chats", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price_retail * item.quantity,
    0
  );

  return (
    <StoreContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        totalCartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        userCity,
        setUserCity: handleSetUserCity,
        isLocationOpen,
        setIsLocationOpen,
        isTrackingOpen,
        setIsTrackingOpen,
        isContactOpen,
        setIsContactOpen,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        albums,
        addAlbum,
        updateAlbum,
        deleteAlbum,
        orders,
        addOrder,
        updateOrder,
        deleteOrder,
        getOrderByGuide,
        createManualOrder,
        users,
        addUser,
        updateUser,
        deleteUser,
        banUser,
        unbanUser,
        currentUser,
        setCurrentUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        loginWithGoogle,
        loginWithEmail,
        updateUserProfile,
        logout,
        requestWholesaleAccount,
        approveWholesaleUser,
        rejectWholesaleUser,
        wholesaleInquiries,
        addWholesaleInquiry,
        updateWholesaleInquiry,
        deleteWholesaleInquiry,
        settings,
        updateSettings,
        banners,
        addBanner,
        updateBanner,
        deleteBanner,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        combos,
        addCombo,
        updateCombo,
        deleteCombo,
        setProductOffer,
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoiceByNumber,
        whatsappClicks,
        trackWhatsAppClick,
        productViews,
        trackProductView,
        supportChats,
        activeChatSessionId,
        setActiveChatSessionId,
        sendMessageFromUser,
        sendMessageFromBot,
        sendMessageFromAgent,
        markChatStatus,
        requestHumanAgent,
        deleteChatSession,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
