"use client";

import { useState, useRef, MouseEvent, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ShoppingCart, 
  MessageCircle, 
  Zap, 
  Ruler, 
  Check, 
  ChevronRight,
  Flame,
  ArrowRight
} from "lucide-react";
import { PRODUCTS, getProductBySlug } from "@/data/products";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const product = getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  const { addToCart, userCity } = useStore();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState("L");
  const [selectedColor, setSelectedColor] = useState("Negro Mate");
  const [quantity, setQuantity] = useState(1);
  const [zoomStyle, setZoomStyle] = useState({ display: "none", transformOrigin: "0% 0%" });
  const [isZooming, setIsZooming] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const formatCOP = (num: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(num);

  // Gallery angles
  const gallery = [
    { label: "Frontal", url: product.images[0] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80" },
    { label: "Lateral", url: product.images[1] || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80" },
    { label: "Posterior", url: product.images[2] || "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80" },
    { label: "Detalle", url: product.images[3] || "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80" },
  ];

  const currentImageUrl = gallery[activeImageIndex]?.url || gallery[0].url;

  // Smooth hover zoom without clicking (Mercado Libre style)
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
    setZoomStyle({ display: "none", transformOrigin: "0% 0%" });
    setIsZooming(false);
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const handleDirectWhatsApp = () => {
    const text = encodeURIComponent(
      `Hola Gordo Ryders, deseo comprar:\n\n• ${product.name}\nTalla: ${selectedSize}\nColor: ${selectedColor}\nCantidad: ${quantity}\nPrecio: ${formatCOP(product.price_retail * quantity)}\nDestino: ${userCity}\n\n¿Tienen disponibilidad para despacho inmediato?`
    );
    window.open(`https://wa.me/573000000000?text=${text}`, "_blank");
  };

  // Related products from other items
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6 overflow-x-auto whitespace-nowrap scrollbar-none">
        <Link href="/" className="hover:text-orange-400 transition-colors shrink-0">Inicio</Link>
        <span>/</span>
        <Link href={`/categoria/${product.category_id || "cascos"}`} className="hover:text-orange-400 transition-colors shrink-0">
          {product.category_name || "Equipamiento"}
        </Link>
        <span>/</span>
        <span className="text-white font-bold truncate">{product.name}</span>
      </nav>

      {/* 2. Main Product Container (Mercado Libre Style Grid) */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-4 sm:p-8 shadow-2xl mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* A. Vertical Thumbnails Column (Desktop: 1.5 cols, Mobile: row) */}
          <div className="lg:col-span-2 order-2 lg:order-1 flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-none">
            {gallery.map((thumb, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setActiveImageIndex(idx)}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative rounded-2xl overflow-hidden border-2 transition-all shrink-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-full lg:h-24 bg-neutral-950 ${
                  activeImageIndex === idx
                    ? "border-orange-500 shadow-md shadow-orange-500/20 scale-[1.02]"
                    : "border-neutral-800 hover:border-neutral-700 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={thumb.url}
                  alt={`${product.name} - ${thumb.label}`}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 left-1 right-1 text-[9px] font-bold text-center bg-black/75 backdrop-blur-sm text-neutral-300 rounded py-0.5 uppercase">
                  {thumb.label}
                </span>
              </button>
            ))}
          </div>

          {/* B. Primary High-Res Photo with Hover Zoom (Desktop: 5.5 cols) */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div
              ref={imageContainerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-800/80 cursor-crosshair group flex items-center justify-center shadow-inner"
            >
              {/* Product Badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 pointer-events-none">
                {product.badge && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/15 border border-orange-500/30 px-3 py-1 rounded-full shadow">
                    {product.badge}
                  </span>
                )}
                {product.price_original && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 rounded-full shadow">
                    -{Math.round(((product.price_original - product.price_retail) / product.price_original) * 100)}% OFF
                  </span>
                )}
              </div>

              {/* Main Image */}
              <img
                src={currentImageUrl}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-200 ${
                  isZooming ? "scale-175 opacity-90" : "scale-100"
                }`}
                style={isZooming ? zoomStyle : {}}
              />

              {/* Hint badge */}
              <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none text-center">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-neutral-300 bg-neutral-900/85 backdrop-blur-md border border-neutral-700/80 px-3 py-1 rounded-full shadow">
                  <Zap className="w-3 h-3 text-orange-400" />
                  <span>Pasa el ratón sobre la imagen para zoom óptico de alta definición</span>
                </span>
              </div>
            </div>
          </div>

          {/* C. Right Column: Buy Box & Options (Desktop: 5 cols) */}
          <div className="lg:col-span-5 order-3 space-y-5">
            
            {/* Sales & Rating Header */}
            <div>
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-1">
                <span>Nuevo • +1.200 vendidos en Colombia</span>
                <span className="font-mono text-orange-400 font-bold">REF: {product.sku}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Stars & Reviews */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-white">{product.rating || 4.9}</span>
                <span className="text-xs text-neutral-400">({product.reviews_count || 58} opiniones verificadas)</span>
              </div>
            </div>

            {/* Price & Installments Box */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800/90 space-y-2">
              {product.price_original && (
                <div className="text-xs text-neutral-500 line-through">
                  {formatCOP(product.price_original)}
                </div>
              )}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
                  {formatCOP(product.price_retail)}
                </span>
                {product.price_original && (
                  <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    Ahorras {formatCOP(product.price_original - product.price_retail)}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400">
                o en 3 cuotas sin interés de <strong className="text-white font-mono">{formatCOP(Math.round(product.price_retail / 3))}</strong> con Addi / Sistecredito.
              </p>

              {/* Wholesale Hint */}
              <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
                <span className="text-neutral-400">Precio Mayorista (desde 6 unds):</span>
                <Link href="/mayoristas" className="text-orange-400 font-bold font-mono hover:underline">
                  {formatCOP(product.price_wholesale || Math.round(product.price_retail * 0.65))} COP →
                </Link>
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-neutral-300 uppercase tracking-wider">
                  Selecciona tu Talla:
                </span>
                <span className="text-orange-400 text-[11px] font-semibold flex items-center gap-1 cursor-pointer hover:underline">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Guía de medidas</span>
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {["S", "M", "L", "XL", "XXL"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedSize === size
                        ? "bg-orange-500 text-neutral-950 border-orange-500 shadow-md font-black"
                        : "bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            <div>
              <span className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                Color: <strong className="text-white normal-case">{selectedColor}</strong>
              </span>
              <div className="flex items-center gap-2">
                {["Negro Mate", "Rojo Furia", "Gris Titanio"].map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      selectedColor === color
                        ? "bg-neutral-800 text-orange-400 border-orange-500 shadow"
                        : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock & Delivery Info */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-neutral-300">
                <Truck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Envío disponible hacia <strong className="text-white">{userCity}</strong> (24 a 48 hrs con guía).
                </span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
                <span>
                  Garantía directa de 3 meses por costuras y materiales.
                </span>
              </div>
            </div>

            {/* Quantity and Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-neutral-400 uppercase">Cantidad:</span>
                <div className="flex items-center rounded-xl bg-neutral-950 border border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-neutral-400 hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-mono font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-neutral-400 hover:text-white"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-neutral-500">
                  (Stock: {product.stock || 8} disponibles)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl border border-neutral-700 transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4 text-orange-400" />
                  <span>Añadir al Carrito</span>
                </button>

                <button
                  type="button"
                  onClick={handleDirectWhatsApp}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl transition-all shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Comprar por WhatsApp</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleBuyNow}
                className="w-full bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black text-xs uppercase tracking-wider py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-500/20"
              >
                Comprar Ahora ({formatCOP(product.price_retail * quantity)})
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* 3. Specifications & Description Section (Mercado Libre Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
        
        {/* Left: Technical Specs Table (7 cols) */}
        <div className="lg:col-span-7 bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
              Ficha Técnica Oficial
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight mt-2">
              Características Principales
            </h2>
          </div>

          <div className="divide-y divide-neutral-800/80 rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-950">
            {product.specs && product.specs.length > 0 ? (
              product.specs.map((spec, i) => (
                <div key={i} className="grid grid-cols-1 sm:grid-cols-2 p-3 text-xs gap-1 sm:gap-4">
                  <span className="font-bold text-neutral-400">{spec.label}</span>
                  <span className="text-white font-medium">{spec.value}</span>
                </div>
              ))
            ) : (
              <div className="p-4 text-xs text-neutral-400">
                Ficha técnica oficial suministrada por Gordo Ryders Colombia.
              </div>
            )}
          </div>

          <div className="pt-4 space-y-3">
            <h3 className="text-base font-bold text-white uppercase">Descripción Detallada</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              {product.description || "Equipamiento de alta resistencia probado en las rutas y carreteras de Colombia para máxima seguridad del piloto."}
            </p>
          </div>
        </div>

        {/* Right: Guarantees & Wholesale Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-black uppercase text-white tracking-wider">
              Garantías Gordo Ryders
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Compra 100% Protegida</strong>
                  <p className="text-neutral-400">Recibe el producto que esperabas o te devolvemos el dinero.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Cambio de Talla Sin Problema</strong>
                  <p className="text-neutral-400">Si no te quedó la talla, coordinamos el cambio rápidamente.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Despacho con Guía Oficial</strong>
                  <p className="text-neutral-400">Seguimiento en línea con transportadoras autorizadas.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Wholesale Call to Action */}
          <div className="bg-gradient-to-br from-orange-950/40 via-neutral-900 to-neutral-900 border border-orange-500/30 rounded-3xl p-6 shadow-xl space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
              ¿Eres Distribuidor o Taller?
            </span>
            <h4 className="text-base font-bold text-white">
              Lleva este producto por docenas a precio de distribuidor
            </h4>
            <p className="text-xs text-neutral-400">
              Accede a márgenes comerciales del 40% al 55% para tu negocio en cualquier ciudad del país.
            </p>
            <Link
              href="/mayoristas"
              className="inline-flex items-center gap-1.5 text-xs font-black text-orange-400 hover:text-orange-300 pt-1"
            >
              <span>Ver escala de precios mayorista</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

      {/* 4. Related Products Grid */}
      <div className="mt-12 pt-8 border-t border-neutral-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
              Recomendados para ti
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
              Completa tu Equipamiento
            </h2>
          </div>
          <Link href="/#catalogo" className="text-xs font-bold text-orange-400 hover:underline">
            Ver todo el catálogo →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={() => addToCart(p, "M", "Negro", 1)}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
