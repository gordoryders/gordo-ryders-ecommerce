"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, CartItem, Order, LookbookAlbum } from "@/types";
import { PRODUCTS, LOOKBOOK_ALBUMS } from "@/data/products";

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
