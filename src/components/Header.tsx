"use client";

import { useState } from "react";
import Link from "next/link";
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
  ShieldCheck, 
  Flame,
  MessageCircle,
  HelpCircle
} from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const categories = [
    { name: "Cascos Certificados", href: "#catalogo", tag: "ECE 22.06" },
    { name: "Guantes Proviker", href: "#catalogo", tag: "Ref E44" },
    { name: "Impermeables", href: "#catalogo", tag: "Siliconados" },
    { name: "Chaquetas Térmicas", href: "#catalogo", tag: "Protección CE" },
    { name: "Protecciones", href: "#catalogo", tag: "Rodilleras" },
    { name: "Accesorios CNC", href: "#catalogo", tag: "Portacelular" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-neutral-950 border-b border-neutral-800 shadow-xl">
      
      {/* =========================================================================
          TIER 1: MAIN SEARCH & COMMERCE BAR (Desktop & Mobile)
          ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden p-2 -ml-2 text-neutral-300 hover:text-white rounded-xl hover:bg-neutral-900 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-orange-600 flex items-center justify-center font-black text-lg sm:text-xl text-neutral-950 tracking-tighter shadow-md shadow-orange-600/20 group-hover:scale-105 transition-transform">
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

          {/* Location / Shipping Destination (Mercado Libre & Amazon Signature) */}
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

          {/* Center Search Bar (Amazon / Mercado Libre Pro Style) */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
              
              {/* Category Selector inside search */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-neutral-900 border-y border-l border-neutral-700 text-neutral-300 text-xs rounded-l-2xl pl-3 pr-6 py-2.5 focus:outline-none hover:bg-neutral-800 transition-colors cursor-pointer shrink-0 border-r-0"
              >
                <option value="all">Todas</option>
                <option value="cascos">Cascos</option>
                <option value="guantes">Guantes</option>
                <option value="impermeables">Impermeables</option>
                <option value="chaquetas">Chaquetas</option>
                <option value="protecciones">Protecciones</option>
              </select>

              {/* Main Search Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cascos certificados, guantes Proviker E44, impermeables..."
                className="w-full bg-neutral-900/90 border-y border-neutral-700 text-xs sm:text-sm px-3 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:bg-neutral-900 transition-all"
              />

              {/* Search Submit Button */}
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-neutral-950 font-bold px-4 py-2.5 rounded-r-2xl border-y border-r border-orange-500 transition-colors shrink-0 flex items-center justify-center"
                aria-label="Buscar"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
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

            {/* Tracking Orders Trigger */}
            <button
              onClick={onOpenTracking}
              className="hidden lg:flex items-center gap-2 p-2 rounded-xl hover:bg-neutral-900 text-left transition-colors text-neutral-300 hover:text-white group"
            >
              <Package className="w-5 h-5 text-neutral-400 group-hover:text-orange-400 transition-colors shrink-0" />
              <div className="hidden xl:block leading-tight">
                <span className="text-[10px] text-neutral-400 block font-medium">Mis Compras</span>
                <span className="text-xs font-bold text-white block">Rastrear Guía</span>
              </div>
            </button>

            {/* Slide-over Cart Trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-2xl text-white transition-all shadow-md group shrink-0"
              aria-label="Abrir Carrito de compras"
            >
              <ShoppingCart className="w-5 h-5 text-neutral-200 group-hover:text-orange-400 transition-colors" />
              {cartCount > 0 ? (
                <span className="bg-orange-500 text-neutral-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow">
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
        <div className="mt-2.5 md:hidden">
          <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
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

        {/* Mobile Shipping City Bar (Tap to change, Mercado Libre mobile style) */}
        <div className="md:hidden mt-2 pt-1 border-t border-neutral-800/80 flex items-center justify-between text-[11px]">
          <button
            onClick={onOpenLocation}
            className="flex items-center gap-1.5 text-neutral-300 font-medium"
          >
            <MapPin className="w-3.5 h-3.5 text-orange-400" />
            <span>Enviar a <strong className="text-white">{userCity}</strong></span>
          </button>
          <button onClick={onOpenTracking} className="text-orange-400 font-semibold text-[10px]">
            Rastrear pedido →
          </button>
        </div>

      </div>

      {/* =========================================================================
          TIER 2: CATEGORIES & SERVICES RIBBON (Desktop)
          ========================================================================= */}
      <nav className="hidden md:block bg-neutral-900/90 border-t border-neutral-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs font-semibold py-1.5">
            
            {/* Left Categories Dropdown & Nav Links */}
            <div className="flex items-center gap-6">
              
              {/* "Todas las Categorías" Dropdown Button */}
              <div className="relative">
                <button
                  onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                  className="flex items-center gap-2 text-white hover:text-orange-400 py-1 transition-colors"
                >
                  <Menu className="w-4 h-4 text-orange-400" />
                  <span className="font-bold">Categorías</span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {/* Dropdown Menu */}
                {categoriesDropdownOpen && (
                  <div
                    onMouseLeave={() => setCategoriesDropdownOpen(false)}
                    className="absolute top-full left-0 mt-2 w-64 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95"
                  >
                    <p className="text-[10px] font-black uppercase tracking-wider text-neutral-400 px-3 py-1">
                      Líneas de Producto
                    </p>
                    {categories.map((c) => (
                      <Link
                        key={c.name}
                        href={c.href}
                        onClick={() => setCategoriesDropdownOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-800 text-neutral-200 hover:text-orange-400 transition-colors"
                      >
                        <span className="text-xs font-bold">{c.name}</span>
                        <span className="text-[10px] text-neutral-500 font-mono">{c.tag}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct Links */}
              <Link href="#catalogo" className="text-neutral-300 hover:text-orange-400 transition-colors py-1">
                Cascos
              </Link>
              <Link href="#catalogo" className="text-neutral-300 hover:text-orange-400 transition-colors py-1">
                Guantes Proviker
              </Link>
              <Link href="#catalogo" className="text-neutral-300 hover:text-orange-400 transition-colors py-1">
                Impermeables
              </Link>
              <Link href="#catalogo" className="text-neutral-300 hover:text-orange-400 transition-colors py-1">
                Protecciones
              </Link>
              <Link href="#catalogo" className="text-orange-400 hover:text-orange-300 font-bold transition-colors py-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                Ofertas del Día
              </Link>
            </div>

            {/* Right Strategic Links (Wholesale & Contact) */}
            <div className="flex items-center gap-5 text-neutral-300">
              <a
                href="https://wa.me/573000000000?text=Hola%20Edwin,%20deseo%20cotizar%20precios%20al%20por%20mayor%20para%20mi%20almacén"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-bold"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mayoristas B2B</span>
              </a>

              <button
                onClick={onOpenContact}
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5 text-orange-400" />
                <span>Contacto & Bodega</span>
              </button>

              <button
                onClick={onOpenTracking}
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Package className="w-3.5 h-3.5 text-neutral-400" />
                <span>Rastrear Guía</span>
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* =========================================================================
          MOBILE SLIDE-OUT DRAWER (Mercado Libre Clean Mobile Style)
          ========================================================================= */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-neutral-900 border-r border-neutral-800 text-white p-5 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-300">
            
            {/* Drawer Top */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-black text-neutral-950 text-sm">
                    GR
                  </div>
                  <span className="font-black text-base uppercase">Gordo Ryders</span>
                </div>
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Account Login in Drawer */}
              <button
                onClick={() => {
                  setMobileDrawerOpen(false);
                  setShowAuthModal(true);
                }}
                className="w-full flex items-center gap-3 p-3 bg-neutral-950 rounded-2xl border border-neutral-800 text-left"
              >
                <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Ingresar a tu cuenta</span>
                  <span className="text-[10px] text-neutral-400">Google, Facebook o Email</span>
                </div>
              </button>

              {/* Categories Navigation */}
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-neutral-500 tracking-wider px-2 pt-2">
                  Categorías
                </p>
                {categories.map((c) => (
                  <Link
                    key={c.name}
                    href={c.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-800 text-xs font-semibold text-neutral-200"
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] text-neutral-500">{c.tag}</span>
                  </Link>
                ))}
              </div>

              {/* Services & Contact */}
              <div className="pt-2 border-t border-neutral-800 space-y-1">
                <p className="text-[10px] font-black uppercase text-neutral-500 tracking-wider px-2">
                  Canales y Servicios
                </p>
                <a
                  href="https://wa.me/573000000000?text=Hola%20Edwin,%20deseo%20comprar%20por%20mayor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold text-emerald-400 hover:bg-neutral-800"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Canal Mayoristas B2B</span>
                </a>
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenTracking && onOpenTracking();
                  }}
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-neutral-300 hover:bg-neutral-800 text-left"
                >
                  <Package className="w-4 h-4 text-orange-400" />
                  <span>Rastrear mi pedido con guía</span>
                </button>
                <button
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    onOpenContact && onOpenContact();
                  }}
                  className="w-full flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-neutral-300 hover:bg-neutral-800 text-left"
                >
                  <Phone className="w-4 h-4 text-neutral-400" />
                  <span>Contacto, Redes y Bodega</span>
                </button>
              </div>

            </div>

            {/* Drawer Bottom */}
            <div className="pt-4 border-t border-neutral-800 text-center">
              <p className="text-[10px] text-neutral-500">
                Gordo Ryders • Despachos a toda Colombia 🇨🇴
              </p>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          AUTH MODAL (Google / Facebook / Email)
          ========================================================================= */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 text-white relative shadow-2xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-xl hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-orange-600/20 text-orange-500 mx-auto flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black uppercase text-white">Ingresar a Gordo Ryders</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Consulta el estado de tus compras, guarda tus datos de envío y recibe precios preferenciales.
              </p>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => alert("El login con Google se activa al conectar el Client ID en el panel de Supabase.")}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-neutral-100 text-neutral-900 font-bold py-3 px-4 rounded-2xl text-xs sm:text-sm transition-all shadow-md"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continuar con Google
              </button>

              <button 
                onClick={() => alert("El login con Facebook se activa en Supabase Auth.")}
                className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-3 px-4 rounded-2xl text-xs sm:text-sm transition-all shadow-md"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continuar con Facebook
              </button>
            </div>

            <p className="text-[11px] text-center text-neutral-500 mt-5">
              Tus datos están protegidos con cifrado de grado militar.
            </p>
          </div>
        </div>
      )}

    </header>
  );
}
