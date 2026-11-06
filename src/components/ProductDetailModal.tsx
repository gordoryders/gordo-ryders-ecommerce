"use client";

import { useState, useRef, MouseEvent } from "react";
import { Product } from "@/types";
import { 
  X, 
  ShoppingCart, 
  MessageSquareText, 
  Star, 
  ShieldCheck, 
  Truck, 
  Zap, 
  RotateCcw,
  Ruler,
  Check
} from "lucide-react";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState("Negro Mate");
  const [quantity, setQuantity] = useState(1);
  const [zoomStyle, setZoomStyle] = useState({ display: "none", transformOrigin: "0% 0%" });
  const [isZooming, setIsZooming] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !product) return null;

  // 4 camera angles / views
  const baseImg = (product.images && product.images[0]) || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1000&q=80";
  
  const gallery = [
    { label: "Frontal", url: product.images?.[0] || baseImg },
    { label: "Lateral", url: product.images?.[1] || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1000&q=80" },
    { label: "Posterior", url: product.images?.[2] || "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1000&q=80" },
    { label: "Detalle", url: product.images?.[3] || "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1000&q=80" },
  ];

  const currentImageUrl = gallery[activeImageIndex]?.url || baseImg;

  // Subtle Mouse Hover Zoom (Mercado Libre / Amazon style without clicking)
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      display: "block",
      transformOrigin: `${x}% ${y}%`,
    });
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
    setZoomStyle({ display: "none", transformOrigin: "0% 0%" });
  };

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const discountPercent = product.price_original && product.price_original > product.price_retail
    ? Math.round(((product.price_original - product.price_retail) / product.price_original) * 100)
    : null;

  const cuota3x = Math.round(product.price_retail / 3);

  const whatsappMessage = encodeURIComponent(
    `Hola Gordo Ryders, me interesa comprar: ${product.name} (Ref: ${product.sku}) en talla ${selectedSize}, color ${selectedColor}. Cantidad: ${quantity}. ¿Tienen despacho disponible?`
  );

  const sizes = [
    { name: "S", stock: 2, label: "55-56 cm" },
    { name: "M", stock: 6, label: "57-58 cm" },
    { name: "L", stock: 4, label: "59-60 cm" },
    { name: "XL", stock: 1, label: "61-62 cm" },
  ];

  const colors = ["Negro Mate", "Rojo Furia", "Gris Titanio"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-4xl w-full text-white relative shadow-2xl my-auto animate-in fade-in zoom-in-95 max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 flex-1 scrollbar-thin">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* LEFT: 4 ANGLES GALLERY WITH HOVER ZOOM */}
            <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-3">
              
              {/* 4 Angle Thumbnails */}
              <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible shrink-0 pb-1 sm:pb-0">
                {gallery.map((thumb, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx
                        ? "border-orange-500 ring-2 ring-orange-500/30 scale-105"
                        : "border-neutral-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={thumb.url}
                      alt={thumb.label}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-black/75 text-[9px] font-bold text-center py-0.5 text-neutral-300">
                      {thumb.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Main Image with Smooth Hover Magnifier */}
              <div
                ref={imageContainerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative flex-1 h-72 sm:h-96 lg:h-[440px] rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800 cursor-crosshair select-none"
              >
                <img
                  src={currentImageUrl}
                  alt={product.name}
                  className={`w-full h-full object-cover transition-transform duration-200 ease-out ${
                    isZooming ? "scale-225" : "scale-100"
                  }`}
                  style={{
                    transformOrigin: zoomStyle.transformOrigin,
                  }}
                />

                {/* Subtle Lens Hint Badge */}
                <div className="absolute bottom-3 left-3 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 px-2.5 py-1 rounded-xl text-[10px] text-neutral-400 pointer-events-none hidden sm:flex items-center gap-1.5">
                  <Ruler className="w-3 h-3 text-orange-400" />
                  <span>Pasa el ratón para zoom de alta definición</span>
                </div>

                {/* Badge */}
                {discountPercent && (
                  <div className="absolute top-3 left-3 bg-red-600 text-white font-black text-xs px-2.5 py-1 rounded-lg shadow-md uppercase tracking-wider">
                    {discountPercent}% OFF
                  </div>
                )}
              </div>

            </div>

            {/* RIGHT: COMMERCIAL DETAILS & ACTIONS */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Category, SKU and Rating */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-orange-400 font-extrabold uppercase text-[10px] tracking-widest">
                    {product.category_name || "Gordo Ryders Oficial"}
                  </span>
                  <span className="text-neutral-500 font-mono text-[10px]">
                    REF: {product.sku}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
                  {product.name}
                </h2>

                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{product.rating || "4.9"}</span>
                  </div>
                  <span className="text-neutral-500 text-xs">•</span>
                  <span className="text-neutral-400 text-xs">
                    {product.reviews_count || 38} calificaciones y ventas
                  </span>
                </div>
              </div>

              {/* Price Block */}
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800/80">
                {product.price_original && (
                  <p className="text-xs text-neutral-500 line-through">
                    {formatCOP(product.price_original)}
                  </p>
                )}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {formatCOP(product.price_retail)}
                  </span>
                  {discountPercent && (
                    <span className="text-xs font-black text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded-md">
                      Ahorras {formatCOP(product.price_original! - product.price_retail)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Paga en <span className="text-white font-bold">3 cuotas de {formatCOP(cuota3x)}</span> sin interés
                </p>
                {product.price_wholesale && (
                  <div className="mt-2 pt-2 border-t border-neutral-800 text-[11px] text-amber-400 font-medium">
                    📦 Tarifa Mayorista: <span className="font-bold text-white">{formatCOP(product.price_wholesale)}</span> a partir de 6 unds.
                  </div>
                )}
              </div>

              {/* Size Selector */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-neutral-300">Selecciona tu talla:</span>
                  <span className="text-orange-400 text-[11px] cursor-pointer hover:underline flex items-center gap-1">
                    <Ruler className="w-3 h-3" /> Guía de medidas
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s.name}
                      onClick={() => setSelectedSize(s.name)}
                      className={`p-2 rounded-xl text-center border transition-all ${
                        selectedSize === s.name
                          ? "bg-orange-500 text-neutral-950 border-orange-500 font-black shadow-lg shadow-orange-500/20"
                          : "bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                      }`}
                    >
                      <span className="block text-sm font-bold">{s.name}</span>
                      <span className="block text-[9px] opacity-75">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <span className="text-xs font-bold text-neutral-300 block mb-2">Color seleccionado: <strong className="text-white">{selectedColor}</strong></span>
                <div className="flex items-center gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                        selectedColor === c
                          ? "bg-neutral-800 border-orange-500 text-orange-400"
                          : "bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-neutral-300">Cantidad:</span>
                <div className="flex items-center border border-neutral-700 rounded-xl bg-neutral-950">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-8 h-8 flex items-center justify-center text-neutral-300 hover:text-white font-bold"
                  >
                    -
                  </button>
                  <span className="w-8 text-center text-xs font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-8 h-8 flex items-center justify-center text-neutral-300 hover:text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    onAddToCart(product, selectedSize, selectedColor, quantity);
                    onClose();
                  }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black py-3.5 px-6 rounded-2xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl shadow-orange-500/20"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Añadir al Carrito ({formatCOP(product.price_retail * quantity)})</span>
                </button>

                <a
                  href={`https://wa.me/573000000000?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold py-3.5 px-6 rounded-2xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageSquareText className="w-4 h-4" />
                  <span>Comprar directo por WhatsApp</span>
                </a>
              </div>

              {/* Trust Micro-Badges */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-neutral-800 text-[11px] text-neutral-400">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Despacho seguro nacional</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Garantía de fábrica</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
