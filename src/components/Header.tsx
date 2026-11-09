"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  MapPin, 
  Package, 
  Phone, 
  ChevronDown, 
  ChevronRight,
  ShieldCheck, 
  Flame,
  MessageCircle,
  HelpCircle,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { MEGA_CATEGORIES, PRODUCTS, MegaCategory } from "@/data/products";

interface HeaderProps {
  cartCount?: number;
  userCity?: string;
  onOpenCart?: () => void;
  onOpenLocation?: () => void;
  onOpenTracking?: () => void;
  onOpenContact?: () => void;
}

export default function Header({
  cartCount = 0,
  userCity = "Bogotá D.C.",
  onOpenCart,
  onOpenLocation,
  onOpenTracking,
  onOpenContact,
}: HeaderProps) {
  const router = useRouter();
  const { categories, products } = useStore();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<MegaCategory>(MEGA_CATEGORIES[0]);
  const [expandedMobileCat, setExpandedMobileCat] = useState<string | null>("cascos");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter products for predictive search preview
  const activeProductsList = products && products.length > 0 ? products : PRODUCTS;
  const searchResults = searchQuery.trim().length >= 2
    ? activeProductsList.filter((p) => {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesSku = p.sku.toLowerCase().includes(query);
        const matchesCat = p.category_name?.toLowerCase().includes(query);
        const matchesSelectedCat = selectedCategory === "all" || p.category_id === selectedCategory;
        return (matchesName || matchesSku || matchesCat) && matchesSelectedCat;
      }).slice(0, 5)
    : [];

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearchFocused(false);
    if (searchResults.length > 0) {
      router.push(`/producto/${searchResults[0].slug}`);
    } else {
      router.push(`/categoria/all?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const formatCOP = (num: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(num);

  return (
    <header className="sticky top-0 z-40 bg-neutral-950 border-b border-neutral-800/90 shadow-2xl backdrop-blur-md">
      
      {/* =========================================================================
          TIER 1: MAIN SEARCH & COMMERCE BAR (Desktop & Mobile)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="lg:hidden p-2 -ml-2 text-neutral-300 hover:text-white rounded-xl hover:bg-neutral-900 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-600 flex items-center justify-center font-black text-lg sm:text-xl text-neutral-950 tracking-tighter shadow-md shadow-orange-600/25 group-hover:scale-105 transition-transform">
              GR
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-xl font-black tracking-wider uppercase text-white flex items-center leading-none">
                GORDO <span className="text-orange-500 ml-1">RYDERS</span>
              </span>
              <span className="text-[9px] sm:text-[10px] tracking-widest text-neutral-400 font-semibold uppercase mt-0.5">
                Equipamiento Motero
              </span>
            </div>
          </Link>

          {/* Location / Shipping Destination (Mercado Libre Signature) */}
          <button
            onClick={onOpenLocation}
            className="hidden lg:flex items-center gap-2 p-2 rounded-xl hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all text-left shrink-0 group"
          >
            <MapPin className="w-4 h-4 text-orange-400 shrink-0 group-hover:scale-110 transition-transform" />
            <div className="leading-tight">
              <span className="text-[10px] text-neutral-400 block font-medium">Enviar a</span>
              <span className="text-xs font-bold text-white block group-hover:text-orange-400 transition-colors">
                {userCity}
              </span>
            </div>
          </button>

          {/* Center Search Bar (Refined with Predictive Preview) */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl hidden md:block relative">
            <form 
              onSubmit={handleSearchSubmit} 
              className={`relative flex items-center rounded-2xl bg-neutral-900 border transition-all ${
                isSearchFocused 
                  ? "border-orange-500 ring-2 ring-orange-500/20 shadow-lg shadow-orange-500/10" 
                  : "border-neutral-700/80 hover:border-neutral-600"
              }`}
            >
              {/* Category Selector inside search */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-neutral-800/80 border-r border-neutral-700 text-neutral-300 text-xs rounded-l-2xl pl-3 pr-6 py-2.5 focus:outline-none hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
              >
                <option value="all">Todas</option>
                <option value="cascos">Cascos</option>
                <option value="guantes">Guantes</option>
                <option value="impermeables">Impermeables</option>
                <option value="protecciones">Protecciones</option>
                <option value="accesorios">Accesorios</option>
              </select>

              {/* Main Search Input */}
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="Buscar cascos ECE 22.06, guantes Proviker E44, impermeables..."
                className="w-full bg-transparent text-xs sm:text-sm px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1.5 text-neutral-400 hover:text-white mr-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Search Submit Button */}
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-neutral-950 font-bold px-4 py-2.5 rounded-r-2xl transition-colors shrink-0 flex items-center justify-center"
                aria-label="Buscar"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Predictive Search Suggestions Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-3 py-1.5 flex items-center justify-between border-b border-neutral-800/80 mb-1">
                  <span>Productos Coincidentes</span>
                  <span className="text-orange-400">Ver producto →</span>
                </div>
                {searchResults.map((product) => (
                  <Link
                    key={product.id}
                    href={`/producto/${product.slug}`}
                    onClick={() => setIsSearchFocused(false)}
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-800/90 transition-colors group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-lg bg-neutral-950 shrink-0 border border-neutral-800"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-orange-400 bg-orange-500/10 px-1.5 py-0.2 rounded font-bold">
                          REF: {product.sku}
                        </span>
                        <span className="text-[10px] text-neutral-400">{product.category_name}</span>
                      </div>
                      <p className="text-xs font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                        {product.name}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-white block">
                        {formatCOP(product.price_retail)}
                      </span>
                      {product.price_original && (
                        <span className="text-[10px] text-neutral-500 line-through block">
                          {formatCOP(product.price_original)}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Utilities (Account, Orders, Cart) */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* User Account Login */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 p-2 rounded-xl hover:bg-neutral-900 text-left transition-colors text-neutral-300 hover:text-white group"
            >
              <User className="w-5 h-5 text-neutral-400 group-hover:text-orange-400 transition-colors shrink-0" />
              <div className="hidden xl:block leading-tight">
                <span className="text-[10px] text-neutral-400 block font-medium">¡Hola! Ingresa</span>
                <span className="text-xs font-bold text-white block">Mi Cuenta</span>
              </div>
            </button>

            {/* Tracking Orders Link */}
            <Link
              href="/rastreo"
              className="hidden lg:flex items-center gap-2 p-2 rounded-xl hover:bg-neutral-900 text-left transition-colors text-neutral-300 hover:text-white group"
            >
              <Package className="w-5 h-5 text-neutral-400 group-hover:text-orange-400 transition-colors shrink-0" />
              <div className="hidden xl:block leading-tight">
                <span className="text-[10px] text-neutral-400 block font-medium">Mis Compras</span>
                <span className="text-xs font-bold text-white block">Rastrear Guía</span>
              </div>
            </Link>

            {/* Slide-over Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 rounded-2xl text-white transition-all shadow-md group shrink-0"
              aria-label="Abrir Carrito de compras"
            >
              <ShoppingCart className="w-5 h-5 text-neutral-200 group-hover:text-orange-400 transition-colors" />
              {cartCount > 0 ? (
                <span className="bg-orange-500 text-neutral-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow animate-pulse">
                  {cartCount}
                </span>
              ) : (
                <span className="hidden sm:inline text-xs font-bold text-neutral-300">
                  $ 0
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Mobile Search Row (Clean and prominent on small screens) */}
        <div className="mt-2.5 md:hidden relative">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar cascos, guantes, impermeables..."
              className="w-full bg-neutral-900 border border-neutral-700 text-xs rounded-2xl pl-9 pr-10 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
            <button type="submit" className="absolute right-2 text-orange-400 p-1">
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Mobile Shipping City Bar */}
        <div className="md:hidden mt-2 pt-1 border-t border-neutral-800/80 flex items-center justify-between text-[11px]">
          <button
            onClick={onOpenLocation}
            className="flex items-center gap-1.5 text-neutral-300 font-medium"
          >
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>Enviar a <strong className="text-white">{userCity}</strong></span>
          </button>
          <Link href="/rastreo" className="text-orange-400 font-semibold text-[10px]">
            Rastrear pedido →
          </Link>
        </div>

      </div>

      {/* =========================================================================
          TIER 2: MEGA-DROPDOWN CATEGORIES & SERVICES RIBBON (Desktop)
          ========================================================================= */}
      <nav className="hidden lg:block bg-neutral-900/90 border-t border-neutral-800 backdrop-blur-md relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs font-semibold py-1.5">
            
            {/* Left Categories Dropdown & Nav Links */}
            <div className="flex items-center gap-6">
              
              {/* "Todas las Categorías" Mega Menu Button */}
              <div ref={megaMenuRef} className="relative">
                <button
                  onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                  onMouseEnter={() => setCategoriesDropdownOpen(true)}
                  className="flex items-center gap-2 text-white hover:text-orange-400 py-1 transition-colors group"
                >
                  <Menu className="w-4 h-4 text-orange-400 group-hover:rotate-90 transition-transform duration-200" />
                  <span className="font-bold">Categorías</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${categoriesDropdownOpen ? "rotate-180 text-orange-400" : ""}`} />
                </button>

                {/* 2-Column Mega Menu Container (Mercado Libre Style) */}
                {categoriesDropdownOpen && (
                  <div
                    onMouseLeave={() => setCategoriesDropdownOpen(false)}
                    className="absolute top-full left-0 mt-1.5 w-[650px] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-50 flex animate-in fade-in zoom-in-95"
                  >
                    {/* Left Column: Main Category List */}
                    <div className="w-60 bg-neutral-950/80 border-r border-neutral-800 p-2 space-y-1">
                      <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500 px-3 py-1">
                        Departamentos
                      </p>
                      {MEGA_CATEGORIES.map((cat) => {
                        const isSelected = activeCategory.id === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onMouseEnter={() => setActiveCategory(cat)}
                            onClick={() => {
                              router.push(`/categoria/${cat.slug}`);
                              setCategoriesDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors ${
                              isSelected
                                ? "bg-orange-500/15 text-orange-400 font-bold border border-orange-500/30"
                                : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                            }`}
                          >
                            <span>{cat.name}</span>
                            <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? "text-orange-400" : "text-neutral-600"}`} />
                          </button>
                        );
                      })}
                    </div>

                    {/* Right Panel: Subcategories for the Active Category */}
                    <div className="flex-1 p-4 bg-neutral-900">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-neutral-800">
                        <div>
                          <h4 className="text-sm font-black text-white uppercase tracking-tight">
                            {activeCategory.name}
                          </h4>
                          {activeCategory.highlight && (
                            <span className="text-[10px] text-orange-400 font-mono font-bold">
                              ★ {activeCategory.highlight}
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/categoria/${activeCategory.slug}`}
                          onClick={() => setCategoriesDropdownOpen(false)}
                          className="text-[11px] font-bold text-orange-400 hover:underline flex items-center gap-1"
                        >
                          Ver todo →
                        </Link>
                      </div>

                      <div className="grid grid-cols-1 gap-1.5">
                        {activeCategory.subcategories.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/categoria/${activeCategory.slug}?sub=${sub.slug}`}
                            onClick={() => setCategoriesDropdownOpen(false)}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs transition-colors group"
                          >
                            <span className="group-hover:translate-x-1 transition-transform">
                              {sub.name}
                            </span>
                            {sub.badge && (
                              <span className="text-[9px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
                                {sub.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>

                      {/* Direct B2B Wholesale Banner in Mega Menu */}
                      <div className="mt-4 p-3 rounded-xl bg-orange-950/30 border border-orange-700/40 flex items-center justify-between">
                        <div>
                          <p className="text-[11px] font-bold text-white">¿Tienes almacén o taller motero?</p>
                          <p className="text-[10px] text-orange-300/80">Precios directos de fábrica por volumen</p>
                        </div>
                        <Link
                          href="/mayoristas"
                          onClick={() => setCategoriesDropdownOpen(false)}
                          className="bg-orange-500 hover:bg-orange-600 text-neutral-950 text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                          Mayoristas
                        </Link>
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* Direct Category Links */}
              <Link prefetch={true} href="/categoria/cascos" className="text-neutral-300 hover:text-orange-400 active:scale-95 transition-all duration-75 py-1 cursor-pointer">
                Cascos
              </Link>
              <Link prefetch={true} href="/categoria/guantes" className="text-neutral-300 hover:text-orange-400 active:scale-95 transition-all duration-75 py-1 cursor-pointer">
                Guantes Proviker
              </Link>
              <Link prefetch={true} href="/categoria/impermeables" className="text-neutral-300 hover:text-orange-400 active:scale-95 transition-all duration-75 py-1 cursor-pointer">
                Impermeables
              </Link>
              <Link prefetch={true} href="/categoria/protecciones" className="text-neutral-300 hover:text-orange-400 active:scale-95 transition-all duration-75 py-1 cursor-pointer">
                Protecciones
              </Link>
              <Link prefetch={true} href="/categoria/ofertas" className="text-orange-400 hover:text-orange-300 active:scale-95 font-bold transition-all duration-75 py-1 flex items-center gap-1 cursor-pointer">
                <Flame className="w-3.5 h-3.5" />
                Ofertas del Día
              </Link>
            </div>

            {/* Right Strategic Links (Wholesale, Contact, Tracking) */}
            <div className="flex items-center gap-5 text-neutral-300">
              <Link
                prefetch={true}
                href="/mayoristas"
                className="hover:text-emerald-400 active:scale-95 transition-all duration-75 flex items-center gap-1.5 font-bold cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mayoristas B2B</span>
              </Link>

              <Link
                prefetch={true}
                href="/contacto"
                className="hover:text-white active:scale-95 transition-all duration-75 flex items-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>Contacto & Bodega</span>
              </Link>

              <Link
                prefetch={true}
                href="/rastreo"
                className="hover:text-white active:scale-95 transition-all duration-75 flex items-center gap-1.5 cursor-pointer"
              >
                <Package className="w-3.5 h-3.5 text-neutral-400" />
                <span>Rastrear Guía</span>
              </Link>
            </div>

          </div>
        </div>
      </nav>

      {/* =========================================================================
          MOBILE SLIDE-OUT DRAWER (Optimized for Phones & Tablets, No Screen Clutter)
          ========================================================================= */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 max-w-sm w-full bg-neutral-900 border-r border-neutral-800 text-white p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-300 overflow-y-auto">
            
            {/* Drawer Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-black text-neutral-950 text-sm">
                    GR
                  </div>
                  <div>
                    <span className="font-black text-base uppercase block leading-none">Gordo Ryders</span>
                    <span className="text-[9px] text-neutral-400 font-mono">Tienda Oficial Motera</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                  aria-label="Cerrar menú"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Login Action in Drawer */}
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setShowAuthModal(true);
                }}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-neutral-950 border border-neutral-800 mb-4 hover:border-neutral-700 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold text-white block">Ingresar a tu Cuenta</span>
                  <span className="text-[10px] text-neutral-400">Google, Email o Mayorista</span>
                </div>
              </button>

              {/* Categorías Accordion List */}
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-2 py-1">
                  Categorías de Producto
                </p>

                {MEGA_CATEGORIES.map((cat) => {
                  const isExpanded = expandedMobileCat === cat.id;
                  return (
                    <div key={cat.id} className="rounded-xl overflow-hidden border border-neutral-800/60 bg-neutral-950/40 mb-1">
                      <button
                        onClick={() => setExpandedMobileCat(isExpanded ? null : cat.id)}
                        className="w-full flex items-center justify-between p-3 text-left text-xs font-bold text-white hover:bg-neutral-800/50"
                      >
                        <span>{cat.name}</span>
                        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isExpanded ? "rotate-180 text-orange-400" : ""}`} />
                      </button>

                      {isExpanded && (
                        <div className="px-3 pb-3 pt-1 space-y-1 border-t border-neutral-800/40 bg-neutral-950/80">
                          {cat.subcategories.map((sub) => (
                            <Link
                              key={sub.slug}
                              href={`/categoria/${cat.slug}?sub=${sub.slug}`}
                              onClick={() => setMobileDrawerOpen(false)}
                              className="flex items-center justify-between py-1.5 px-2 rounded-lg text-[11px] text-neutral-300 hover:text-orange-400 hover:bg-neutral-900"
                            >
                              <span>{sub.name}</span>
                              {sub.badge && (
                                <span className="text-[8px] font-bold text-orange-400 bg-orange-500/10 px-1.5 py-0.5 rounded">
                                  {sub.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                          <Link
                            href={`/categoria/${cat.slug}`}
                            onClick={() => setMobileDrawerOpen(false)}
                            className="block text-[11px] font-black text-orange-400 pt-2 px-2"
                          >
                            Ver toda la categoría {cat.name} →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Navigation Pages */}
              <div className="mt-4 pt-4 border-t border-neutral-800 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-2 py-1">
                  Secciones y Servicios
                </p>

                <Link
                  href="/categoria/ofertas"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-xl text-orange-400 font-bold text-xs hover:bg-neutral-800"
                >
                  <Flame className="w-4 h-4" />
                  <span>Ofertas Relámpago</span>
                </Link>

                <Link
                  href="/mayoristas"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-xl text-emerald-400 font-bold text-xs hover:bg-neutral-800"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Canal Mayoristas B2B</span>
                </Link>

                <Link
                  href="/contacto"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-xl text-neutral-200 text-xs hover:bg-neutral-800"
                >
                  <Phone className="w-4 h-4 text-orange-400" />
                  <span>Contacto, Bodega y Mapa</span>
                </Link>

                <Link
                  href="/rastreo"
                  onClick={() => setMobileDrawerOpen(false)}
                  className="flex items-center gap-3 p-2.5 rounded-xl text-neutral-200 text-xs hover:bg-neutral-800"
                >
                  <Package className="w-4 h-4 text-neutral-400" />
                  <span>Rastreo de Pedidos</span>
                </Link>
              </div>

            </div>

            {/* Drawer Bottom Info */}
            <div className="pt-4 border-t border-neutral-800 text-center">
              <p className="text-[10px] text-neutral-500">
                Gordo Ryders Colombia • Envíos a todo el país
              </p>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          AUTH MODAL (Google / Email) - Portal to Body to avoid any Header blur / clipping
          ========================================================================= */}
      {showAuthModal && mounted && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[999999] min-h-[100dvh] w-screen flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-sm bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl my-auto animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1.5 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center font-black text-neutral-950 text-xl mx-auto mb-3 shadow-lg shadow-orange-600/30">
                GR
              </div>
              <h3 className="text-lg font-black uppercase text-white">Ingresa a tu Cuenta</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Guarda tus direcciones y consulta el estado de tus compras en tiempo real.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => alert("El login con Google se activa con Supabase / Firebase Auth configurado.")}
                className="w-full flex items-center justify-center gap-3 p-3 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs transition-colors cursor-pointer shadow-md"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                Continuar con Google
              </button>
              <button
                onClick={() => alert("El login por correo enviará un Magic Link seguro a tu bandeja.")}
                className="w-full p-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors border border-neutral-700 cursor-pointer"
              >
                Ingresar con Correo Electrónico
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

    </header>
  );
}
