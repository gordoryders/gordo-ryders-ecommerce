"use client";

import { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Sparkles, ArrowRight, Eye, ShoppingCart, Package, X } from "lucide-react";
import { LOOKBOOK_ALBUMS } from "@/data/products";
import { LookbookAlbum, Product } from "@/types";

interface LookbookCollageProps {
  albums?: LookbookAlbum[];
}

export default function LookbookCollage({ albums: propAlbums }: LookbookCollageProps) {
  const { albums: storeAlbums, products } = useStore();
  const albums = propAlbums || storeAlbums || LOOKBOOK_ALBUMS;

  const [selectedAlbum, setSelectedAlbum] = useState<LookbookAlbum | null>(null);
  const [isBoxModalOpen, setIsBoxModalOpen] = useState(false);

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getAlbumProducts = (album: LookbookAlbum): Product[] => {
    return (album.productSlugs || [])
      .map((identifier) =>
        products.find(
          (p) =>
            p.slug === identifier ||
            p.id === identifier ||
            p.name.toLowerCase().includes(identifier.toLowerCase())
        )
      )
      .filter(Boolean) as Product[];
  };

  const openAlbumModal = (album: LookbookAlbum) => {
    setSelectedAlbum(album);
    setIsBoxModalOpen(true);
  };

  const activeModalAlbum = selectedAlbum || albums[0];
  const modalProducts = activeModalAlbum ? getAlbumProducts(activeModalAlbum) : [];
  const modalTotal = modalProducts.reduce((acc, p) => acc + (p?.price_retail || 0), 0);

  const whatsappKitMessage = activeModalAlbum
    ? encodeURIComponent(
        `Hola Gordo Ryders, me interesa la CAJA / COLECCIÓN "${activeModalAlbum.title}" (${activeModalAlbum.tag}). Deseo cotizar estos productos.`
      )
    : "";

  return (
    <section className="py-12 bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Colecciones & Lookbooks 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              Equípate por Líneas de Ruta
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Colecciones temáticas en mosaicos fotográficos. Haz clic en cualquier caja para desplegar la lista completa de equipamiento.
            </p>
          </div>
        </div>

        {/* Amazon-Style Multi-Container Collage Grid (No Side List!) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => {
            const albumProds = getAlbumProducts(album);
            const displayProds = albumProds.slice(0, 4);

            return (
              <div
                key={album.id}
                className="bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl group hover:shadow-orange-500/10"
              >
                {/* Card Header */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/15 border border-orange-500/30 px-2.5 py-0.5 rounded-full shadow-sm">
                      {album.tag}
                    </span>
                    <button
                      onClick={() => openAlbumModal(album)}
                      className="text-neutral-500 group-hover:text-orange-400 transition-colors p-1"
                      aria-label="Abrir colección"
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <h3
                    onClick={() => openAlbumModal(album)}
                    className="text-lg font-black text-white uppercase tracking-tight group-hover:text-orange-400 transition-colors cursor-pointer line-clamp-1"
                  >
                    {album.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                    {album.subtitle}
                  </p>
                </div>

                {/* 2x2 Amazon-Style Mosaic Grid */}
                <div
                  onClick={() => openAlbumModal(album)}
                  className="grid grid-cols-2 gap-2.5 my-4 cursor-pointer"
                >
                  {displayProds.length > 0 ? (
                    displayProds.map((prod, pIdx) => (
                      <div
                        key={prod.id || pIdx}
                        className="group/item flex flex-col space-y-1.5"
                      >
                        <div className="aspect-square rounded-2xl bg-neutral-950 overflow-hidden border border-neutral-800/80 relative">
                          <img
                            src={prod.images?.[0] || album.coverImage}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute bottom-1 right-1 text-[9px] font-mono font-bold text-white bg-neutral-950/85 px-1.5 py-0.5 rounded backdrop-blur-sm border border-neutral-800">
                            {formatCOP(prod.price_retail)}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-neutral-300 truncate block group-hover/item:text-orange-400 transition-colors">
                          {prod.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-800">
                      <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400 font-medium">
                    {albumProds.length} productos en esta línea
                  </span>
                  <button
                    onClick={() => openAlbumModal(album)}
                    className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Ver colección completa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* =========================================================================
          MODAL: CAJA / KIT DE PRODUCTOS ABIERTO (LISTA EXTENSA TIPO AMAZON)
          ========================================================================= */}
      {isBoxModalOpen && activeModalAlbum && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto animate-in fade-in zoom-in-95">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-orange-500 text-neutral-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
                    {activeModalAlbum.tag}
                  </span>
                  <span className="text-xs text-neutral-400 font-semibold">• {activeModalAlbum.subtitle}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                  Colección: {activeModalAlbum.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  {activeModalAlbum.description}
                </p>
              </div>
              <button
                onClick={() => setIsBoxModalOpen(false)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Products inside this box */}
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-neutral-700">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Productos disponibles en esta colección ({modalProducts.length}):
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {modalProducts.map((prod) => {
                  if (!prod) return null;
                  return (
                    <div
                      key={prod.id}
                      className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 group hover:border-neutral-700 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={prod.images?.[0] || activeModalAlbum.coverImage}
                          alt={prod.name}
                          className="w-20 h-20 rounded-xl object-cover bg-neutral-900 border border-neutral-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider block">
                            {prod.category_name}
                          </span>
                          <h5 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                            {prod.name}
                          </h5>
                          <span className="text-sm font-black text-white font-mono mt-1 block">
                            {formatCOP(prod.price_retail)}
                          </span>
                          {prod.price_wholesale && (
                            <span className="text-[10px] text-amber-400 font-mono block">
                              Mayorista: {formatCOP(prod.price_wholesale)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-neutral-900 flex items-center justify-between gap-2">
                        <Link
                          href={`/producto/${prod.slug}`}
                          onClick={() => setIsBoxModalOpen(false)}
                          className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs py-2 rounded-xl text-center transition-all border border-neutral-700 flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-orange-400" />
                          <span>Ver Ficha Técnica</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer Summary & Kit Purchase */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                  Valor estimado individual del set
                </span>
                <strong className="text-lg font-black text-white font-mono">
                  {formatCOP(modalTotal)}
                </strong>
              </div>

              <a
                href={`https://wa.me/573000000000?text=${whatsappKitMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Cotizar Kit por WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}