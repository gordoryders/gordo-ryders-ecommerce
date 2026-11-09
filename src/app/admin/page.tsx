"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Product, Order, LookbookAlbum, CustomerUser, WholesaleInquiry, HeroBanner, Invoice } from "@/types";
import {
  BarChart3,
  Package,
  Truck,
  Lock,
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
  Users,
  Building2,
  FileText,
  Printer,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  Flame,
  Star,
  Zap,
  MessageSquareText,
  Calendar,
  Check,
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
    banners,
    addBanner,
    updateBanner,
    deleteBanner,
    invoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
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

  // 2. ACTIVE TABS (Redes sociales eliminada, Anuncios y Facturas agregadas)
  const [activeTab, setActiveTab] = useState<
    "products" | "banners" | "lookbooks" | "invoices" | "orders" | "users" | "wholesale" | "analytics" | "reviews"
  >("products");

  // 3. PRODUCT MODAL WITH LOCAL PC FILE UPLOADS & LIVE PREVIEW
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

  // 4. HERO BANNER / SLIDER ANNOUNCEMENT STATE
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [bannerForm, setBannerForm] = useState<{
    tag: string;
    title: string;
    highlight: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    secondaryText: string;
    secondaryLink: string;
    bgImage: string;
    isActive: boolean;
  }>({
    tag: "OFERTA RELÁMPAGO • HASTA AGOTAR STOCK",
    title: "CASCOS CERTIFICADOS",
    highlight: "HASTA 35% OFF",
    subtitle: "Homologación internacional DOT y ECE 22.06. Calotas de policarbonato reforzado.",
    buttonText: "VER CASCOS EN OFERTA",
    buttonLink: "#catalogo",
    secondaryText: "Cotizar por WhatsApp",
    secondaryLink: "https://wa.me/573000000000",
    bgImage: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1920&q=80",
    isActive: true,
  });

  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen no debe superar los 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setBannerForm((prev) => ({ ...prev, bgImage: event.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const openNewBannerModal = () => {
    setEditingBanner(null);
    setBannerForm({
      tag: "LANZAMIENTO EXCLUSIVO 2026",
      title: "NUEVA COLECCIÓN RUTERA",
      highlight: "EQUÍPATE CON GORDO RYDERS",
      subtitle: "Lo último en seguridad, cascos de alta gama y guantes con protección rígida.",
      buttonText: "EXPLORAR COLECCIÓN",
      buttonLink: "#catalogo",
      secondaryText: "Cotizar por WhatsApp",
      secondaryLink: "https://wa.me/573000000000",
      bgImage: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1920&q=80",
      isActive: true,
    });
    setIsBannerModalOpen(true);
  };

  const openEditBannerModal = (banner: HeroBanner) => {
    setEditingBanner(banner);
    setBannerForm({
      tag: banner.tag,
      title: banner.title,
      highlight: banner.highlight,
      subtitle: banner.subtitle,
      buttonText: banner.buttonText,
      buttonLink: banner.buttonLink,
      secondaryText: banner.secondaryText || "",
      secondaryLink: banner.secondaryLink || "",
      bgImage: banner.bgImage,
      isActive: banner.isActive,
    });
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    const bannerPayload: HeroBanner = {
      id: editingBanner ? editingBanner.id : `banner-${Date.now()}`,
      tag: bannerForm.tag,
      title: bannerForm.title,
      highlight: bannerForm.highlight,
      subtitle: bannerForm.subtitle,
      buttonText: bannerForm.buttonText,
      buttonLink: bannerForm.buttonLink,
      secondaryText: bannerForm.secondaryText || undefined,
      secondaryLink: bannerForm.secondaryLink || undefined,
      bgImage: bannerForm.bgImage,
      accentColor: "from-orange-600 via-amber-500 to-yellow-500",
      isActive: bannerForm.isActive,
    };

    if (editingBanner) {
      updateBanner(bannerPayload);
    } else {
      addBanner(bannerPayload);
    }
    setIsBannerModalOpen(false);
  };

  // 5. COLLAGES & LOOKBOOKS (SINCRONIZADOS CON PRODUCTOS DEL STOCK GENERAL)
  const [editingAlbum, setEditingAlbum] = useState<LookbookAlbum | null>(null);
  const [albumForm, setAlbumForm] = useState<{
    title: string;
    subtitle: string;
    tag: string;
    description: string;
    coverImage: string;
    productSlugs: string[];
  }>({
    title: "",
    subtitle: "",
    tag: "",
    description: "",
    coverImage: "",
    productSlugs: [],
  });

  const openAlbumModal = (album: LookbookAlbum) => {
    setEditingAlbum(album);
    setAlbumForm({
      title: album.title,
      subtitle: album.subtitle,
      tag: album.tag,
      description: album.description,
      coverImage: album.coverImage,
      productSlugs: album.productSlugs || [],
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
      productSlugs: albumForm.productSlugs,
    });
    setEditingAlbum(null);
  };

  // 6. INVOICES & OFFICIAL BILLS
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState<Invoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [newInvoiceForm, setNewInvoiceForm] = useState<{
    customerName: string;
    customerNitOrCedula: string;
    customerPhone: string;
    customerEmail: string;
    customerCity: string;
    customerAddress: string;
    carrier: string;
    guideNumber: string;
    selectedProductId: string;
    quantity: number;
    paymentMethod: "Wompi (Bancolombia)" | "Mercado Pago" | "PSE / Nequi" | "Transferencia Directa";
  }>({
    customerName: "",
    customerNitOrCedula: "",
    customerPhone: "300",
    customerEmail: "",
    customerCity: "Bogotá D.C.",
    customerAddress: "",
    carrier: "Inter Rapidísimo",
    guideNumber: `INT-${Math.floor(1000000 + Math.random() * 9000000)}`,
    selectedProductId: products[0]?.id || "",
    quantity: 1,
    paymentMethod: "Wompi (Bancolombia)",
  });

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === newInvoiceForm.selectedProductId) || products[0];
    const subtotal = prod.price_retail * newInvoiceForm.quantity;
    const invNumber = `FACT-GR-2026-${String(invoices.length + 101).padStart(5, "0")}`;

    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNumber,
      date: new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) + ", " + new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      customerName: newInvoiceForm.customerName,
      customerNitOrCedula: newInvoiceForm.customerNitOrCedula || "222222222222",
      customerPhone: newInvoiceForm.customerPhone,
      customerEmail: newInvoiceForm.customerEmail || "cliente@correo.com",
      customerCity: newInvoiceForm.customerCity,
      customerAddress: newInvoiceForm.customerAddress || "Despacho a Domicilio",
      carrier: newInvoiceForm.carrier,
      guideNumber: newInvoiceForm.guideNumber.toUpperCase().trim(),
      items: [
        {
          productName: prod.name,
          sku: prod.sku,
          size: "L",
          quantity: newInvoiceForm.quantity,
          unitPrice: prod.price_retail,
          subtotal,
        },
      ],
      subtotal,
      shippingCost: 0,
      tax: 0,
      total: subtotal,
      paymentMethod: newInvoiceForm.paymentMethod,
      paymentStatus: "pagado",
    };

    addInvoice(newInv);

    // Also register order in dispatches
    addOrder({
      id: `ord-${Date.now()}`,
      guideNumber: newInv.guideNumber,
      carrier: newInv.carrier as any,
      customerName: newInv.customerName,
      customerPhone: newInv.customerPhone,
      city: newInv.customerCity,
      total: newInv.total,
      itemsCount: newInvoiceForm.quantity,
      status: "empacado",
      date: "Hoy, " + new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
      productsSummary: `${newInvoiceForm.quantity}x ${prod.name}`,
    });

    setIsInvoiceModalOpen(false);
    setSelectedInvoiceForView(newInv);
  };

  // 7. DISPATCHES / ORDERS REALISTIC LOGISTICS
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

  // 8. USERS WITH 360° PROFILE
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<CustomerUser | null>(null);

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

  // Calculate live preview discount
  const previewDiscount =
    prodForm.price_original && prodForm.price_original > prodForm.price_retail
      ? Math.round(((prodForm.price_original - prodForm.price_retail) / prodForm.price_original) * 100)
      : null;
  const previewCuota = Math.round(prodForm.price_retail / 3);

  // Serious Functional Analytics Calculations
  const totalInventoryValue = products.reduce((acc, p) => acc + p.price_retail * (p.stock || 0), 0);
  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalInvoicedSales = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const averageTicket = invoices.length > 0 ? Math.round(totalInvoicedSales / invoices.length) : 0;
  const conversionRate = productViews > 0 ? ((whatsappClicks / productViews) * 100).toFixed(1) : "0.0";
  const lowStockProducts = products.filter((p) => (p.stock || 0) <= 5);

  // Quick Restock handler
  const handleQuickRestock = (productId: string, addQty: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    updateProduct({ ...prod, stock: (prod.stock || 0) + addQty });
  };

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
              Gordo Ryders • Backoffice Central
            </h1>
            <p className="text-xs text-neutral-400">
              Módulo exclusivo de administración. Acceso privado mediante clave maestra.
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-orange-500 selection:text-neutral-950">
      
      {/* Top Backoffice Header Bar (Limpio, sin aviso 'Panel Separado 2026') */}
      <header className="sticky top-0 z-40 bg-neutral-900 border-b border-neutral-800 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center font-black text-neutral-950 text-base shadow-md">
            GR
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-black uppercase text-white tracking-wide">
              Gordo Ryders • Backoffice Central
            </h1>
            <p className="text-[11px] text-neutral-400">
              Gestión Integral de Catálogo, Anuncios Slider, Collages, Facturas, Envíos y Clientes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 border border-neutral-700"
          >
            <Eye className="w-3.5 h-3.5 text-orange-400" />
            <span>Ver Tienda en Vivo</span>
            <ExternalLink className="w-3 h-3 text-neutral-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold px-3.5 py-2 rounded-xl transition-all border border-red-500/30 flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs Bar con Scrollbar estilizada y sin recortes */}
      <div className="bg-neutral-900/80 border-b border-neutral-800 px-4 sm:px-8 sticky top-[65px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-3 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
          {[
            { id: "products", label: "Catálogo & Stock", icon: Package, badge: products.length },
            { id: "banners", label: "Anuncios & Slider Home", icon: Sparkles, badge: banners.filter((b) => b.isActive).length },
            { id: "lookbooks", label: "Lookbooks & Cajas", icon: Layers, badge: albums.length },
            { id: "invoices", label: "Facturación Oficial", icon: FileText, badge: invoices.length },
            { id: "orders", label: "Registro de Envíos", icon: Truck, badge: orders.length },
            { id: "users", label: "Expediente Clientes", icon: Users, badge: users.length },
            { id: "wholesale", label: "Mayoristas B2B", icon: Building2, badge: wholesaleInquiries.length },
            { id: "analytics", label: "Métricas & Análisis", icon: BarChart3 },
            { id: "reviews", label: "Reseñas Clientes", icon: MessageSquareText, badge: storedReviews.length },
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* =========================================================================
            TAB 1: PRODUCTS & INVENTORY
            ========================================================================= */}
        {activeTab === "products" && (
          <div className="space-y-6">
            
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
                <span>Agregar Producto (Fotos del PC)</span>
              </button>
            </div>

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
            TAB 2: HERO SLIDER ANNOUNCEMENTS & BANNERS (NUEVA SECCIÓN PEDIDA)
            ========================================================================= */}
        {activeTab === "banners" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black uppercase text-white">Anuncios y Slider Principal del Home</h3>
                <p className="text-xs text-neutral-400">
                  Controla los banners grandes promocionales que ven los moteros al ingresar a la tienda.
                </p>
              </div>
              <button
                onClick={openNewBannerModal}
                className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Crear Nuevo Anuncio Slider</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((b) => (
                <div
                  key={b.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-48 w-full bg-neutral-950 overflow-hidden">
                      <img src={b.bgImage} alt={b.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
                      <div className="absolute top-3 left-3 bg-orange-500 text-neutral-950 font-black text-[10px] uppercase px-2.5 py-0.5 rounded shadow">
                        {b.tag}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <h4 className="text-base font-black text-white uppercase">{b.title}</h4>
                        <span className="text-xs font-bold text-orange-400 block">{b.highlight}</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">
                        {b.subtitle}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-neutral-400 font-mono pt-1">
                        <span>Botón: <strong className="text-white">{b.buttonText}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 border-t border-neutral-800/80 flex items-center justify-between gap-2 mt-2">
                    <button
                      onClick={() => updateBanner({ ...b, isActive: !b.isActive })}
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                        b.isActive
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-neutral-800 text-neutral-500 border border-neutral-700"
                      }`}
                    >
                      {b.isActive ? "En Pantalla" : "Pausado"}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditBannerModal(b)}
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white transition-colors cursor-pointer"
                        title="Editar Anuncio"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar anuncio "${b.title}"?`)) deleteBanner(b.id);
                        }}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                        title="Eliminar Anuncio"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: LOOKBOOKS & CAJAS (SINCRONIZADO CON STOCK GENERAL)
            ========================================================================= */}
        {activeTab === "lookbooks" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black uppercase text-white">Lookbooks & Cajas de Equipamiento</h3>
              <p className="text-xs text-neutral-400">
                Selecciona productos del stock general para armar cada collage. Cualquier cambio en precio o stock se sincroniza de inmediato.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {albums.map((album) => {
                const albumProducts = (album.productSlugs || [])
                  .map((slug) => products.find((p) => p.slug === slug || p.id === slug))
                  .filter(Boolean) as Product[];

                return (
                  <div
                    key={album.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xl"
                  >
                    <div>
                      {/* Mini 4-photo quadrant preview */}
                      <div className="grid grid-cols-2 gap-1 p-2 bg-neutral-950 h-44">
                        {albumProducts.length >= 4 ? (
                          albumProducts.slice(0, 4).map((p, idx) => (
                            <div key={idx} className="relative rounded-lg overflow-hidden bg-neutral-900">
                              <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover" />
                              <span className="absolute bottom-1 left-1 text-[8px] bg-black/80 px-1 rounded text-white font-mono truncate max-w-[90%]">
                                {p.name}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-2 relative h-full rounded-lg overflow-hidden">
                            <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                            {album.tag}
                          </span>
                          <span className="text-xs text-neutral-400">{album.subtitle}</span>
                        </div>
                        <h4 className="text-sm font-black text-white">{album.title}</h4>
                        <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                          {album.description}
                        </p>
                        <span className="text-[11px] font-bold text-emerald-400 block pt-1">
                          ✓ {albumProducts.length} productos seleccionados del catálogo
                        </span>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <button
                        onClick={() => openAlbumModal(album)}
                        className="w-full bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 border border-neutral-700 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                        <span>Configurar Productos de este Collage</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: INVOICES & OFFICIAL BILLS (NUEVA SECCIÓN FACTURACIÓN)
            ========================================================================= */}
        {activeTab === "invoices" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black uppercase text-white">Facturación Oficial de Venta</h3>
                <p className="text-xs text-neutral-400">
                  Comprobantes oficiales de venta de Gordo Ryders con número de guía, desglose de productos y soporte para impresión PDF.
                </p>
              </div>
              <button
                onClick={() => setIsInvoiceModalOpen(true)}
                className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Generar Factura Oficial de Venta</span>
              </button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 border-b border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-400">
                    <tr>
                      <th className="p-4">N° Factura</th>
                      <th className="p-4">Fecha</th>
                      <th className="p-4">Cliente & Destino</th>
                      <th className="p-4">Guía Transportadora</th>
                      <th className="p-4">Total Venta</th>
                      <th className="p-4">Método de Pago</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/60">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="p-4 font-mono font-bold text-orange-400">
                          {inv.invoiceNumber}
                        </td>
                        <td className="p-4 text-neutral-400 font-mono text-[11px]">
                          {inv.date}
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-white">{inv.customerName}</p>
                          <span className="text-[10px] text-neutral-400">📍 {inv.customerCity}</span>
                        </td>
                        <td className="p-4 font-mono">
                          <span className="text-white font-bold block">{inv.guideNumber}</span>
                          <span className="text-[10px] text-neutral-500">{inv.carrier}</span>
                        </td>
                        <td className="p-4 font-mono font-black text-emerald-400 text-sm">
                          {formatCOP(inv.total)}
                        </td>
                        <td className="p-4">
                          <span className="text-[10px] font-bold bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded">
                            {inv.paymentMethod}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedInvoiceForView(inv)}
                              className="px-3 py-1.5 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 border border-orange-500/30 font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>Ver Factura</span>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar factura ${inv.invoiceNumber}?`)) deleteInvoice(inv.id);
                              }}
                              className="p-1.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
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
            TAB 5: REALISTIC CARRIER LOGISTICS & EN ROUTE TRACKING
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
              {orders
                .filter((o) => {
                  const q = orderFilterQuery.toLowerCase();
                  return o.guideNumber.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.city.toLowerCase().includes(q);
                })
                .map((ord) => {
                  const waMessage = encodeURIComponent(
                    `Hola ${ord.customerName}, tu pedido de Gordo Ryders ya está en curso con guía ${ord.guideNumber} por ${ord.carrier}. Rastréalo en vivo aquí: https://gordo-ryders-ecommerce.vercel.app/rastreo`
                  );

                  return (
                    <div
                      key={ord.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                          <span className="font-mono text-xs font-black text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg">
                            GUÍA: {ord.guideNumber}
                          </span>
                          <span className="text-[11px] font-bold text-neutral-400">{ord.carrier}</span>
                        </div>

                        <div className="mt-3 space-y-1">
                          <h4 className="text-sm font-black text-white">{ord.customerName}</h4>
                          <p className="text-xs text-neutral-400">📍 {ord.city}</p>
                          <p className="text-xs text-neutral-300 font-medium line-clamp-2 mt-1">📦 {ord.productsSummary}</p>
                          <p className="text-xs font-mono font-bold text-emerald-400 mt-1">Total: {formatCOP(ord.total)}</p>
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
                            <option value="empacado">📦 1. Empacado en Bodega</option>
                            <option value="recolectado">🚚 2. Entregado a Transportadora</option>
                            <option value="en_transito">🛣️ 3. En Tránsito Intermunicipal</option>
                            <option value="en_reparto">🛵 4. En Reparto Local</option>
                            <option value="entregado">✅ 5. Entregado al Cliente</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href="/rastreo"
                            target="_blank"
                            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5 text-orange-400" />
                            <span>Rastreo en Vivo</span>
                          </Link>

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
            TAB 6: USERS 360° PROFILE (EXPEDIENTE DEL CLIENTE)
            ========================================================================= */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-black uppercase text-white">Expedientes de Clientes 360°</h3>
              <p className="text-xs text-neutral-400">
                Información de cuenta, método de inicio de sesión (Google o Correo), compras recientes y comentarios.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((usr) => (
                <div
                  key={usr.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                      <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                        {usr.authProvider || "Google Workspace"}
                      </span>
                      <span className="text-[10px] text-neutral-500">{usr.registrationDate}</span>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      <h4 className="text-sm font-black text-white">{usr.name}</h4>
                      <p className="text-xs text-neutral-300">✉️ {usr.email}</p>
                      <p className="text-xs text-neutral-400">📱 {usr.phone} • 📍 {usr.city}</p>
                      
                      <div className="p-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-xs space-y-1 mt-2">
                        <div className="flex justify-between text-neutral-400">
                          <span>Compras registradas:</span>
                          <strong className="text-white">{usr.ordersCount} pedidos</strong>
                        </div>
                        <div className="flex justify-between text-neutral-400">
                          <span>Inversión total:</span>
                          <strong className="text-emerald-400 font-mono">{formatCOP(usr.totalSpent)}</strong>
                        </div>
                      </div>

                      {usr.notes && (
                        <p className="text-[11px] text-neutral-400 italic pt-1">
                          "{usr.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-800 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedUserForDetail(usr)}
                      className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs py-2 rounded-xl text-center border border-neutral-700 transition-all cursor-pointer"
                    >
                      Ver Expediente Completo
                    </button>
                    <a
                      href={`https://wa.me/57${usr.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all"
                    >
                      <MessageSquareText className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: WHOLESALE B2B PIPELINE
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
              {wholesaleInquiries.map((wh) => (
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
                        <option value="en_negociacion">3. En Negociación</option>
                        <option value="cerrado">4. Pago Confirmado / Cerrado</option>
                        <option value="descartado">5. Descartado</option>
                      </select>
                    </div>

                    <a
                      href={`https://wa.me/57${wh.phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs py-2.5 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all shadow"
                    >
                      <MessageSquareText className="w-3.5 h-3.5" />
                      <span>Atender por WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 8: SERIOUS FUNCTIONAL ANALYTICS & REVENUE ANALYSIS
            ========================================================================= */}
        {activeTab === "analytics" && (
          <div className="space-y-6">
            
            {/* Primary KPI Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-1">
                  Valor Total del Inventario
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {formatCOP(totalInventoryValue)}
                </div>
                <p className="text-[11px] text-emerald-400 font-semibold mt-1">
                  {totalStockUnits} unidades físicas en bodega
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-1">
                  Ventas Facturadas
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {formatCOP(totalInvoicedSales)}
                </div>
                <p className="text-[11px] text-orange-400 font-semibold mt-1">
                  {invoices.length} facturas oficiales emitidas
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-1">
                  Ticket Promedio de Venta
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {formatCOP(averageTicket)}
                </div>
                <p className="text-[11px] text-blue-400 font-semibold mt-1">
                  Por orden de compra
                </p>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-xl">
                <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block mb-1">
                  Tasa de Conversión a WhatsApp
                </span>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {conversionRate}%
                </div>
                <p className="text-[11px] text-purple-400 font-semibold mt-1">
                  {whatsappClicks} clics / {productViews} visitas
                </p>
              </div>
            </div>

            {/* Low Stock Real-Time Alert & Quick Restock */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-black uppercase text-white">
                    Alerta de Bajo Stock (Productos con 5 o menos unidades)
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                  {lowStockProducts.length} productos en riesgo
                </span>
              </div>

              {lowStockProducts.length === 0 ? (
                <p className="text-xs text-neutral-400">Todo el inventario cuenta con stock óptimo.</p>
              ) : (
                <div className="space-y-3">
                  {lowStockProducts.map((p) => (
                    <div
                      key={p.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                          <p className="text-xs font-bold text-white line-clamp-1">{p.name}</p>
                          <span className="text-[10px] text-neutral-500 font-mono">SKU: {p.sku}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-amber-400 font-mono bg-amber-500/10 px-2 py-1 rounded">
                          {p.stock} unid. restantes
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleQuickRestock(p.id, 5)}
                            className="bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-neutral-700 cursor-pointer"
                          >
                            +5 Unid
                          </button>
                          <button
                            onClick={() => handleQuickRestock(p.id, 10)}
                            className="bg-orange-500 hover:bg-orange-600 text-neutral-950 text-[10px] font-black px-2.5 py-1.5 rounded-lg cursor-pointer"
                          >
                            +10 Unid
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 9: REVIEWS MODERATION
            ========================================================================= */}
        {activeTab === "reviews" && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-base font-black text-white uppercase">Moderación de Reseñas Reales de Clientes</h3>
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
          MODAL: PRODUCT FORM WITH LOCAL PC UPLOADS & LIVE PREVIEW
          ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-4xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto animate-in fade-in zoom-in-95">
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
                <h4 className="text-xs font-black uppercase text-orange-400">Etiqueta / Badge Personalizado</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">
                      Texto del Badge
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
                  <h4 className="text-xs font-black uppercase text-white">Fotografías del Producto (4 Ángulos desde tu PC)</h4>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Haz clic en cada botón para subir la foto directamente desde tus archivos.</p>
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
                            <span className="text-[11px] font-bold text-neutral-300 group-hover:text-white">Cargar desde PC</span>
                          </button>
                        )}
                        <p className="text-[10px] text-neutral-400 leading-tight">
                          Recomendado: <strong className="text-orange-400">800 x 800 px (1:1 cuadrado)</strong> • Máx 5 MB
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

              {/* LIVE REAL-TIME CARD PREVIEW */}
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
                    <div className="relative h-56 w-full bg-neutral-950 overflow-hidden">
                      <img
                        src={prodForm.img1 || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80"}
                        alt={prodForm.name || "Preview"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-950/20" />
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
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-orange-400 font-extrabold uppercase text-[10px]">{prodForm.category_name}</span>
                        <div className="flex items-center gap-1 text-amber-400 text-[10px] font-bold">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>5.0 (Nuevo)</span>
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                        {prodForm.name || "Nombre del producto"}
                      </h4>
                      <div className="pt-2 border-t border-neutral-800 space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-black text-white font-mono">{formatCOP(prodForm.price_retail || 0)}</span>
                          {previewDiscount && (
                            <span className="text-[10px] font-black text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1 py-0.5 rounded">
                              {previewDiscount}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

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
          MODAL: HERO BANNER / SLIDER ANNOUNCEMENT CREATE / EDIT
          ========================================================================= */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl space-y-5 my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-black text-white uppercase">
                {editingBanner ? "Editar Anuncio Slider" : "Crear Nuevo Anuncio Slider"}
              </h3>
              <button onClick={() => setIsBannerModalOpen(false)} className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase mb-1">Etiqueta Superior</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.tag}
                    onChange={(e) => setBannerForm({ ...bannerForm, tag: e.target.value })}
                    placeholder="Ej: OFERTA RELÁMPAGO 35% OFF"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold uppercase mb-1">Título Principal</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    placeholder="Ej: CASCOS CERTIFICADOS"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase mb-1">Destacado (Naranja / Verde)</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.highlight}
                    onChange={(e) => setBannerForm({ ...bannerForm, highlight: e.target.value })}
                    placeholder="Ej: HASTA 35% OFF"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold uppercase mb-1">Texto del Botón</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.buttonText}
                    onChange={(e) => setBannerForm({ ...bannerForm, buttonText: e.target.value })}
                    placeholder="Ej: VER CASCOS EN OFERTA"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase mb-1">Subtítulo / Bajada</label>
                <textarea
                  rows={2}
                  required
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  placeholder="Descripción atractiva del banner..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white"
                />
              </div>

              {/* Local PC Upload for Banner Background */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
                <span className="block text-neutral-300 font-bold">Foto de Fondo del Anuncio (desde tu PC)</span>
                <input type="file" ref={bannerFileInputRef} accept="image/*" className="hidden" onChange={handleBannerFileUpload} />
                {bannerForm.bgImage ? (
                  <div className="relative h-36 w-full rounded-xl overflow-hidden border border-neutral-700 bg-neutral-900 group">
                    <img src={bannerForm.bgImage} alt="Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => bannerFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-orange-500 text-neutral-950 font-bold text-xs"
                      >
                        Cambiar Foto desde PC
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => bannerFileInputRef.current?.click()}
                    className="h-28 w-full rounded-xl border border-dashed border-neutral-700 hover:border-orange-500 bg-neutral-900/50 flex flex-col items-center justify-center cursor-pointer"
                  >
                    <Upload className="w-5 h-5 text-neutral-500 mb-1" />
                    <span className="font-bold text-neutral-300 text-xs">Cargar Foto desde PC</span>
                  </button>
                )}
                <p className="text-[10px] text-neutral-400">
                  Recomendado: <strong className="text-orange-400">1920 x 800 px (Panorámica 16:9 o 21:9)</strong> • Máx 5 MB
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="bannerActive"
                  checked={bannerForm.isActive}
                  onChange={(e) => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                  className="w-4 h-4 accent-orange-500 rounded"
                />
                <label htmlFor="bannerActive" className="text-neutral-300 font-bold cursor-pointer">
                  Mostrar este anuncio inmediatamente en el slider del Home
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button type="button" onClick={() => setIsBannerModalOpen(false)} className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black uppercase">
                  Guardar Anuncio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT COLLAGE WITH SELECTION OF EXISTING PRODUCTS
          ========================================================================= */}
      {editingAlbum && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl space-y-5 my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-black text-white uppercase">
                Configurar Collage / Caja: {editingAlbum.title}
              </h3>
              <button onClick={() => setEditingAlbum(null)} className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAlbum} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase mb-1">Título del Collage</label>
                  <input
                    type="text"
                    required
                    value={albumForm.title}
                    onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-bold"
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

              {/* SELECCIÓN DE PRODUCTOS DEL CATÁLOGO PARA ESTE COLLAGE */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-black uppercase text-orange-400">
                      Productos que conforman este Collage (4 Productos Mosaico)
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Toma automáticamente la foto, el precio y el stock general de cada producto.
                    </p>
                  </div>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {products.map((p) => {
                    const isSelected = albumForm.productSlugs.includes(p.slug) || albumForm.productSlugs.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-orange-500/15 border-orange-500/50 text-white"
                            : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAlbumForm({
                                  ...albumForm,
                                  productSlugs: [...albumForm.productSlugs, p.slug],
                                });
                              } else {
                                setAlbumForm({
                                  ...albumForm,
                                  productSlugs: albumForm.productSlugs.filter((s) => s !== p.slug && s !== p.id),
                                });
                              }
                            }}
                            className="w-4 h-4 accent-orange-500 rounded"
                          />
                          <img src={p.images?.[0]} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <span className="font-bold text-xs text-white block">{p.name}</span>
                            <span className="text-[10px] text-neutral-500 font-mono">SKU: {p.sku} • Stock: {p.stock}</span>
                          </div>
                        </div>
                        <span className="text-xs font-mono font-bold text-orange-400">{formatCOP(p.price_retail)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase mb-1">Descripción del Kit</label>
                <textarea
                  rows={2}
                  value={albumForm.description}
                  onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button type="button" onClick={() => setEditingAlbum(null)} className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black uppercase">
                  Guardar Collage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: VIEW / PRINT OFFICIAL INVOICE (FACTURA DE VENTA)
          ========================================================================= */}
      {selectedInvoiceForView && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-neutral-950 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto animate-in fade-in zoom-in-95">
            
            {/* Invoice Printable Header */}
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center font-black text-white text-xl">
                  GR
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tight text-neutral-900">
                    GORDO RYDERS COLOMBIA
                  </h3>
                  <p className="text-xs text-neutral-600">NIT: 901.442.891-1 • Régimen Común</p>
                  <p className="text-xs text-neutral-600">Bodega Principal: Sector 7 de Agosto, Bogotá D.C.</p>
                  <p className="text-xs text-neutral-600">WhatsApp Oficial: +57 300 000 0000</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-neutral-500 block">Factura Oficial de Venta</span>
                <strong className="text-lg font-black font-mono text-orange-600">{selectedInvoiceForView.invoiceNumber}</strong>
                <p className="text-xs text-neutral-500 font-mono mt-1">{selectedInvoiceForView.date}</p>
                <span className="inline-block bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase mt-1">
                  ✓ Pagado
                </span>
              </div>
            </div>

            {/* Customer & Shipping Guide Bar */}
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-neutral-100 text-xs">
              <div>
                <span className="font-bold uppercase text-neutral-500 text-[10px] block">Facturado a:</span>
                <p className="font-black text-sm text-neutral-900">{selectedInvoiceForView.customerName}</p>
                <p className="text-neutral-700">C.C. / NIT: {selectedInvoiceForView.customerNitOrCedula}</p>
                <p className="text-neutral-700">Teléfono: {selectedInvoiceForView.customerPhone}</p>
                <p className="text-neutral-700">Ciudad: {selectedInvoiceForView.customerCity}</p>
              </div>

              <div>
                <span className="font-bold uppercase text-neutral-500 text-[10px] block">Despacho & Seguimiento Oficial:</span>
                <p className="font-bold text-neutral-900">Transportadora: {selectedInvoiceForView.carrier}</p>
                <p className="font-mono font-black text-orange-600 text-sm">GUÍA: {selectedInvoiceForView.guideNumber}</p>
                <p className="text-neutral-700">Método de pago: {selectedInvoiceForView.paymentMethod}</p>
                <Link
                  href="/rastreo"
                  target="_blank"
                  className="text-orange-600 font-bold underline text-[11px] block mt-1"
                >
                  Rastrear paquete en vivo aquí →
                </Link>
              </div>
            </div>

            {/* Line items table */}
            <div className="border rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100 border-b text-[11px] uppercase tracking-wider text-neutral-600">
                  <tr>
                    <th className="p-3">Producto / Referencia</th>
                    <th className="p-3 text-center">Cant.</th>
                    <th className="p-3 text-right">Precio Unitario</th>
                    <th className="p-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-neutral-800">
                  {selectedInvoiceForView.items.map((item, i) => (
                    <tr key={i}>
                      <td className="p-3">
                        <strong className="text-neutral-900 block">{item.productName}</strong>
                        <span className="text-[10px] text-neutral-500 font-mono">SKU: {item.sku} • Talla: {item.size || "M"}</span>
                      </td>
                      <td className="p-3 text-center font-bold">{item.quantity}</td>
                      <td className="p-3 text-right font-mono">{formatCOP(item.unitPrice)}</td>
                      <td className="p-3 text-right font-mono font-bold">{formatCOP(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-between items-center pt-2">
              <div className="text-[11px] text-neutral-500 max-w-xs">
                Esta factura de venta constituye título valor según la legislación colombiana. Mercancía despachada con control de calidad Gordo Ryders.
              </div>
              <div className="text-right space-y-1">
                <div className="text-xs text-neutral-600">Subtotal: <span className="font-mono">{formatCOP(selectedInvoiceForView.subtotal)}</span></div>
                <div className="text-xs text-neutral-600">Envío Nacional: <span className="text-emerald-600 font-bold">GRATIS</span></div>
                <div className="text-base sm:text-lg font-black text-neutral-900 border-t pt-1">
                  TOTAL PAGADO: <span className="font-mono text-orange-600">{formatCOP(selectedInvoiceForView.total)}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <button
                onClick={() => setSelectedInvoiceForView(null)}
                className="px-4 py-2 rounded-xl bg-neutral-200 text-neutral-800 font-bold text-xs"
              >
                Cerrar
              </button>
              <button
                onClick={() => window.print()}
                className="bg-neutral-900 hover:bg-neutral-800 text-white font-black text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow"
              >
                <Printer className="w-4 h-4 text-orange-400" />
                <span>Imprimir / Descargar Factura PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: NEW INVOICE CREATION
          ========================================================================= */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-5 my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-black text-white uppercase">Generar Factura Oficial de Venta</h3>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold uppercase mb-1">Nombre Completo del Cliente</label>
                <input
                  type="text"
                  required
                  value={newInvoiceForm.customerName}
                  onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, customerName: e.target.value })}
                  placeholder="Ej: David Restrepo"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase mb-1">Cédula o NIT</label>
                  <input
                    type="text"
                    required
                    value={newInvoiceForm.customerNitOrCedula}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, customerNitOrCedula: e.target.value })}
                    placeholder="1.020.304.506"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold uppercase mb-1">Teléfono WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={newInvoiceForm.customerPhone}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, customerPhone: e.target.value })}
                    placeholder="3101234567"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase mb-1">Ciudad Destino</label>
                  <input
                    type="text"
                    required
                    value={newInvoiceForm.customerCity}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, customerCity: e.target.value })}
                    placeholder="Ej: Medellín, Antioquia"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold uppercase mb-1">Transportadora</label>
                  <select
                    value={newInvoiceForm.carrier}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, carrier: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Inter Rapidísimo">Inter Rapidísimo</option>
                    <option value="Servientrega">Servientrega</option>
                    <option value="Envia">Envia Colvanes</option>
                    <option value="Coordinadora">Coordinadora</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase mb-1">Producto Vendido</label>
                  <select
                    value={newInvoiceForm.selectedProductId}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, selectedProductId: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({formatCOP(p.price_retail)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold uppercase mb-1">Cantidad</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newInvoiceForm.quantity}
                    onChange={(e) => setNewInvoiceForm({ ...newInvoiceForm, quantity: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button type="button" onClick={() => setIsInvoiceModalOpen(false)} className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black uppercase">
                  Emitir Factura
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: USER 360° PROFILE DETAIL
          ========================================================================= */}
      {selectedUserForDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-5 my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-black text-white uppercase">Expediente de Cliente 360°</h3>
              <button onClick={() => setSelectedUserForDetail(null)} className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-black text-white">{selectedUserForDetail.name}</h4>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    {selectedUserForDetail.status}
                  </span>
                </div>
                <p className="text-neutral-300">✉️ Correo: {selectedUserForDetail.email}</p>
                <p className="text-neutral-300">📱 WhatsApp: {selectedUserForDetail.phone}</p>
                <p className="text-neutral-300">📍 Ciudad: {selectedUserForDetail.city}</p>
                <p className="text-neutral-400">🔑 Método de inicio: <strong className="text-orange-400">{selectedUserForDetail.authProvider || "Google Workspace"}</strong></p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Historial de Compras & Facturas</span>
                <p className="text-white font-bold">{selectedUserForDetail.ordersCount} pedidos realizados</p>
                <p className="text-emerald-400 font-mono font-black text-sm">Total Invertido: {formatCOP(selectedUserForDetail.totalSpent)}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                <button onClick={() => setSelectedUserForDetail(null)} className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold">
                  Cerrar
                </button>
                <a
                  href={`https://wa.me/57${selectedUserForDetail.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5"
                >
                  <MessageSquareText className="w-3.5 h-3.5" />
                  <span>Chatear por WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ORDER REGISTER (LOGISTICS)
          ========================================================================= */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-5 my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h3 className="text-base font-black text-white uppercase">Registrar Despacho con Guía Real</h3>
              <button onClick={() => setIsOrderModalOpen(false)} className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white">
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
                  <label className="block text-neutral-400 font-bold uppercase mb-1">WhatsApp</label>
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
                <button type="button" onClick={() => setIsOrderModalOpen(false)} className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black uppercase">
                  Guardar Envío
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}