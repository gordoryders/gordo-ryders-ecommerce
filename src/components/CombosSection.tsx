"use client";

import { useStore } from "@/context/StoreContext";
import { ProductCombo, Product } from "@/types";
import { Package, Plus, ShoppingCart, MessageCircle, Sparkles, CheckCircle2 } from "lucide-react";

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
            p.id === idOrSlug ||
            p.slug === idOrSlug ||
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
        
        {/* Header */}
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
              Lleva 2 o 3 productos juntos a un precio preferencial. Ahorra comprando el kit completo.
            </p>
          </div>
        </div>

        {/* Combos Cards Grid */}
        <div className="space-y-6">
          {activeCombos.map((combo) => {
            const comboProds = getComboProducts(combo);
            const calculatedOriginal = comboProds.reduce((acc, p) => acc + (p?.price_retail || 0), 0);
            const originalPrice = combo.originalPrice || calculatedOriginal;
            const savings = combo.savingsAmount || Math.max(0, originalPrice - combo.price);

            const whatsappMessage = encodeURIComponent(
              `Hola Gordo Ryders, quiero comprar el ${combo.name} por valor de ${formatCOP(combo.price)} (Ahorro de ${formatCOP(savings)}). ¿Tienen disponibilidad inmediata?`
            );

            return (
              <div
                key={combo.id}
                className="bg-neutral-900 border border-neutral-800 hover:border-orange-500/40 rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-2xl flex flex-col lg:flex-row items-stretch justify-between gap-6 relative overflow-hidden"
              >
                {/* Accent Background Glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Left Side: Combo Details & Products in Combo */}
                <div className="flex-1 space-y-5">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
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

                  {/* Included Products Visual Pills */}
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {comboProds.map((prod, idx) => (
                      <div key={prod.id || idx} className="flex items-center gap-2">
                        <div className="flex items-center gap-2.5 bg-neutral-950 border border-neutral-800 rounded-2xl p-2 pr-3.5">
                          <img
                            src={prod.images?.[0] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=150&q=80"}
                            alt={prod.name}
                            className="w-10 h-10 rounded-xl object-cover bg-neutral-900 border border-neutral-800 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="text-[9px] font-bold text-orange-400 uppercase tracking-wider block">
                              {prod.category_name}
                            </span>
                            <span className="text-xs font-bold text-white truncate max-w-[140px] sm:max-w-[180px] block">
                              {prod.name}
                            </span>
                          </div>
                        </div>

                        {idx < comboProds.length - 1 && (
                          <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-orange-400 font-black text-xs shrink-0">
                            +
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-neutral-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Envío seguro a toda Colombia con guía de rastreo oficial incluida.</span>
                  </div>
                </div>

                {/* Right Side: Price Box & Actions */}
                <div className="lg:w-72 bg-neutral-950 border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 shrink-0">
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-semibold">
                      Precio de los productos por separado:
                    </span>
                    <span className="text-sm font-bold text-neutral-500 line-through font-mono block">
                      {formatCOP(originalPrice)}
                    </span>

                    <span className="text-[11px] text-orange-400 uppercase tracking-wider block font-black pt-2">
                      Precio Especial Combo:
                    </span>
                    <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                      {formatCOP(combo.price)}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => handleAddComboToCart(combo)}
                      className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Llevar Combo al Carrito</span>
                    </button>

                    <a
                      href={`https://wa.me/573000000000?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Pedir por WhatsApp</span>
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