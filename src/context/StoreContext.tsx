"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, CartItem, Order, LookbookAlbum, CustomerUser, WholesaleInquiry, StoreSettings } from "@/types";
import { PRODUCTS, LOOKBOOK_ALBUMS } from "@/data/products";

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
    totalSpent: 289900,
    registrationDate: "Ayer",
    status: "activo",
    notes: "Compró Casco Shaft Pro 582 para despacho en Bogotá.",
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
    productsInterest: "Lote Cascos Shaft Pro ECE 22.06 (12 unds variadas)",
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
  const [whatsappClicks, setWhatsappClicks] = useState<number>(38);
  const [productViews, setProductViews] = useState<number>(342);

  // Client-side initialization from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("gr_cart");
      if (savedCart) setCartItems(JSON.parse(savedCart));

      const savedCity = localStorage.getItem("gr_user_city");
      if (savedCity) setUserCity(savedCity);

      const savedProducts = localStorage.getItem("gr_admin_products");
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedAlbums = localStorage.getItem("gr_admin_albums");
      if (savedAlbums) setAlbums(JSON.parse(savedAlbums));

      const savedOrders = localStorage.getItem("gr_admin_orders");
      if (savedOrders) setOrders(JSON.parse(savedOrders));

      const savedUsers = localStorage.getItem("gr_admin_users");
      if (savedUsers) setUsers(JSON.parse(savedUsers));

      const savedWholesale = localStorage.getItem("gr_admin_wholesale");
      if (savedWholesale) setWholesaleInquiries(JSON.parse(savedWholesale));

      const savedSettings = localStorage.getItem("gr_admin_settings");
      if (savedSettings) setSettings(JSON.parse(savedSettings));

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
