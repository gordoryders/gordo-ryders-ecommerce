"use client";

import { useState } from "react";
import HeroSlider from "@/components/HeroSlider";
import CategoryBubbles from "@/components/CategoryBubbles";
import PromoTiles from "@/components/PromoTiles";
import ProductCarousel from "@/components/ProductCarousel";
import ProductCard from "@/components/ProductCard";
import LookbookCollage from "@/components/LookbookCollage";
import CombosSection from "@/components/CombosSection";
import BrandStrip from "@/components/BrandStrip";
import WholesaleBanner from "@/components/WholesaleBanner";
import { PRODUCTS } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { Flame, Sparkles } from "lucide-react";

export default function Home() {
  const { addToCart, products, albums, categories } = useStore();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const activeProducts = products.filter((p) => p.is_active);

  const filteredProducts =
    selectedFilter === "all"
      ? activeProducts
      : activeProducts.filter((p) =>
          p.category_name?.toLowerCase().includes(selectedFilter) ||
          p.category_id?.toLowerCase().includes(selectedFilter)
        );

  const newArrivals = activeProducts.filter(
    (p) => p.is_new_arrival || p.badge?.includes("MÁS VENDIDO") || p.badge?.includes("NUEVA") || p.badge?.includes("2026")
  );

  return (
    <div>
      {/* 1. Hero Slider Principal (Carrusel automático estilo Retail) */}
      <HeroSlider />

      {/* 2. Categorías con Fotografía Real */}
      <CategoryBubbles />

      {/* 3. Carrusel de Novedades & Nuevos Lanzamientos 2026 */}
      <ProductCarousel
        title="Novedades & Nuevos Ingresos 2026"
        badge="RECIÉN LLEGADO"
        products={newArrivals.length > 0 ? newArrivals : activeProducts}
        onAddToCart={(p) => addToCart(p, "M", "Negro", 1)}
        showCountdown={false}
      />

      {/* 4. Banners Triples Promocionales */}
      <PromoTiles />

      {/* 5. Carrusel Horizontal de Ofertas Relámpago con Cuenta Regresiva */}
      <ProductCarousel
        title="Ofertas Relámpago de la Semana"
        badge="OFERTA DEL DÍA"
        products={activeProducts}
        onAddToCart={(p) => addToCart(p, "M", "Negro", 1)}
        showCountdown={true}
      />

      {/* 6. Combos & Packs Dinámicos con Descuento */}
      <CombosSection />

      {/* 7. Mini-Álbumes & Lookbook Collages Categorizados (Estilo Amazon) */}
      <LookbookCollage albums={albums} />

      {/* 8. Catálogo Principal con Filtros Rápidos */}
      <section id="catalogo" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Catálogo Oficial</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              Equipamiento y Protección
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Haz clic en cualquier producto para inspeccionar sus 4 ángulos con zoom óptico, ficha técnica y compra directa.
            </p>
          </div>

          {/* Filter Pills Dinámicos */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
                selectedFilter === "all"
                  ? "bg-orange-500 text-neutral-950 shadow-md font-black"
                  : "bg-neutral-900 text-neutral-300 border border-neutral-800 hover:border-neutral-700"
              }`}
            >
              Todos los productos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.name.toLowerCase())}
                className={`px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 cursor-pointer ${
                  selectedFilter.toLowerCase() === cat.name.toLowerCase()
                    ? "bg-orange-500 text-neutral-950 shadow-md font-black"
                    : "bg-neutral-900 text-neutral-300 border border-neutral-800 hover:border-neutral-700"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(p, size) => addToCart(p, size, "Negro", 1)}
            />
          ))}
        </div>

      </section>

      {/* 6. Tira de Marcas Oficiales */}
      <BrandStrip />

      {/* 7. Canal Mayorista B2B */}
      <WholesaleBanner />
    </div>
  );
}
