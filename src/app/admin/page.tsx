"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Product, Order, LookbookAlbum } from "@/types";
import {
  BarChart3,
  Package,
  Truck,
  ShieldCheck,
  Lock,
  Unlock,
  Edit3,
  Trash2,
  Plus,
  Eye,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Layers,
  Search,
  Save,
  X,
  RefreshCw,
  MessageSquareText,
} from "lucide-react";

export default function AdminPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    albums,
    updateAlbum,
    whatsappClicks,
    productViews,
  } = useStore();

  // 1. AUTHENTICATION GATEKEEPER
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [pinError, setPinError] = useState<string>("");

  useEffect(() => {
    try {
      const auth = sessionStorage.getItem("gr_admin_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
      }
    } catch {}
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === "2026" || pinInput.trim().toLowerCase() === "gordo2026") {
      setIsAuthenticated(true);
      setPinError("");
      try {
        sessionStorage.setItem("gr_admin_auth", "true");
      } catch {}
    } else {
      setPinError("PIN incorrecto. Usa el PIN maestro: 2026");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPinInput("");
    try {
      sessionStorage.removeItem("gr_admin_auth");
    } catch {}
  };

  // 2. ACTIVE TAB
  const [activeTab, setActiveTab] = useState<"analytics" | "products" | "orders" | "lookbooks" | "reviews">("analytics");

  // 3. PRODUCT MODAL STATE
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  // Product Form State
  const [prodForm, setProdForm] = useState<{
    name: string;
    sku: string;
    category_name: string;
    price_retail: number;
    price_original: number;
    price_wholesale: number;
    stock: number;
    badge: string;
    badge_color: "orange" | "red" | "emerald" | "purple" | "blue";
    is_new_arrival: boolean;
    is_limited_edition: boolean;
    is_active: boolean;
    img1: string;
    img2: string;
    img3: string;
    img4: string;
    description: string;
  }>({
    name: "",
    sku: "",
    category_name: "Cascos",
    price_retail: 0,
    price_original: 0,
    price_wholesale: 0,
    stock: 10,
    badge: "",
    badge_color: "orange",
    is_new_arrival: false,
    is_limited_edition: false,
    is_active: true,
    img1: "",
    img2: "",
    img3: "",
    img4: "",
    description: "",
  });

  const openNewProductModal = () => {
    setEditingProduct(null);
    setProdForm({
      name: "",
      sku: `GR-${Math.floor(100 + Math.random() * 900)}`,
      category_name: "Cascos",
      price_retail: 250000,
      price_original: 310000,
      price_wholesale: 190000,
      stock: 12,
      badge: "NOVEDAD 2026",
      badge_color: "orange",
      is_new_arrival: true,
      is_limited_edition: false,
      is_active: true,
      img1: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
      img2: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
      img3: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80",
      img4: "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=800&q=80",
      description: "Equipamiento certificado para motociclistas de alto rendimiento.",
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProdForm({
      name: product.name,
      sku: product.sku,
      category_name: product.category_name || "Cascos",
      price_retail: product.price_retail,
      price_original: product.price_original || 0,
      price_wholesale: product.price_wholesale || 0,
      stock: product.stock ?? 10,
      badge: product.badge || "",
      badge_color: product.badge_color || "orange",
      is_new_arrival: !!product.is_new_arrival,
      is_limited_edition: !!product.is_limited_edition,
      is_active: product.is_active,
      img1: product.images?.[0] || "",
      img2: product.images?.[1] || "",
      img3: product.images?.[2] || "",
      img4: product.images?.[3] || "",
      description: product.description || "",
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const images = [prodForm.img1, prodForm.img2, prodForm.img3, prodForm.img4].filter(Boolean);
    const slug = editingProduct ? editingProduct.slug : prodForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    const productPayload: Product = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: prodForm.name,
      sku: prodForm.sku,
      slug: slug || `producto-${Date.now()}`,
      category_name: prodForm.category_name,
      price_retail: Number(prodForm.price_retail),
      price_original: prodForm.price_original ? Number(prodForm.price_original) : undefined,
      price_wholesale: prodForm.price_wholesale ? Number(prodForm.price_wholesale) : undefined,
      stock: Number(prodForm.stock),
      badge: prodForm.badge.trim() || undefined,
      badge_color: prodForm.badge_color,
      is_new_arrival: prodForm.is_new_arrival,
      is_limited_edition: prodForm.is_limited_edition,
      is_active: prodForm.is_active,
      is_featured: true,
      images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"],
      description: prodForm.description,
      rating: editingProduct?.rating ?? 5.0,
      reviews_count: editingProduct?.reviews_count ?? 1,
    };

    if (editingProduct) {
      updateProduct(productPayload);
    } else {
      addProduct(productPayload);
    }
    setIsProductModalOpen(false);
  };

  // 4. ORDER / GUIDE STATE
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderFilterQuery, setOrderFilterQuery] = useState("");
  const [newOrderForm, setNewOrderForm] = useState<{
    guideNumber: string;
    carrier: "Inter Rapidísimo" | "Servientrega" | "Envia" | "Coordinadora";
    customerName: string;
    customerPhone: string;
    city: string;
    total: number;
    productsSummary: string;
    status: "empacado" | "recolectado" | "en_transito" | "en_reparto" | "entregado";
  }>({
    guideNumber: `INT-${Math.floor(1000000 + Math.random() * 9000000)}`,
    carrier: "Inter Rapidísimo",
    customerName: "",
    customerPhone: "300",
    city: "Bogotá D.C.",
    total: 289900,
    productsSummary: "1x Casco Integral Shaft Pro 582 (Talla L)",
    status: "empacado",
  });

  const handleSaveOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderPayload: Order = {
      id: `ord-${Date.now()}`,
      guideNumber: newOrderForm.guideNumber.toUpperCase().trim(),
      carrier: newOrderForm.carrier,
      customerName: newOrderForm.customerName,
      customerPhone: newOrderForm.customerPhone,
      city: newOrderForm.city,
      total: Number(newOrderForm.total),
      itemsCount: 1,
      status: newOrderForm.status,
      date: "Hoy, " + new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      productsSummary: newOrderForm.productsSummary,
    };
    addOrder(orderPayload);
    setIsOrderModalOpen(false);
  };

  // 5. LOOKBOOK EDIT STATE
  const [editingAlbum, setEditingAlbum] = useState<LookbookAlbum | null>(null);
  const [albumForm, setAlbumForm] = useState({
    title: "",
    subtitle: "",
    tag: "",
    description: "",
    coverImage: "",
  });

  const openAlbumModal = (album: LookbookAlbum) => {
    setEditingAlbum(album);
    setAlbumForm({
      title: album.title,
      subtitle: album.subtitle,
      tag: album.tag,
      description: album.description,
      coverImage: album.coverImage,
    });
  };

  const handleSaveAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAlbum) return;
    updateAlbum({
      ...editingAlbum,
      title: albumForm.title,
      subtitle: albumForm.subtitle,
      tag: albumForm.tag,
      description: albumForm.description,
      coverImage: albumForm.coverImage,
    });
    setEditingAlbum(null);
  };

  // 6. REVIEWS RETRIEVAL FROM LOCALSTORAGE
  const [storedReviews, setStoredReviews] = useState<{ id: string; productSlug: string; author: string; rating: number; title: string; comment: string; date: string }[]>([]);

  useEffect(() => {
    try {
      const loaded: { id: string; productSlug: string; author: string; rating: number; title: string; comment: string; date: string }[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("gr_reviews_")) {
          const productSlug = key.replace("gr_reviews_", "");
          const val = localStorage.getItem(key);
          if (val) {
            const list = JSON.parse(val);
            if (Array.isArray(list)) {
              list.forEach((r: any) => loaded.push({ ...r, productSlug }));
            }
          }
        }
      }
      setStoredReviews(loaded);
    } catch {}
  }, [activeTab]);

  const handleDeleteReview = (productSlug: string, reviewId: string) => {
    try {
      const key = `gr_reviews_${productSlug}`;
      const val = localStorage.getItem(key);
      if (val) {
        const list = JSON.parse(val);
        const filtered = list.filter((r: any) => r.id !== reviewId);
        localStorage.setItem(key, JSON.stringify(filtered));
        setStoredReviews((prev) => prev.filter((r) => r.id !== reviewId));
      }
    } catch {}
  };

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategoryFilter === "all" || p.category_name?.toLowerCase().includes(selectedCategoryFilter.toLowerCase());
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const q = orderFilterQuery.toLowerCase();
    return o.guideNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.city.toLowerCase().includes(q);
  });

  // Gatekeeper View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/10">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              Gordo Ryders • Control Center
            </h1>
            <p className="text-xs text-neutral-400">
              Acceso exclusivo para el administrador general y gestión de inventario.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                PIN o Contraseña Maestra
              </label>
              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Ingresa tu clave maestra..."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-2xl px-4 py-3.5 text-white placeholder-neutral-500 text-center text-lg tracking-widest font-mono focus:outline-none focus:border-orange-500"
              />
              {pinError && <p className="text-xs text-red-400 font-bold mt-2 text-center">{pinError}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 font-black py-3.5 rounded-2xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
            >
              Entrar al Panel de Control
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-800/80 text-center">
            <p className="text-[11px] text-neutral-500">
              Clave maestra predeterminada: <span className="text-orange-400 font-mono font-bold">2026</span>
            </p>
            <button
              type="button"
              onClick={() => {
                setPinInput("2026");
                setIsAuthenticated(true);
                try {
                  sessionStorage.setItem("gr_admin_auth", "true");
                } catch {}
              }}
              className="mt-2 text-xs text-neutral-400 hover:text-white underline cursor-pointer"
            >
              (Acceso rápido de prueba: PIN 2026)
            </button>
          </div>

          <div className="text-center">
            <Link href="/" className="text-xs text-neutral-500 hover:text-orange-400 transition-colors">
              ← Volver a la Tienda Gordo Ryders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-20">
      
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center font-black text-neutral-950 text-base shadow-md">
            GR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black uppercase text-white tracking-wide">
                Gordo Ryders • Panel de Control
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                En Línea 2026
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Ecosistema Integral: Catálogo, Métricas, Despachos & Lookbooks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-neutral-700"
          >
            <Eye className="w-3.5 h-3.5 text-orange-400" />
            <span>Ver Tienda</span>
            <ExternalLink className="w-3 h-3 text-neutral-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold px-3 py-2 rounded-xl transition-all border border-red-500/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>
        </div>
      </header>

      {/* Admin Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-neutral-800">
          {[
            { id: "analytics", label: "Analítica & KPIs", icon: BarChart3 },
            { id: "products", label: "Catálogo & Badges", icon: Package, badge: products.length },
            { id: "orders", label: "Logística & Guías", icon: Truck, badge: orders.length },
            { id: "lookbooks", label: "Lookbooks & Collages", icon: Layers, badge: albums.length },
            { id: "reviews", label: "Moderación Reseñas", icon: MessageSquareText, badge: storedReviews.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-orange-500 text-neutral-950 shadow-lg shadow-orange-500/20"
                    : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-neutral-950" : "text-orange-400"}`} />
                <span>{tab.label}</span>
                {typeof tab.badge !== "undefined" && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                      isActive ? "bg-neutral-950 text-white" : "bg-neutral-800 text-neutral-300"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* ========================================================= */}
        {/* TAB 1: ANALYTICS & KPIS */}
        {/* ========================================================= */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400 text-xs mb-3">
                  <span className="font-bold uppercase tracking-wider">Clics a WhatsApp</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <MessageSquareText className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">{whatsappClicks}</div>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                  ↑ Consultas directas de clientes
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400 text-xs mb-3">
                  <span className="font-bold uppercase tracking-wider">Vistas de Productos</span>
                  <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">{productViews}</div>
                <p className="text-[11px] text-orange-400 font-semibold mt-1">
                  ↑ Tráfico al catálogo 2026
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400 text-xs mb-3">
                  <span className="font-bold uppercase tracking-wider">Despachos Activos</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">{orders.length}</div>
                <p className="text-[11px] text-blue-400 font-semibold mt-1">
                  Guías sincronizadas en /rastreo
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400 text-xs mb-3">
                  <span className="font-bold uppercase tracking-wider">Inventario Total</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">
                  {products.reduce((acc, p) => acc + (p.stock || 0), 0)}
                </div>
                <p className="text-[11px] text-purple-400 font-semibold mt-1">
                  Unidades listas para entrega
                </p>
              </div>

            </div>

            {/* Geographic & Funnel Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* City Breakdown */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-base font-black uppercase text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span>Ciudades con Mayor Demanda (Despachos & Cotizaciones)</span>
                </h3>
                <div className="space-y-3">
                  {[
                    { city: "Bogotá D.C. (Sede & Domicilios Express)", percent: 52, count: "48 envíos" },
                    { city: "Medellín & Valle de Aburrá", percent: 24, count: "22 envíos" },
                    { city: "Cali & Eje Cafetero", percent: 14, count: "13 envíos" },
                    { city: "Barranquilla & Costa Caribe (Mayoristas)", percent: 10, count: "9 lotes B2B" },
                  ].map((row, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-neutral-200">{row.city}</span>
                        <span className="text-orange-400 font-mono font-bold">{row.count} ({row.percent}%)</span>
                      </div>
                      <div className="h-2 w-full bg-neutral-950 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 rounded-full"
                          style={{ width: `${row.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products Conversion */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-base font-black uppercase text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-400" />
                  <span>Top Productos Más Cotizados</span>
                </h3>
                <div className="space-y-3">
                  {products.slice(0, 4).map((prod, i) => (
                    <div
                      key={prod.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-neutral-950 border border-neutral-800"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-orange-500/20 text-orange-400 font-black text-xs flex items-center justify-center">
                          #{i + 1}
                        </span>
                        <div>
                          <p className="text-xs font-bold text-white line-clamp-1">{prod.name}</p>
                          <span className="text-[10px] text-neutral-400 font-mono">REF: {prod.sku} • {formatCOP(prod.price_retail)}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded">
                        {prod.stock || 10} en stock
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: PRODUCT & INVENTORY MANAGEMENT */}
        {/* ========================================================= */}
        {activeTab === "products" && (
          <div className="space-y-6">
            
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              
              <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Buscar producto por nombre o SKU..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="all">Todas las Categorías</option>
                  <option value="Cascos">Cascos</option>
                  <option value="Guantes">Guantes</option>
                  <option value="Impermeable">Impermeables & Chaquetas</option>
                  <option value="Protecciones">Protecciones</option>
                  <option value="Accesorios">Accesorios</option>
                </select>
              </div>

              <button
                onClick={openNewProductModal}
                className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Crear Nuevo Producto</span>
              </button>

            </div>

            {/* Products Table / Cards */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 border-b border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-400">
                    <tr>
                      <th className="p-4">Producto</th>
                      <th className="p-4">Categoría & SKU</th>
                      <th className="p-4">Precios (Detal / Mayorista)</th>
                      <th className="p-4">Badge / Etiqueta</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-neutral-800/40 transition-colors">
                        
                        {/* Photo + Name */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.images?.[0] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=150&q=80"}
                              alt={prod.name}
                              className="w-12 h-12 rounded-xl object-cover border border-neutral-700 bg-neutral-950 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-white text-xs line-clamp-1">{prod.name}</p>
                              <span className="text-[10px] text-neutral-500 font-mono">Slug: {prod.slug}</span>
                            </div>
                          </div>
                        </td>

                        {/* Category & SKU */}
                        <td className="p-4 font-mono">
                          <span className="text-orange-400 font-bold block">{prod.category_name}</span>
                          <span className="text-neutral-400 text-[10px]">SKU: {prod.sku}</span>
                        </td>

                        {/* Prices */}
                        <td className="p-4 font-mono">
                          <div className="font-bold text-white">{formatCOP(prod.price_retail)}</div>
                          {prod.price_wholesale && (
                            <div className="text-[10px] text-amber-400">B2B: {formatCOP(prod.price_wholesale)}</div>
                          )}
                        </td>

                        {/* Badges */}
                        <td className="p-4">
                          {prod.badge ? (
                            <span
                              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded shadow ${
                                prod.badge_color === "red"
                                  ? "bg-red-600 text-white"
                                  : prod.badge_color === "emerald"
                                  ? "bg-emerald-500 text-neutral-950"
                                  : prod.badge_color === "purple"
                                  ? "bg-purple-600 text-white"
                                  : prod.badge_color === "blue"
                                  ? "bg-blue-600 text-white"
                                  : "bg-orange-500 text-neutral-950"
                              }`}
                            >
                              {prod.badge}
                            </span>
                          ) : prod.is_new_arrival ? (
                            <span className="bg-emerald-500 text-neutral-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                              NOVEDAD
                            </span>
                          ) : (
                            <span className="text-neutral-600 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Stock */}
                        <td className="p-4 font-mono font-bold">
                          <span className={prod.stock && prod.stock <= 5 ? "text-amber-400" : "text-neutral-200"}>
                            {prod.stock ?? 10} unds.
                          </span>
                        </td>

                        {/* Active switch */}
                        <td className="p-4">
                          <button
                            onClick={() => updateProduct({ ...prod, is_active: !prod.is_active })}
                            className={`text-[10px] font-black uppercase px-2 py-1 rounded-full cursor-pointer transition-all ${
                              prod.is_active
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-neutral-800 text-neutral-500 border border-neutral-700"
                            }`}
                          >
                            {prod.is_active ? "Activo" : "Pausado"}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditProductModal(prod)}
                              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer"
                              title="Editar producto"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar producto "${prod.name}"?`)) {
                                  deleteProduct(prod.id);
                                }
                              }}
                              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                              title="Eliminar producto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: LOGISTICS & GUIDES (/RASTREO) */}
        {/* ========================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            
            {/* Header + Add Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={orderFilterQuery}
                  onChange={(e) => setOrderFilterQuery(e.target.value)}
                  placeholder="Buscar por guía, cliente o ciudad de destino..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Asignar Nueva Guía de Envío</span>
              </button>
            </div>

            {/* Orders Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((ord) => {
                const waMessage = encodeURIComponent(
                  `Hola ${ord.customerName}, tu pedido de Gordo Ryders ya está en curso con guía ${ord.guideNumber} por ${ord.carrier}. Puedes rastrearlo en tiempo real aquí: https://gordo-ryders-ecommerce.vercel.app/rastreo`
                );

                return (
                  <div
                    key={ord.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Carrier + Guide */}
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-neutral-800">
                        <span className="font-mono text-xs font-black text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg">
                          {ord.guideNumber}
                        </span>
                        <span className="text-[11px] font-bold text-neutral-400">
                          {ord.carrier}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="mt-3 space-y-1">
                        <h4 className="text-sm font-black text-white">{ord.customerName}</h4>
                        <p className="text-xs text-neutral-400">📍 {ord.city}</p>
                        <p className="text-xs text-neutral-300 font-medium line-clamp-2 mt-1">
                          📦 {ord.productsSummary}
                        </p>
                        <p className="text-xs font-mono font-bold text-emerald-400 mt-1">
                          Total: {formatCOP(ord.total)}
                        </p>
                      </div>
                    </div>

                    {/* Status Changer */}
                    <div className="space-y-3 pt-3 border-t border-neutral-800">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-500 tracking-wider mb-1">
                          Estado del Despacho
                        </label>
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrder({ ...ord, status: e.target.value as any })}
                          className="w-full bg-neutral-950 border border-neutral-700 text-xs rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
                        >
                          <option value="empacado">📦 1. Empacado en Bodega</option>
                          <option value="recolectado">🚚 2. Recolectado por Transportadora</option>
                          <option value="en_transito">🛣️ 3. En Tránsito Intermunicipal</option>
                          <option value="en_reparto">🛵 4. En Reparto Local</option>
                          <option value="entregado">✅ 5. Entregado Exitoso</option>
                        </select>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={`https://wa.me/57${ord.customerPhone.replace(/\D/g, "")}?text=${waMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all"
                        >
                          <MessageSquareText className="w-3.5 h-3.5" />
                          <span>Notificar</span>
                        </a>

                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar despacho con guía ${ord.guideNumber}?`)) {
                              deleteOrder(ord.id);
                            }
                          }}
                          className="bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border border-neutral-700 hover:border-red-500/30 text-xs font-bold py-2 rounded-xl text-center transition-all cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: LOOKBOOKS & COLLAGES */}
        {/* ========================================================= */}
        {activeTab === "lookbooks" && (
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-base font-black text-white uppercase mb-1">
                Mini-Álbumes y Collages del Home
              </h3>
              <p className="text-xs text-neutral-400 mb-6">
                Personaliza los 3 bloques visuales de estilo editorial que se muestran en la página principal para inspirar a los moteros.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 w-full bg-neutral-900 overflow-hidden">
                        <img
                          src={album.coverImage}
                          alt={album.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-orange-500 text-neutral-950 font-black text-[10px] uppercase px-2 py-0.5 rounded shadow">
                          {album.tag}
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="text-sm font-black text-white">{album.title}</h4>
                        <p className="text-xs text-orange-400 font-semibold">{album.subtitle}</p>
                        <p className="text-[11px] text-neutral-400 leading-relaxed line-clamp-3">
                          {album.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        onClick={() => openAlbumModal(album)}
                        className="w-full bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 border border-neutral-700 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                        <span>Editar Lookbook</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: REVIEWS MODERATION */}
        {/* ========================================================= */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-base font-black text-white uppercase mb-1">
                Moderación de Reseñas de Clientes Reales
              </h3>
              <p className="text-xs text-neutral-400 mb-6">
                Visualiza y modera las opiniones y calificaciones dejadas libremente por los clientes en cada ficha técnica.
              </p>

              {storedReviews.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-neutral-800 rounded-2xl p-6">
                  <MessageSquareText className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-neutral-300">
                    Aún no hay reseñas enviadas por clientes
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Las calificaciones enviadas desde las páginas de producto aparecerán aquí para tu control.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {storedReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-white">{rev.author}</span>
                          <span className="text-[10px] text-neutral-500 font-mono">{rev.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-400 text-xs mb-2">
                          {"★".repeat(rev.rating)}
                          {"☆".repeat(5 - rev.rating)}
                        </div>
                        <h4 className="text-xs font-bold text-neutral-200">{rev.title}</h4>
                        <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                          "{rev.comment}"
                        </p>
                        <p className="text-[10px] text-orange-400 font-mono mt-2">
                          Producto: /{rev.productSlug}
                        </p>
                      </div>

                      <div className="flex items-center justify-end pt-2 border-t border-neutral-800">
                        <button
                          onClick={() => handleDeleteReview(rev.productSlug, rev.id)}
                          className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar Reseña</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* ========================================================= */}
      {/* MODAL: PRODUCT CREATE / EDIT */}
      {/* ========================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white uppercase">
                  {editingProduct ? "Editar Producto" : "Nuevo Producto en Catálogo"}
                </h3>
                <p className="text-xs text-neutral-400">
                  Control total sobre precios, badges, stock y 4 fotografías.
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Nombre del Producto
                  </label>
                  <input
                    type="text"
                    required
                    value={prodForm.name}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    placeholder="Ej: Casco Shaft Pro 582 ECE 22.06"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    SKU / Referencia
                  </label>
                  <input
                    type="text"
                    required
                    value={prodForm.sku}
                    onChange={(e) => setProdForm({ ...prodForm, sku: e.target.value })}
                    placeholder="Ej: C-SHAFT-582"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Categoría
                  </label>
                  <select
                    value={prodForm.category_name}
                    onChange={(e) => setProdForm({ ...prodForm, category_name: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="Cascos">Cascos</option>
                    <option value="Guantes">Guantes</option>
                    <option value="Impermeables & Chaquetas">Impermeables & Chaquetas</option>
                    <option value="Protecciones">Protecciones</option>
                    <option value="Accesorios">Accesorios</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Precio Detal (COP)
                  </label>
                  <input
                    type="number"
                    required
                    value={prodForm.price_retail}
                    onChange={(e) => setProdForm({ ...prodForm, price_retail: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Precio Mayorista B2B (COP)
                  </label>
                  <input
                    type="number"
                    value={prodForm.price_wholesale}
                    onChange={(e) => setProdForm({ ...prodForm, price_wholesale: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Precio Antes / Tachado (Para mostrar % OFF)
                  </label>
                  <input
                    type="number"
                    value={prodForm.price_original}
                    onChange={(e) => setProdForm({ ...prodForm, price_original: Number(e.target.value) })}
                    placeholder="Ej: 345000"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Stock en Unidades
                  </label>
                  <input
                    type="number"
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* BADGES & HIGHLIGHTS */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                <h4 className="text-xs font-black uppercase text-orange-400">
                  Etiqueta / Badge Personalizado
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Texto de la Etiqueta (Ej: NOVEDAD, EDICIÓN LIMITADA, MÁS VENDIDO 1°)
                    </label>
                    <input
                      type="text"
                      value={prodForm.badge}
                      onChange={(e) => setProdForm({ ...prodForm, badge: e.target.value })}
                      placeholder="Dejar vacío si no aplica"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 uppercase font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Color del Badge
                    </label>
                    <select
                      value={prodForm.badge_color}
                      onChange={(e) => setProdForm({ ...prodForm, badge_color: e.target.value as any })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      <option value="orange">Naranja (Clásico Gordo Ryders)</option>
                      <option value="red">Rojo (Oferta Relámpago)</option>
                      <option value="emerald">Verde Esmeralda (Novedad / Ingreso)</option>
                      <option value="purple">Morado (Edición Limitada)</option>
                      <option value="blue">Azul (Certificado DOT / ECE)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                    <input
                      type="checkbox"
                      checked={prodForm.is_new_arrival}
                      onChange={(e) => setProdForm({ ...prodForm, is_new_arrival: e.target.checked })}
                      className="w-4 h-4 accent-orange-500 rounded"
                    />
                    <span>Incluir en Carrusel de Novedades (Home)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                    <input
                      type="checkbox"
                      checked={prodForm.is_limited_edition}
                      onChange={(e) => setProdForm({ ...prodForm, is_limited_edition: e.target.checked })}
                      className="w-4 h-4 accent-orange-500 rounded"
                    />
                    <span>Marcar como Edición Limitada</span>
                  </label>
                </div>
              </div>

              {/* 4 IMAGES URLS */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <h4 className="text-xs font-black uppercase text-white">
                  Fotografías en Alta Definición (4 Ángulos)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">1. Frontal (Principal)</label>
                    <input
                      type="text"
                      value={prodForm.img1}
                      onChange={(e) => setProdForm({ ...prodForm, img1: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">2. Lateral</label>
                    <input
                      type="text"
                      value={prodForm.img2}
                      onChange={(e) => setProdForm({ ...prodForm, img2: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">3. Posterior</label>
                    <input
                      type="text"
                      value={prodForm.img3}
                      onChange={(e) => setProdForm({ ...prodForm, img3: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">4. Detalle / Interior</label>
                    <input
                      type="text"
                      value={prodForm.img4}
                      onChange={(e) => setProdForm({ ...prodForm, img4: e.target.value })}
                      placeholder="https://..."
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Descripción Ficha Técnica
                </label>
                <textarea
                  rows={3}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-300 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  {editingProduct ? "Guardar Cambios" : "Crear Producto"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ASSIGN ORDER / GUIDE */}
      {/* ========================================================= */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-lg font-black text-white uppercase">
                  Asignar Nueva Guía de Despacho
                </h3>
                <p className="text-xs text-neutral-400">
                  Visible inmediatamente en /rastreo para el cliente.
                </p>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrder} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Número de Guía
                </label>
                <input
                  type="text"
                  required
                  value={newOrderForm.guideNumber}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, guideNumber: e.target.value })}
                  placeholder="Ej: INT-9482012 / SER-7840192"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Transportadora
                  </label>
                  <select
                    value={newOrderForm.carrier}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, carrier: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="Inter Rapidísimo">Inter Rapidísimo</option>
                    <option value="Servientrega">Servientrega</option>
                    <option value="Envia">Envia</option>
                    <option value="Coordinadora">Coordinadora</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Estado Inicial
                  </label>
                  <select
                    value={newOrderForm.status}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, status: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                  >
                    <option value="empacado">1. Empacado</option>
                    <option value="recolectado">2. Recolectado</option>
                    <option value="en_transito">3. En Tránsito</option>
                    <option value="en_reparto">4. En Reparto</option>
                    <option value="entregado">5. Entregado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  required
                  value={newOrderForm.customerName}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customerName: e.target.value })}
                  placeholder="Ej: David Restrepo"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    WhatsApp del Cliente
                  </label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.customerPhone}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerPhone: e.target.value })}
                    placeholder="3001234567"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                    Ciudad Destino
                  </label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.city}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, city: e.target.value })}
                    placeholder="Ej: Medellín, Antioquia"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Resumen de Productos
                </label>
                <input
                  type="text"
                  required
                  value={newOrderForm.productsSummary}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, productsSummary: e.target.value })}
                  placeholder="Ej: 1x Casco Shaft Pro + 1x Guantes Proviker"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">
                  Valor Total Orden (COP)
                </label>
                <input
                  type="number"
                  required
                  value={newOrderForm.total}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, total: Number(e.target.value) })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-neutral-300 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  Guardar Guía
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: EDIT LOOKBOOK ALBUM */}
      {/* ========================================================= */}
      {editingAlbum && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-5 my-8 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-black text-white uppercase">
                Editar Lookbook: {editingAlbum.category}
              </h3>
              <button
                onClick={() => setEditingAlbum(null)}
                className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAlbum} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold uppercase mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={albumForm.title}
                  onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase mb-1">Subtítulo</label>
                <input
                  type="text"
                  required
                  value={albumForm.subtitle}
                  onChange={(e) => setAlbumForm({ ...albumForm, subtitle: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase mb-1">Etiqueta</label>
                <input
                  type="text"
                  required
                  value={albumForm.tag}
                  onChange={(e) => setAlbumForm({ ...albumForm, tag: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white uppercase font-bold"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase mb-1">URL Imagen Portada</label>
                <input
                  type="text"
                  required
                  value={albumForm.coverImage}
                  onChange={(e) => setAlbumForm({ ...albumForm, coverImage: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase mb-1">Descripción</label>
                <textarea
                  rows={3}
                  value={albumForm.description}
                  onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingAlbum(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black uppercase"
                >
                  Actualizar Lookbook
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}