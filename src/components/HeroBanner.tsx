import Link from "next/link";
import { ArrowRight, ShieldCheck, Flame, Zap } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white py-12 sm:py-16 lg:py-20 border-b border-neutral-800">
      {/* Background Glow Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text / Pitch */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-700/80 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 text-orange-500 animate-bounce" />
              <span>Temporada 2026 • Nuevas Referencias Proviker</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none uppercase">
              EQUÍPATE PARA <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500">
                LA RUTA REAL
              </span>
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base max-w-xl font-normal leading-relaxed">
              Cascos certificados, guantes con protección urbana de alto impacto, impermeables reforzados y repuestos para rodar seguro. Venta directa y distribución mayorista en Colombia.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="#catalogo"
                className="bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black px-6 py-3.5 rounded-xl text-sm flex items-center gap-2 shadow-xl shadow-orange-500/20 hover:gap-3 transition-all transform hover:-translate-y-0.5"
              >
                <span>VER CATÁLOGO COMPLETO</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/573000000000?text=Hola%20Gordo%20Ryders,%20quiero%20cotizar%20por%20WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-bold px-5 py-3.5 rounded-xl text-sm transition-all"
              >
                Pedir por WhatsApp
              </a>
            </div>

            {/* Quick Micro-Trust badges */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-800/80 max-w-lg text-xs text-neutral-400 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
                <span>Normas DOT / ECE</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Despachos el mismo día</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-orange-400 text-sm">+300</span>
                <span>Referencias</span>
              </div>
            </div>
          </div>

          {/* Right Showcase Card (Featured Deal like ML/Amazon) */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800 rounded-3xl p-6 shadow-2xl relative group">
              <div className="absolute top-4 right-4 bg-red-600 text-white text-[11px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
                23% OFF
              </div>
              <div className="text-[11px] font-bold text-orange-400 uppercase tracking-widest mb-1">
                ⭐ Producto Estrella del Mes
              </div>
              <h3 className="text-xl font-black text-white uppercase">
                Guante Proviker Protección Urbana Ref E44
              </h3>
              <p className="text-xs text-neutral-400 mb-4">
                Protección rígida en nudillos, palma antideslizante, tejido transpirable y touch screen.
              </p>

              {/* Graphic Mock Placeholder */}
              <div className="h-48 w-full bg-neutral-800/60 rounded-2xl border border-neutral-700/50 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden group-hover:border-orange-500/50 transition-colors">
                <span className="text-4xl">🧤</span>
                <span className="text-xs font-semibold text-neutral-300 mt-2">
                  Tallas disponibles: M, L, XL
                </span>
                <span className="text-[10px] text-neutral-500">
                  Colores: Negro Mate, Rojo Furia, Morado Racing
                </span>
              </div>

              {/* Price comparison */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-black text-white">$85.000 COP</span>
                <span className="text-xs text-neutral-500 line-through">$110.000 COP</span>
                <span className="text-xs font-bold text-emerald-400 ml-auto">Ahorras $25.000</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors">
                  Añadir al Carrito
                </button>
                <a
                  href="https://wa.me/573000000000?text=Hola,%20me%20interesa%20el%20Guante%20Proviker%20E44"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
