"use client";

import { useState } from "react";
import Header from "@/components/Header";
import HeroSlider from "@/components/HeroSlider";
import CategoryBubbles from "@/components/CategoryBubbles";
import PromoTiles from "@/components/PromoTiles";
import ProductCarousel from "@/components/ProductCarousel";
import ProductCard from "@/components/ProductCard";
import BrandStrip from "@/components/BrandStrip";
import WholesaleBanner from "@/components/WholesaleBanner";
import Footer from "@/components/Footer";
import { Product } from "@/types";
import { Flame, ArrowRight, ShieldCheck, Zap } from "lucide-react";

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
      badge: "MÁS VENDIDO 1°",
      rating: 4.9,
      reviews_count: 84,
      images: [
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=700&q=80",
      ],
      is_featured: true,
      is_active: true,
      stock: 4,
    },
    {
      id: "2",
      sku: "C-SHAFT-582",
      name: "Casco Integral Shaft Pro 582 Certificado ECE 22.06",
      slug: "casco-integral-shaft-pro-582",
      category_name: "Cascos",
      price_retail: 289900,
      price_original: 345000,
      price_wholesale: 220000,
      badge: "OFERTA RELÁMPAGO",
      rating: 5.0,
      reviews_count: 62,
      images: [
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=700&q=80",
      ],
      is_featured: true,
      is_active: true,
      stock: 7,
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
      reviews_count: 39,
      images: [
        "https://images.unsplash.com/photo-1517846695664-44df0e167232?auto=format&fit=crop&w=700&q=80",
      ],
      is_featured: true,
      is_active: true,
      stock: 12,
    },
    {
      id: "4",
      sku: "CH-BOMBER-AIR",
      name: "Chaqueta Térmica con Protecciones Removibles CE Nivel 2",
      slug: "chaqueta-termica-protecciones-ce",
      category_name: "Chaquetas",
      price_retail: 245000,
      price_original: 295000,
      price_wholesale: 175000,
      badge: "NUEVA COLECCIÓN",
      rating: 5.0,
      reviews_count: 31,
      images: [
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=700&q=80",
      ],
      is_featured: true,
      is_active: true,
      stock: 5,
    },
    {
      id: "5",
      sku: "PRO-KNEE-4",
      name: "Kit de Rodilleras y Coderas Articuladas Acero Reforzado",
      slug: "kit-rodilleras-coderas-acero",
      category_name: "Protecciones",
      price_retail: 78000,
      price_original: 99000,
      price_wholesale: 49000,
      badge: "RECOMENDADO",
      rating: 4.7,
      reviews_count: 27,
      images: [
        "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=700&q=80",
      ],
      is_featured: true,
      is_active: true,
      stock: 3,
    },
    {
      id: "6",
      sku: "ACC-HOLDER-M8",
      name: "Soporte Antivibración Portacelular para Moto en Aluminio CNC",
      slug: "soporte-portacelular-antivibracion",
      category_name: "Accesorios",
      price_retail: 65000,
      price_original: 85000,
      price_wholesale: 39000,
      badge: "TENDENCIA",
      rating: 4.9,
      reviews_count: 53,
      images: [
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=700&q=80",
      ],
      is_featured: true,
      is_active: true,
      stock: 14,
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
      
      {/* 1. Header con Buscador Predictivo y Carrito */}
      <Header cartCount={cartCount} />

      <main className="flex-1">
        {/* 2. Hero Slider Principal (Carrusel automático estilo Mercado Libre / Retail) */}
        <HeroSlider />

        {/* 3. Categorías con Fotografía Real */}
        <CategoryBubbles />

        {/* 4. Carrusel Horizontal de Ofertas Relámpago con Cuenta Regresiva */}
        <ProductCarousel
          title="Ofertas Relámpago de la Semana"
          badge="OFERTA DEL DÍA"
          products={sampleProducts}
          onAddToCart={handleAddToCart}
          showCountdown={true}
        />

        {/* 5. Banners Triples Promocionales */}
        <PromoTiles />

        {/* 6. Catálogo Principal con Filtros Rápidos */}
        <section id="catalogo" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4 text-orange-500" />
                <span>Catálogo Completo</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                Equipamiento y Protección
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Selecciona tu categoría y cotiza tu talla directamente o compra con pasarela segura.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              {[
                { label: "Todos los productos", value: "all" },
                { label: "Guantes", value: "guante" },
                { label: "Cascos", value: "casco" },
                { label: "Impermeables", value: "impermeable" },
                { label: "Protecciones", value: "protecci" },
                { label: "Chaquetas", value: "chaqueta" },
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
                onAddToCart={handleAddToCart}
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

        {/* 7. Tira de Marcas Oficiales */}
        <BrandStrip />

        {/* 8. Canal Mayorista B2B */}
        <WholesaleBanner />
      </main>

      {/* 9. Footer Oficial */}
      <Footer />

    </div>
  );
}
