"use client";

import { useState } from "react";
import HeroSlider from "@/components/HeroSlider";
import CategoryBubbles from "@/components/CategoryBubbles";
import PromoTiles from "@/components/PromoTiles";
import ProductCarousel from "@/components/ProductCarousel";
import ProductCard from "@/components/ProductCard";
import BrandStrip from "@/components/BrandStrip";
import WholesaleBanner from "@/components/WholesaleBanner";
import { PRODUCTS } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import { Flame } from "lucide-react";

export default function Home() {
  const { addToCart } = useStore();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const filteredProducts =
    selectedFilter === "all"
      ? PRODUCTS
      : PRODUCTS.filter((p) =>
          p.category_name?.toLowerCase().includes(selectedFilter) ||
          p.category_id?.toLowerCase().includes(selectedFilter)
        );

  return (
    <div>
      {/* 1. Hero Slider Principal (Carrusel automático estilo Retail) */}
      <HeroSlider />

      {/* 2. Categorías con Fotografía Real */}
      <CategoryBubbles />

      {/* 3. Carrusel Horizontal de Ofertas Relámpago con Cuenta Regresiva */}
      <ProductCarousel
        title="Ofertas Relámpago de la Semana"
        badge="OFERTA DEL DÍA"
        products={PRODUCTS}
        onAddToCart={(p) => addToCart(p, "M", "Negro", 1)}
        showCountdown={true}
      />

      {/* 4. Banners Triples Promocionales */}
      <PromoTiles />

      {/* 5. Catálogo Principal con Filtros Rápidos */}
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

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {[
              { label: "Todos los productos", value: "all" },
              { label: "Guantes Proviker", value: "guante" },
              { label: "Cascos", value: "casco" },
              { label: "Impermeables", value: "impermeable" },
              { label: "Protecciones", value: "protecci" },
              { label: "Chaquetas", value: "chaqueta" },
              { label: "Accesorios CNC", value: "accesorios" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setSelectedFilter(f.value)}
                className={`px-3.5 py-1.5 rounded-full font-bold transition-all shrink-0 ${
                  selectedFilter === f.value
                    ? "bg-orange-500 text-neutral-950 shadow-md"
                    : "bg-neutral-900 text-neutral-300 border border-neutral-800 hover:border-neutral-700"
                }`}
              >
                {f.label}
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

        {/* Upselling Combo Banner */}
        <div className="mt-12 bg-gradient-to-r from-neutral-900 via-neutral-900 to-orange-950/40 border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
              Combo Rutero Especial
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase leading-tight">
              Lleva Guantes Proviker + Impermeable y ahorra $35.000 COP
            </h3>
            <p className="text-xs text-neutral-400 max-w-xl">
              Equípate completo para rodar en carretera y ciudad. Incluye bolso transportador hermético y garantía oficial.
            </p>
          </div>
          <a
            href="https://wa.me/573000000000?text=Hola%20Gordo%20Ryders,%20deseo%20aprovechar%20el%20Combo%20Rutero%20(Guantes%20+%20Impermeable)"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shrink-0 transition-colors shadow-lg shadow-orange-500/20"
          >
            Comprar Combo en Promoción
          </a>
        </div>

      </section>

      {/* 6. Tira de Marcas Oficiales */}
      <BrandStrip />

      {/* 7. Canal Mayorista B2B */}
      <WholesaleBanner />
    </div>
  );
}
