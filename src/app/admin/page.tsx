"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Product, Order, LookbookAlbum, CustomerUser, WholesaleInquiry, StoreSettings } from "@/types";
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
  Upload,
  ImageIcon,
  Users,
  Building2,
  Share2,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  MessageSquareText,
  ShoppingCart,
  Zap,
  Star,
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
      setPinError("PIN incorrecto. Clave maestra: 2026");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPinInput("");
    try {
      sessionStorage.removeItem("gr_admin_auth");
    } catch {}
  };

  // 2. ACTIVE TABS
  const [activeTab, setActiveTab] = useState<
    "analytics" | "products" | "orders" | "lookbooks" | "users" | "wholesale" | "settings" | "reviews"
  >("products");

  // 3. PRODUCT MODAL STATE WITH LOCAL FILE UPLOAD & LIVE PREVIEW
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

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
    img2: "",
    img3: "",
    img4: "",
    description: "Equipamiento certificado para motociclistas de alto rendimiento.",
  });

  const fileInputRef1 = useRef<HTMLInputElement>(null);
  const fileInputRef2 = useRef<HTMLInputElement>(null);
  const fileInputRef3 = useRef<HTMLInputElement>(null);
  const fileInputRef4 = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetKey: "img1" | "img2" | "img3" | "img4") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar los 5 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setProdForm((prev) => ({ ...prev, [targetKey]: result }));
    };
    reader.readAsDataURL(file);
  };

  const openNewProductModal = () => {
    setEditingProduct(null);
    setProdForm({
      name: "",
      sku: `GR-${Math.floor(100 + Math.random() * 900)}`,
      category_name: "Cascos",
      price_retail: 289900,
      price_original: 345000,
      price_wholesale: 220000,
      stock: 10,
      badge: "NOVEDAD 2026",
      badge_color: "orange",
      is_new_arrival: true,
      is_limited_edition: false,
      is_active: true,
      img1: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
      img2: "",
      img3: "",
      img4: "",
      description: "Equipamiento de alta resistencia certificado internacionalmente.",
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
    const slug = editingProduct
      ? editingProduct.slug
      : prodForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

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

  // 4. LOOKBOOK WITH LOCAL FILE UPLOAD
  const [editingAlbum, setEditingAlbum] = useState<LookbookAlbum | null>(null);
  const [albumForm, setAlbumForm] = useState({
    title: "",
    subtitle: "",
    tag: "",
    description: "",
    coverImage: "",
  });
  const albumFileInputRef = useRef<HTMLInputElement>(null);

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

  const handleAlbumFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar los 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setAlbumForm((prev) => ({ ...prev, coverImage: event.target?.result as string }));
    };
    reader.readAsDataURL(file);
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

  // 5. ORDERS / DISPATCHES (REAL LOGISTICS WITH DIRECT CARRIER PORTALS)
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
    productsSummary: "1x Casco Shaft Pro 582 (Talla L)",
    status: "empacado",
  });

  const getCarrierUrl = (carrier: string, guide: string) => {
    switch (carrier) {
      case "Inter Rapidísimo":
        return `https://www.interrapidisimo.com/sigue-tu-envio/?guia=${guide}`;
      case "Servientrega":
        return `https://www.servientrega.com/wps/portal/rastreo-envio`;
      case "Envia":
        return `https://enviacolvanes.com/`;
      case "Coordinadora":
        return `https://coordinadora.com/rastreo/rastreo-de-guia/`;
      default:
        return "https://www.interrapidisimo.com/sigue-tu-envio/";
    }
  };

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

  // 6. USERS STATE
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<CustomerUser | null>(null);
  const [userForm, setUserForm] = useState<{
    name: string;
    email: string;
    phone: string;
    city: string;
    type: "detal" | "mayorista";
    notes: string;
  }>({
    name: "",
    email: "",
    phone: "300",
    city: "Bogotá D.C.",
    type: "detal",
    notes: "",
  });

  const openNewUserModal = () => {
    setEditingUser(null);
    setUserForm({
      name: "",
      email: "",
      phone: "300",
      city: "Bogotá D.C.",
      type: "detal",
      notes: "",
    });
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser({
        ...editingUser,
        name: userForm.name,
        email: userForm.email,
        phone: userForm.phone,
        city: userForm.city,
        type: userForm.type,
        notes: userForm.notes,
      });
    } else {
      addUser({
        id: `usr-${Date.now()}`,
        name: userForm.name,
        email: userForm.email,
        phone: userForm.phone,
        city: userForm.city,
        type: userForm.type,
        ordersCount: 0,
        totalSpent: 0,
        registrationDate: "Hoy",
        status: "activo",
        notes: userForm.notes,
      });
    }
    setIsUserModalOpen(false);
  };

  // 7. WHOLESALE B2B STATE
  const [editingInquiry, setEditingInquiry] = useState<WholesaleInquiry | null>(null);

  // 8. SETTINGS FORM STATE
  const [settingsForm, setSettingsForm] = useState<StoreSettings>(settings);
  const [settingsSavedNotice, setSettingsSavedNotice] = useState(false);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(settingsForm);
    setSettingsSavedNotice(true);
    setTimeout(() => setSettingsSavedNotice(false), 3000);
  };

  // 9. REVIEWS MODERATION STATE
  const [storedReviews, setStoredReviews] = useState<
    { id: string; productSlug: string; author: string; rating: number; title: string; comment: string; date: string }[]
  >([]);

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
    const matchCat =
      selectedCategoryFilter === "all" ||
      p.category_name?.toLowerCase().includes(selectedCategoryFilter.toLowerCase());
    const matchSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const q = orderFilterQuery.toLowerCase();
    return (
      o.guideNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.city.toLowerCase().includes(q)
    );
  });

  // Calculate live preview discount
  const previewDiscount =
    prodForm.price_original && prodForm.price_original > prodForm.price_retail
      ? Math.round(((prodForm.price_original - prodForm.price_retail) / prodForm.price_original) * 100)
      : null;
  const previewCuota = Math.round(prodForm.price_retail / 3);

  // =========================================================================
  // GATEKEEPER VIEW (PIN LOGIN)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4 selection:bg-orange-500 selection:text-neutral-950">
        <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/10">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              Gordo Ryders • Backoffice
            </h1>
            <p className="text-xs text-neutral-400">
              Módulo exclusivo de administración general. Acceso mediante clave secreta.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                Clave o PIN Maestro
              </label>
              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Ingresa tu clave de acceso..."
                className="w-full bg-neutral-950 border border-neutral-700 rounded-2xl px-4 py-3.5 text-white placeholder-neutral-500 text-center text-lg tracking-widest font-mono focus:outline-none focus:border-orange-500"
              />
              {pinError && <p className="text-xs text-red-400 font-bold mt-2 text-center">{pinError}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 font-black py-3.5 rounded-2xl text-sm uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
            >
              Ingresar al Backoffice
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-800 text-center">
            <p className="text-[11px] text-neutral-500">
              Clave predeterminada: <span className="text-orange-400 font-mono font-bold">2026</span>
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
              (Acceso rápido administrador: PIN 2026)
            </button>
          </div>

          <div className="text-center">
            <Link href="/" className="text-xs text-neutral-500 hover:text-orange-400 transition-colors">
              ← Regresar a la tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN STANDALONE BACKOFFICE INTERFACE
  // =========================================================================
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      
      {/* Top Backoffice Header Bar */}
      <header className="sticky top-0 z-40 bg-neutral-900 border-b border-neutral-800 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center font-black text-neutral-950 text-base shadow-md">
            GR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black uppercase text-white tracking-wide">
                Gordo Ryders • Backoffice Central
              </span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Panel Separado 2026
              </span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Gestión Integral de Catálogo, Clientes, Mayoristas B2B, Redes & Envíos
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
            <span>Ver Tienda en Vivo</span>
            <ExternalLink className="w-3 h-3 text-neutral-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold px-3 py-2 rounded-xl transition-all border border-red-500/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="bg-neutral-900/60 border-b border-neutral-800 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
          {[
            { id: "products", label: "Catálogo & Badges", icon: Package, badge: products.length },
            { id: "users", label: "Control de Clientes", icon: Users, badge: users.length },
            { id: "wholesale", label: "Mayoristas B2B", icon: Building2, badge: wholesaleInquiries.length },
            { id: "orders", label: "Registro de Envíos", icon: Truck, badge: orders.length },
            { id: "lookbooks", label: "Lookbooks & Cajas", icon: Layers, badge: albums.length },
            { id: "settings", label: "Redes & Bodega", icon: Share2 },
            { id: "analytics", label: "Métricas & KPIs", icon: BarChart3 },
            { id: "reviews", label: "Reseñas Clientes", icon: MessageSquareText, badge: storedReviews.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* =========================================================================
            TAB 1: PRODUCTS & BADGES WITH LIVE PREVIEW & LOCAL PC UPLOAD
            ========================================================================= */}
        {activeTab === "products" && (
          <div className="space-y-6">
            
            {/* Top Toolbar */}
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
                <span>Agregar Producto (Cargar Fotos del PC)</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 border-b border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-400">
                    <tr>
                      <th className="p-4">Foto & Producto</th>
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
                        
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.images?.[0] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=150&q=80"}
                              alt={prod.name}
                              className="w-12 h-12 rounded-xl object-cover border border-neutral-700 bg-neutral-950 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-white text-xs line-clamp-1">{prod.name}</p>
                              <span className="text-[10px] text-neutral-500 font-mono">/{prod.slug}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-mono">
                          <span className="text-orange-400 font-bold block">{prod.category_name}</span>
                          <span className="text-neutral-400 text-[10px]">SKU: {prod.sku}</span>
                        </td>

                        <td className="p-4 font-mono">
                          <div className="font-bold text-white">{formatCOP(prod.price_retail)}</div>
                          {prod.price_wholesale && (
                            <div className="text-[10px] text-amber-400">B2B: {formatCOP(prod.price_wholesale)}</div>
                          )}
                        </td>

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

                        <td className="p-4 font-mono font-bold">
                          <span className={prod.stock && prod.stock <= 5 ? "text-amber-400" : "text-neutral-200"}>
                            {prod.stock ?? 10} unds.
                          </span>
                        </td>

                        <td className="p-4">
                          <button
                            onClick={() => updateProduct({ ...prod, is_active: !prod.is_active })}
                            className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                              prod.is_active
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-neutral-800 text-neutral-500 border border-neutral-700"
                            }`}
                          >
                            {prod.is_active ? "Activo" : "Pausado"}
                          </button>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditProductModal(prod)}
                              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer"
                              title="Editar fotos y producto"
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

        {/* =========================================================================
            TAB 2: USERS & CUSTOMERS DIRECTORY
            ========================================================================= */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black uppercase text-white">Directorio de Clientes</h3>
                <p className="text-xs text-neutral-400">
                  Control de compradores al detal y distribuidores mayoristas registrados.
                </p>
              </div>
              <button
                onClick={openNewUserModal}
                className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Registrar Nuevo Cliente</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((usr) => {
                const waChat = encodeURIComponent(
                  `Hola ${usr.name}, te escribimos desde la gerencia de Gordo Ryders Colombia. ¿Cómo vas con tu equipamiento?`
                );
                return (
                  <div
                    key={usr.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-3 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 pb-2 border-b border-neutral-800">
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            usr.type === "mayorista"
                              ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                              : "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                          }`}
                        >
                          {usr.type === "mayorista" ? "Mayorista B2B" : "Cliente Detal"}
                        </span>
                        <span className="text-[10px] text-neutral-500">{usr.registrationDate}</span>
                      </div>

                      <div className="mt-3 space-y-1">
                        <h4 className="text-sm font-black text-white">{usr.name}</h4>
                        <p className="text-xs text-neutral-400">📱 {usr.phone}</p>
                        <p className="text-xs text-neutral-400">✉️ {usr.email}</p>
                        <p className="text-xs text-neutral-400">📍 {usr.city}</p>
                        {usr.notes && (
                          <p className="text-[11px] text-neutral-400 italic bg-neutral-950 p-2 rounded-xl mt-2 border border-neutral-800/80">
                            "{usr.notes}"
                          </p>
                        )}
                        <div className="pt-2 flex items-center justify-between text-xs font-mono">
                          <span className="text-neutral-500">Pedidos: {usr.ordersCount}</span>
                          <span className="font-bold text-emerald-400">{formatCOP(usr.totalSpent)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-800 flex items-center gap-2">
                      <a
                        href={`https://wa.me/57${usr.phone.replace(/\D/g, "")}?text=${waChat}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all"
                      >
                        <MessageSquareText className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar al cliente ${usr.name}?`)) deleteUser(usr.id);
                        }}
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 border border-neutral-700 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: WHOLESALE B2B INQUIRIES & VOLUME ORDERS
            ========================================================================= */}
        {activeTab === "wholesale" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black uppercase text-white">Solicitudes de Mayoristas & Talleres B2B</h3>
              <p className="text-xs text-neutral-400">
                Almacenes interesados en comprar por mayor docenas de cascos, impermeables o guantes.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {wholesaleInquiries.map((wh) => {
                const waMessage = encodeURIComponent(
                  `Hola ${wh.contactName} de ${wh.businessName}, te saluda Edwin Bernal de Gordo Ryders Colombia. Respecto a tu cotización de ${wh.productsInterest}: ¿Deseas que te enviemos el catálogo mayorista en PDF actualizado?`
                );

                return (
                  <div
                    key={wh.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                        <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                          NIT: {wh.nitOrCedula}
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">{wh.date}</span>
                      </div>

                      <div className="mt-3 space-y-1.5">
                        <h4 className="text-sm font-black text-white">{wh.businessName}</h4>
                        <p className="text-xs text-neutral-300 font-bold">Contacto: {wh.contactName}</p>
                        <p className="text-xs text-neutral-400">📱 {wh.phone} • 📍 {wh.city}</p>
                        <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs space-y-1">
                          <span className="text-[10px] uppercase font-bold text-orange-400 block">Interés / Volumen:</span>
                          <p className="text-neutral-200">{wh.productsInterest}</p>
                          <span className="text-[10px] text-neutral-400 font-bold block mt-1">
                            Volumen estimado: {wh.estimatedUnits} unidades
                          </span>
                        </div>
                        {wh.notes && (
                          <p className="text-[11px] text-neutral-400 italic">Notas: {wh.notes}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-neutral-800">
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">
                          Estado de la Cotización
                        </label>
                        <select
                          value={wh.status}
                          onChange={(e) => updateWholesaleInquiry({ ...wh, status: e.target.value as any })}
                          className="w-full bg-neutral-950 border border-neutral-700 text-xs rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
                        >
                          <option value="nuevo">1. Nueva Solicitud</option>
                          <option value="catalogo_enviado">2. Catálogo PDF Enviado</option>
                          <option value="en_negociacion">3. En Negociación de Precios</option>
                          <option value="cerrado">4. Pago Confirmado / Cerrado</option>
                          <option value="descartado">5. Descartado</option>
                        </select>
                      </div>

                      <a
                        href={`https://wa.me/57${wh.phone.replace(/\D/g, "")}?text=${waMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all shadow"
                      >
                        <MessageSquareText className="w-3.5 h-3.5" />
                        <span>Atender por WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: REAL LOGISTICS & CARRIER TRACKING LOGS
            ========================================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={orderFilterQuery}
                  onChange={(e) => setOrderFilterQuery(e.target.value)}
                  placeholder="Buscar por guía, cliente o ciudad..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Registrar Envío con Guía Real</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((ord) => {
                const carrierPortalUrl = getCarrierUrl(ord.carrier, ord.guideNumber);
                const waMessage = encodeURIComponent(
                  `Hola ${ord.customerName}, tu pedido de Gordo Ryders ya fue despachado. Tu guía oficial de ${ord.carrier} es ${ord.guideNumber}. Puedes consultar el estado en la transportadora aquí: ${carrierPortalUrl} o en nuestra web: https://gordo-ryders-ecommerce.vercel.app/rastreo`
                );

                return (
                  <div
                    key={ord.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-neutral-800">
                        <span className="font-mono text-xs font-black text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg">
                          GUÍA: {ord.guideNumber}
                        </span>
                        <span className="text-[11px] font-bold text-neutral-400">
                          {ord.carrier}
                        </span>
                      </div>

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

                    <div className="space-y-3 pt-3 border-t border-neutral-800">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-500 tracking-wider mb-1">
                          Estado del Paquete
                        </label>
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrder({ ...ord, status: e.target.value as any })}
                          className="w-full bg-neutral-950 border border-neutral-700 text-xs rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-orange-500 cursor-pointer"
                        >
                          <option value="empacado">📦 1. Empacado en Bodega Gordo Ryders</option>
                          <option value="recolectado">🚚 2. Entregado a Transportadora</option>
                          <option value="en_transito">🛣️ 3. En Tránsito Intermunicipal</option>
                          <option value="en_reparto">🛵 4. En Reparto Local</option>
                          <option value="entregado">✅ 5. Entregado al Cliente</option>
                        </select>
                      </div>

                      {/* Official carrier link + WhatsApp notifier */}
                      <div className="grid grid-cols-2 gap-2">
                        <a
                          href={carrierPortalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-orange-400" />
                          <span>Portal {ord.carrier.split(" ")[0]}</span>
                        </a>

                        <a
                          href={`https://wa.me/57${ord.customerPhone.replace(/\D/g, "")}?text=${waMessage}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all"
                        >
                          <MessageSquareText className="w-3.5 h-3.5" />
                          <span>Notificar</span>
                        </a>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: LOOKBOOKS & BOXES WITH LOCAL IMAGE UPLOAD
            ========================================================================= */}
        {activeTab === "lookbooks" && (
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-base font-black text-white uppercase mb-1">
                Kits y Cajas de Equipamiento (Home Collages)
              </h3>
              <p className="text-xs text-neutral-400 mb-6">
                Cada bloque funciona como una caja de protección integral. El cliente puede abrirla y revisar cada producto por separado.
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
                        <span>Editar Caja & Cargar Foto Local</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: SOCIAL MEDIA & PHYSICAL STORE SETTINGS
            ========================================================================= */}
        {activeTab === "settings" && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl max-w-4xl space-y-6">
            <div>
              <h3 className="text-lg font-black uppercase text-white">Canales Oficiales, Redes & Bodega</h3>
              <p className="text-xs text-neutral-400">
                Configura los números de WhatsApp, enlaces de redes sociales y dirección física de la bodega en Bogotá.
              </p>
            </div>

            {settingsSavedNotice && (
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Configuración guardada exitosamente y actualizada en la tienda.</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-400 uppercase mb-1">WhatsApp Ventas Detal</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappSales}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappSales: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-400 uppercase mb-1">WhatsApp Ventas Mayoristas (Edwin Bernal)</label>
                  <input
                    type="text"
                    value={settingsForm.whatsappWholesale}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappWholesale: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-neutral-400 uppercase mb-1">Usuario Instagram</label>
                  <input
                    type="text"
                    value={settingsForm.instagramHandle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagramHandle: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-400 uppercase mb-1">URL Instagram</label>
                  <input
                    type="text"
                    value={settingsForm.instagramUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, instagramUrl: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-400 uppercase mb-1">URL Facebook</label>
                  <input
                    type="text"
                    value={settingsForm.facebookUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-400 uppercase mb-1">URL TikTok</label>
                  <input
                    type="text"
                    value={settingsForm.tiktokUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tiktokUrl: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-400 uppercase mb-1">Correo Electrónico Oficial</label>
                  <input
                    type="text"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-neutral-400 uppercase mb-1">Dirección Sede y Bodega en Bogotá</label>
                  <input
                    type="text"
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-400 uppercase mb-1">Horario de Atención</label>
                  <input
                    type="text"
                    value={settingsForm.schedule}
                    onChange={(e) => setSettingsForm({ ...settingsForm, schedule: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end">
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 font-black text-xs uppercase px-6 py-3 rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Configuración Oficial</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            TAB 7: ANALYTICS & KPIS
            ========================================================================= */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400 text-xs mb-3">
                  <span className="font-bold uppercase tracking-wider">Clics a WhatsApp</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
                    <MessageSquareText className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">{whatsappClicks}</div>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">↑ Consultas directas de moteros</p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400 text-xs mb-3">
                  <span className="font-bold uppercase tracking-wider">Vistas de Catálogo</span>
                  <div className="w-8 h-8 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">{productViews}</div>
                <p className="text-[11px] text-orange-400 font-semibold mt-1">↑ Tráfico total al ecommerce</p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400 text-xs mb-3">
                  <span className="font-bold uppercase tracking-wider">Prospectos B2B</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">{wholesaleInquiries.length}</div>
                <p className="text-[11px] text-purple-400 font-semibold mt-1">Almacenes y distribuidores</p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl">
                <div className="flex items-center justify-between text-neutral-400 text-xs mb-3">
                  <span className="font-bold uppercase tracking-wider">Envíos Registrados</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center">
                    <Truck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white">{orders.length}</div>
                <p className="text-[11px] text-blue-400 font-semibold mt-1">Guías activas de transportadoras</p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 8: REVIEWS MODERATION
            ========================================================================= */}
        {activeTab === "reviews" && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-black text-white uppercase">Moderación de Reseñas Reales</h3>
            {storedReviews.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-neutral-800 rounded-2xl p-6">
                <MessageSquareText className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-neutral-300">Aún no hay opiniones de clientes</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Cuando los moteros califiquen los productos aparecerán aquí para tu control.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {storedReviews.map((rev) => (
                  <div key={rev.id} className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-white">{rev.author}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">{rev.date}</span>
                      </div>
                      <div className="text-amber-400 text-xs mb-1">{"★".repeat(rev.rating)}</div>
                      <h4 className="text-xs font-bold text-neutral-200">{rev.title}</h4>
                      <p className="text-xs text-neutral-400 mt-1">"{rev.comment}"</p>
                      <span className="text-[10px] text-orange-400 font-mono mt-2 block">/{rev.productSlug}</span>
                    </div>
                    <div className="pt-2 border-t border-neutral-800 flex justify-end mt-3">
                      <button
                        onClick={() => handleDeleteReview(rev.productSlug, rev.id)}
                        className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* =========================================================================
          MODAL: PRODUCT FORM WITH LOCAL PC UPLOADS & LIVE CARD PREVIEW
          ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-4xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in-95">
            
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-white uppercase">
                  {editingProduct ? "Editar Producto" : "Nuevo Producto en Catálogo"}
                </h3>
                <p className="text-xs text-neutral-400">
                  Carga imágenes directamente desde tu PC y previsualiza cómo quedará la tarjeta antes de guardar.
                </p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              
              {/* Product Info Inputs */}
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
                    placeholder="Ej: Casco Shaft Pro 582 Certificado ECE 22.06"
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

              {/* BADGE CONFIG */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <h4 className="text-xs font-black uppercase text-orange-400">
                  Etiqueta / Badge Personalizado
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Texto del Badge (Ej: NOVEDAD 2026, EDICIÓN LIMITADA, MÁS VENDIDO 1°)
                    </label>
                    <input
                      type="text"
                      value={prodForm.badge}
                      onChange={(e) => setProdForm({ ...prodForm, badge: e.target.value })}
                      placeholder="Dejar vacío si no aplica"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white uppercase font-bold"
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

              {/* LOCAL PC IMAGE UPLOADS FOR 4 ANGLES */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                <div>
                  <h4 className="text-xs font-black uppercase text-white">
                    Fotografías del Producto (4 Ángulos desde tu PC)
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Haz clic en cada botón para subir la foto directamente desde tus archivos.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "1. Frontal (Principal)", key: "img1" as const, ref: fileInputRef1 },
                    { label: "2. Vista Lateral", key: "img2" as const, ref: fileInputRef2 },
                    { label: "3. Vista Posterior", key: "img3" as const, ref: fileInputRef3 },
                    { label: "4. Detalle / Interior", key: "img4" as const, ref: fileInputRef4 },
                  ].map((angle) => {
                    const imgVal = prodForm[angle.key];
                    return (
                      <div key={angle.key} className="space-y-1.5 flex flex-col justify-between">
                        <span className="text-[11px] font-bold text-neutral-300">{angle.label}</span>
                        
                        <input
                          type="file"
                          ref={angle.ref}
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, angle.key)}
                        />

                        {imgVal ? (
                          <div className="relative h-32 w-full rounded-xl overflow-hidden border border-neutral-700 bg-neutral-900 group">
                            <img src={imgVal} alt={angle.label} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => angle.ref.current?.click()}
                                className="p-1.5 rounded-lg bg-orange-500 text-neutral-950 text-[10px] font-bold"
                              >
                                Cambiar
                              </button>
                              <button
                                type="button"
                                onClick={() => setProdForm((prev) => ({ ...prev, [angle.key]: "" }))}
                                className="p-1.5 rounded-lg bg-red-600 text-white text-[10px] font-bold"
                              >
                                Borrar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => angle.ref.current?.click()}
                            className="h-32 w-full rounded-xl border border-dashed border-neutral-700 hover:border-orange-500 bg-neutral-900/50 hover:bg-neutral-900 transition-colors flex flex-col items-center justify-center p-2 text-center cursor-pointer group"
                          >
                            <Upload className="w-5 h-5 text-neutral-500 group-hover:text-orange-400 mb-1" />
                            <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white">
                              Cargar desde PC
                            </span>
                          </button>
                        )}

                        {/* Exact Recommended Dimensions Requirement */}
                        <p className="text-[10px] text-neutral-400 leading-tight">
                          Recomendado: <strong className="text-orange-400">800 x 800 px (1:1 cuadrado)</strong> • Máx 5 MB (JPG/PNG/WebP)
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Descripción Ficha Técnica
                </label>
                <textarea
                  rows={2}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* =========================================================================
                  LIVE REAL-TIME CARD PREVIEW
                  ========================================================================= */}
              <div className="p-5 rounded-2xl bg-neutral-950 border border-orange-500/40 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-orange-400" />
                    <span className="text-xs font-black uppercase text-white tracking-wider">
                      Vista Previa en Tiempo Real: Así se verá en la tienda
                    </span>
                  </div>
                  <span className="text-[10px] bg-orange-500/10 text-orange-400 font-mono font-bold px-2 py-0.5 rounded">
                    Simulación Exacta
                  </span>
                </div>

                <div className="max-w-xs mx-auto">
                  <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                    
                    {/* Image Preview Container (Clean, no text blocking it) */}
                    <div className="relative h-56 w-full bg-neutral-950 overflow-hidden">
                      <img
                        src={prodForm.img1 || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80"}
                        alt={prodForm.name || "Preview"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-950/20" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                        {prodForm.badge && (
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded shadow ${
                              prodForm.badge_color === "red"
                                ? "bg-red-600 text-white"
                                : prodForm.badge_color === "emerald"
                                ? "bg-emerald-500 text-neutral-950"
                                : prodForm.badge_color === "purple"
                                ? "bg-purple-600 text-white"
                                : prodForm.badge_color === "blue"
                                ? "bg-blue-600 text-white"
                                : "bg-orange-500 text-neutral-950"
                            }`}
                          >
                            {prodForm.badge}
                          </span>
                        )}
                      </div>

                      <span className="absolute top-2.5 right-2.5 bg-neutral-950/80 border border-neutral-700 text-neutral-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded">
                        REF: {prodForm.sku || "GR-000"}
                      </span>

                      {prodForm.stock <= 5 && (
                        <div className="absolute bottom-2 left-2.5 bg-neutral-950/90 border border-amber-500/40 text-amber-400 text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                          <Zap className="w-3 h-3 text-amber-400" />
                          <span>Últimas {prodForm.stock} unidades</span>
                        </div>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-orange-400 font-extrabold uppercase text-[10px]">
                          {prodForm.category_name}
                        </span>
                        <div className="flex items-center gap-1 text-amber-400 text-[10px] font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>5.0 (Nuevo)</span>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                        {prodForm.name || "Nombre del producto en alta definición"}
                      </h4>

                      <div className="pt-2 border-t border-neutral-800 space-y-1">
                        {prodForm.price_original > prodForm.price_retail && (
                          <span className="text-[10px] text-neutral-500 line-through block font-mono">
                            {formatCOP(prodForm.price_original)}
                          </span>
                        )}
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-black text-white font-mono">
                            {formatCOP(prodForm.price_retail || 0)}
                          </span>
                          {previewDiscount && (
                            <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1 py-0.5 rounded">
                              {previewDiscount}% OFF
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-400 font-medium">
                          en 3x de {formatCOP(previewCuota)} sin interés
                        </p>
                        {prodForm.price_wholesale > 0 && (
                          <p className="text-[10px] text-amber-400 font-medium pt-0.5">
                            Mayoristas: {formatCOP(prodForm.price_wholesale)} (x6 unid.)
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="bg-orange-500 text-neutral-950 font-black py-2 rounded-xl text-[10px] text-center uppercase tracking-wider">
                          Comprar
                        </div>
                        <div className="bg-neutral-800 text-white font-bold py-2 rounded-xl text-[10px] text-center border border-neutral-700">
                          WhatsApp
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
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
                  {editingProduct ? "Guardar Cambios" : "Publicar en la Tienda"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ORDER REGISTER (REAL LOGISTICS)
          ========================================================================= */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-5 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <h3 className="text-base font-black text-white uppercase">Registrar Despacho con Guía Real</h3>
                <p className="text-xs text-neutral-400">Genera el seguimiento oficial y el enlace a la transportadora.</p>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOrder} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold uppercase mb-1">Número de Guía Transportadora</label>
                <input
                  type="text"
                  required
                  value={newOrderForm.guideNumber}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, guideNumber: e.target.value })}
                  placeholder="Ej: 70009482012 / SER-998822"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase mb-1">Empresa Transportadora</label>
                  <select
                    value={newOrderForm.carrier}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, carrier: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Inter Rapidísimo">Inter Rapidísimo</option>
                    <option value="Servientrega">Servientrega</option>
                    <option value="Envia">Envia Colvanes</option>
                    <option value="Coordinadora">Coordinadora</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold uppercase mb-1">Estado Inicial</label>
                  <select
                    value={newOrderForm.status}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, status: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="empacado">1. Empacado en Bodega</option>
                    <option value="recolectado">2. Entregado a Transportadora</option>
                    <option value="en_transito">3. En Tránsito</option>
                    <option value="en_reparto">4. En Reparto</option>
                    <option value="entregado">5. Entregado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase mb-1">Nombre del Cliente</label>
                <input
                  type="text"
                  required
                  value={newOrderForm.customerName}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, customerName: e.target.value })}
                  placeholder="Ej: Andrés Felipe Silva"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase mb-1">WhatsApp del Cliente</label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.customerPhone}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, customerPhone: e.target.value })}
                    placeholder="3001234567"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold uppercase mb-1">Ciudad Destino</label>
                  <input
                    type="text"
                    required
                    value={newOrderForm.city}
                    onChange={(e) => setNewOrderForm({ ...newOrderForm, city: e.target.value })}
                    placeholder="Ej: Pereira, Risaralda"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase mb-1">Resumen de Productos</label>
                <input
                  type="text"
                  required
                  value={newOrderForm.productsSummary}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, productsSummary: e.target.value })}
                  placeholder="Ej: 1x Casco Shaft Pro 582 (Talla L)"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase mb-1">Valor Total (COP)</label>
                <input
                  type="number"
                  required
                  value={newOrderForm.total}
                  onChange={(e) => setNewOrderForm({ ...newOrderForm, total: Number(e.target.value) })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-white font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsOrderModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black uppercase"
                >
                  Guardar Envío
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT LOOKBOOK ALBUM WITH LOCAL IMAGE UPLOAD
          ========================================================================= */}
      {editingAlbum && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-5 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-black text-white uppercase">
                Editar Lookbook: {editingAlbum.title}
              </h3>
              <button
                onClick={() => setEditingAlbum(null)}
                className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAlbum} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold uppercase mb-1">Título de la Colección</label>
                <input
                  type="text"
                  required
                  value={albumForm.title}
                  onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                  <label className="block text-neutral-400 font-bold uppercase mb-1">Etiqueta Badge</label>
                  <input
                    type="text"
                    required
                    value={albumForm.tag}
                    onChange={(e) => setAlbumForm({ ...albumForm, tag: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white uppercase font-bold"
                  />
                </div>
              </div>

              {/* Local PC Upload for Lookbook Cover */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <span className="block text-neutral-300 font-bold">Foto de Portada del Lookbook (desde tu PC)</span>
                
                <input
                  type="file"
                  ref={albumFileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleAlbumFileUpload}
                />

                {albumForm.coverImage ? (
                  <div className="relative h-36 w-full rounded-xl overflow-hidden border border-neutral-700 bg-neutral-900 group">
                    <img src={albumForm.coverImage} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => albumFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-orange-500 text-neutral-950 font-bold text-xs"
                      >
                        Cambiar Foto desde PC
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => albumFileInputRef.current?.click()}
                    className="h-32 w-full rounded-xl border border-dashed border-neutral-700 hover:border-orange-500 bg-neutral-900/50 flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="w-5 h-5 text-neutral-500 mb-1" />
                    <span className="font-bold text-neutral-300 text-xs">Cargar Foto desde PC</span>
                  </button>
                )}

                <p className="text-[10px] text-neutral-400">
                  Recomendado: <strong className="text-orange-400">1200 x 800 px (3:2 horizontal)</strong> • Máx 5 MB (JPG/PNG/WebP)
                </p>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase mb-1">Descripción de la Línea</label>
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
                  Guardar Lookbook
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CREATE / EDIT CUSTOMER USER
          ========================================================================= */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-black text-white uppercase">Registrar Cliente</h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold uppercase mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  placeholder="Ej: Daniel Morales"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase mb-1">Teléfono WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    placeholder="3101234567"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold uppercase mb-1">Tipo de Cliente</label>
                  <select
                    value={userForm.type}
                    onChange={(e) => setUserForm({ ...userForm, type: e.target.value as any })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="detal">Detal / Minorista</option>
                    <option value="mayorista">Mayorista B2B</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  placeholder="cliente@correo.com"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase mb-1">Ciudad</label>
                <input
                  type="text"
                  value={userForm.city}
                  onChange={(e) => setUserForm({ ...userForm, city: e.target.value })}
                  placeholder="Ej: Cali, Valle"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase mb-1">Notas Internas</label>
                <textarea
                  rows={2}
                  value={userForm.notes}
                  onChange={(e) => setUserForm({ ...userForm, notes: e.target.value })}
                  placeholder="Detalles sobre compras o preferencias..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black uppercase"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}