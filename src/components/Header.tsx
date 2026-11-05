"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  PhoneCall, 
  ShieldCheck, 
  Truck,
  Sparkles
} from "lucide-react";

interface HeaderProps {
  cartCount?: number;
}

export default function Header({ cartCount = 0 }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const categories = [
    { name: "Cascos", href: "#cascos" },
    { name: "Guantes", href: "#guantes" },
    { name: "Impermeables & Chaquetas", href: "#impermeables" },
    { name: "Protecciones", href: "#protecciones" },
    { name: "Accesorios", href: "#accesorios" },
    { name: "Ofertas 🔥", href: "#ofertas" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-neutral-950 text-white border-b border-neutral-800 shadow-xl">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600 text-neutral-950 text-xs sm:text-sm font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 animate-pulse hidden sm:inline" />
        <span>⚡ Envíos rápidos a toda Colombia | Compras seguras | Ventas al por mayor vía WhatsApp</span>
        <span className="hidden md:inline text-neutral-900 font-extrabold">• Atención directa: +57 300 000 0000</span>
      </div>

      {/* 2. MAIN NAVBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center font-black text-xl text-neutral-950 tracking-tighter shadow-lg shadow-orange-600/30 group-hover:scale-105 transition-transform">
              GR
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-wider uppercase text-white flex items-center gap-1">
                GORDO <span className="text-orange-500">RYDERS</span>
              </span>
              <span className="text-[10px] tracking-widest text-neutral-400 font-semibold uppercase -mt-1">
                Equipamiento Motero
              </span>
            </div>
          </Link>

          {/* Search Bar (Mercado Libre style) */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <form onSubmit={(e) => e.preventDefault()} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar cascos, guantes Proviker E44, impermeables, rodilleras..."
                className="w-full bg-neutral-900 border border-neutral-700 text-sm rounded-full pl-11 pr-24 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-inner"
              />
              <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-2.5" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bg-orange-500 hover:bg-orange-600 text-neutral-950 font-bold text-xs px-4 py-1.5 rounded-full transition-colors"
              >
                Buscar
              </button>
            </form>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* WhatsApp B2B CTA */}
            <a
              href="https://wa.me/573000000000?text=Hola%20Gordo%20Ryders,%20deseo%20cotizar%20precios%20al%20por%20mayor"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-700/50 hover:bg-emerald-900/60 px-3 py-2 rounded-full transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Mayoristas B2B</span>
            </a>

            {/* Login / Profile */}
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-neutral-300 hover:text-white px-2.5 py-2 rounded-lg hover:bg-neutral-800/60 transition-colors"
            >
              <User className="w-4 h-4 text-orange-400" />
              <span className="hidden sm:inline">Ingresar</span>
            </button>

            {/* Cart Button */}
            <button 
              className="relative p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-xl text-neutral-200 hover:text-white transition-all shadow-md group"
              aria-label="Carrito de compras"
            >
              <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-orange-500 text-neutral-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos, tallas, marcas..."
              className="w-full bg-neutral-900 border border-neutral-700 text-xs rounded-full pl-9 pr-20 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <button className="absolute right-1 top-1 bg-orange-500 text-neutral-950 font-bold text-[11px] px-3 py-1.5 rounded-full">
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* 3. CATEGORIES BAR (Desktop) */}
      <nav className="hidden md:block bg-neutral-900/80 border-t border-neutral-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-6 py-2 text-xs font-semibold tracking-wide">
            {categories.map((cat) => (
              <li key={cat.name}>
                <Link
                  href={cat.href}
                  className="text-neutral-300 hover:text-orange-400 transition-colors py-1 inline-block"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-neutral-900 border-t border-neutral-800 px-4 py-4 space-y-3">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Categorías</p>
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                className="bg-neutral-800/70 p-2.5 rounded-lg text-neutral-200 hover:bg-neutral-800 hover:text-orange-400"
              >
                {cat.name}
              </Link>
            ))}
          </div>
          <div className="pt-2 border-t border-neutral-800">
            <a
              href="https://wa.me/573000000000?text=Hola%20Gordo%20Ryders,%20deseo%20cotizar%20precios%20al%20por%20mayor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full text-center bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold py-2.5 rounded-xl text-sm"
            >
              <PhoneCall className="w-4 h-4" />
              Cotizar al por mayor (WhatsApp)
            </a>
          </div>
        </div>
      )}

      {/* AUTH MODAL PREVIEW (Google / Facebook / Email) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-white relative shadow-2xl animate-in fade-in zoom-in-95">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-orange-600/20 text-orange-500 mx-auto flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Ingresar a Gordo Ryders</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Guarda tus direcciones de envío, consulta pedidos y accede a descuentos.
              </p>
            </div>

            <div className="space-y-3">
              {/* Google Button */}
              <button 
                onClick={() => alert("El login con Google se activará al conectar el Client ID en el panel de Supabase.")}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-neutral-100 text-neutral-900 font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continuar con Google
              </button>

              {/* Facebook Button */}
              <button 
                onClick={() => alert("El login con Facebook se activará en Supabase Auth.")}
                className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166fe5] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-md"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continuar con Facebook
              </button>
            </div>

            <p className="text-[11px] text-center text-neutral-500 mt-5">
              Al continuar, aceptas las políticas de compra y privacidad de Gordo Ryders.
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
