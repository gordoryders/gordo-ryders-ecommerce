"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Package, 
  ShieldCheck, 
  Download, 
  MessageCircle, 
  TrendingUp, 
  CheckCircle2, 
  Calculator,
  Truck,
  FileText,
  BadgePercent
} from "lucide-react";
import { PRODUCTS } from "@/data/products";

export default function MayoristasPage() {
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [quantity, setQuantity] = useState(12);

  const product = PRODUCTS[selectedProductIndex];
  const wholesalePrice = product.price_wholesale || Math.round(product.price_retail * 0.65);
  const retailPrice = product.price_retail;
  const totalWholesale = wholesalePrice * quantity;
  const totalRetail = retailPrice * quantity;
  const estimatedProfit = totalRetail - totalWholesale;

  const formatCOP = (num: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(num);

  const handleWholesaleChat = () => {
    const text = encodeURIComponent(
      `Hola Edwin Bernal, estoy interesado en comprar al por mayor para mi almacén:\n\nProducto: ${product.name}\nCantidad: ${quantity} unidades\nTotal estimado: ${formatCOP(totalWholesale)}\n\n¿Me podrías compartir la lista de precios completa en PDF y los términos de despacho?`
    );
    window.open(`https://wa.me/573000000000?text=${text}`, "_blank");
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
        <Link href="/" className="hover:text-orange-400 transition-colors">Inicio</Link>
        <span>/</span>
        <span className="text-white font-bold">Canal Mayoristas B2B</span>
      </nav>

      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-orange-950/60 via-neutral-900 to-neutral-950 border border-orange-500/30 p-6 sm:p-10 mb-12 shadow-2xl overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
            Distribución Oficial para Almacenes y Talleres de Colombia
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            Canal Mayorista B2B <span className="text-orange-500">Gordo Ryders</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Abastécete directamente con Edwin Bernal al mejor precio de fábrica en guantes Proviker Ref E44, impermeables termosellados, cascos ECE 22.06 y accesorios de alto margen comercial.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={handleWholesaleChat}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Contactar a Edwin Bernal (WhatsApp)</span>
            </button>
            <a
              href="#simulador"
              className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase px-5 py-3.5 rounded-xl transition-colors border border-neutral-700 flex items-center gap-2"
            >
              <Calculator className="w-4 h-4 text-orange-400" />
              <span>Simular Margen de Ganancia</span>
            </a>
          </div>
        </div>
      </div>

      {/* 3 Value Propositions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center font-bold">
            <BadgePercent className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Precios de Fábrica desde 6 Unidades</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            No necesitas contenedores enteros. Accede a tarifas mayoristas a partir de solo 6 piezas por referencia para rotación constante.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Despachos Express a Nivel Nacional</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Envíos asegurados desde bodega en Bogotá hacia Antioquia, Valle, Costa Caribe, Santanderes y Llanos con tarifas preferenciales de carga.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">Catálogo Completo y Facturación</h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Te entregamos ficha técnica de homologación, fotos en alta definición para tus redes sociales y lista de precios oficial en PDF.
          </p>
        </div>
      </div>

      {/* Simulator Section */}
      <div id="simulador" className="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 sm:p-10 shadow-2xl mb-12">
        <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider mb-2">
          <Calculator className="w-4 h-4" />
          <span>Calculadora de Rentabilidad B2B</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mb-8">
          Simula la Rentabilidad de tu Almacén
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                Selecciona la Referencia de Producto:
              </label>
              <select
                value={selectedProductIndex}
                onChange={(e) => setSelectedProductIndex(Number(e.target.value))}
                className="w-full bg-neutral-950 border border-neutral-700 text-xs sm:text-sm rounded-2xl p-3 text-white focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                {PRODUCTS.map((p, idx) => (
                  <option key={p.id} value={idx}>
                    {p.name} (PVP: {formatCOP(p.price_retail)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                <span>Cantidad a Comprar:</span>
                <span className="text-orange-400 font-mono text-sm">{quantity} unidades</span>
              </div>
              <input
                type="range"
                min="6"
                max="100"
                step="6"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-2 bg-neutral-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 mt-1 font-mono">
                <span>Mínimo 6 unds</span>
                <span>24 unds</span>
                <span>50 unds</span>
                <span>100 unds</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Precio Mayorista por Unidad:</span>
                <strong className="text-orange-400 font-mono">{formatCOP(wholesalePrice)}</strong>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Precio Sugerido al Público (PVP):</span>
                <strong className="text-white font-mono">{formatCOP(retailPrice)}</strong>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Margen Bruto de Ganancia:</span>
                <strong className="text-emerald-400 font-mono">
                  +{Math.round(((retailPrice - wholesalePrice) / retailPrice) * 100)}% por unidad
                </strong>
              </div>
            </div>
          </div>

          {/* Results Box (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-neutral-950 border border-orange-500/30 text-center space-y-4 shadow-xl">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Ganancia Estimada de Venta
            </span>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                +{formatCOP(estimatedProfit)}
              </div>
              <span className="text-xs text-neutral-400 mt-1 block">
                Total Inversión Mayorista: {formatCOP(totalWholesale)}
              </span>
            </div>

            <button
              onClick={handleWholesaleChat}
              className="w-full bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Solicitar Pedido de {quantity} Unidades</span>
            </button>
            <p className="text-[10px] text-neutral-500">
              Cotización directa con Edwin Bernal sin intermediarios.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
