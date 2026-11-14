"use client";

import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { Sparkles, ArrowRight, Package } from "lucide-react";
import { LOOKBOOK_ALBUMS } from "@/data/products";
import { LookbookAlbum, Product } from "@/types";

interface LookbookCollageProps {
  albums?: LookbookAlbum[];
}

export default function LookbookCollage({ albums: propAlbums }: LookbookCollageProps) {
  const { albums: storeAlbums, products } = useStore();
  const albums = propAlbums || storeAlbums || LOOKBOOK_ALBUMS;

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
            p.slug.toLowerCase() === identifier.toLowerCase() ||
            p.id.toLowerCase() === identifier.toLowerCase() ||
            p.name.toLowerCase().includes(identifier.toLowerCase())
        )
      )
      .filter(Boolean) as Product[];
  };

  const getAlbumCatalogUrl = (album: LookbookAlbum): string => {
    if (album.id === "album-1" || album.title.toLowerCase().includes("modular")) {
      return "/categoria/cascos?sub=cascos-abatibles";
    }
    if (album.id === "album-2" || album.title.toLowerCase().includes("urbana")) {
      return "/categoria/cascos?sub=cascos-urbanos";
    }
    if (album.id === "album-3" || album.title.toLowerCase().includes("stealth")) {
      return "/categoria/cascos?sub=cascos-top-speed";
    }
    return "/categoria/cascos";
  };

  return (
    <section className="py-12 bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Colecciones & Collages 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              Equípate por Líneas de Ruta
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Explora las líneas de cascos por estilo. Haz clic en cualquier modelo para ver su ficha o entra al catálogo completo de la línea.
            </p>
          </div>

          <Link
            href="/categoria/cascos"
            prefetch={true}
            className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-1.5 shrink-0"
          >
            <span>Ver todo el catálogo de cascos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Amazon-Style Multi-Container Collage Grid (Navigates to Full Catalog & Product Detail) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => {
            const albumProds = getAlbumProducts(album);
            const displayProds = albumProds.slice(0, 4);
            const catalogUrl = getAlbumCatalogUrl(album);

            return (
              <div
                key={album.id}
                className="bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 shadow-xl group hover:shadow-orange-500/10"
              >
                {/* Card Header (Links to Catalog) */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/15 border border-orange-500/30 px-2.5 py-0.5 rounded-full shadow-sm">
                      {album.tag}
                    </span>
                    <Link
                      href={catalogUrl}
                      prefetch={true}
                      className="text-neutral-500 group-hover:text-orange-400 transition-colors p-1"
                      aria-label="Ver catálogo de esta línea"
                    >
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  <Link href={catalogUrl} prefetch={true} className="block group-hover:opacity-90">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight group-hover:text-orange-400 transition-colors line-clamp-1">
                      {album.title}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                      {album.subtitle}
                    </p>
                  </Link>
                </div>

                {/* 2x2 Amazon-Style Mosaic Grid (Each product navigates to /producto/[slug]) */}
                <div className="grid grid-cols-2 gap-2.5 my-4">
                  {displayProds.length > 0 ? (
                    displayProds.map((prod, pIdx) => (
                      <Link
                        key={prod.id || pIdx}
                        href={`/producto/${prod.slug}`}
                        prefetch={true}
                        className="group/item flex flex-col space-y-1.5"
                      >
                        <div className="aspect-square rounded-2xl bg-neutral-950 overflow-hidden border border-neutral-800/80 relative">
                          <img
                            src={prod.images?.[0] || album.coverImage}
                            alt={prod.name}
                            className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                          <span className="absolute bottom-1 right-1 text-[9px] font-mono font-bold text-white bg-neutral-950/90 px-1.5 py-0.5 rounded backdrop-blur-sm border border-neutral-800">
                            {formatCOP(prod.price_retail)}
                          </span>
                        </div>
                        <span className="text-[11px] font-medium text-neutral-300 truncate block group-hover/item:text-orange-400 transition-colors">
                          {prod.name}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <Link href={catalogUrl} prefetch={true} className="col-span-2 aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-800 block">
                      <img src={album.coverImage} alt={album.title} className="w-full h-full object-cover" />
                    </Link>
                  )}
                </div>

                {/* Card Footer (Goes to the full catalog page) */}
                <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400 font-medium">
                    {albumProds.length} modelos en esta línea
                  </span>
                  <Link
                    href={catalogUrl}
                    prefetch={true}
                    className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Ver en catálogo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
