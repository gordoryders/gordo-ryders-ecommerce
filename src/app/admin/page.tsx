"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useStore, getAutoOrderStatus } from "@/context/StoreContext";
import { Product, Order, LookbookAlbum, CustomerUser, WholesaleInquiry, HeroBanner, Invoice, Category, ProductCombo } from "@/types";
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
  Menu,
  Copy,
  ChevronRight,
  Home,
  Globe,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Store,
  Send,
  MessageSquare,
  Bot,
  Phone,
  ShoppingBag,
  ClipboardList,
  Ban,
  UserCheck,
  UtensilsCrossed,
} from "lucide-react";

export default function AdminPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    combos,
    addCombo,
    updateCombo,
    deleteCombo,
    setProductOffer,
    orders,
    addOrder,
    updateOrder,
    deleteOrder,
    createManualOrder,
    albums,
    updateAlbum,
    users,
    addUser,
    updateUser,
    deleteUser,
    banUser,
    unbanUser,
    wholesaleInquiries,
    addWholesaleInquiry,
    updateWholesaleInquiry,
    deleteWholesaleInquiry,
    approveWholesaleUser,
    rejectWholesaleUser,
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
    supportChats,
    sendMessageFromAgent,
    markChatStatus,
    deleteChatSession,
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

  // 2. ADMIN MODULE & ACTIVE TABS
  // Module architecture: "hub" (Pantalla de Inicio / Hub Central) | "store" (CMS Tienda Web) | "operations" (Backoffice Operaciones, Envíos, Clientes)
  const [adminModule, setAdminModule] = useState<"hub" | "store" | "operations">("hub");
  const [activeTab, setActiveTab] = useState<
    "products" | "combos" | "offers" | "categories" | "banners" | "lookbooks" | "invoices" | "orders" | "users" | "wholesale" | "analytics" | "reviews" | "support"
  >("products");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [userTypeFilter, setUserTypeFilter] = useState<"all" | "mayorista" | "detal">("all");
  const [selectedSupportChatId, setSelectedSupportChatId] = useState<string>("");
  const [agentReplyText, setAgentReplyText] = useState<string>("");
  const [supportFilter, setSupportFilter] = useState<"all" | "needs_human" | "b2b" | "resolved">("all");
  const [supportSearch, setSupportSearch] = useState<string>("");
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to latest message
  useEffect(() => {
    if (activeTab === "support") {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTab, selectedSupportChatId, supportChats]);

  // 3. PRODUCT MODAL WITH LOCAL PC FILE UPLOADS & LIVE PREVIEW
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");

  const SPECS_TEMPLATES = {
    cascos: [
      { label: "Marca Oficial", value: "ICH Helmets (Inducascos Colombia)" },
      { label: "Referencia", value: "ICH 3110 Modular Doble Visor" },
      { label: "Certificación", value: "DOT FMVSS 218 y NTC 4533 (Resolución 1080)" },
      { label: "Material Calota", value: "Termoplástico ABS inyectado de alto impacto" },
      { label: "Sistema de Visor", value: "Doble Visor: Exterior UV anti-scratch + Gafas solares retráctiles" },
      { label: "Ventilación", value: "Entradas frontales y superiores regulables con spoiler extractor" },
      { label: "Interior / Tapizado", value: "Acolchado transpirable hipoalergénico desmontable y lavable" },
      { label: "Sistema de Cierre", value: "Hebilla micrométrica de ajuste milimétrico rápido" },
      { label: "Intercomunicador", value: "Cavidades pre-moldeadas para parlantes Bluetooth" },
      { label: "Garantía Oficial", value: "6 meses directa de fábrica" },
    ],
    guantes: [
      { label: "Marca Oficial", value: "Proviker" },
      { label: "Referencia", value: "Guante Protección Urbana Ref E44" },
      { label: "Material Principal", value: "Textil ventilado microperforado de alta resistencia" },
      { label: "Protección Nudillos", value: "Protección rígida moldeada en polímero anti-impacto" },
      { label: "Palma / Agarre", value: "Capa antideslizante con textura de silicona antivibración" },
      { label: "Compatibilidad Táctil", value: "Tecnología Touch Screen en dedos índice y pulgar" },
      { label: "Cierre", value: "Correa elástica en muñeca con velcro de alta adherencia" },
      { label: "Garantía Oficial", value: "3 meses por costuras y materiales" },
    ],
    impermeables: [
      { label: "Tipo de Prenda", value: "Enterizo siliconado con capucha ergonómica y zapatones" },
      { label: "Material", value: "Poliéster siliconado calibre 16 100% impermeable" },
      { label: "Sellado de Costuras", value: "100% termoselladas vulcanizadas a calor anti-filtración" },
      { label: "Seguridad Vial", value: "Cintas reflectivas de alta intensidad 360° para noche y lluvia" },
      { label: "Accesorios Incluidos", value: "Incluye tula transportadora compacta hermética" },
      { label: "Garantía Oficial", value: "3 meses de impermeabilidad total" },
    ],
    chaquetas: [
      { label: "Marca Oficial", value: "Gordo Ryders Touring Series" },
      { label: "Material Exterior", value: "Cordura 600D resistente a la abrasión y al viento" },
      { label: "Protecciones", value: "Insertos CE Nivel 2 en hombros, codos y espalda removibles" },
      { label: "Forro Térmico", value: "Chaleco térmico interior desmontable para clima frío" },
      { label: "Ventilación", value: "Cremalleras de ventilación directa en pecho y espalda" },
      { label: "Ajuste", value: "Correas regulables en cintura, brazos y puños" },
      { label: "Garantía Oficial", value: "6 meses directa de fábrica" },
    ],
  };

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
    offer_is_active: boolean;
    offer_price: number;
    offer_duration_type: "permanent" | "hours" | "days";
    offer_duration_value: number;
    offer_badge_text: string;
    img1: string;
    img2: string;
    img3: string;
    img4: string;
    description: string;
    specs: { label: string; value: string }[];
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
    offer_is_active: false,
    offer_price: 220000,
    offer_duration_type: "permanent",
    offer_duration_value: 24,
    offer_badge_text: "OFERTA RELÁMPAGO",
    img1: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
    img2: "",
    img3: "",
    img4: "",
    description: "Equipamiento certificado para motociclistas de alto rendimiento.",
    specs: [
      { label: "Marca Oficial", value: "ICH Helmets (Inducascos Colombia)" },
      { label: "Referencia", value: "ICH 3110 Modular Doble Visor" },
      { label: "Certificación", value: "DOT FMVSS 218 y NTC 4533 (Resolución 1080)" },
      { label: "Material Calota", value: "Termoplástico ABS inyectado de alto impacto" },
      { label: "Sistema de Visor", value: "Doble Visor: Exterior UV anti-scratch + Gafas solares retráctiles" },
      { label: "Ventilación", value: "Entradas frontales y superiores regulables con spoiler extractor" },
      { label: "Interior / Tapizado", value: "Acolchado transpirable hipoalergénico desmontable y lavable" },
      { label: "Sistema de Cierre", value: "Hebilla micrométrica de ajuste milimétrico rápido" },
      { label: "Intercomunicador", value: "Cavidades pre-moldeadas para parlantes Bluetooth" },
      { label: "Garantía Oficial", value: "6 meses directa de fábrica" },
    ],
  });

  const handleApplySpecTemplate = (key: keyof typeof SPECS_TEMPLATES) => {
    setProdForm((prev) => ({
      ...prev,
      specs: SPECS_TEMPLATES[key].map((s) => ({ ...s })),
    }));
  };

  const handleAddSpecRow = () => {
    setProdForm((prev) => ({
      ...prev,
      specs: [...prev.specs, { label: "", value: "" }],
    }));
  };

  const handleUpdateSpecRow = (idx: number, field: "label" | "value", val: string) => {
    setProdForm((prev) => {
      const copy = [...prev.specs];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...prev, specs: copy };
    });
  };

  const handleRemoveSpecRow = (idx: number) => {
    setProdForm((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== idx),
    }));
  };

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
      category_name: categories[0]?.name || "Cascos",
      price_retail: 289900,
      price_original: 345000,
      price_wholesale: 220000,
      stock: 10,
      badge: "NOVEDAD 2026",
      badge_color: "orange",
      is_new_arrival: true,
      is_limited_edition: false,
      is_active: true,
      offer_is_active: false,
      offer_price: 249900,
      offer_duration_type: "permanent",
      offer_duration_value: 24,
      offer_badge_text: "OFERTA RELÁMPAGO",
      img1: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
      img2: "",
      img3: "",
      img4: "",
      description: "Equipamiento de alta resistencia certificado internacionalmente.",
      specs: SPECS_TEMPLATES.cascos.map((s) => ({ ...s })),
    });
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setProdForm({
      name: product.name,
      sku: product.sku,
      category_name: product.category_name || categories[0]?.name || "Cascos",
      price_retail: product.price_retail,
      price_original: product.price_original || 0,
      price_wholesale: product.price_wholesale || 0,
      stock: product.stock ?? 10,
      badge: product.badge || "",
      badge_color: product.badge_color || "orange",
      is_new_arrival: !!product.is_new_arrival,
      is_limited_edition: !!product.is_limited_edition,
      is_active: product.is_active,
      offer_is_active: !!product.offer_is_active,
      offer_price: product.offer_price || product.price_retail,
      offer_duration_type: product.offer_duration_type || "permanent",
      offer_duration_value: product.offer_duration_value || 24,
      offer_badge_text: product.offer_badge_text || "OFERTA RELÁMPAGO",
      img1: product.images?.[0] || "",
      img2: product.images?.[1] || "",
      img3: product.images?.[2] || "",
      img4: product.images?.[3] || "",
      description: product.description || "",
      specs: product.specs && product.specs.length > 0
        ? product.specs.map((s) => ({ ...s }))
        : SPECS_TEMPLATES.cascos.map((s) => ({ ...s })),
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const images = [prodForm.img1, prodForm.img2, prodForm.img3, prodForm.img4].filter(Boolean);
    const slug = editingProduct
      ? editingProduct.slug
      : prodForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    let expiresAt: string | undefined = undefined;
    if (prodForm.offer_is_active) {
      if (prodForm.offer_duration_type === "hours") {
        expiresAt = new Date(Date.now() + (prodForm.offer_duration_value || 12) * 3600000).toISOString();
      } else if (prodForm.offer_duration_type === "days") {
        expiresAt = new Date(Date.now() + (prodForm.offer_duration_value || 3) * 86400000).toISOString();
      }
    }

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
      offer_is_active: prodForm.offer_is_active,
      offer_price: prodForm.offer_price ? Number(prodForm.offer_price) : undefined,
      offer_duration_type: prodForm.offer_duration_type,
      offer_duration_value: prodForm.offer_duration_value,
      offer_expires_at: expiresAt,
      offer_badge_text: prodForm.offer_badge_text,
      images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80"],
      description: prodForm.description,
      specs: prodForm.specs.filter((s) => s.label.trim() && s.value.trim()),
      color_variants: editingProduct?.color_variants,
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

  // CATEGORIES MANAGEMENT STATE & HANDLERS
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [catForm, setCatForm] = useState<{
    name: string;
    slug: string;
    description: string;
  }>({
    name: "",
    slug: "",
    description: "",
  });

  const openNewCategoryModal = () => {
    setEditingCategory(null);
    setCatForm({ name: "", slug: "", description: "" });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: Category) => {
    setEditingCategory(cat);
    setCatForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = catForm.slug.trim()
      ? catForm.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")
      : catForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const payload: Category = {
      id: editingCategory ? editingCategory.id : `cat-${Date.now()}`,
      name: catForm.name.trim(),
      slug: slug,
      description: catForm.description.trim(),
    };

    if (editingCategory) {
      updateCategory(payload);
    } else {
      addCategory(payload);
    }
    setIsCategoryModalOpen(false);
  };

  // COMBOS & PACKS STATE & HANDLERS
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<ProductCombo | null>(null);
  const [comboForm, setComboForm] = useState<{
    name: string;
    tag: string;
    description: string;
    productIds: string[];
    price: number;
    isActive: boolean;
  }>({
    name: "",
    tag: "COMBO RUTERO ESPECIAL",
    description: "",
    productIds: [],
    price: 0,
    isActive: true,
  });

  const openNewComboModal = () => {
    setEditingCombo(null);
    const initialProductIds = products.slice(0, 2).map((p) => p.id);
    const initialSum = products
      .filter((p) => initialProductIds.includes(p.id))
      .reduce((acc, p) => acc + p.price_retail, 0);

    setComboForm({
      name: "",
      tag: "COMBO RUTERO ESPECIAL",
      description: "Equípate con todo el kit necesario para rodar con garantía y descuento oficial.",
      productIds: initialProductIds,
      price: Math.round(initialSum * 0.85),
      isActive: true,
    });
    setIsComboModalOpen(true);
  };

  const openEditComboModal = (combo: ProductCombo) => {
    setEditingCombo(combo);
    setComboForm({
      name: combo.name,
      tag: combo.tag,
      description: combo.description,
      productIds: combo.productIds || [],
      price: combo.price,
      isActive: combo.isActive,
    });
    setIsComboModalOpen(true);
  };

  const toggleProductInCombo = (productId: string) => {
    setComboForm((prev) => {
      const exists = prev.productIds.includes(productId);
      const nextIds = exists
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId];

      const newSum = products
        .filter((p) => nextIds.includes(p.id))
        .reduce((acc, p) => acc + p.price_retail, 0);

      return {
        ...prev,
        productIds: nextIds,
        price: prev.price === 0 || !exists ? Math.round(newSum * 0.85) : prev.price,
      };
    });
  };

  const handleSaveCombo = (e: React.FormEvent) => {
    e.preventDefault();
    if (comboForm.productIds.length < 2) {
      alert("Por favor selecciona al menos 2 productos para armar el combo.");
      return;
    }

    const selectedProds = products.filter((p) => comboForm.productIds.includes(p.id));
    const calculatedSum = selectedProds.reduce((acc, p) => acc + p.price_retail, 0);
    const savings = Math.max(0, calculatedSum - Number(comboForm.price));
    const slug = comboForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const payload: ProductCombo = {
      id: editingCombo ? editingCombo.id : `combo-${Date.now()}`,
      name: comboForm.name.trim(),
      slug: slug || `combo-${Date.now()}`,
      tag: comboForm.tag.trim() || "COMBO PROMOCIONAL",
      description: comboForm.description.trim(),
      productIds: comboForm.productIds,
      originalPrice: calculatedSum,
      price: Number(comboForm.price),
      savingsAmount: savings,
      isActive: comboForm.isActive,
    };

    if (editingCombo) {
      updateCombo(payload);
    } else {
      addCombo(payload);
    }
    setIsComboModalOpen(false);
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
    accentColor: string;
    isActive: boolean;
  }>({
    tag: "TEMPORADA DE LLUVIAS • 100% SILICONADO",
    title: "TRAJES IMPERMEABLES DE ALTO RENDIMIENTO",
    highlight: "CERO FILTRACIONES GARANTIZADO",
    subtitle: "Costuras termoselladas reforzadas en entrepierna, cremallera hermética con solapa y reflectivos 3M. Incluye zapatones y tula compacta.",
    buttonText: "VER TRAJES IMPERMEABLES",
    buttonLink: "/categoria/impermeables",
    secondaryText: "Pedir por WhatsApp",
    secondaryLink: "https://wa.me/573000000000?text=Hola,%20quiero%20pedir%20el%20traje%20impermeable%20siliconado",
    bgImage: "https://images.unsplash.com/photo-1517846695664-44df0e167232?auto=format&fit=crop&w=1920&q=80",
    accentColor: "from-cyan-400 via-blue-500 to-teal-300",
    isActive: true,
  });

  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress to JPEG with 0.82 quality - reduces multi-MB photos down to ~90KB!
          const compressed = canvas.toDataURL("image/jpeg", 0.82);
          setBannerForm((prev) => ({ ...prev, bgImage: compressed }));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const openNewBannerModal = () => {
    setEditingBanner(null);
    setBannerForm({
      tag: "TEMPORADA DE LLUVIAS • 100% SILICONADO",
      title: "TRAJES IMPERMEABLES DE ALTO RENDIMIENTO",
      highlight: "CERO FILTRACIONES GARANTIZADO",
      subtitle: "Costuras termoselladas reforzadas en entrepierna, cremallera hermética con solapa y reflectivos 3M de alta visibilidad nocturna. Incluye zapatones y tula compacta.",
      buttonText: "VER TRAJES IMPERMEABLES",
      buttonLink: "/categoria/impermeables",
      secondaryText: "Pedir por WhatsApp",
      secondaryLink: "https://wa.me/573000000000?text=Hola,%20quiero%20pedir%20el%20traje%20impermeable%20siliconado",
      bgImage: "https://images.unsplash.com/photo-1517846695664-44df0e167232?auto=format&fit=crop&w=1920&q=80",
      accentColor: "from-cyan-400 via-blue-500 to-teal-300",
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
      accentColor: banner.accentColor || "from-orange-500 via-amber-400 to-yellow-400",
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
      accentColor: bannerForm.accentColor || "from-orange-500 via-amber-400 to-yellow-400",
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

  // 7.1 TAKE MANUAL ORDER (CAJERO VIRTUAL) & KITCHEN TICKET (COMANDA DE BODEGA)
  const [isTakeOrderModalOpen, setIsTakeOrderModalOpen] = useState(false);
  const [selectedOrderForKitchenTicket, setSelectedOrderForKitchenTicket] = useState<Order | null>(null);
  const [orderStageFilter, setOrderStageFilter] = useState<"all" | "empacado" | "transito" | "entregado">("all");
  const [manualOrderForm, setManualOrderForm] = useState<{
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    customerCedula: string;
    customerCity: string;
    customerAddress: string;
    selectedProductId: string;
    size: string;
    quantity: number;
    paymentMethod: "Contra Entrega Nacional" | "Wompi (Bancolombia)" | "PSE / Nequi";
    carrier: "Inter Rapidísimo" | "Servientrega" | "Envia";
  }>({
    customerName: "Michael Tovar",
    customerPhone: "3161492880",
    customerEmail: "tobarmichael212@gmail.com",
    customerCedula: "1.020.849.201",
    customerCity: "Bogotá D.C., Cundinamarca",
    customerAddress: "Carrera 7 # 72-41 - Chapinero",
    selectedProductId: products[0]?.id || "",
    size: "L",
    quantity: 1,
    paymentMethod: "Contra Entrega Nacional",
    carrier: "Inter Rapidísimo",
  });

  const handleCreateManualOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === manualOrderForm.selectedProductId) || products[0];
    const totalAmount = prod.price_retail * manualOrderForm.quantity;

    const created = createManualOrder({
      customerName: manualOrderForm.customerName,
      customerEmail: manualOrderForm.customerEmail,
      customerPhone: manualOrderForm.customerPhone,
      customerCedulaOrNit: manualOrderForm.customerCedula,
      city: manualOrderForm.customerCity,
      customerAddress: manualOrderForm.customerAddress,
      total: totalAmount,
      itemsCount: manualOrderForm.quantity,
      productsSummary: `${manualOrderForm.quantity}x ${prod.name} (Talla ${manualOrderForm.size})`,
      paymentMethod: manualOrderForm.paymentMethod,
      carrier: manualOrderForm.carrier,
      paymentStatus: manualOrderForm.paymentMethod === "Contra Entrega Nacional" ? "pendiente" : "pagado",
    });

    setIsTakeOrderModalOpen(false);
    setSelectedOrderForKitchenTicket(created);
  };

  // 8. USERS WITH 360° PROFILE
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<CustomerUser | null>(null);
  const [userProfileTab, setUserProfileTab] = useState<"orders" | "invoices" | "chats" | "notes">("orders");
  const [userAdminNote, setUserAdminNote] = useState<string>("");

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

  const getTabLabel = (tabId: string) => {
    switch (tabId) {
      case "products": return "Catálogo & Stock";
      case "categories": return "Categorías";
      case "combos": return "Combos & Packs";
      case "offers": return "Ofertas Relámpago";
      case "banners": return "Anuncios Slider";
      case "lookbooks": return "Lookbooks & Cajas";
      case "orders": return "Registro de Envíos";
      case "invoices": return "Facturación Oficial";
      case "users": return "Expediente Clientes 360°";
      case "wholesale": return "Mayoristas B2B";
      case "reviews": return "Reseñas Clientes";
      case "support": return "Chats en Vivo & Soporte";
      case "analytics": return "Métricas & Análisis";
      default: return tabId;
    }
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
  // CENTRAL HUB / SELECTOR DE MÓDULOS (INICIO DE ADMINISTRACIÓN)
  // =========================================================================
  if (adminModule === "hub") {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-orange-500 selection:text-neutral-950">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-neutral-950 font-black flex items-center justify-center text-sm shadow-lg shadow-orange-500/20">
              GR
            </div>
            <div>
              <h1 className="text-sm font-black uppercase text-white tracking-wider flex items-center gap-2">
                <span>Gordo Ryders</span>
                <span className="text-[10px] text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded font-mono font-bold">
                  HUB CENTRAL
                </span>
              </h1>
              <p className="text-[10px] text-neutral-400 font-mono">
                CENTRO MAESTRO DE CONTROL EMPRESARIAL
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-2 bg-neutral-950 px-3 py-1.5 rounded-xl border border-neutral-800 text-[10px] font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>BODEGA EN VIVO • SUPABASE</span>
            </div>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-neutral-700"
            >
              <Eye className="w-3.5 h-3.5 text-orange-400" />
              <span className="hidden sm:inline">Tienda Pública</span>
              <ExternalLink className="w-3 h-3 text-neutral-400" />
            </Link>

            <Link
              href="/mayoristas"
              target="_blank"
              className="px-3 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 border border-amber-500/30"
            >
              <span className="text-xs">👑</span>
              <span className="hidden sm:inline">Portal Mayoristas</span>
              <ExternalLink className="w-3 h-3 text-amber-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all border border-red-500/20 flex items-center gap-1.5 cursor-pointer"
              title="Cerrar Sesión"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </header>

        {/* Hero Welcome Header */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 lg:p-10 space-y-8">
          <div className="text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Centro de Mando & Control Gordo Ryders</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              ¿Qué área deseas gestionar hoy?
            </h2>
            <p className="text-sm text-neutral-400 max-w-2xl leading-relaxed">
              Hemos separado los controles de la vitrina web de los controles administrativos y logísticos. Selecciona tu área de trabajo para comenzar:
            </p>
          </div>

          {/* 2 Primary Choice Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Card 1: GESTIÓN DE TIENDA & PLATAFORMA WEB (CMS) */}
            <div className="relative group rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10">
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shadow-inner">
                    <Globe className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
                    MÓDULO 1 • CMS TIENDA WEB
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black uppercase text-white tracking-wide group-hover:text-orange-400 transition-colors">
                    Gestión de Tienda & Plataforma Web
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                    Mueve y configura todo lo visible para los clientes: catálogo de cascos y accesorios, stock disponible, combos 2x1, promociones relámpago, anuncios del slider principal y lookbooks.
                  </p>
                </div>

                {/* Counters Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-left">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Catálogo</span>
                    <strong className="text-white text-base font-black font-mono">{products.length}</strong>
                    <span className="text-[10px] text-neutral-400 ml-1">prods</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-left">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Categorías</span>
                    <strong className="text-white text-base font-black font-mono">{categories.length}</strong>
                    <span className="text-[10px] text-neutral-400 ml-1">secciones</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-left">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Combos</span>
                    <strong className="text-white text-base font-black font-mono">{combos.length}</strong>
                    <span className="text-[10px] text-neutral-400 ml-1">packs</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-left">
                    <span className="text-[10px] text-orange-400 uppercase font-bold block">Ofertas</span>
                    <strong className="text-orange-400 text-base font-black font-mono">
                      {products.filter((p) => p.offer_is_active || (p.price_original && p.price_original > p.price_retail)).length}
                    </strong>
                    <span className="text-[10px] text-neutral-400 ml-1">activas</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-left">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Slider</span>
                    <strong className="text-white text-base font-black font-mono">
                      {banners.filter((b) => b.isActive).length}
                    </strong>
                    <span className="text-[10px] text-neutral-400 ml-1">banners</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-left">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Lookbooks</span>
                    <strong className="text-white text-base font-black font-mono">{albums.length}</strong>
                    <span className="text-[10px] text-neutral-400 ml-1">álbumes</span>
                  </div>
                </div>
              </div>

              {/* CTA & Sub-shortcuts */}
              <div className="pt-6 space-y-3 mt-6 border-t border-neutral-800/80">
                <button
                  onClick={() => {
                    setAdminModule("store");
                    setActiveTab("products");
                  }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black text-sm py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer group-hover:scale-[1.01]"
                >
                  <span>Entrar a Gestión de Tienda Web</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-neutral-400 pt-1">
                  <span>Acceso directo:</span>
                  <button
                    onClick={() => { setAdminModule("store"); setActiveTab("products"); }}
                    className="hover:text-orange-400 underline cursor-pointer"
                  >
                    Catálogo
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => { setAdminModule("store"); setActiveTab("combos"); }}
                    className="hover:text-orange-400 underline cursor-pointer"
                  >
                    Combos
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => { setAdminModule("store"); setActiveTab("offers"); }}
                    className="hover:text-orange-400 underline cursor-pointer"
                  >
                    Ofertas
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => { setAdminModule("store"); setActiveTab("banners"); }}
                    className="hover:text-orange-400 underline cursor-pointer"
                  >
                    Slider
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => { setAdminModule("store"); setActiveTab("lookbooks"); }}
                    className="hover:text-orange-400 underline cursor-pointer"
                  >
                    Lookbooks
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: OPERACIONES, LOGÍSTICA & NEGOCIO (ERP) */}
            <div className="relative group rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10">
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-inner">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                    MÓDULO 2 • OPERACIONES & CRM
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black uppercase text-white tracking-wide group-hover:text-emerald-400 transition-colors">
                    Operaciones, Logística & Clientes
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-400 mt-2 leading-relaxed">
                    Administra el negocio internamente: expedientes 360° de compradores, canal de mayoristas B2B, registro de guías de envío, facturación oficial legal y métricas del negocio.
                  </p>
                </div>

                {/* Counters Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                  <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-left">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Envíos</span>
                    <strong className="text-white text-base font-black font-mono">{orders.length}</strong>
                    <span className="text-[10px] text-neutral-400 ml-1">guías</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-left">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Facturación</span>
                    <strong className="text-white text-base font-black font-mono">{invoices.length}</strong>
                    <span className="text-[10px] text-neutral-400 ml-1">facturas</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-left">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Clientes 360°</span>
                    <strong className="text-white text-base font-black font-mono">{users.length}</strong>
                    <span className="text-[10px] text-neutral-400 ml-1">cuentas</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-left">
                    <span className="text-[10px] text-amber-400 uppercase font-bold block">Mayoristas B2B</span>
                    <strong className="text-amber-400 text-base font-black font-mono">
                      {users.filter((u) => u.b2bStatus === "aprobado" || u.type === "mayorista").length + wholesaleInquiries.length}
                    </strong>
                    <span className="text-[10px] text-neutral-400 ml-1">comercios</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-left">
                    <span className="text-[10px] text-neutral-500 uppercase font-bold block">Reseñas</span>
                    <strong className="text-white text-base font-black font-mono">{storedReviews.length}</strong>
                    <span className="text-[10px] text-neutral-400 ml-1">opiniones</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-neutral-950/80 border border-neutral-800 text-left">
                    <span className="text-[10px] text-amber-400 uppercase font-bold block">Chats en Vivo</span>
                    <strong className="text-amber-400 text-base font-black font-mono">
                      {supportChats.length}
                    </strong>
                    <span className="text-[10px] text-neutral-400 ml-1">
                      ({supportChats.filter((c) => c.status === "needs_human").length} 🔥)
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA & Sub-shortcuts */}
              <div className="pt-6 space-y-3 mt-6 border-t border-neutral-800/80">
                <button
                  onClick={() => {
                    setAdminModule("operations");
                    setActiveTab("orders");
                  }}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black text-sm py-3.5 px-6 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer group-hover:scale-[1.01]"
                >
                  <span>Entrar a Operaciones & Logística</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex flex-wrap items-center justify-center gap-1.5 text-[11px] text-neutral-400 pt-1">
                  <span>Acceso directo:</span>
                  <button
                    onClick={() => { setAdminModule("operations"); setActiveTab("orders"); }}
                    className="hover:text-emerald-400 underline cursor-pointer"
                  >
                    Envíos
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => { setAdminModule("operations"); setActiveTab("invoices"); }}
                    className="hover:text-emerald-400 underline cursor-pointer"
                  >
                    Facturas
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => { setAdminModule("operations"); setActiveTab("users"); }}
                    className="hover:text-emerald-400 underline cursor-pointer"
                  >
                    Clientes 360°
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => { setAdminModule("operations"); setActiveTab("support"); }}
                    className="hover:text-amber-400 underline cursor-pointer font-bold text-amber-300"
                  >
                    💬 Chats en Vivo
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => { setAdminModule("operations"); setActiveTab("wholesale"); }}
                    className="hover:text-amber-400 underline cursor-pointer font-bold text-amber-300"
                  >
                    Mayoristas B2B
                  </button>
                  <span>•</span>
                  <button
                    onClick={() => { setAdminModule("operations"); setActiveTab("analytics"); }}
                    className="hover:text-emerald-400 underline cursor-pointer"
                  >
                    Métricas
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Featured Section: CANAL MAYORISTAS B2B */}
          <div className="rounded-3xl bg-gradient-to-r from-amber-500/10 via-neutral-900 to-amber-500/10 border border-amber-500/30 p-6 sm:p-8 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">👑</span>
                <div>
                  <h4 className="text-base sm:text-lg font-black uppercase text-white flex items-center gap-2">
                    <span>Canal Nacional de Distribuidores Mayoristas B2B</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">
                      ¡Activo en Producción!
                    </span>
                  </h4>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-0.5">
                    Precios especiales para almacenes y talleres en Colombia con compras desde 6 unidades, cotizador formal con PDF y aprobación de cuentas.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setAdminModule("operations");
                    setActiveTab("wholesale");
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs transition-all flex items-center gap-1.5 shadow cursor-pointer"
                >
                  <span>Aprobar Distribuidores B2B</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setAdminModule("operations");
                    setActiveTab("users");
                    setUserTypeFilter("mayorista");
                  }}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-all border border-neutral-700 cursor-pointer"
                >
                  Ver Cuentas Mayoristas
                </button>

                <Link
                  href="/mayoristas"
                  target="_blank"
                  className="px-4 py-2 rounded-xl bg-neutral-950 hover:bg-neutral-900 text-amber-300 font-bold text-xs transition-all border border-amber-500/30 flex items-center gap-1.5"
                >
                  <span>Visitar Portal Público (/mayoristas)</span>
                  <ExternalLink className="w-3 h-3 text-amber-400" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                <span className="text-amber-400 font-bold block mb-1">Nivel 1 • Mayorista Plata (6-11 unds)</span>
                <p className="text-neutral-400 text-[11px]">Margen del <strong>-28% sobre PVP</strong>. Ideal para pequeños talleres de motos y tiendas locales.</p>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                <span className="text-amber-400 font-bold block mb-1">Nivel 2 • Mayorista Oro (12-23 unds)</span>
                <p className="text-neutral-400 text-[11px]">Margen del <strong>-35% sobre PVP</strong>. Despachos prioritarios con Servientrega e Inter Rapidísimo.</p>
              </div>
              <div className="p-3 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                <span className="text-amber-400 font-bold block mb-1">Nivel 3 • Distribuidor Platino (24+ unds)</span>
                <p className="text-neutral-400 text-[11px]">Margen del <strong>-42% sobre PVP</strong>. Factura electrónica DIAN oficial y flete bonificado.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =========================================================================
  // MAIN STANDALONE BACKOFFICE INTERFACE
  // =========================================================================
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col lg:flex-row font-sans selection:bg-orange-500 selection:text-neutral-950">
      
      {/* 1. TOP BAR FOR MOBILE DEVICES */}
      <header className="lg:hidden sticky top-0 z-40 bg-neutral-900 border-b border-neutral-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white"
          >
            <Menu className="w-5 h-5 text-orange-400" />
          </button>
          <button
            onClick={() => setAdminModule("hub")}
            className="p-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30"
            title="Volver al Hub Central"
          >
            <Home className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center font-black text-neutral-950 text-xs">
            GR
          </div>
          <span className="text-xs font-black uppercase text-white tracking-wider truncate max-w-[120px]">
            {adminModule === "store" ? "Tienda Web" : "Operaciones"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="p-2 rounded-xl bg-neutral-800 text-neutral-300 hover:text-white"
            title="Ver Tienda"
          >
            <Eye className="w-4 h-4 text-orange-400" />
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30"
            title="Cerrar Sesión"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. MOBILE BACKDROP */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* 3. VERTICAL SIDEBAR MENU (Sticky on Desktop, Drawer on Mobile) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="p-4 border-b border-neutral-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-500 text-neutral-950 font-black flex items-center justify-center text-sm shadow-lg shadow-orange-500/20">
                GR
              </div>
              <div>
                <h1 className="text-sm font-black uppercase text-white tracking-wide">
                  Gordo Ryders
                </h1>
                <p className="text-[10px] text-neutral-400 font-mono">
                  BACKOFFICE CENTRAL
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Botón Volver al Menú Central / Hub */}
          <button
            onClick={() => {
              setAdminModule("hub");
              setIsMobileSidebarOpen(false);
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-black transition-all cursor-pointer shadow-sm"
          >
            <Home className="w-3.5 h-3.5" />
            <span>← Menú Principal (Hub Central)</span>
          </button>

          {/* Pill Toggle Switcher between Store & Operations */}
          <div className="bg-neutral-950 p-1 rounded-xl border border-neutral-800 flex items-center gap-1">
            <button
              onClick={() => {
                setAdminModule("store");
                if (!["products", "categories", "combos", "offers", "banners", "lookbooks"].includes(activeTab)) {
                  setActiveTab("products");
                }
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                adminModule === "store"
                  ? "bg-orange-500 text-neutral-950 font-black shadow-md shadow-orange-500/20"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Tienda Web</span>
            </button>
            <button
              onClick={() => {
                setAdminModule("operations");
                if (!["orders", "invoices", "users", "wholesale", "reviews", "analytics"].includes(activeTab)) {
                  setActiveTab("orders");
                }
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                adminModule === "operations"
                  ? "bg-emerald-500 text-neutral-950 font-black shadow-md shadow-emerald-500/20"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Operaciones</span>
            </button>
          </div>
        </div>

        {/* Sidebar Nav Items: Dynamically filtered based on adminModule */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 scrollbar-thin scrollbar-thumb-neutral-800">
          {adminModule === "store" ? (
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 px-3 block mb-2">
                Gestión Tienda Web (CMS)
              </span>
              {[
                { id: "products", label: "Catálogo & Stock", icon: Package, badge: products.length },
                { id: "categories", label: "Categorías", icon: Layers, badge: categories.length },
                { id: "combos", label: "Combos & Packs", icon: Sparkles, badge: combos.length },
                { id: "offers", label: "Ofertas Relámpago", icon: Flame, badge: products.filter((p) => p.offer_is_active || (p.price_original && p.price_original > p.price_retail)).length },
                { id: "banners", label: "Anuncios Slider", icon: Zap, badge: banners.filter((b) => b.isActive).length },
                { id: "lookbooks", label: "Lookbooks & Cajas", icon: Layers, badge: albums.length },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-orange-500 text-neutral-950 font-black shadow-lg shadow-orange-500/20"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-neutral-950" : "text-orange-400"}`} />
                      <span>{tab.label}</span>
                    </div>
                    {typeof tab.badge !== "undefined" && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-black font-mono ${
                          isActive ? "bg-neutral-950 text-white" : "bg-neutral-800 text-neutral-300 border border-neutral-700/60"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-4 mt-4 border-t border-neutral-800">
                <button
                  onClick={() => {
                    setAdminModule("operations");
                    setActiveTab("orders");
                  }}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-[11px] font-bold text-neutral-400 hover:text-emerald-400 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ir a Operaciones & Clientes</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-600" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 px-3 block mb-2">
                Operaciones & Clientes (ERP)
              </span>
              {[
                { id: "orders", label: "Pedidos & Comandas", icon: ShoppingBag, badge: orders.length },
                { id: "invoices", label: "Facturación Oficial", icon: FileText, badge: invoices.length },
                { id: "users", label: "Control de Usuarios & CRM", icon: Users, badge: users.length },
                {
                  id: "support",
                  label: "Chats en Vivo",
                  icon: MessageSquare,
                  badge: supportChats.filter((c) => c.status === "needs_human" || c.unreadCountForAdmin > 0).length,
                },
                {
                  id: "wholesale",
                  label: "Mayoristas B2B",
                  icon: Building2,
                  badge: wholesaleInquiries.length + users.filter((u) => u.b2bStatus === "pendiente" || u.b2bStatus === "aprobado" || u.type === "mayorista").length,
                },
                { id: "reviews", label: "Reseñas Clientes", icon: MessageSquareText, badge: storedReviews.length },
                { id: "analytics", label: "Métricas & Análisis", icon: BarChart3 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-emerald-500 text-neutral-950 font-black shadow-lg shadow-emerald-500/20"
                        : "text-neutral-400 hover:text-white hover:bg-neutral-800/80"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-neutral-950" : "text-emerald-400"}`} />
                      <span>{tab.label}</span>
                    </div>
                    {typeof tab.badge !== "undefined" && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-black font-mono ${
                          isActive ? "bg-neutral-950 text-white" : "bg-neutral-800 text-neutral-300 border border-neutral-700/60"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-4 mt-4 border-t border-neutral-800">
                <button
                  onClick={() => {
                    setAdminModule("store");
                    setActiveTab("products");
                  }}
                  className="w-full p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-[11px] font-bold text-neutral-400 hover:text-orange-400 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-orange-400" />
                    <span>Ir a Tienda Web & CMS</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-600" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-neutral-800 space-y-2 bg-neutral-950/60">
          <Link
            href="/"
            target="_blank"
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold py-2.5 px-3 rounded-xl transition-all flex items-center justify-between border border-neutral-700"
          >
            <div className="flex items-center gap-2">
              <Eye className="w-3.5 h-3.5 text-orange-400" />
              <span>Ver Tienda en Vivo</span>
            </div>
            <ExternalLink className="w-3 h-3 text-neutral-400" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold py-2.5 px-3 rounded-xl transition-all border border-red-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* 4. MAIN CONTENT WORKSPACE (Right side) */}
      <main className={`flex-1 min-w-0 bg-neutral-950 overflow-y-auto min-h-screen ${activeTab === "support" ? "p-3 sm:p-5" : "p-4 sm:p-8 lg:p-10"}`}>
        
        {/* Navigation Breadcrumb & Fast Module Switcher */}
        <div className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800 ${activeTab === "support" ? "mb-2" : "mb-6"}`}>
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <button
              onClick={() => setAdminModule("hub")}
              className="text-neutral-400 hover:text-white flex items-center gap-1.5 font-bold cursor-pointer transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-orange-400" />
              <span>Hub Central</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className={`font-bold ${adminModule === "store" ? "text-orange-400" : "text-emerald-400"}`}>
              {adminModule === "store" ? "Gestión de Tienda Web (CMS)" : "Operaciones & Logística (ERP)"}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600" />
            <span className="text-white font-black uppercase">
              {getTabLabel(activeTab)}
            </span>
            <span className="hidden lg:inline-flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>SISTEMA EN VIVO</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (adminModule === "store") {
                  setAdminModule("operations");
                  if (!["orders", "invoices", "users", "wholesale", "reviews", "analytics"].includes(activeTab)) {
                    setActiveTab("orders");
                  }
                } else {
                  setAdminModule("store");
                  if (!["products", "categories", "combos", "offers", "banners", "lookbooks"].includes(activeTab)) {
                    setActiveTab("products");
                  }
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold text-neutral-300 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              {adminModule === "store" ? (
                <>
                  <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ir a Operaciones</span>
                </>
              ) : (
                <>
                  <Globe className="w-3.5 h-3.5 text-orange-400" />
                  <span>Ir a Tienda Web</span>
                </>
              )}
            </button>
            
            <button
              onClick={() => setAdminModule("hub")}
              className="px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-xs font-bold text-orange-400 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Hub Principal</span>
            </button>
          </div>
        </div>
        
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
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
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
            TAB: COMBOS & PACKS DE AHORRO (NUEVA SECCIÓN PEDIDA)
            ========================================================================= */}
        {activeTab === "combos" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black uppercase text-white">Combos & Packs Promocionales</h3>
                <p className="text-xs text-neutral-400">
                  Crea paquetes de 2 o 3 productos con un precio especial y ahorro automático para el comprador.
                </p>
              </div>
              <button
                onClick={openNewComboModal}
                className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Crear Nuevo Combo</span>
              </button>
            </div>

            {combos.length === 0 ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-12 text-center space-y-4">
                <Sparkles className="w-12 h-12 text-orange-400 mx-auto" />
                <h4 className="text-base font-bold text-white">No tienes combos activos todavía</h4>
                <p className="text-xs text-neutral-400 max-w-md mx-auto">
                  Arma combos combinando por ejemplo un casco + guantes + soporte para incentivar ventas cruzadas.
                </p>
                <button
                  onClick={openNewComboModal}
                  className="bg-orange-500 text-neutral-950 font-black text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Crear mi primer combo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {combos.map((combo) => {
                  const comboProds = products.filter((p) => (combo.productIds || []).includes(p.id));
                  const calculatedSum = comboProds.reduce((acc, p) => acc + p.price_retail, 0);
                  const originalPrice = combo.originalPrice || calculatedSum;
                  const savings = combo.savingsAmount || Math.max(0, originalPrice - combo.price);

                  return (
                    <div
                      key={combo.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between space-y-5 shadow-xl hover:border-neutral-700 transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black uppercase text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                            {combo.tag}
                          </span>
                          <button
                            onClick={() => updateCombo({ ...combo, isActive: !combo.isActive })}
                            className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full cursor-pointer transition-colors ${
                              combo.isActive
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : "bg-neutral-800 text-neutral-500 border border-neutral-700"
                            }`}
                          >
                            {combo.isActive ? "Activo en Tienda" : "Pausado"}
                          </button>
                        </div>

                        <div>
                          <h4 className="text-base font-black text-white uppercase">{combo.name}</h4>
                          <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{combo.description}</p>
                        </div>

                        {/* Included Products Mini List */}
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                            Productos incluidos en el combo ({comboProds.length}):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {comboProds.map((prod) => (
                              <div
                                key={prod.id}
                                className="flex items-center gap-2.5 bg-neutral-950 border border-neutral-800 rounded-xl p-2"
                              >
                                <img
                                  src={prod.images?.[0] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=100&q=80"}
                                  alt={prod.name}
                                  className="w-9 h-9 rounded-lg object-cover bg-neutral-900 border border-neutral-800 shrink-0"
                                />
                                <div className="min-w-0">
                                  <span className="text-[11px] font-bold text-white truncate block">{prod.name}</span>
                                  <span className="text-[10px] text-neutral-400 font-mono block">
                                    {formatCOP(prod.price_retail)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Pricing Breakdown */}
                        <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800/80 flex items-center justify-between gap-4">
                          <div>
                            <span className="text-[10px] text-neutral-500 line-through font-mono block">
                              Regular: {formatCOP(originalPrice)}
                            </span>
                            <span className="text-lg font-black text-orange-400 font-mono">
                              {formatCOP(combo.price)}
                            </span>
                          </div>
                          {savings > 0 && (
                            <div className="text-right">
                              <span className="text-[10px] text-emerald-400 font-black uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                Ahorro: {formatCOP(savings)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                        <button
                          onClick={() => openEditComboModal(combo)}
                          className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                          <span>Editar Combo</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar combo "${combo.name}"?`)) {
                              deleteCombo(combo.id);
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB: OFERTAS RELÁMPAGO CON DURACIÓN (NUEVA SECCIÓN PEDIDA)
            ========================================================================= */}
        {activeTab === "offers" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black uppercase text-white">Ofertas Relámpago & Cuenta Regresiva</h3>
                <p className="text-xs text-neutral-400">
                  Controla qué productos están en oferta, su descuento y duración exacta (horas con reloj regresivo, días o para siempre).
                </p>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Ofertas Activas</span>
                  <strong className="text-lg font-black text-white">
                    {products.filter((p) => p.offer_is_active || (p.price_original && p.price_original > p.price_retail)).length}
                  </strong>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Descuento Promedio</span>
                  <strong className="text-lg font-black text-emerald-400">
                    22% OFF
                  </strong>
                </div>
              </div>

              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-neutral-400 uppercase font-bold block">Visibilidad en Home</span>
                  <strong className="text-lg font-black text-white">
                    Carrusel Activo
                  </strong>
                </div>
              </div>
            </div>

            {/* Offers Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 border-b border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-400">
                    <tr>
                      <th className="p-4">Producto en Oferta</th>
                      <th className="p-4">Precio Regular</th>
                      <th className="p-4">Precio Oferta</th>
                      <th className="p-4">Descuento</th>
                      <th className="p-4">Duración</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {products.map((prod) => {
                      const hasOffer = prod.offer_is_active || (prod.price_original && prod.price_original > prod.price_retail);
                      const regularPrice = prod.price_original || prod.price_retail;
                      const offerPrice = prod.offer_price || prod.price_retail;
                      const discountPct = regularPrice > offerPrice ? Math.round(((regularPrice - offerPrice) / regularPrice) * 100) : 0;

                      return (
                        <tr key={prod.id} className="hover:bg-neutral-800/40 transition-colors">
                          <td className="p-4 flex items-center gap-3 min-w-[200px]">
                            <img
                              src={prod.images?.[0] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=100&q=80"}
                              alt={prod.name}
                              className="w-10 h-10 rounded-xl object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                            />
                            <div>
                              <strong className="font-bold text-white block truncate max-w-[200px]">{prod.name}</strong>
                              <span className="text-[10px] text-neutral-400 font-mono">{prod.sku} • {prod.category_name}</span>
                            </div>
                          </td>

                          <td className="p-4 font-mono text-neutral-400">
                            {formatCOP(regularPrice)}
                          </td>

                          <td className="p-4 font-mono font-bold text-orange-400">
                            {formatCOP(offerPrice)}
                          </td>

                          <td className="p-4">
                            {discountPct > 0 ? (
                              <span className="text-[10px] font-black uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                                {discountPct}% OFF
                              </span>
                            ) : (
                              <span className="text-neutral-500 text-[10px]">-</span>
                            )}
                          </td>

                          <td className="p-4 text-neutral-300">
                            {prod.offer_duration_type === "permanent" ? (
                              <span className="text-neutral-300 font-medium">Permanente (Sin expiración)</span>
                            ) : prod.offer_duration_type === "hours" ? (
                              <span className="text-amber-400 font-bold flex items-center gap-1">
                                <span>{prod.offer_duration_value || 12} horas (Reloj activo)</span>
                              </span>
                            ) : prod.offer_duration_type === "days" ? (
                              <span className="text-purple-400 font-bold">
                                {prod.offer_duration_value || 3} días
                              </span>
                            ) : (
                              <span className="text-neutral-500">No definida</span>
                            )}
                          </td>

                          <td className="p-4">
                            <button
                              onClick={() => {
                                setProductOffer(prod.id, {
                                  isActive: !hasOffer,
                                  price: prod.offer_price || prod.price_retail,
                                  durationType: prod.offer_duration_type || "permanent",
                                  durationValue: prod.offer_duration_value || 24,
                                });
                              }}
                              className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full cursor-pointer transition-all ${
                                hasOffer
                                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                                  : "bg-neutral-800 text-neutral-500 border border-neutral-700"
                              }`}
                            >
                              {hasOffer ? "Oferta Activa" : "Sin Oferta"}
                            </button>
                          </td>

                          <td className="p-4 text-right">
                            <button
                              onClick={() => openEditProductModal(prod)}
                              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                              Configurar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB: GESTIÓN DE CATEGORÍAS (NUEVA SECCIÓN PEDIDA)
            ========================================================================= */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black uppercase text-white">Categorías de la Tienda</h3>
                <p className="text-xs text-neutral-400">
                  Crea y administra las categorías oficiales de Gordo Ryders. Todos los productos y menús se sincronizan con esta lista.
                </p>
              </div>
              <button
                onClick={openNewCategoryModal}
                className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 font-black text-xs sm:text-sm px-5 py-2.5 rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Crear Nueva Categoría</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const linkedProducts = products.filter(
                  (p) =>
                    p.category_name?.toLowerCase() === cat.name.toLowerCase() ||
                    p.category_id?.toLowerCase() === cat.slug?.toLowerCase()
                );

                return (
                  <div
                    key={cat.id}
                    className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-xl hover:border-neutral-700 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                          /{cat.slug}
                        </span>
                        <span className="text-[11px] font-bold text-neutral-400">
                          {linkedProducts.length} productos
                        </span>
                      </div>
                      <h4 className="text-base font-black text-white uppercase">{cat.name}</h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {cat.description || "Categoría oficial de repuestos y equipamiento motero."}
                      </p>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                      <button
                        onClick={() => openEditCategoryModal(cat)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar categoría "${cat.name}"?`)) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
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
                        <span className={`text-xs font-black block text-transparent bg-clip-text bg-gradient-to-r ${b.accentColor || "from-orange-400 to-amber-300"}`}>{b.highlight}</span>
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
            TAB 5: MESA CENTRAL DE PEDIDOS & COMANDAS (VENTAS WEB & MOSTRADOR)
            ========================================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-6">
            
            {/* Banner Mesa Central de Pedidos & Comandas */}
            <div className="bg-gradient-to-r from-orange-500/10 via-neutral-900 to-neutral-900 border border-orange-500/30 rounded-3xl p-5 sm:p-6 shadow-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full">
                      Módulo de Pedidos & Comandas • Bodega & Ventas Gordo Ryders
                    </span>
                  </div>
                  <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                    <span>Mesa Central de Pedidos & Comandas</span>
                    <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                      ⚡ Logística Automatizada
                    </span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                    Opera como la cocina de un restaurante: el cliente pide (o el cajero toma la venta), se genera la comanda de bodega y la factura oficial. Los estados de transporte avanzan automáticamente según los tiempos de entrega nacional.
                  </p>
                </div>

                {/* Acciones Rápidas de Venta y Portales */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setIsTakeOrderModalOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 cursor-pointer"
                  >
                    <UtensilsCrossed className="w-4 h-4 stroke-[2.5]" />
                    <span>Tomar Nuevo Pedido (Cajero)</span>
                  </button>

                  <button
                    onClick={() => setIsOrderModalOpen(true)}
                    className="bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-bold px-3 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-orange-400" />
                    <span>Guía Manual</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Total Pedidos</span>
                <p className="text-xl sm:text-2xl font-black text-white">{orders.length}</p>
                <span className="text-[10px] text-neutral-500 font-medium">Tienda Web & Mostrador</span>
              </div>
              <div className="bg-neutral-900 border border-amber-500/20 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">Comandas en Bodega</span>
                <p className="text-xl sm:text-2xl font-black text-amber-400">
                  {orders.filter((o) => getAutoOrderStatus(o) === "empacado").length}
                </p>
                <span className="text-[10px] text-neutral-500 font-medium">Por alistar / empacar</span>
              </div>
              <div className="bg-neutral-900 border border-blue-500/20 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-bold text-blue-400 block mb-1">⚡ En Tránsito Automático</span>
                <p className="text-xl sm:text-2xl font-black text-blue-400">
                  {orders.filter((o) => ["recolectado", "en_transito", "en_reparto"].includes(getAutoOrderStatus(o))).length}
                </p>
                <span className="text-[10px] text-neutral-500 font-medium">Con Transportadoras</span>
              </div>
              <div className="bg-neutral-900 border border-emerald-500/20 rounded-2xl p-4">
                <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">Total Facturado</span>
                <p className="text-lg sm:text-xl font-black font-mono text-emerald-400 truncate">
                  {formatCOP(orders.reduce((acc, o) => acc + o.total, 0))}
                </p>
                <span className="text-[10px] text-neutral-500 font-medium">100% Sincronizado</span>
              </div>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-1.5 bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800">
                <button
                  onClick={() => setOrderStageFilter("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    orderStageFilter === "all" ? "bg-orange-500 text-neutral-950 font-black shadow-md" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Todos ({orders.length})
                </button>
                <button
                  onClick={() => setOrderStageFilter("empacado")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    orderStageFilter === "empacado" ? "bg-amber-500 text-neutral-950 font-black shadow-md" : "text-amber-400 hover:bg-neutral-800"
                  }`}
                >
                  <span>📦 Por Alistar</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-950 text-amber-300 font-mono font-bold">
                    {orders.filter((o) => getAutoOrderStatus(o) === "empacado").length}
                  </span>
                </button>
                <button
                  onClick={() => setOrderStageFilter("transito")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    orderStageFilter === "transito" ? "bg-blue-500 text-neutral-950 font-black shadow-md" : "text-blue-400 hover:bg-neutral-800"
                  }`}
                >
                  <span>⚡ En Tránsito</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-950 text-blue-300 font-mono font-bold">
                    {orders.filter((o) => ["recolectado", "en_transito", "en_reparto"].includes(getAutoOrderStatus(o))).length}
                  </span>
                </button>
                <button
                  onClick={() => setOrderStageFilter("entregado")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    orderStageFilter === "entregado" ? "bg-emerald-500 text-neutral-950 font-black shadow-md" : "text-emerald-400 hover:bg-neutral-800"
                  }`}
                >
                  <span>✅ Entregados</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-950 text-emerald-300 font-mono font-bold">
                    {orders.filter((o) => getAutoOrderStatus(o) === "entregado").length}
                  </span>
                </button>
              </div>

              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                <input
                  type="text"
                  value={orderFilterQuery}
                  onChange={(e) => setOrderFilterQuery(e.target.value)}
                  placeholder="Buscar por guía, cliente o ciudad..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl pl-9 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            {/* Orders Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders
                .filter((o) => {
                  const currentStatus = getAutoOrderStatus(o);
                  if (orderStageFilter === "empacado" && currentStatus !== "empacado") return false;
                  if (orderStageFilter === "transito" && !["recolectado", "en_transito", "en_reparto"].includes(currentStatus)) return false;
                  if (orderStageFilter === "entregado" && currentStatus !== "entregado") return false;

                  const q = orderFilterQuery.toLowerCase();
                  return (
                    o.guideNumber.toLowerCase().includes(q) ||
                    o.customerName.toLowerCase().includes(q) ||
                    o.city.toLowerCase().includes(q) ||
                    o.id.toLowerCase().includes(q)
                  );
                })
                .map((ord) => {
                  const autoStatus = getAutoOrderStatus(ord);
                  const isMichael = ord.customerName.toLowerCase().includes("michael") || ord.customerEmail?.includes("tobarmichael");

                  const statusLabels: Record<string, { label: string; color: string; desc: string }> = {
                    empacado: {
                      label: "1. Comanda en Bodega (Alistamiento)",
                      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
                      desc: "Ítems en proceso de recolección y embalaje en estantería.",
                    },
                    recolectado: {
                      label: `2. Recolectado por ${ord.carrier}`,
                      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                      desc: "Manifiesto de carga emitido y camión en ruta.",
                    },
                    en_transito: {
                      label: "3. En Tránsito Intermunicipal",
                      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
                      desc: "Viajando por troncal nacional hacia la ciudad destino.",
                    },
                    en_reparto: {
                      label: "4. En Reparto Local (Móvil)",
                      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
                      desc: "Mensajero local en camino a la dirección de entrega.",
                    },
                    entregado: {
                      label: "5. ¡Entregado a Satisfacción!",
                      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
                      desc: "Paquete recibido y comprobante firmado.",
                    },
                    cancelado: {
                      label: "Cancelado / Anulado",
                      color: "text-red-400 bg-red-500/10 border-red-500/20",
                      desc: "Orden cancelada por administración o cliente.",
                    },
                  };

                  const currentMeta = statusLabels[autoStatus] || statusLabels.empacado;

                  const waMessage = encodeURIComponent(
                    `Hola ${ord.customerName}, tu pedido ${ord.id.toUpperCase()} de Gordo Ryders está en curso con guía ${ord.guideNumber} por ${ord.carrier}. Estado actual: ${currentMeta.label}. Rastréalo en vivo aquí: https://gordo-ryders-ecommerce.vercel.app/rastreo`
                  );

                  return (
                    <div
                      key={ord.id}
                      className={`bg-neutral-900 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between transition-all ${
                        isMichael
                          ? "border-2 border-orange-500/50 shadow-orange-500/5 hover:border-orange-400"
                          : "border border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      <div>
                        {/* Header: Order ID + Invoice ID */}
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                          <div>
                            <span className="font-mono text-xs font-black text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg">
                              {ord.id.toUpperCase()}
                            </span>
                            {ord.invoiceNumber && (
                              <span className="block text-[10px] font-mono text-neutral-400 mt-1">
                                {ord.invoiceNumber}
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] font-bold text-neutral-300 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                              {ord.carrier}
                            </span>
                            <span className="block text-[10px] text-neutral-500 font-mono mt-0.5">
                              {ord.date}
                            </span>
                          </div>
                        </div>

                        {/* Customer & Items (La Comanda) */}
                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                              <span>{ord.customerName}</span>
                              {isMichael && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 font-bold">
                                  OFICIAL
                                </span>
                              )}
                            </h4>
                            <span className="text-xs font-mono font-black text-emerald-400">
                              {formatCOP(ord.total)}
                            </span>
                          </div>

                          <p className="text-xs text-neutral-300">
                            📱 {ord.customerPhone} {ord.customerEmail ? `• ✉️ ${ord.customerEmail}` : ""}
                          </p>
                          <p className="text-xs text-neutral-400 truncate">
                            📍 {ord.customerAddress || ord.city}
                          </p>

                          {/* Packing slip summary */}
                          <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs mt-2 space-y-1">
                            <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                              Comanda de Alistamiento:
                            </span>
                            <p className="text-neutral-200 font-medium">📦 {ord.productsSummary}</p>
                            <div className="flex items-center justify-between pt-1 border-t border-neutral-800/80 text-[11px]">
                              <span className="text-neutral-400">
                                Pago: <strong>{ord.paymentMethod || "Contra Entrega"}</strong>
                              </span>
                              <span className={ord.paymentStatus === "pagado" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                                {ord.paymentStatus === "pagado" ? "🟢 Pagado" : "🟡 Cobro en puerta"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Automated Status Tracker & Actions */}
                      <div className="space-y-3 pt-3 border-t border-neutral-800">
                        {/* Auto Logistics Badge */}
                        <div className={`p-2.5 rounded-xl border text-xs space-y-1 ${currentMeta.color}`}>
                          <div className="flex items-center justify-between font-bold">
                            <span className="flex items-center gap-1">
                              <span>⚡</span>
                              <span>{currentMeta.label}</span>
                            </span>
                            <span className="font-mono text-[10px] uppercase">
                              Guía: {ord.guideNumber}
                            </span>
                          </div>
                          <p className="text-[10px] text-neutral-400 opacity-90 leading-tight">
                            {currentMeta.desc}
                          </p>
                        </div>

                        {/* Action Buttons: Kitchen ticket & Invoice */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrderForKitchenTicket(ord)}
                            className="bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 border border-orange-500/30 text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <ClipboardList className="w-3.5 h-3.5" />
                            <span>Comanda Bodega</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const foundInv = invoices.find(
                                (i) => i.orderId?.toLowerCase() === ord.id.toLowerCase() || i.invoiceNumber === ord.invoiceNumber
                              );
                              if (foundInv) {
                                setSelectedInvoiceForView(foundInv);
                              } else {
                                alert(`Factura oficial emitida bajo consecutivo ${ord.invoiceNumber || "FACT-GR-2026-40291"}`);
                              }
                            }}
                            className="bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Factura</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <Link
                            href="/rastreo"
                            target="_blank"
                            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all"
                          >
                            <Eye className="w-3.5 h-3.5 text-orange-400" />
                            <span>Rastreo Tienda</span>
                          </Link>

                          <a
                            href={`https://wa.me/57${ord.customerPhone.replace(/\D/g, "")}?text=${waMessage}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1.5 transition-all"
                          >
                            <MessageSquareText className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black uppercase text-white flex items-center gap-2">
                  <span>Expedientes de Clientes 360°</span>
                  <span className="text-xs text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded font-mono">
                    {users.length} Registrados
                  </span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Información de cuenta, cédula/NIT para facturas, datos de despacho, compras y estatus de distribuidores mayoristas.
                </p>
              </div>

              {/* Botón rápido a Mayoristas */}
              <button
                onClick={() => {
                  setAdminModule("operations");
                  setActiveTab("wholesale");
                }}
                className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>👑 Ir a Pipeline Mayoristas B2B</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Filter Tabs for Customer Types */}
            <div className="flex flex-wrap items-center gap-2 bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800">
              <button
                onClick={() => setUserTypeFilter("all")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  userTypeFilter === "all"
                    ? "bg-orange-500 text-neutral-950 font-black shadow-md shadow-orange-500/20"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Todos los Clientes ({users.length})
              </button>
              <button
                onClick={() => setUserTypeFilter("mayorista")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  userTypeFilter === "mayorista"
                    ? "bg-amber-500 text-neutral-950 font-black shadow-md shadow-amber-500/20"
                    : "text-amber-400 hover:bg-neutral-800"
                }`}
              >
                <span>👑 Distribuidores Mayoristas B2B</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-950 text-amber-300 font-mono font-bold">
                  {users.filter((u) => u.type === "mayorista" || u.b2bStatus === "aprobado" || u.name.toLowerCase().includes("b2b")).length}
                </span>
              </button>
              <button
                onClick={() => setUserTypeFilter("detal")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  userTypeFilter === "detal"
                    ? "bg-neutral-200 text-neutral-950 font-black"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Clientes al Detal ({users.filter((u) => u.type !== "mayorista" && u.b2bStatus !== "aprobado" && !u.name.toLowerCase().includes("b2b")).length})
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users
                .filter((usr) => {
                  const isWholesale = usr.type === "mayorista" || usr.b2bStatus === "aprobado" || usr.name.toLowerCase().includes("b2b");
                  if (userTypeFilter === "mayorista") return isWholesale;
                  if (userTypeFilter === "detal") return !isWholesale;
                  return true;
                })
                .map((usr) => {
                  const isWholesale = usr.type === "mayorista" || usr.b2bStatus === "aprobado" || usr.name.toLowerCase().includes("b2b");

                  return (
                    <div
                      key={usr.id}
                      className={`bg-neutral-900 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between transition-all ${
                        isWholesale
                          ? "border-2 border-amber-500/40 shadow-amber-500/5 hover:border-amber-400"
                          : "border border-neutral-800 hover:border-neutral-700"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                          {isWholesale ? (
                            <span className="text-[10px] font-black uppercase text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2.5 py-1 rounded-lg flex items-center gap-1">
                              <span>👑</span>
                              <span>MAYORISTA B2B APROBADO</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                              {usr.authProvider || "Google Workspace"}
                            </span>
                          )}
                          <span className="text-[10px] text-neutral-500 font-mono">{usr.registrationDate}</span>
                        </div>

                        <div className="mt-3 space-y-1.5">
                          <h4 className="text-sm font-black text-white flex items-center justify-between">
                            <span>{usr.name}</span>
                            {isWholesale && (
                              <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                                {usr.b2bCode || "GR-B2B-108"}
                              </span>
                            )}
                          </h4>
                          <p className="text-xs text-neutral-300">✉️ {usr.email}</p>
                          <p className="text-xs text-neutral-400">📱 {usr.phone} • 📍 {usr.city}</p>
                          {usr.cedulaOrNit && (
                            <p className="text-[11px] text-orange-400 font-mono font-semibold">
                              🪪 {usr.documentType || "CC"}: {usr.cedulaOrNit}
                            </p>
                          )}
                          {usr.address && (
                            <p className="text-[11px] text-neutral-400 truncate">
                              🏠 {usr.address} {usr.neighborhood ? `(${usr.neighborhood})` : ""}
                            </p>
                          )}

                          {/* Tarjeta de Resumen Mayorista B2B Especial */}
                          {isWholesale && (
                            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1 mt-2">
                              <div className="flex justify-between items-center text-amber-300">
                                <span className="font-bold flex items-center gap-1">
                                  <span>🏷️</span>
                                  <span>Margen Bodega B2B:</span>
                                </span>
                                <strong className="text-emerald-400 font-mono">-35% Mayorista Oro</strong>
                              </div>
                              <p className="text-[11px] text-neutral-400">
                                Habilitado para pedidos al por mayor desde 6 unidades a nivel nacional.
                              </p>
                            </div>
                          )}
                          
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
                        {isWholesale && (
                          <button
                            onClick={() => {
                              setAdminModule("operations");
                              setActiveTab("wholesale");
                            }}
                            className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all cursor-pointer"
                            title="Ver en Gestión Mayoristas B2B"
                          >
                            <Building2 className="w-4 h-4" />
                          </button>
                        )}
                        <a
                          href={`https://wa.me/57${usr.phone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all"
                          title="Contactar por WhatsApp"
                        >
                          <MessageSquareText className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  );
                })}
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

            {/* Registered B2B Distributor Accounts */}
            <div className="p-5 rounded-3xl bg-neutral-900 border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-white uppercase flex items-center gap-2">
                    <span className="text-amber-400">👑</span>
                    <span>Cuentas de Distribuidores Mayoristas Registradas</span>
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Comercios que solicitaron estatus mayorista desde su cuenta web.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                  {users.filter((u) => u.b2bStatus === "pendiente" || u.b2bStatus === "aprobado" || u.type === "mayorista").length} cuentas B2B
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {users.filter((u) => u.b2bStatus === "pendiente" || u.b2bStatus === "aprobado" || u.type === "mayorista").map((b2bUser) => (
                  <div key={b2bUser.id} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">{b2bUser.businessName || b2bUser.name}</span>
                      {b2bUser.b2bStatus === "aprobado" ? (
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">
                          ✓ Aprobado ({b2bUser.b2bCode || "GR-B2B-108"})
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase animate-pulse">
                          ⏳ Pendiente Aprobación
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-neutral-400 space-y-1">
                      <p>👤 Contacto: <strong className="text-neutral-200">{b2bUser.name}</strong></p>
                      <p>📍 Ciudad: <strong className="text-neutral-200">{b2bUser.city}</strong></p>
                      <p>📱 WhatsApp: <strong className="text-neutral-200">{b2bUser.phone}</strong></p>
                      {b2bUser.b2bNitOrRut && <p className="font-mono text-[11px]">🪪 NIT/RUT: {b2bUser.b2bNitOrRut}</p>}
                      {b2bUser.b2bAddressOrSocial && <p className="text-[11px] truncate">🏠 Local/Redes: {b2bUser.b2bAddressOrSocial}</p>}
                    </div>

                    <div className="pt-2 border-t border-neutral-800 flex items-center gap-2">
                      {b2bUser.b2bStatus !== "aprobado" ? (
                        <button
                          onClick={() => approveWholesaleUser(b2bUser.id)}
                          className="flex-1 py-1.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs transition-colors cursor-pointer text-center"
                        >
                          Aprobar como Mayorista
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-bold flex-1">
                          Tarifas B2B Habilitadas
                        </span>
                      )}
                      <a
                        href={`https://wa.me/57${b2bUser.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Hola ${b2bUser.name}, te escribe Edwin Bernal de Gordo Ryders Colombia. Tu cuenta mayorista para ${b2bUser.businessName || "tu almacén"} ha sido aprobada con el código ${b2bUser.b2bCode || "GR-B2B-101"}. Ya puedes acceder a precios de bodega desde 6 unidades en la tienda.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all"
                        title="Enviar confirmación por WhatsApp"
                      >
                        <MessageSquareText className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
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

        {/* =========================================================================
            TAB 10: BANDEJA DE ENTRADA CHATS EN VIVO (ESTILO WHATSAPP WEB / STAKE)
            ========================================================================= */}
        {activeTab === "support" && (() => {
          const cleanSnippet = (text: string) => {
            return text
              .replace(/\*\*/g, "")
              .replace(/•/g, "")
              .replace(/\n+/g, " ")
              .trim();
          };

          const renderFormattedText = (text: string) => {
            const parts = text.split(/(\*\*.*?\*\*)/g);
            return parts.map((part, i) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <strong key={i} className="font-bold text-white">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              return part;
            });
          };

          const filteredChats = supportChats.filter((chat) => {
            const matchesSearch =
              chat.customerName.toLowerCase().includes(supportSearch.toLowerCase()) ||
              (chat.customerCity && chat.customerCity.toLowerCase().includes(supportSearch.toLowerCase())) ||
              (chat.customerPhone && chat.customerPhone.includes(supportSearch)) ||
              chat.lastMessageText.toLowerCase().includes(supportSearch.toLowerCase());

            if (!matchesSearch) return false;

            if (supportFilter === "needs_human") return chat.status === "needs_human";
            if (supportFilter === "b2b") return chat.customerType === "mayorista";
            if (supportFilter === "resolved") return chat.status === "resolved";
            return true;
          });

          const activeChat =
            supportChats.find((c) => c.id === selectedSupportChatId) ||
            filteredChats[0] ||
            supportChats[0];

          const needsHumanCount = supportChats.filter((c) => c.status === "needs_human").length;
          const b2bCount = supportChats.filter((c) => c.customerType === "mayorista").length;
          const resolvedCount = supportChats.filter((c) => c.status === "resolved").length;

          const handleSendAgent = (e?: React.FormEvent) => {
            if (e) e.preventDefault();
            if (!agentReplyText.trim() || !activeChat) return;
            sendMessageFromAgent(activeChat.id, agentReplyText.trim(), "Edwin Bernal (Asesor Oficial)");
            setAgentReplyText("");
          };

          const quickReplies = [
            { label: "👋 Saludo Asesor", text: "¡Hola! Te saluda Edwin Bernal de soporte Gordo Ryders. ¿En qué te puedo asesorar personalmente?" },
            { label: "📦 Stock Inmediato", text: "¡Sí señor! Tenemos unidades disponibles en bodega para despacho el día de hoy con guía de rastreo." },
            { label: "🚚 Tiempo de Envío", text: "A ciudades principales como Medellín, Cali o Bogotá tarda de 24 a 48 horas hábiles por Inter Rapidísimo o Envía." },
            { label: "👑 Descuento Mayorista", text: "Para compras mayoristas a partir de 6 unidades manejamos precios especiales con hasta 40% de descuento y catálogo oficial." },
            { label: "📏 Asesoría Tallas", text: "Para saber tu talla de casco exacta, mide el contorno de tu cabeza a la altura de la frente con una cinta métrica en centímetros." },
          ];

          return (
            <div className="flex flex-col h-[calc(100vh-140px)] min-h-[540px] max-h-[880px] -mt-2 space-y-3">
              {/* Sleek, Compact Control Bar */}
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl px-4 py-2.5 shadow-lg flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-400 shadow-sm">
                    <MessageSquare className="w-4 h-4" />
                  </span>
                  <div>
                    <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <span>Bandeja de Chats en Vivo</span>
                      <span className="text-[10px] text-neutral-400 font-normal hidden sm:inline">• Soporte WhatsApp Web Style</span>
                    </h2>
                    <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono font-bold mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>CONEXIÓN CON TIENDA EN VIVO 24/7</span>
                    </div>
                  </div>
                </div>

                {/* Counters / Pills */}
                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center gap-1.5 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    <span className="font-mono font-bold text-white">{supportChats.length}</span>
                    <span className="text-[10px] text-neutral-400">Total</span>
                  </div>
                  <div className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 text-[11px] ${
                    needsHumanCount > 0 ? "bg-red-500/15 border-red-500/40 text-red-300 animate-pulse" : "bg-neutral-950 border-neutral-800 text-neutral-400"
                  }`}>
                    <Flame className="w-3 h-3 text-red-400" />
                    <span className="font-mono font-bold text-red-400">{needsHumanCount}</span>
                    <span className="text-[10px] font-bold">Piden Asesor</span>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-1.5 text-[11px] text-amber-300">
                    <Building2 className="w-3 h-3 text-amber-400" />
                    <span className="font-mono font-bold text-amber-400">{b2bCount}</span>
                    <span className="text-[10px] font-bold">Mayoristas</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Web Style Main Inbox Container */}
              <div className="flex-1 min-h-0 bg-neutral-900/90 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                {/* Left Side: Directory & Conversation Threads */}
                <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-neutral-800 flex flex-col bg-neutral-950/70 h-full min-h-0">
                  {/* Search bar */}
                  <div className="p-3 border-b border-neutral-800 shrink-0">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={supportSearch}
                        onChange={(e) => setSupportSearch(e.target.value)}
                        placeholder="Buscar por cliente, ciudad o texto..."
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500/60"
                      />
                      {supportSearch && (
                        <button
                          onClick={() => setSupportSearch("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center gap-1 mt-2 overflow-x-auto pb-0.5 text-[11px] scrollbar-none">
                      <button
                        onClick={() => setSupportFilter("all")}
                        className={`px-2 py-0.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap text-[11px] ${
                          supportFilter === "all"
                            ? "bg-neutral-800 text-white font-bold"
                            : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                        }`}
                      >
                        Todos ({supportChats.length})
                      </button>
                      <button
                        onClick={() => setSupportFilter("needs_human")}
                        className={`px-2 py-0.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap text-[11px] flex items-center gap-1 ${
                          supportFilter === "needs_human"
                            ? "bg-red-500/20 text-red-400 font-bold border border-red-500/30"
                            : "text-neutral-400 hover:text-red-400 hover:bg-neutral-900"
                        }`}
                      >
                        🔥 Asesor ({needsHumanCount})
                      </button>
                      <button
                        onClick={() => setSupportFilter("b2b")}
                        className={`px-2 py-0.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap text-[11px] flex items-center gap-1 ${
                          supportFilter === "b2b"
                            ? "bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30"
                            : "text-neutral-400 hover:text-amber-400 hover:bg-neutral-900"
                        }`}
                      >
                        👑 B2B ({b2bCount})
                      </button>
                      <button
                        onClick={() => setSupportFilter("resolved")}
                        className={`px-2 py-0.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap text-[11px] ${
                          supportFilter === "resolved"
                            ? "bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30"
                            : "text-neutral-400 hover:text-emerald-400 hover:bg-neutral-900"
                        }`}
                      >
                        ✅ Resueltos ({resolvedCount})
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Chat Items */}
                  <div className="flex-1 overflow-y-auto divide-y divide-neutral-900/80 min-h-0 scrollbar-thin">
                    {filteredChats.length === 0 ? (
                      <div className="p-8 text-center text-neutral-500">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <p className="text-xs">No hay chats en este filtro.</p>
                      </div>
                    ) : (
                      filteredChats.map((chat) => {
                        const isSelected = activeChat?.id === chat.id;
                        const isHumanNeeded = chat.status === "needs_human";
                        const isReplying = chat.status === "agent_replying";

                        return (
                          <div
                            key={chat.id}
                            onClick={() => setSelectedSupportChatId(chat.id)}
                            className={`p-3 flex items-start gap-2.5 cursor-pointer transition relative group ${
                              isSelected
                                ? "bg-neutral-900 border-l-4 border-orange-500"
                                : "hover:bg-neutral-900/50"
                            }`}
                          >
                            {/* Avatar */}
                            <div className="relative shrink-0">
                              <div
                                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs text-white ${
                                  chat.customerType === "mayorista"
                                    ? "bg-gradient-to-br from-amber-500 to-orange-700"
                                    : "bg-gradient-to-br from-neutral-700 to-neutral-900"
                                }`}
                              >
                                {chat.customerName.charAt(0).toUpperCase()}
                              </div>
                              {/* Status dot indicator */}
                              <span
                                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-neutral-950 ${
                                  isHumanNeeded
                                    ? "bg-red-500 animate-pulse"
                                    : isReplying
                                    ? "bg-emerald-500"
                                    : chat.status === "resolved"
                                    ? "bg-neutral-500"
                                    : "bg-blue-400"
                                }`}
                                title={chat.status}
                              />
                            </div>

                            {/* Chat Preview Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <h4 className="text-xs font-bold text-white truncate flex items-center gap-1">
                                  {chat.customerName}
                                  {chat.customerType === "mayorista" && (
                                    <span className="px-1.5 py-0.2 bg-amber-500/20 text-amber-400 text-[9px] font-mono font-bold rounded">
                                      B2B
                                    </span>
                                  )}
                                </h4>
                                <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                                  {chat.lastMessageTime?.replace("Hoy, ", "")}
                                </span>
                              </div>

                              <p className="text-[10px] text-neutral-400 truncate mb-0.5">
                                {chat.customerCity || "Colombia"} {chat.customerPhone ? `• ${chat.customerPhone}` : ""}
                              </p>

                              <p
                                className={`text-[11px] truncate ${
                                  chat.unreadCountForAdmin > 0
                                    ? "text-neutral-200 font-semibold"
                                    : "text-neutral-400"
                                }`}
                              >
                                {cleanSnippet(chat.lastMessageText)}
                              </p>
                            </div>

                            {/* Unread badge & urgent tag */}
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              {chat.unreadCountForAdmin > 0 && (
                                <span className="w-4 h-4 rounded-full bg-orange-500 text-white font-black text-[9px] flex items-center justify-center shadow-md shadow-orange-500/20">
                                  {chat.unreadCountForAdmin}
                                </span>
                              )}
                              {isHumanNeeded && (
                                <span className="px-1.5 py-0.5 rounded-md bg-red-500/20 text-red-400 text-[9px] font-bold uppercase tracking-wider flex items-center gap-0.5">
                                  🔥 Asesor
                                </span>
                              )}
                              {isReplying && (
                                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                                  🧑‍💼 Edwin
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Side: Active Conversation Thread & Reply Bar */}
                {activeChat ? (
                  <div className="flex-1 flex flex-col bg-neutral-900/40 h-full min-h-0 overflow-hidden">
                    {/* Conversation Header */}
                    <div className="p-3 border-b border-neutral-800 bg-neutral-950/70 flex items-center justify-between gap-3 shrink-0">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs text-white shrink-0 ${
                            activeChat.customerType === "mayorista"
                              ? "bg-gradient-to-br from-amber-500 to-orange-700"
                              : "bg-gradient-to-br from-neutral-700 to-neutral-900"
                          }`}
                        >
                          {activeChat.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-xs font-black text-white truncate">
                              {activeChat.customerName}
                            </h3>
                            {activeChat.customerType === "mayorista" ? (
                              <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[9px] font-bold uppercase">
                                Mayorista B2B (Min 6 unds)
                              </span>
                            ) : (
                              <span className="px-1.5 py-0.5 rounded-full bg-neutral-800 text-neutral-300 text-[9px] font-bold uppercase">
                                Cliente Detal
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2.5 text-[11px] text-neutral-400 mt-0.5 flex-wrap">
                            {activeChat.customerPhone && (
                              <a
                                href={`https://wa.me/57${activeChat.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${activeChat.customerName}, te saluda Edwin de Gordo Ryders.`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 hover:text-emerald-400 text-emerald-500 font-mono font-medium transition"
                              >
                                <Phone className="w-3 h-3" />
                                +57 {activeChat.customerPhone}
                              </a>
                            )}
                            {activeChat.customerEmail && (
                              <span className="truncate hidden sm:inline">{activeChat.customerEmail}</span>
                            )}
                            {activeChat.customerCity && (
                              <span>📍 {activeChat.customerCity}</span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Header Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        {/* Status selector */}
                        <div className="hidden sm:flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-[10px]">
                          <button
                            onClick={() => markChatStatus(activeChat.id, "bot")}
                            className={`px-2 py-0.5 rounded-lg transition ${
                              activeChat.status === "bot"
                                ? "bg-neutral-800 text-white font-bold"
                                : "text-neutral-400 hover:text-white"
                            }`}
                          >
                            🤖 Bot
                          </button>
                          <button
                            onClick={() => markChatStatus(activeChat.id, "needs_human")}
                            className={`px-2 py-0.5 rounded-lg transition ${
                              activeChat.status === "needs_human"
                                ? "bg-red-500/20 text-red-400 font-bold"
                                : "text-neutral-400 hover:text-red-400"
                            }`}
                          >
                            🔥 Humano
                          </button>
                          <button
                            onClick={() => markChatStatus(activeChat.id, "agent_replying")}
                            className={`px-2 py-0.5 rounded-lg transition ${
                              activeChat.status === "agent_replying"
                                ? "bg-emerald-500/20 text-emerald-400 font-bold"
                                : "text-neutral-400 hover:text-emerald-400"
                            }`}
                          >
                            🧑‍💼 Asesor
                          </button>
                          <button
                            onClick={() => markChatStatus(activeChat.id, "resolved")}
                            className={`px-2 py-0.5 rounded-lg transition ${
                              activeChat.status === "resolved"
                                ? "bg-neutral-700 text-neutral-200 font-bold"
                                : "text-neutral-400 hover:text-white"
                            }`}
                          >
                            ✅ Resuelto
                          </button>
                        </div>

                        {/* WhatsApp redirect button */}
                        {activeChat.customerPhone && (
                          <a
                            href={`https://wa.me/57${activeChat.customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hola ${activeChat.customerName}, te escribe Edwin Bernal de Gordo Ryders para darte soporte a tu pedido.`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition text-xs flex items-center gap-1 font-bold cursor-pointer"
                            title="Abrir chat en WhatsApp Web"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span className="hidden xl:inline">WhatsApp</span>
                          </a>
                        )}

                        {/* Delete chat button */}
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar la conversación con ${activeChat.customerName}?`)) {
                              deleteChatSession(activeChat.id);
                            }
                          }}
                          className="p-1.5 rounded-xl bg-neutral-950 hover:bg-red-500/20 text-neutral-500 hover:text-red-400 border border-neutral-800 transition cursor-pointer"
                          title="Eliminar conversación"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0 scrollbar-thin">
                      {/* Product viewed alert */}
                      {activeChat.currentProductViewed && (
                        <div className="mx-auto max-w-md bg-neutral-950/80 border border-neutral-800 rounded-xl p-2 text-center text-xs text-neutral-400 flex items-center justify-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                          <span>Viendo: <strong className="text-white">{activeChat.currentProductViewed}</strong></span>
                        </div>
                      )}

                      {activeChat.messages.map((msg) => {
                        const isUser = msg.sender === "user";
                        const isAgent = msg.sender === "agent";
                        const isBot = msg.sender === "bot";

                        return (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${
                              isUser ? "items-start" : "items-end"
                            }`}
                          >
                            <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-neutral-500">
                              {isUser && <span className="font-bold text-neutral-400">{activeChat.customerName}</span>}
                              {isBot && (
                                <span className="font-bold text-amber-400 flex items-center gap-1">
                                  <Bot className="w-3 h-3" /> Smart Bot Gordo Ryders
                                </span>
                              )}
                              {isAgent && (
                                <span className="font-bold text-emerald-400 flex items-center gap-1">
                                  🧑‍💼 {msg.senderName || "Edwin Bernal (Asesor)"}
                                </span>
                              )}
                              <span>• {msg.timestamp}</span>
                            </div>

                            {/* Bubble */}
                            <div
                              className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-md ${
                                isUser
                                  ? "bg-neutral-800 text-neutral-100 rounded-tl-sm border border-neutral-700/60"
                                  : isAgent
                                  ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-tr-sm font-medium shadow-orange-500/10"
                                  : "bg-neutral-950 text-neutral-200 rounded-tr-sm border border-neutral-800"
                              }`}
                            >
                              <div className="whitespace-pre-line leading-relaxed">
                                {renderFormattedText(msg.text)}
                              </div>

                              {/* Rich Card: Product */}
                              {msg.productCard && (
                                <div className="mt-2.5 p-2 rounded-xl bg-neutral-900 border border-neutral-700/60 flex items-center gap-3 text-left">
                                  <img
                                    src={msg.productCard.image_url}
                                    alt={msg.productCard.name}
                                    className="w-12 h-12 rounded-lg object-cover bg-neutral-950 shrink-0"
                                    loading="lazy"
                                    decoding="async"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <h5 className="font-bold text-white text-[11px] truncate">
                                      {msg.productCard.name}
                                    </h5>
                                    <div className="text-orange-400 font-mono font-bold text-xs">
                                      {formatCOP(msg.productCard.price)}
                                    </div>
                                    <Link
                                      href={`/producto/${msg.productCard.slug}`}
                                      target="_blank"
                                      className="text-[10px] text-neutral-400 hover:text-white underline inline-flex items-center gap-1 mt-0.5"
                                    >
                                      <span>Ver en catálogo</span>
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </Link>
                                  </div>
                                </div>
                              )}

                              {/* Rich Card: Order */}
                              {msg.orderCard && (
                                <div className="mt-2.5 p-2.5 rounded-xl bg-neutral-900 border border-neutral-700/60 text-left space-y-1">
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-neutral-400">Guía de Envío:</span>
                                    <span className="font-mono font-bold text-white">{msg.orderCard.guideNumber}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-neutral-400">Transportadora:</span>
                                    <span className="font-bold text-emerald-400">{msg.orderCard.carrier}</span>
                                  </div>
                                  <div className="flex items-center justify-between text-[11px]">
                                    <span className="text-neutral-400">Estado:</span>
                                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                      {msg.orderCard.status}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={chatMessagesEndRef} />
                    </div>

                    {/* Quick Canned Responses Bar */}
                    <div className="px-3 py-1.5 bg-neutral-950/90 border-t border-neutral-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
                      <span className="text-[10px] text-neutral-500 font-bold uppercase shrink-0 px-1">
                        Plantillas:
                      </span>
                      {quickReplies.map((r, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAgentReplyText(r.text)}
                          className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 hover:text-white transition whitespace-nowrap cursor-pointer active:scale-95"
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>

                    {/* Reply Input Bar */}
                    <form
                      onSubmit={handleSendAgent}
                      className="p-3 bg-neutral-950 border-t border-neutral-800 flex items-center gap-2 shrink-0"
                    >
                      <input
                        type="text"
                        value={agentReplyText}
                        onChange={(e) => setAgentReplyText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSendAgent();
                          }
                        }}
                        placeholder={`Escribir como Edwin Bernal a ${activeChat.customerName}... (Presiona Enter para enviar)`}
                        className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500/60"
                      />
                      <button
                        type="submit"
                        disabled={!agentReplyText.trim()}
                        className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-orange-600/20 cursor-pointer active:scale-95"
                      >
                        <span>Responder</span>
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-neutral-500">
                    <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
                    <h3 className="text-base font-bold text-neutral-300">Ningún chat seleccionado</h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      Elige una conversación del listado izquierdo para responder al cliente en vivo.
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

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

              {/* FICHA TÉCNICA DINÁMICA CON PLANTILLAS PROFESIONALES */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-orange-400" />
                      <h4 className="text-xs font-black uppercase text-white tracking-wider">
                        Ficha Técnica y Especificaciones Oficiales
                      </h4>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Carga una plantilla rápida por tipo de producto o añade filas personalizadas para tu catálogo.
                    </p>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">
                    <strong className="text-orange-400">{prodForm.specs.length}</strong> características
                  </div>
                </div>

                {/* BOTONES DE PLANTILLAS RÁPIDAS (1 CLIC) */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    Cargar Plantilla Oficial (1 Clic):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplySpecTemplate("cascos")}
                      className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 hover:border-orange-500 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>🛡️</span>
                      <span>Plantilla Cascos</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplySpecTemplate("guantes")}
                      className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 hover:border-orange-500 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>🧤</span>
                      <span>Plantilla Guantes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplySpecTemplate("impermeables")}
                      className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 hover:border-orange-500 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>🌧️</span>
                      <span>Plantilla Impermeables</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplySpecTemplate("chaquetas")}
                      className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 hover:border-orange-500 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>🧥</span>
                      <span>Plantilla Chaquetas</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProdForm((prev) => ({ ...prev, specs: [] }))}
                      className="px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-red-950/40 text-neutral-400 hover:text-red-400 border border-neutral-800 hover:border-red-800 text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Limpiar Todo</span>
                    </button>
                  </div>
                </div>

                {/* TABLA DE FILAS EDITABLES */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
                  {prodForm.specs.length > 0 ? (
                    prodForm.specs.map((spec, sIdx) => (
                      <div key={sIdx} className="grid grid-cols-12 gap-2 items-center bg-neutral-900/80 p-2 rounded-xl border border-neutral-800/80">
                        <div className="col-span-5 sm:col-span-4">
                          <input
                            type="text"
                            placeholder="Ej: Certificación"
                            value={spec.label}
                            onChange={(e) => handleUpdateSpecRow(sIdx, "label", e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-2.5 py-1.5 text-xs text-orange-400 font-bold focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div className="col-span-6 sm:col-span-7">
                          <input
                            type="text"
                            placeholder="Ej: DOT FMVSS 218 y NTC 4533"
                            value={spec.value}
                            onChange={(e) => handleUpdateSpecRow(sIdx, "value", e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-700/80 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div className="col-span-1 flex justify-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveSpecRow(sIdx)}
                            className="p-1 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors cursor-pointer"
                            title="Eliminar característica"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 border border-dashed border-neutral-800 rounded-xl text-neutral-500 text-xs">
                      No hay características configuradas. Haz clic en una plantilla rápida de arriba o añade una fila manual.
                    </div>
                  )}
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleAddSpecRow}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir Fila / Característica</span>
                  </button>
                  <span className="text-[11px] text-neutral-500">
                    Se guardará en la Ficha Técnica oficial del producto.
                  </span>
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
                  <label className="block text-neutral-400 font-bold uppercase mb-1">Palabra o Frase Destacada</label>
                  <input
                    type="text"
                    required
                    value={bannerForm.highlight}
                    onChange={(e) => setBannerForm({ ...bannerForm, highlight: e.target.value })}
                    placeholder="Ej: CERO FILTRACIONES GARANTIZADO"
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
                    placeholder="Ej: VER TRAJES IMPERMEABLES"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>

              {/* Selector de Paleta de Colores de Letras (Múltiples opciones para combinar) */}
              <div className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="block text-neutral-300 font-bold uppercase text-[11px]">
                    🎨 Color de las Letras Destacadas (Elige tu combinación)
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">7 estilos disponibles</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "orange", label: "🔥 Fuego Naranja", gradient: "from-orange-500 via-amber-400 to-yellow-400" },
                    { id: "cyan", label: "⚡ Azul Cyan Neón", gradient: "from-cyan-400 via-blue-500 to-teal-300" },
                    { id: "green", label: "🌿 Verde Lima Cyber", gradient: "from-emerald-400 via-green-400 to-lime-300" },
                    { id: "gold", label: "👑 Oro Imperial B2B", gradient: "from-yellow-400 via-amber-300 to-orange-400" },
                    { id: "pink", label: "💜 Fucsia / Magenta", gradient: "from-fuchsia-500 via-pink-400 to-rose-400" },
                    { id: "red", label: "🔴 Rojo Furia Devil", gradient: "from-red-500 via-rose-500 to-orange-500" },
                    { id: "silver", label: "❄️ Plata Titanium", gradient: "from-slate-100 via-zinc-200 to-neutral-400" },
                  ].map((preset) => {
                    const isSelected = bannerForm.accentColor === preset.gradient;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setBannerForm({ ...bannerForm, accentColor: preset.gradient })}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                          isSelected
                            ? "bg-neutral-900 border-orange-500 shadow-md shadow-orange-500/20"
                            : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700"
                        }`}
                      >
                        <span className="text-[11px] font-bold text-neutral-200 truncate">{preset.label}</span>
                        <span className={`w-3.5 h-3.5 rounded-full bg-gradient-to-r ${preset.gradient} shrink-0 shadow-sm border border-black/40`} />
                      </button>
                    );
                  })}
                </div>

                {/* Live Color Preview */}
                <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800/80 text-center">
                  <span className="text-[10px] text-neutral-400 block mb-0.5">Vista previa del texto:</span>
                  <div className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                    {bannerForm.title || "TÍTULO"}{" "}
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${bannerForm.accentColor}`}>
                      {bannerForm.highlight || "TEXTO DESTACADO"}
                    </span>
                  </div>
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

              {/* Local PC Upload for Banner Background & Presets */}
              <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2.5">
                <span className="block text-neutral-300 font-bold">Foto de Fondo del Anuncio</span>
                <input type="file" ref={bannerFileInputRef} accept="image/*" className="hidden" onChange={handleBannerFileUpload} />
                
                {/* Presets de Foto de Alta Definición */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                  <span className="text-neutral-500 uppercase text-[10px] font-bold shrink-0">Fotos rápidas:</span>
                  <button
                    type="button"
                    onClick={() => setBannerForm({ ...bannerForm, bgImage: "/products/cascos/ich-3110-top-speed.jpg" })}
                    className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 whitespace-nowrap cursor-pointer"
                  >
                    🪖 Cascos Top Speed
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerForm({ ...bannerForm, bgImage: "https://images.unsplash.com/photo-1517846695664-44df0e167232?auto=format&fit=crop&w=1920&q=80" })}
                    className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-cyan-400 whitespace-nowrap cursor-pointer"
                  >
                    🌧️ Impermeable Lluvia
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerForm({ ...bannerForm, bgImage: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1920&q=80" })}
                    className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-emerald-400 whitespace-nowrap cursor-pointer"
                  >
                    🥊 Guantes Proviker
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerForm({ ...bannerForm, bgImage: "/products/cascos/ich-3110-ktm-orange.jpg" })}
                    className="px-2 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-amber-400 whitespace-nowrap cursor-pointer"
                  >
                    👑 Mayoristas B2B
                  </button>
                </div>

                {bannerForm.bgImage ? (
                  <div className="relative h-36 w-full rounded-xl overflow-hidden border border-neutral-700 bg-neutral-900 group">
                    <img src={bannerForm.bgImage} alt="Banner" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => bannerFileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-orange-500 text-neutral-950 font-bold text-xs cursor-pointer shadow-lg"
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
                    <span className="font-bold text-neutral-300 text-xs">Cargar Foto desde PC (Compresión automática)</span>
                  </button>
                )}

                {/* Direct Image URL input */}
                <div className="pt-1">
                  <input
                    type="text"
                    value={bannerForm.bgImage.startsWith("data:") ? "" : bannerForm.bgImage}
                    onChange={(e) => setBannerForm({ ...bannerForm, bgImage: e.target.value })}
                    placeholder="O escribe o pega una URL de imagen (https://...)"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-300 placeholder-neutral-500 focus:outline-none focus:border-orange-500/60"
                  />
                </div>

                <p className="text-[10px] text-neutral-400">
                  Recomendado: <strong className="text-orange-400">1920 x 800 px (Panorámica 16:9 o 21:9)</strong> • Las fotos desde tu PC se optimizan automáticamente para guardar sin límite.
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
          MODAL: USER 360° PROFILE DETAIL & CRM CONTROLS
          ========================================================================= */}
      {selectedUserForDetail && (() => {
        const userOrders = orders.filter(
          (o) =>
            o.customerName.toLowerCase() === selectedUserForDetail.name.toLowerCase() ||
            (selectedUserForDetail.email && o.customerEmail?.toLowerCase() === selectedUserForDetail.email.toLowerCase()) ||
            (selectedUserForDetail.phone && o.customerPhone.replace(/\D/g, "") === selectedUserForDetail.phone.replace(/\D/g, ""))
        );

        const userInvoices = invoices.filter(
          (inv) =>
            inv.customerName.toLowerCase() === selectedUserForDetail.name.toLowerCase() ||
            (selectedUserForDetail.email && inv.customerEmail?.toLowerCase() === selectedUserForDetail.email.toLowerCase()) ||
            (selectedUserForDetail.cedulaOrNit && inv.customerNitOrCedula === selectedUserForDetail.cedulaOrNit)
        );

        const userChats = supportChats.filter(
          (c) =>
            (selectedUserForDetail.email && c.customerEmail?.toLowerCase() === selectedUserForDetail.email.toLowerCase()) ||
            c.customerName.toLowerCase() === selectedUserForDetail.name.toLowerCase()
        );

        const isBanned = selectedUserForDetail.status === "bloqueado";
        const isWholesale = selectedUserForDetail.type === "mayorista" || selectedUserForDetail.b2bStatus === "aprobado";

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95">
              
              {/* Modal Header */}
              <div className="bg-neutral-950 px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-orange-500/20 border border-orange-500/40 text-orange-400 font-black text-sm flex items-center justify-center">
                    {selectedUserForDetail.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-white">{selectedUserForDetail.name}</h3>
                      {isBanned ? (
                        <span className="text-[10px] font-black uppercase bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Ban className="w-3 h-3" />
                          <span>BANEADO</span>
                        </span>
                      ) : isWholesale ? (
                        <span className="text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                          👑 MAYORISTA B2B
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                          CLIENTE DETAL
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      ✉️ {selectedUserForDetail.email} • 📱 {selectedUserForDetail.phone}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUserForDetail(null)}
                  className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* CRM Administrative Action Toolbar */}
              <div className="bg-neutral-950/60 px-6 py-2.5 border-b border-neutral-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  {isBanned ? (
                    <button
                      onClick={() => {
                        unbanUser(selectedUserForDetail.id);
                        setSelectedUserForDetail({ ...selectedUserForDetail, status: "activo" });
                        alert(`Usuario ${selectedUserForDetail.name} desbloqueado exitosamente.`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Desbloquear / Quitar Baneo</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (confirm(`¿Bloquear / Banear la cuenta de ${selectedUserForDetail.name}? No podrá realizar compras ni pedidos contra entrega.`)) {
                          banUser(selectedUserForDetail.id, "Baneado por administración");
                          setSelectedUserForDetail({ ...selectedUserForDetail, status: "bloqueado" });
                        }
                      }}
                      className="px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Banear / Bloquear Usuario</span>
                    </button>
                  )}

                  {isWholesale ? (
                    <button
                      onClick={() => {
                        rejectWholesaleUser(selectedUserForDetail.id);
                        setSelectedUserForDetail({ ...selectedUserForDetail, type: "detal", b2bStatus: "rechazado" });
                        alert(`Cuenta revertida a Cliente Detal.`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 font-bold cursor-pointer transition-colors"
                    >
                      <span>Revertir a Detal</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        approveWholesaleUser(selectedUserForDetail.id);
                        setSelectedUserForDetail({ ...selectedUserForDetail, type: "mayorista", b2bStatus: "aprobado", b2bCode: "GR-B2B-108" });
                        alert(`¡${selectedUserForDetail.name} ascendido a Mayorista B2B Oficial con tarifa especial!`);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>👑 Ascender a Mayorista B2B</span>
                    </button>
                  )}
                </div>

                <a
                  href={`https://wa.me/57${selectedUserForDetail.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquareText className="w-3.5 h-3.5" />
                  <span>WhatsApp Directo</span>
                </a>
              </div>

              {/* Subtabs inside CRM modal */}
              <div className="flex items-center gap-1 px-6 pt-3 border-b border-neutral-800 bg-neutral-900 text-xs">
                <button
                  onClick={() => setUserProfileTab("orders")}
                  className={`px-3 py-2 border-b-2 font-bold transition-all cursor-pointer ${
                    userProfileTab === "orders" ? "border-orange-500 text-orange-400" : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  🛍️ Pedidos ({userOrders.length})
                </button>
                <button
                  onClick={() => setUserProfileTab("invoices")}
                  className={`px-3 py-2 border-b-2 font-bold transition-all cursor-pointer ${
                    userProfileTab === "invoices" ? "border-orange-500 text-orange-400" : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  📑 Facturas ({userInvoices.length})
                </button>
                <button
                  onClick={() => setUserProfileTab("chats")}
                  className={`px-3 py-2 border-b-2 font-bold transition-all cursor-pointer ${
                    userProfileTab === "chats" ? "border-orange-500 text-orange-400" : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  💬 Chats en Vivo ({userChats.length})
                </button>
                <button
                  onClick={() => setUserProfileTab("notes")}
                  className={`px-3 py-2 border-b-2 font-bold transition-all cursor-pointer ${
                    userProfileTab === "notes" ? "border-orange-500 text-orange-400" : "border-transparent text-neutral-400 hover:text-white"
                  }`}
                >
                  📝 Datos & Notas Admin
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1 scrollbar-thin scrollbar-thumb-neutral-800">
                {userProfileTab === "orders" && (
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Historial de Compras ({userOrders.length} pedidos • Total: {formatCOP(selectedUserForDetail.totalSpent)})
                    </span>
                    {userOrders.length === 0 ? (
                      <p className="text-neutral-500 py-4 text-center">Este cliente aún no ha registrado pedidos.</p>
                    ) : (
                      userOrders.map((ord) => (
                        <div key={ord.id} className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-black text-orange-400">{ord.id.toUpperCase()}</span>
                            <span className="font-mono text-emerald-400 font-bold">{formatCOP(ord.total)}</span>
                          </div>
                          <p className="text-neutral-200">📦 {ord.productsSummary}</p>
                          <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-800">
                            <span>Guía: <strong>{ord.guideNumber}</strong> ({ord.carrier})</span>
                            <span className="font-bold text-white">{getAutoOrderStatus(ord).toUpperCase()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {userProfileTab === "invoices" && (
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Facturación Oficial Emitida ({userInvoices.length} comprobantes)
                    </span>
                    {userInvoices.length === 0 ? (
                      <p className="text-neutral-500 py-4 text-center">No hay facturas emitidas para este cliente.</p>
                    ) : (
                      userInvoices.map((inv) => (
                        <div key={inv.id} className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex items-center justify-between">
                          <div>
                            <span className="font-mono font-bold text-orange-400 block">{inv.invoiceNumber}</span>
                            <span className="text-[10px] text-neutral-400">{inv.date} • {inv.paymentMethod}</span>
                          </div>
                          <div className="text-right flex items-center gap-3">
                            <span className="font-mono font-black text-emerald-400 text-sm">{formatCOP(inv.total)}</span>
                            <button
                              onClick={() => setSelectedInvoiceForView(inv)}
                              className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold hover:bg-orange-500/30 transition-colors cursor-pointer"
                            >
                              Ver Factura
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {userProfileTab === "chats" && (
                  <div className="space-y-3">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Conversaciones en la Bandeja de Soporte en Vivo
                    </span>
                    {userChats.length === 0 ? (
                      <p className="text-neutral-500 py-4 text-center">Este cliente no ha abierto sesiones de chat con la tienda.</p>
                    ) : (
                      userChats.map((c) => (
                        <div key={c.id} className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">Sesión: {c.customerName}</span>
                            <span className="text-[10px] text-neutral-500">{c.lastMessageTime}</span>
                          </div>
                          <p className="text-neutral-300 italic">"{c.lastMessageText}"</p>
                          <div className="pt-2 border-t border-neutral-800 flex justify-end">
                            <button
                              onClick={() => {
                                setSelectedUserForDetail(null);
                                setAdminModule("operations");
                                setActiveTab("support");
                                setSelectedSupportChatId(c.id);
                              }}
                              className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold hover:bg-emerald-500/25 transition-colors cursor-pointer"
                            >
                              Abrir en Bandeja WhatsApp Web
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {userProfileTab === "notes" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                      <h4 className="font-bold text-white uppercase text-[11px]">Datos Tributarios & Ubicación:</h4>
                      <p className="text-neutral-300">🪪 {selectedUserForDetail.documentType || "CC"}: <strong>{selectedUserForDetail.cedulaOrNit || "1.020.849.201"}</strong></p>
                      <p className="text-neutral-300">📍 Ciudad: {selectedUserForDetail.city} {selectedUserForDetail.department ? `(${selectedUserForDetail.department})` : ""}</p>
                      <p className="text-neutral-300">🏠 Dirección: {selectedUserForDetail.address || "Carrera 7 # 72-41 - Chapinero"}</p>
                      {selectedUserForDetail.deliveryNotes && (
                        <p className="text-neutral-400 italic">ℹ️ Notas de entrega: "{selectedUserForDetail.deliveryNotes}"</p>
                      )}
                    </div>

                    <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
                      <h4 className="font-bold text-white uppercase text-[11px]">Bitácora Privada del Administrador:</h4>
                      <textarea
                        rows={3}
                        defaultValue={selectedUserForDetail.notes || ""}
                        onChange={(e) => setUserAdminNote(e.target.value)}
                        placeholder="Escribe notas privadas sobre este cliente (ej: 'Llamar antes de despachar', 'Cliente VIP')..."
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                      />
                      <button
                        onClick={() => {
                          const updated = { ...selectedUserForDetail, notes: userAdminNote || selectedUserForDetail.notes };
                          updateUser(updated);
                          setSelectedUserForDetail(updated);
                          alert("Notas de administración guardadas exitosamente.");
                        }}
                        className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black cursor-pointer transition-colors"
                      >
                        Guardar Notas Internas
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-neutral-950 px-6 py-3 border-t border-neutral-800 flex justify-end">
                <button
                  onClick={() => setSelectedUserForDetail(null)}
                  className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs cursor-pointer transition-colors"
                >
                  Cerrar Expediente
                </button>
              </div>

            </div>
          </div>
        );
      })()}

      {/* =========================================================================
          MODAL: TOMAR NUEVO PEDIDO (CAJERO VIRTUAL / RESTAURANTE E-COMMERCE)
          ========================================================================= */}
      {isTakeOrderModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95">
            <div className="bg-neutral-950 px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-neutral-950 font-black flex items-center justify-center text-xs">
                  🍽️
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase">Tomar Nuevo Pedido (Cajero)</h3>
                  <p className="text-[11px] text-neutral-400">Emite la orden de venta, comanda de bodega y factura oficial al instante.</p>
                </div>
              </div>
              <button onClick={() => setIsTakeOrderModalOpen(false)} className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrderSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3.5 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
                <span className="text-[10px] uppercase font-bold text-orange-400 block">1. Datos del Cliente & Despacho</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-medium">Nombre Cliente</label>
                    <input
                      type="text"
                      required
                      value={manualOrderForm.customerName}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, customerName: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 font-medium">WhatsApp / Teléfono</label>
                    <input
                      type="text"
                      required
                      value={manualOrderForm.customerPhone}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, customerPhone: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-medium">Cédula o NIT</label>
                    <input
                      type="text"
                      value={manualOrderForm.customerCedula}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, customerCedula: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 font-medium">Ciudad Destino</label>
                    <input
                      type="text"
                      value={manualOrderForm.customerCity}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, customerCity: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Dirección de Entrega</label>
                  <input
                    type="text"
                    value={manualOrderForm.customerAddress}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, customerAddress: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="p-3.5 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
                <span className="text-[10px] uppercase font-bold text-orange-400 block">2. Producto & Alistamiento (Comanda)</span>
                <div>
                  <label className="block text-neutral-400 mb-1 font-medium">Seleccionar Producto del Catálogo</label>
                  <select
                    value={manualOrderForm.selectedProductId}
                    onChange={(e) => setManualOrderForm({ ...manualOrderForm, selectedProductId: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-bold"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({formatCOP(p.price_retail)})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-medium">Talla</label>
                    <select
                      value={manualOrderForm.size}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, size: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="S">Talla S</option>
                      <option value="M">Talla M</option>
                      <option value="L">Talla L</option>
                      <option value="XL">Talla XL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 font-medium">Cantidad</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={manualOrderForm.quantity}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, quantity: Number(e.target.value) })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-neutral-950 rounded-2xl border border-neutral-800 space-y-3">
                <span className="text-[10px] uppercase font-bold text-orange-400 block">3. Finanzas & Transportadora</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1 font-medium">Método de Pago</label>
                    <select
                      value={manualOrderForm.paymentMethod}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, paymentMethod: e.target.value as any })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="Contra Entrega Nacional">Contra Entrega (Cobro en puerta)</option>
                      <option value="Wompi (Bancolombia)">Wompi / Tarjeta / PSE</option>
                      <option value="PSE / Nequi">Nequi / Bancolombia QR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1 font-medium">Transportadora</label>
                    <select
                      value={manualOrderForm.carrier}
                      onChange={(e) => setManualOrderForm({ ...manualOrderForm, carrier: e.target.value as any })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-2 text-white"
                    >
                      <option value="Inter Rapidísimo">Inter Rapidísimo</option>
                      <option value="Envia">Envía</option>
                      <option value="Servientrega">Servientrega</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsTakeOrderModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black uppercase shadow-lg shadow-orange-500/20 cursor-pointer"
                >
                  Emitir Pedido, Factura & Comanda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: COMANDA DE ALISTAMIENTO DE BODEGA (ESTILO COCINA RESTAURANTE)
          ========================================================================= */}
      {selectedOrderForKitchenTicket && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 text-white">
            
            {/* Ticket Header */}
            <div className="p-6 border-b border-dashed border-neutral-700 bg-neutral-900 text-center relative">
              <button
                onClick={() => setSelectedOrderForKitchenTicket(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="w-10 h-10 rounded-2xl bg-orange-500 text-neutral-950 font-black flex items-center justify-center mx-auto mb-2 text-sm shadow-md">
                GR
              </div>
              <h3 className="text-sm font-black uppercase tracking-wider text-white">
                GORDO RYDERS • BODEGA CENTRAL
              </h3>
              <p className="text-[10px] text-orange-400 font-bold uppercase tracking-widest mt-0.5">
                COMANDA DE ALISTAMIENTO & EMPAQUE
              </p>
              <div className="flex items-center justify-center gap-3 mt-3 text-xs font-mono text-neutral-300">
                <span className="bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-800 font-bold text-orange-400">
                  {selectedOrderForKitchenTicket.id.toUpperCase()}
                </span>
                {selectedOrderForKitchenTicket.invoiceNumber && (
                  <span className="bg-neutral-950 px-2.5 py-1 rounded-lg border border-neutral-800 font-bold text-emerald-400">
                    {selectedOrderForKitchenTicket.invoiceNumber}
                  </span>
                )}
              </div>
            </div>

            {/* Ticket Body (Checklist) */}
            <div className="p-6 space-y-4 text-xs font-mono">
              <div className="space-y-1 pb-3 border-b border-neutral-800 text-neutral-300">
                <p>👤 <strong>DESTINATARIO:</strong> {selectedOrderForKitchenTicket.customerName}</p>
                <p>📱 <strong>TELÉFONO:</strong> {selectedOrderForKitchenTicket.customerPhone}</p>
                <p>📍 <strong>CIUDAD:</strong> {selectedOrderForKitchenTicket.city}</p>
                <p>🏠 <strong>DIRECCIÓN:</strong> {selectedOrderForKitchenTicket.customerAddress || selectedOrderForKitchenTicket.city}</p>
                <p>🚚 <strong>TRANSPORTADORA:</strong> {selectedOrderForKitchenTicket.carrier} (Guía: {selectedOrderForKitchenTicket.guideNumber})</p>
              </div>

              {/* Items checklist */}
              <div className="space-y-2 py-2">
                <span className="text-[10px] uppercase font-bold text-orange-400 font-sans block">
                  ÍTEMS A RETIRAR DE ESTANTERÍA:
                </span>
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2 font-sans">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 mt-0.5 accent-orange-500 rounded" />
                    <div>
                      <span className="font-bold text-white block">{selectedOrderForKitchenTicket.productsSummary}</span>
                      <span className="text-[10px] text-neutral-400">Verificar embalaje, visor sellado y etiquetas oficiales.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Total & Payment method */}
              <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-1 text-center font-sans">
                <span className="text-[10px] text-neutral-400 uppercase font-bold block">
                  CONDICIÓN DE RECAUDO:
                </span>
                <p className="text-base font-black text-emerald-400 font-mono">
                  {formatCOP(selectedOrderForKitchenTicket.total)}
                </p>
                <span className="text-xs font-bold text-amber-300 block">
                  {selectedOrderForKitchenTicket.paymentMethod || "Contra Entrega Nacional"}
                </span>
              </div>
            </div>

            {/* Ticket Footer Actions */}
            <div className="p-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedOrderForKitchenTicket(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold text-xs"
              >
                Cerrar
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black text-xs uppercase flex items-center gap-1.5 shadow-lg shadow-orange-500/20 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Comanda</span>
              </button>
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

      {/* =========================================================================
          MODAL: CREAR / EDITAR CATEGORÍA
          ========================================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6 my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <h3 className="text-base font-black uppercase text-white">
                {editingCategory ? "Editar Categoría" : "Nueva Categoría Oficial"}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Nombre de la Categoría
                </label>
                <input
                  type="text"
                  required
                  value={catForm.name}
                  onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                  placeholder="Ej: Intercomunicadores & Audio"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Slug / URL Amigable
                </label>
                <input
                  type="text"
                  value={catForm.slug}
                  onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })}
                  placeholder="Ej: intercomunicadores (opcional, se autogenera)"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={catForm.description}
                  onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                  placeholder="Descripción corta para filtros y posicionamiento..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black text-xs uppercase"
                >
                  {editingCategory ? "Guardar Cambios" : "Crear Categoría"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CREAR / EDITAR COMBO PROMOCIONAL (CON SELECTOR DE PRODUCTOS)
          ========================================================================= */}
      {isComboModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-base font-black uppercase text-white">
                  {editingCombo ? "Editar Combo Promocional" : "Crear Nuevo Combo de Equipamiento"}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Selecciona los productos a incluir y define el precio con descuento.
                </p>
              </div>
              <button
                onClick={() => setIsComboModalOpen(false)}
                className="p-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCombo} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Nombre del Combo
                  </label>
                  <input
                    type="text"
                    required
                    value={comboForm.name}
                    onChange={(e) => setComboForm({ ...comboForm, name: e.target.value })}
                    placeholder="Ej: Combo Rutero Urbano 2026"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Etiqueta / Badge
                  </label>
                  <input
                    type="text"
                    value={comboForm.tag}
                    onChange={(e) => setComboForm({ ...comboForm, tag: e.target.value })}
                    placeholder="Ej: COMBO RUTERO ESPECIAL"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white uppercase font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                  Descripción del Combo
                </label>
                <textarea
                  rows={2}
                  required
                  value={comboForm.description}
                  onChange={(e) => setComboForm({ ...comboForm, description: e.target.value })}
                  placeholder="Explica qué incluye y los beneficios de comprar este combo completo..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* PRODUCT SELECTOR WITH CHECKBOXES */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Selecciona los productos para este combo ({comboForm.productIds.length} seleccionados):
                  </label>
                  <span className="text-[11px] font-mono text-orange-400 font-bold">
                    Mínimo 2 productos
                  </span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-neutral-700">
                  {products.map((p) => {
                    const isSelected = comboForm.productIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleProductInCombo(p.id)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-orange-500/10 border-orange-500/40 text-white"
                            : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // handled by parent onClick
                            className="w-4 h-4 accent-orange-500 rounded"
                          />
                          <img
                            src={p.images?.[0] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=100&q=80"}
                            alt={p.name}
                            className="w-9 h-9 rounded-lg object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold block truncate max-w-[280px]">{p.name}</span>
                            <span className="text-[10px] text-neutral-400 font-mono">{p.category_name} • {p.sku}</span>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-bold text-white shrink-0">
                          {formatCOP(p.price_retail)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal preview */}
                {(() => {
                  const selProds = products.filter((p) => comboForm.productIds.includes(p.id));
                  const sum = selProds.reduce((acc, p) => acc + p.price_retail, 0);
                  const savings = Math.max(0, sum - Number(comboForm.price || 0));

                  return (
                    <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                      <span className="text-neutral-400">
                        Suma individual: <strong className="text-white font-mono">{formatCOP(sum)}</strong>
                      </span>
                      {comboForm.price > 0 && sum > comboForm.price && (
                        <span className="text-emerald-400 font-black">
                          Ahorro calculado: {formatCOP(savings)} ({Math.round((savings / sum) * 100)}% OFF)
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Combo Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                    Precio Promocional del Combo (COP)
                  </label>
                  <input
                    type="number"
                    required
                    value={comboForm.price}
                    onChange={(e) => setComboForm({ ...comboForm, price: Number(e.target.value) })}
                    placeholder="Ej: 389900"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono font-bold focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-neutral-300">
                    <input
                      type="checkbox"
                      checked={comboForm.isActive}
                      onChange={(e) => setComboForm({ ...comboForm, isActive: e.target.checked })}
                      className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
                    />
                    <span>Activar combo inmediatamente en la tienda</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsComboModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-bold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black text-xs uppercase"
                >
                  {editingCombo ? "Actualizar Combo" : "Guardar Combo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}