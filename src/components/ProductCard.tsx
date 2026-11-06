"use client";

import { useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { ShoppingCart, Star, MessageSquareText, Zap, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product, size: string) => void;
  onViewDetail?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart, onViewDetail }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState<string>("L");

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

  const cuota3x = Math.round(product.price_retail / 3);

  const whatsappMessage = encodeURIComponent(
    `Hola Gordo Ryders, me interesa el producto: ${product.name} (Ref: ${product.sku}) en talla ${selectedSize}. ¿Tienen despacho disponible?`
  );

  const fallbackImage = product.category_name?.toLowerCase().includes("casco")
    ? "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80"
    : product.category_name?.toLowerCase().includes("guante")
    ? "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80"
    : product.category_name?.toLowerCase().includes("impermeable")
    ? "https://images.unsplash.com/photo-1517846695664-44df0e167232?auto=format&fit=crop&w=600&q=80"
    : product.category_name?.toLowerCase().includes("chaqueta")
    ? "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80"
    : product.category_name?.toLowerCase().includes("protecci")
    ? "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=600&q=80"
    : "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80";

  const imageUrl = (product.images && product.images.length > 0 && product.images[0]) ? product.images[0] : fallbackImage;

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 hover:shadow-2xl hover:shadow-orange-500/10 transition-all flex flex-col group">
      
      {/* 1. PRODUCT PHOTO CONTAINER (Click opens Full Product Page) */}
      <Link 
        href={`/producto/${product.slug}`}
        prefetch={true}
        onClick={() => onViewDetail && onViewDetail(product)}
        className="relative h-60 w-full bg-neutral-950 overflow-hidden cursor-pointer block active:opacity-90 transition-opacity"
      >
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-neutral-950/20" />

        {/* Top Badges (Mercado Libre Style) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          {product.badge && (
            <span className="bg-orange-500 text-neutral-950 text-[10px] font-black uppercase px-2 py-0.5 rounded shadow-md tracking-wider">
              {product.badge}
            </span>
          )}
        </div>

        {/* Ref / SKU Badge */}
        <span className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-sm border border-neutral-700 text-neutral-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded pointer-events-none">
          REF: {product.sku}
        </span>

        {/* Scarcity tag */}
        {product.stock && product.stock <= 5 && (
          <div className="absolute bottom-2.5 left-3 bg-neutral-950/90 border border-amber-500/40 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-md pointer-events-none">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Últimas {product.stock} unidades</span>
          </div>
        )}
      </Link>

      {/* 2. CARD BODY */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-orange-400 font-extrabold uppercase text-[10px] tracking-wider">
              {product.category_name || "Equipamiento Motero"}
            </span>
            <div className="flex items-center gap-1 text-amber-400 text-[11px] font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || "5.0"}</span>
              <span className="text-neutral-500 text-[10px]">({product.reviews_count || 24})</span>
            </div>
          </div>

          {/* Product Name (Click opens full product page) */}
          <Link 
            href={`/producto/${product.slug}`}
            prefetch={true}
            onClick={() => onViewDetail && onViewDetail(product)}
            className="text-sm font-bold text-white line-clamp-2 hover:text-orange-400 active:text-orange-500 transition-colors leading-snug cursor-pointer block"
          >
            {product.name}
          </Link>

          {/* Size Selector */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[11px] text-neutral-400 font-medium">Talla:</span>
            <div className="flex items-center gap-1.5">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold border transition-all ${
                    selectedSize === size
                      ? "bg-orange-500 text-neutral-950 border-orange-500 shadow"
                      : "bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-neutral-500"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3. PRICE & VALUE PROPS (Mercado Libre style) */}
        <div className="mt-4 pt-3 border-t border-neutral-800">
          
          {/* Crossed-out original price */}
          {product.price_original && (
            <p className="text-xs text-neutral-500 line-through">
              {formatCOP(product.price_original)}
            </p>
          )}

          {/* Real Price + Discount Tag */}
          <div className="flex items-baseline gap-2.5">
            <span className="text-xl font-black text-white tracking-tight">
              {formatCOP(product.price_retail)}
            </span>
            {discountPercent && (
              <span className="text-xs font-black text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Installments text */}
          <p className="text-[11px] text-neutral-400 font-medium mt-0.5">
            en <span className="text-neutral-200 font-bold">3x de {formatCOP(cuota3x)}</span> sin interés
          </p>

          {/* Free shipping pill */}
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold mt-1.5">
            <Zap className="w-3.5 h-3.5" />
            <span>Envío nacional disponible</span>
          </div>

          {/* Wholesale price hint */}
          {product.price_wholesale && (
            <p className="text-[10px] text-amber-400/90 font-medium mt-1">
              Mayoristas desde {formatCOP(product.price_wholesale)} (x6 unid.)
            </p>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => onAddToCart && onAddToCart(product, selectedSize)}
              className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-75 shadow-lg shadow-orange-500/10 uppercase tracking-wider cursor-pointer"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Comprar</span>
            </button>

            <a
              href={`https://wa.me/573000000000?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all duration-75 border border-neutral-700 cursor-pointer"
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
