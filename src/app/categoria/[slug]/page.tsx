"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Flame, ShieldCheck, Filter, ArrowUpDown } from "lucide-react";
import { PRODUCTS, MEGA_CATEGORIES } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/context/StoreContext";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const { addToCart, products } = useStore();

  const categorySlug = resolvedParams.slug.toLowerCase();
  const querySearch = searchParams.get("q") || "";
  const initialSub = searchParams.get("sub") || "all";
  
  const [activeSub, setActiveSub] = useState<string>(initialSub);
  const [sortOrder, setSortOrder] = useState<"featured" | "price-asc" | "price-desc">("featured");

  // Find category metadata
  const currentCategory = MEGA_CATEGORIES.find((c) => c.slug === categorySlug);
  const title = currentCategory
    ? currentCategory.name
    : categorySlug === "ofertas"
    ? "Ofertas Relámpago y Promociones"
    : categorySlug === "all"
    ? querySearch ? `Resultados para "${querySearch}"` : "Catálogo Completo"
    : categorySlug.toUpperCase();

  // Instant in-memory filter
  const filteredProducts = useMemo(() => {
    let list = products && products.length > 0 ? [...products] : [...PRODUCTS];

    if (categorySlug === "ofertas") {
      list = list.filter((p) => p.badge?.includes("OFERTA") || (p.price_original && p.price_original > p.price_retail));
    } else if (categorySlug !== "all") {
      list = list.filter(
        (p) =>
          p.category_id?.toLowerCase() === categorySlug ||
          p.category_name?.toLowerCase().includes(categorySlug) ||
          p.slug.toLowerCase().includes(categorySlug)
      );
    }

    // Filter by active subcategory pill
    if (activeSub !== "all") {
      const subNorm = activeSub.replace("mayorista-", "").replace("guantes-", "").replace("cascos-", "");
      list = list.filter(
        (p) =>
          p.slug.toLowerCase().includes(subNorm) ||
          p.name.toLowerCase().includes(subNorm) ||
          p.category_name?.toLowerCase().includes(subNorm) ||
          p.sku.toLowerCase().includes(subNorm)
      );
    }

    if (querySearch.trim()) {
      const q = querySearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category_name?.toLowerCase().includes(q)
      );
    }

    if (sortOrder === "price-asc") {
      list.sort((a, b) => a.price_retail - b.price_retail);
    } else if (sortOrder === "price-desc") {
      list.sort((a, b) => b.price_retail - a.price_retail);
    }

    return list;
  }, [categorySlug, querySearch, activeSub, sortOrder]);

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
        <Link href="/" prefetch={true} className="hover:text-orange-400 transition-colors">Inicio</Link>
        <span>/</span>
        <span className="text-white font-bold">{title}</span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-neutral-800 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
            <Flame className="w-4 h-4 text-orange-500" />
            <span>Gordo Ryders Store</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
            {title}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Mostrando {filteredProducts.length} productos con disponibilidad para despacho inmediato en Colombia.
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-neutral-400 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Ordenar:</span>
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="bg-neutral-900 border border-neutral-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="featured">Más Destacados</option>
            <option value="price-asc">Menor a Mayor Precio</option>
            <option value="price-desc">Mayor a Menor Precio</option>
          </select>
        </div>
      </div>

      {/* Instant Interactive Subcategory Pills (Zero Latency, Super Smooth) */}
      {currentCategory && currentCategory.subcategories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none text-xs">
          <button
            type="button"
            onClick={() => setActiveSub("all")}
            className={`px-4 py-2 rounded-full font-black text-xs transition-all duration-75 active:scale-95 cursor-pointer shrink-0 ${
              activeSub === "all"
                ? "bg-orange-500 text-neutral-950 shadow-lg shadow-orange-500/25 ring-2 ring-orange-400/40"
                : "bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700"
            }`}
          >
            Todos ({currentCategory.name})
          </button>
          {currentCategory.subcategories.map((sub) => {
            const isActive = activeSub === sub.slug;
            return (
              <button
                key={sub.slug}
                type="button"
                onClick={() => setActiveSub(sub.slug)}
                className={`px-4 py-2 rounded-full font-bold text-xs transition-all duration-75 active:scale-95 cursor-pointer shrink-0 border ${
                  isActive
                    ? "bg-orange-500 text-neutral-950 border-orange-500 font-black shadow-lg shadow-orange-500/25 ring-2 ring-orange-400/40"
                    : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700"
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={() => addToCart(p, "M", "Negro", 1)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 rounded-3xl bg-neutral-900 border border-neutral-800 p-8">
          <p className="text-base text-neutral-300">
            No encontramos productos para esta subcategoría específica en bodega.
          </p>
          <button
            type="button"
            onClick={() => setActiveSub("all")}
            className="inline-block bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 font-black text-xs uppercase px-6 py-3 rounded-xl transition-all duration-75 shadow-lg shadow-orange-500/20 cursor-pointer"
          >
            Ver Todos los {currentCategory?.name || "Productos"}
          </button>
        </div>
      )}

    </div>
  );
}
