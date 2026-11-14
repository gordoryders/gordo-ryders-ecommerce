"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, CartItem, Order, LookbookAlbum, CustomerUser, WholesaleInquiry, StoreSettings, HeroBanner, Invoice, Category, ProductCombo } from "@/types";
import { PRODUCTS, LOOKBOOK_ALBUMS } from "@/data/products";

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
    tag: "TENDENCIA SCOOTER & CIUDAD 2026",
    title: "LÍNEA URBANA ICH 501",
    highlight: "LILA, BEIGE & MATE",
    subtitle: "Cascos livianos semi-integrales con visor panorámico transparente anti-scratch. Confort, frescura y visibilidad óptima para rodar fresco en el tráfico diario.",
    buttonText: "EXPLORAR MODELOS URBANOS",
    buttonLink: "/categoria/cascos?sub=cascos-urbanos",
    secondaryText: "Ver Gama Pastel",
    secondaryLink: "/categoria/cascos?sub=cascos-urbanos",
    bgImage: "/products/cascos/ich-501-lila.jpg",
    accentColor: "from-purple-400 via-pink-400 to-orange-400",
    isActive: true,
  },
  {
    id: "banner-3",
    tag: "CANAL MAYORISTA B2B PARA ALMACENES Y TALLERES",
    title: "PRECIOS DE BODEGA",
    highlight: "DESDE 6 UNIDADES",
    subtitle: "Suministro directo de fábrica con más de 300 referencias listas para despacho nacional. Cascos ICH por docena y guantes Proviker con margen B2B garantizado.",
    buttonText: "SOLICITAR CATÁLOGO MAYORISTA",
    buttonLink: "https://wa.me/573000000000?text=Hola%20Gordo%20Ryders,%20deseo%20el%20catálogo%20mayorista%20de%20cascos%20ICH",
    bgImage: "/products/cascos/ich-3110-ktm-orange.jpg",
    accentColor: "from-emerald-400 via-teal-300 to-cyan-400",
    isActive: true,
  },
];

const DEFAULT_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "FACT-GR-2026-00124",
    orderId: "ord-1",
    date: "08 Nov 2026, 09:30 AM",
    customerName: "Carlos Mario Restrepo",
    customerNitOrCedula: "1.037.492.180",
    customerPhone: "3104567890",
    customerEmail: "carlos.mario@gmail.com",
    customerCity: "Medellín, Antioquia",
    customerAddress: "Calle 10 # 43E-20, El Poblado",
    carrier: "Inter Rapidísimo",
    guideNumber: "INT-7009482",
    items: [
      {
        productName: "Guantes Urbanos Proviker Ref E44",
        sku: "G-PROV-E44",
        size: "L",
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
  {
    id: "inv-2",
    invoiceNumber: "FACT-GR-2026-00125",
    orderId: "ord-2",
    date: "07 Nov 2026, 03:15 PM",
    customerName: "Alejandro Gómez",
    customerNitOrCedula: "14.892.301",
    customerPhone: "3158901234",
    customerEmail: "alejandro.gomez@gmail.com",
    customerCity: "Cali, Valle",
    customerAddress: "Avenida 6N # 24-18, Granada",
    carrier: "Servientrega",
    guideNumber: "SER-8849201",
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
    paymentMethod: "PSE / Nequi",
    paymentStatus: "pagado",
  },
  {
    id: "inv-3",
    invoiceNumber: "FACT-GR-2026-00126",
    orderId: "ord-3",
    date: "08 Nov 2026, 10:45 AM",
    customerName: "Almacén Motos El Diamante (B2B)",
    customerNitOrCedula: "900.849.201-4",
    customerPhone: "3209876543",
    customerEmail: "compras@motoseldiamante.com",
    customerCity: "Barranquilla, Atlántico",
    customerAddress: "Calle 30 # 41-15, Centro",
    carrier: "Envia",
    guideNumber: "ENV-4592018",
    items: [
      {
        productName: "Lote Mayorista 12x Guantes Proviker Ref E44",
        sku: "G-PROV-E44-B2B",
        size: "Surtido",
        quantity: 12,
        unitPrice: 55000,
        subtotal: 660000,
      },
    ],
    subtotal: 660000,
    shippingCost: 0,
    tax: 0,
    total: 660000,
    paymentMethod: "Transferencia Directa",
    paymentStatus: "pagado",
  },
];

const DEFAULT_USERS: CustomerUser[] = [
  {
    id: "usr-1",
    name: "Carlos Mario Restrepo",
    email: "carlos.mario@gmail.com",
    phone: "3104567890",
    city: "Medellín, Antioquia",
    type: "detal",
    ordersCount: 3,
    totalSpent: 649700,
    registrationDate: "15 Oct 2026",
    status: "verificado",
    notes: "Cliente recurrente de cascos Shaft y guantes Proviker.",
  },
  {
    id: "usr-2",
    name: "Almacén Motos El Diamante (B2B)",
    email: "compras@motoseldiamante.com",
    phone: "3209876543",
    city: "Bucaramanga, Santander",
    type: "mayorista",
    ordersCount: 8,
    totalSpent: 4850000,
    registrationDate: "02 Sep 2026",
    status: "verificado",
    notes: "Distribuidor mayorista de Santander. Compra por docenas de impermeables y guantes.",
  },
  {
    id: "usr-3",
    name: "Paola Andrea Parada",
    email: "paola.parada@outlook.com",
    phone: "3145678901",
    city: "Bogotá D.C.",
    type: "detal",
    ordersCount: 1,
    totalSpent: 249900,
    registrationDate: "Ayer",
    status: "activo",
    notes: "Compró Casco Abatible ICH 3110 Doble Visor Top Speed para despacho en Bogotá.",
  },
];

const DEFAULT_WHOLESALE_INQUIRIES: WholesaleInquiry[] = [
  {
    id: "wh-1",
    businessName: "Motos & Accesorios del Valle",
    contactName: "Julián Echeverry",
    nitOrCedula: "900.849.201-4",
    phone: "3127894561",
    city: "Cali, Valle",
    productsInterest: "Guantes Proviker Ref E44 (30 pares) + Impermeables Siliconados (20 unds)",
    estimatedUnits: 50,
    date: "Hoy, 09:15 AM",
    status: "en_negociacion",
    notes: "Interesado en surtido quincenal. Se envió catálogo y lista de precios B2B.",
  },
  {
    id: "wh-2",
    businessName: "Taller y Repuestos La 33",
    contactName: "Rodrigo Montoya",
    nitOrCedula: "71.382.901",
    phone: "3186543210",
    city: "Medellín, Antioquia",
    productsInterest: "Lote Cascos Abatibles ICH 3110 Doble Visor (12 unds variadas)",
    estimatedUnits: 12,
    date: "Ayer, 04:30 PM",
    status: "catalogo_enviado",
    notes: "Solicitó fotos de los visores y colores disponibles.",
  },
  {
    id: "wh-3",
    businessName: "Mundo Motero Caribe",
    contactName: "Edwin Bernal (Contacto Aliado)",
    nitOrCedula: "901.442.891-1",
    phone: "3001122334",
    city: "Barranquilla, Atlántico",
    productsInterest: "Protecciones de rodilla y kits impermeables (40 unds)",
    estimatedUnits: 40,
    date: "04 Nov 2026",
    status: "cerrado",
    notes: "Pedido despachado por Envia y pagado con transferencia Bancolombia.",
  },
];

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

const DEFAULT_ORDERS: Order[] = [
  {
    id: "ord-1",
    guideNumber: "INT-7009482",
    carrier: "Inter Rapidísimo",
    customerName: "Carlos Mendoza",
    customerPhone: "3104567890",
    city: "Medellín, Antioquia",
    total: 170000,
    itemsCount: 2,
    status: "en_reparto",
    date: "Hoy, 08:30 AM",
    productsSummary: "2x Guantes Proviker Ref E44 (Talla L)",
  },
  {
    id: "ord-2",
    guideNumber: "SER-8849201",
    carrier: "Servientrega",
    customerName: "Alejandro Gómez",
    customerPhone: "3158901234",
    city: "Cali, Valle",
    total: 289900,
    itemsCount: 1,
    status: "en_transito",
    date: "Ayer, 03:15 PM",
    productsSummary: "1x Casco Shaft Pro 582 ECE 22.06 (Talla M)",
  },
  {
    id: "ord-3",
    guideNumber: "ENV-4592018",
    carrier: "Envia",
    customerName: "Taller Motos El Poblado (B2B)",
    customerPhone: "3209876543",
    city: "Barranquilla, Atlántico",
    total: 660000,
    itemsCount: 12,
    status: "empacado",
    date: "Hoy, 10:45 AM",
    productsSummary: "Lote Mayorista 12x Guantes Proviker Ref E44",
  },
];

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
  updateAlbum: (album: LookbookAlbum) => void;

  // Orders & Tracking (Admin Synced)
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  deleteOrder: (id: string) => void;
  getOrderByGuide: (guide: string) => Order | undefined;

  // Users & Customers (Admin Synced)
  users: CustomerUser[];
  addUser: (user: CustomerUser) => void;
  updateUser: (user: CustomerUser) => void;
  deleteUser: (id: string) => void;

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

  // Analytics
  whatsappClicks: number;
  trackWhatsAppClick: (label?: string) => void;
  productViews: number;
  trackProductView: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userCity, setUserCity] = useState("Bogotá D.C.");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

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

  // Client-side initialization from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("gr_cart");
      if (savedCart) setCartItems(JSON.parse(savedCart));

      const savedCity = localStorage.getItem("gr_user_city");
      if (savedCity) setUserCity(savedCity);

      const CATALOG_VERSION = "2026_real_ich_v4";
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
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedUsers = localStorage.getItem("gr_admin_users");
      if (savedUsers) setUsers(JSON.parse(savedUsers));

      const savedWholesale = localStorage.getItem("gr_admin_wholesale");
      if (savedWholesale) setWholesaleInquiries(JSON.parse(savedWholesale));

      const savedSettings = localStorage.getItem("gr_admin_settings");
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedBanners = localStorage.getItem("gr_admin_banners");
      if (savedBanners) setBanners(JSON.parse(savedBanners));

      const savedInvoices = localStorage.getItem("gr_admin_invoices");
      if (savedInvoices) setInvoices(JSON.parse(savedInvoices));

      const savedCategories = localStorage.getItem("gr_admin_categories");
      if (savedCategories) setCategories(JSON.parse(savedCategories));

      const savedCombos = localStorage.getItem("gr_admin_combos");
      if (savedCombos) setCombos(JSON.parse(savedCombos));

      const savedClicks = localStorage.getItem("gr_wa_clicks");
      if (savedClicks) setWhatsappClicks(Number(savedClicks));

      const savedViews = localStorage.getItem("gr_views");
      if (savedViews) setProductViews(Number(savedViews));
    } catch {
      // ignore
    }
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
  const updateAlbum = (updatedAlbum: LookbookAlbum) => {
    setAlbums((prev) => {
      const updated = prev.map((a) => (a.id === updatedAlbum.id ? updatedAlbum : a));
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
    return orders.find((o) => o.guideNumber.toUpperCase() === clean);
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
        updateAlbum,
        orders,
        addOrder,
        updateOrder,
        deleteOrder,
        getOrderByGuide,
        users,
        addUser,
        updateUser,
        deleteUser,
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
