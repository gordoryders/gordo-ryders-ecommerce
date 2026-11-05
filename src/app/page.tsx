"use client";

import { useState } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategoryBubbles from "@/components/CategoryBubbles";
import ProductCard from "@/components/ProductCard";
import WholesaleBanner from "@/components/WholesaleBanner";
import TrustBadges from "@/components/TrustBadges";
import Footer from "@/components/Footer";
import { Product } from "@/types";
import { Sparkles, Flame, Tag, Filter } from "lucide-react";

export default function Home() {
  const [cartCount, setCartCount] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const sampleProducts: Product[] = [
    {
      id: "1",
      sku: "E44",
      name: "Guante Proviker Protección Urbana Ref E44",
      slug: "guante-proviker-e44",
      category_name: "Guantes",
      price_retail: 85000,
      price_original: 110000,
      price_wholesale: 55000,
      badge: "MÁS VENDIDO",
      rating: 4.9,
      reviews_count: 38,
      images: [],
      is_featured: true,
      is_active: true,
      stock: 4,
    },
    {
      id: "2",
      sku: "C-SHAFT-582",
      name: "Casco Integral Shaft Pro 582 Certificado DOT / ECE",
      slug: "casco-integral-shaft-pro-582",
      category_name: "Cascos",
      price_retail: 289900,
      price_original: 340000,
      price_wholesale: 220000,
      badge: "OFERTA RELÁMPAGO",
      rating: 5.0,
      reviews_count: 54,
      images: [],
      is_featured: true,
      is_active: true,
      stock: 8,
    },
    {
      id: "3",
      sku: "IMP-PRO-HD",
      name: "Impermeable Enterizo Siliconado Alta Resistencia con Tula",
      slug: "impermeable-enterizo-siliconado",
      category_name: "Impermeables",
      price_retail: 119000,
      price_original: 145000,
      price_wholesale: 82000,
      badge: "LLUVIA READY",
      rating: 4.8,
      reviews_count: 29,
      images: [],
      is_featured: true,
      is_active: true,
      stock: 12,
    },
    {
      id: "4",
      sku: "PRO-KNEE-4",
      name: "Kit de Rodilleras y Coderas Articuladas Acero Reforzado",
      slug: "kit-rodilleras-coderas-acero",
      category_name: "Protecciones",
      price_retail: 78000,
      price_original: 99000,
      price_wholesale: 49000,
      badge: "RECOMENDADO",
      rating: 4.7,
      reviews_count: 19,
      images: [],
      is_featured: true,
      is_active: true,
      stock: 3,
    },
    {
      id: "5",
      sku: "ACC-HOLDER-M8",
      name: "Soporte Antivibración Portacelular para Moto en Aluminio CNC",
      slug: "soporte-portacelular-antivibracion",
      category_name: "Accesorios",
      price_retail: 65000,
      price_original: 85000,
      price_wholesale: 39000,
      badge: "TENDENCIA",
      rating: 4.9,
      reviews_count: 42,
      images: [],
      is_featured: true,
      is_active: true,
      stock: 15,
    },
    {
      id: "6",
      sku: "CH-BOMBER-AIR",
      name: "Chaqueta Térmica con Protecciones Removibles CE Nivel 2",
      slug: "chaqueta-termica-protecciones-ce",
      category_name: "Chaquetas",
      price_retail: 245000,
      price_original: 295000,
      price_wholesale: 175000,
      badge: "PREMIUM",
      rating: 5.0,
      reviews_count: 23,
      images: [],
      is_featured: true,
      is_active: true,
      stock: 5,
    },
  ];

  const handleAddToCart = (product: Product) => {
    setCartCount((prev) => prev + 1);
  };

  const filteredProducts = selectedFilter === "all"
    ? sampleProducts
    : sampleProducts.filter((p) => p.category_name?.toLowerCase().includes(selectedFilter));

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans selection:bg-orange-500 selection:text-neutral-950">
      
      {/* 1. Header with dynamic cart */}
      <Header cartCount={cartCount} />

      <main className="flex-1">
        {/* 2. Hero Banner with CTA & High Impact */}
        <HeroBanner />

        {/* 3. Category Bubbles (Mercado Libre visual style) */}
        <CategoryBubbles />

        {/* 4. Trust Badges (Eliminating purchase friction) */}
        <TrustBadges />

        {/* 5. Product Catalog & Promotions Grid */}
        <section id="catalogo" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Ofertas de la Semana</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                Equipamiento Más Buscado
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Aprovecha precios de lanzamiento y promociones exclusivas para compras online.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {[
                { label: "Todos", value: "all" },
                { label: "Guantes", value: "guante" },
                { label: "Cascos", value: "casco" },
                { label: "Impermeables", value: "impermeable" },
                { label: "Protecciones", value: "protecci" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setSelectedFilter(f.value)}
                  className={`px-3 py-1.5 rounded-full font-bold transition-all shrink-0 ${
                    selectedFilter === f.value
                      ? "bg-orange-500 text-neutral-950"
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
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>

          {/* Secondary Upsell / Combo Banner */}
          <div className="mt-12 bg-gradient-to-r from-orange-950/40 via-neutral-900 to-amber-950/30 border border-orange-500/30 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[11px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
                Combo Rutero Recomendado
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white uppercase">
                Lleva Guantes Proviker + Impermeable y ahorra $35.000 COP
              </h3>
              <p className="text-xs text-neutral-400 max-w-xl">
                Combina cualquier referencia de guante Proviker con el impermeable enterizo reforzado para viajar protegido de la lluvia y la fricción.
              </p>
            </div>
            <a
              href="https://wa.me/573000000000?text=Hola%20Gordo%20Ryders,%20deseo%20aprovechar%20el%20Combo%20Rutero%20(Guantes%20+%20Impermeable)"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider shrink-0 transition-colors shadow-lg shadow-orange-500/10"
            >
              Comprar Combo en Promoción
            </a>
          </div>

        </section>

        {/* 6. Wholesale Channel Banner */}
        <WholesaleBanner />
      </main>

      {/* 7. Full Footer */}
      <Footer />

    </div>
  );
}
