"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Eye, ShieldCheck, ShoppingCart } from "lucide-react";
import { LOOKBOOK_ALBUMS, getProductBySlug } from "@/data/products";
import { LookbookAlbum } from "@/types";

interface LookbookCollageProps {
  albums?: LookbookAlbum[];
}

export default function LookbookCollage({ albums = LOOKBOOK_ALBUMS }: LookbookCollageProps) {
  const [activeAlbumIndex, setActiveAlbumIndex] = useState(0);
  const currentAlbum = albums[activeAlbumIndex] || albums[0];

  const featuredProducts = currentAlbum.productSlugs
    .map((slug) => getProductBySlug(slug))
    .filter(Boolean);

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <section className="py-12 bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Mini-Álbumes & Lookbook 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              Equípate por Líneas de Ruta
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Explora las combinaciones recomendadas por pilotos profesionales para ciudad, carretera o lluvia.
            </p>
          </div>

          {/* Collection Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            {albums.map((album, idx) => (
              <button
                key={album.id}
                onClick={() => setActiveAlbumIndex(idx)}
                className={`px-4 py-2 rounded-full font-bold transition-all duration-75 active:scale-95 cursor-pointer shrink-0 border ${
                  activeAlbumIndex === idx
                    ? "bg-orange-500 text-neutral-950 border-orange-500 shadow-lg shadow-orange-500/25 font-black"
                    : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700"
                }`}
              >
                {album.title}
              </button>
            ))}
          </div>
        </div>

        {/* Collage Display Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Main Hero Shot (7 cols) */}
          <div className="lg:col-span-7 relative rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl min-h-[340px] sm:min-h-[420px] group flex flex-col justify-end p-6 sm:p-8">
            <img
              src={currentAlbum.coverImage}
              alt={currentAlbum.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />

            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/15 border border-orange-500/30 px-3 py-1 rounded-full shadow">
                  {currentAlbum.tag}
                </span>
                <span className="text-xs text-neutral-300 font-semibold">• {currentAlbum.subtitle}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                {currentAlbum.title}
              </h3>
              <p className="text-xs text-neutral-300 max-w-lg leading-relaxed">
                {currentAlbum.description}
              </p>
            </div>
          </div>

          {/* Right Product Grid in this Album (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-3">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
              Productos incluidos en este álbum:
            </span>

            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {featuredProducts.map((p) => {
                if (!p) return null;
                return (
                  <Link
                    key={p.id}
                    href={`/producto/${p.slug}`}
                    prefetch={true}
                    className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-orange-500/60 transition-all duration-75 active:scale-[0.98] group flex items-center justify-between gap-4 shadow-lg hover:shadow-orange-500/10 cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-14 h-14 rounded-xl object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                      />
                      <div className="min-w-0">
                        {p.badge && (
                          <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider block">
                            {p.badge}
                          </span>
                        )}
                        <h4 className="text-xs font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                          {p.name}
                        </h4>
                        <span className="text-xs font-black text-white font-mono mt-0.5 block">
                          {formatCOP(p.price_retail)}
                        </span>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-xl bg-neutral-800 group-hover:bg-orange-500 text-neutral-400 group-hover:text-neutral-950 flex items-center justify-center shrink-0 transition-colors shadow">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Quick action wholesale / catalog link */}
            <div className="pt-2">
              <Link
                href="/categoria/all"
                prefetch={true}
                className="w-full text-center text-xs font-bold text-neutral-400 hover:text-orange-400 transition-colors block py-1"
              >
                Ver todos los productos de este lookbook →
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
