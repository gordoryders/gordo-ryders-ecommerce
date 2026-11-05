"use client";

import { useState } from "react";
import { Product } from "@/types";
import { ShoppingCart, Star, MessageSquareText, ShieldAlert } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>("L");

  // Calculate discount percentage if original price exists
  const discountPercent = product.price_original && product.price_original > product.price_retail
    ? Math.round(((product.price_original - product.price_retail) / product.price_original) * 100)
    : null;

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const whatsappMessage = encodeURIComponent(
    `Hola Gordo Ryders, me interesa el producto: ${product.name} (Ref: ${product.sku}) en talla ${selectedSize}. ¿Tienen disponibilidad?`
  );

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 hover:shadow-xl hover:shadow-orange-500/5 transition-all flex flex-col group">
      
      {/* Top Media / Thumbnail */}
      <div className="relative h-56 bg-neutral-950 p-4 flex items-center justify-center overflow-hidden border-b border-neutral-800/80">
        
        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="bg-orange-500 text-neutral-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded shadow">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Ref / SKU watermark */}
        <span className="absolute top-2.5 right-2.5 text-[10px] text-neutral-500 font-mono font-semibold">
          REF: {product.sku}
        </span>

        {/* Placeholder Emoji/Image */}
        <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
          {product.category_name?.toLowerCase().includes("casco") ? "🪖" :
           product.category_name?.toLowerCase().includes("guante") ? "🧤" :
           product.category_name?.toLowerCase().includes("impermeable") ? "🌧️" :
           product.category_name?.toLowerCase().includes("chaqueta") ? "🧥" :
           product.category_name?.toLowerCase().includes("protecci") ? "🛡️" : "📦"}
        </div>

        {/* Scarcity Trigger */}
        {product.stock && product.stock <= 5 && (
          <div className="absolute bottom-2 left-2 bg-neutral-900/90 border border-amber-500/40 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
            <ShieldAlert className="w-3 h-3" />
            <span>¡Últimas {product.stock} unidades!</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-orange-400 font-semibold uppercase text-[10px] tracking-wider">
              {product.category_name || "Accesorio Motero"}
            </span>
            <div className="flex items-center gap-1 text-amber-400 text-[11px] font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || "5.0"}</span>
              <span className="text-neutral-500 text-[10px]">({product.reviews_count || 12})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-orange-400 transition-colors">
            {product.name}
          </h3>

          {/* Tallas Rápidas */}
          <div className="mt-2.5 flex items-center gap-1.5 text-[10px]">
            <span className="text-neutral-400 font-medium">Talla:</span>
            {["S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-6 h-6 rounded font-bold border transition-all ${
                  selectedSize === size
                    ? "bg-orange-500 text-neutral-950 border-orange-500"
                    : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-neutral-500"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Actions */}
        <div className="mt-4 pt-3 border-t border-neutral-800">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-lg font-black text-white">
              {formatCOP(product.price_retail)}
            </span>
            {product.price_original && (
              <span className="text-xs text-neutral-500 line-through">
                {formatCOP(product.price_original)}
              </span>
            )}
          </div>

          {product.price_wholesale && (
            <p className="text-[10px] text-emerald-400 font-semibold mb-3">
              Mayoristas desde: {formatCOP(product.price_wholesale)} (6+ unds)
            </p>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddToCart && onAddToCart(product)}
              className="bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Comprar</span>
            </button>

            <a
              href={`https://wa.me/573000000000?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors border border-neutral-700"
            >
              <MessageSquareText className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
}
