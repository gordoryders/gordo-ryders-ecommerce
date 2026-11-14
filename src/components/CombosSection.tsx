"use client";

import { useStore } from "@/context/StoreContext";
import { ProductCombo, Product } from "@/types";
import { Package, Plus, Equal, ShoppingCart, MessageCircle, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CombosSection() {
  const { combos, products, addToCart } = useStore();

  const activeCombos = combos.filter((c) => c.isActive);

  if (activeCombos.length === 0) return null;

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getComboProducts = (combo: ProductCombo): Product[] => {
    return combo.productIds
      .map((idOrSlug) =>
        products.find(
          (p) =>
            p.id.toLowerCase() === idOrSlug.toLowerCase() ||
            p.slug.toLowerCase() === idOrSlug.toLowerCase() ||
            p.name.toLowerCase().includes(idOrSlug.toLowerCase())
        )
      )
      .filter(Boolean) as Product[];
  };

  const handleAddComboToCart = (combo: ProductCombo) => {
    const comboProds = getComboProducts(combo);
    if (comboProds.length === 0) return;
    comboProds.forEach((prod) => {
      addToCart(prod, "M", "Negro", 1);
    });
    alert(`¡Combo "${combo.name}" agregado al carrito con precio especial!`);
  };

  return (
    <section className="py-12 bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>Packs & Combos en Promoción</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              Combos de Equipamiento con Descuento
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Lleva los productos juntos a precio especial de bodega. Fotos completas de cada artículo incluido.
            </p>
          </div>
        </div>

        {/* Combos Visual Showcase */}
        <div className="space-y-8">
          {activeCombos.map((combo) => {
            const comboProds = getComboProducts(combo);
            const calculatedOriginal = comboProds.reduce((acc, p) => acc + (p?.price_retail || 0), 0);
            const originalPrice = combo.originalPrice || calculatedOriginal;
            const savings = combo.savingsAmount || Math.max(0, originalPrice - combo.price);

            const whatsappMessage = encodeURIComponent(
              `Hola Gordo Ryders, me interesa comprar el "${combo.name}" en promoción por valor de ${formatCOP(combo.price)} (Ahorro de ${formatCOP(savings)}). ¿Tienen disponibilidad en bodega?`
            );

            return (
              <div
                key={combo.id}
                className="bg-neutral-900 border border-neutral-800 hover:border-orange-500/40 rounded-3xl p-5 sm:p-7 transition-all duration-300 shadow-2xl flex flex-col xl:flex-row items-stretch justify-between gap-6 relative overflow-hidden group"
              >
                {/* Background ambient lighting */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Left / Main Section: Titles + Complete Product Photo Cards */}
                <div className="flex-1 space-y-6">
                  
                  {/* Combo Header Info */}
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/15 border border-orange-500/30 px-3 py-1 rounded-full shadow-sm">
                        {combo.tag || "COMBO PROMOCIONAL"}
                      </span>
                      {savings > 0 && (
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                          Ahorras {formatCOP(savings)}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                      {combo.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
                      {combo.description}
                    </p>
                  </div>

                  {/* Complete Products Gallery Showcase (Visual Bundle Row) */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-none">
                    {comboProds.map((prod, idx) => (
                      <div key={prod.id || idx} className="flex items-center gap-3 w-full sm:w-auto">
                        
                        {/* Complete Product Card with Large Image */}
                        <Link
                          href={`/producto/${prod.slug}`}
                          prefetch={true}
                          className="w-full sm:w-48 bg-neutral-950 border border-neutral-800 hover:border-orange-500/50 rounded-2xl p-3 flex flex-col transition-all group/card shadow-lg hover:shadow-orange-500/10"
                        >
                          {/* Complete Photo Container */}
                          <div className="aspect-square w-full rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800/80 mb-2 relative">
                            <img
                              src={prod.images?.[0] || "/products/cascos/ich-3110-top-speed.jpg"}
                              alt={prod.name}
                              className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            {/* Category Pill Overlay */}
                            <span className="absolute top-2 left-2 text-[9px] font-black uppercase tracking-wider bg-neutral-950/85 backdrop-blur-sm text-orange-400 px-2 py-0.5 rounded border border-neutral-800">
                              {prod.category_name || "Producto"}
                            </span>
                            {/* Price Pill Overlay */}
                            <span className="absolute bottom-2 right-2 text-[10px] font-mono font-bold text-white bg-neutral-950/90 backdrop-blur-sm px-2 py-0.5 rounded border border-neutral-800">
                              {formatCOP(prod.price_retail)}
                            </span>
                          </div>

                          {/* Product Name */}
                          <h4 className="text-xs font-bold text-neutral-200 line-clamp-2 group-hover/card:text-orange-400 transition-colors leading-snug">
                            {prod.name}
                          </h4>
                          <span className="text-[10px] font-mono text-neutral-400 mt-1 block">
                            Ref: {prod.sku}
                          </span>
                        </Link>

                        {/* Visual '+' Badge Between Items */}
                        {idx < comboProds.length - 1 && (
                          <div className="hidden sm:flex w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 items-center justify-center font-black text-sm shrink-0 shadow-md">
                            <Plus className="w-4 h-4 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Trust Footer Note */}
                  <div className="flex items-center gap-2 text-[11px] text-neutral-400 pt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Los productos se despachan juntos en un solo paquete con guía de rastreo oficial.</span>
                  </div>
                </div>

                {/* Right Side: Total Price Box & Actions */}
                <div className="xl:w-80 bg-neutral-950 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between space-y-5 shrink-0 shadow-xl">
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">
                        Precio por separado:
                      </span>
                      <span className="text-sm font-bold text-neutral-500 line-through font-mono">
                        {formatCOP(originalPrice)}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-neutral-800/80">
                      <span className="text-xs text-orange-400 uppercase tracking-wider block font-black mb-1">
                        Precio Especial del Combo:
                      </span>
                      <div className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                        {formatCOP(combo.price)}
                      </div>
                    </div>

                    {savings > 0 && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 text-center mt-2">
                        <span className="text-xs font-black text-emerald-400 uppercase tracking-wide">
                          🎉 Te ahorras {formatCOP(savings)} en este pack
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2.5 pt-2">
                    <button
                      onClick={() => handleAddComboToCart(combo)}
                      className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 font-black py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Llevar Combo al Carrito</span>
                    </button>

                    <a
                      href={`https://wa.me/573000000000?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Comprar por WhatsApp</span>
                    </a>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
