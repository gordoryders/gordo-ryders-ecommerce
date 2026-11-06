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
import ProductDetailModal from "@/components/ProductDetailModal";
import SlideOverCart from "@/components/SlideOverCart";
import LocationModal from "@/components/LocationModal";
import OrderTrackingModal from "@/components/OrderTrackingModal";
import ContactModal from "@/components/ContactModal";
import ChatbotSupport from "@/components/ChatbotSupport";
import { Product, CartItem } from "@/types";
import { Flame, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLocationOpen, setIsLocationOpen] = useState<boolean>(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);
  const [isContactOpen, setIsContactOpen] = useState<boolean>(false);
  const [userCity, setUserCity] = useState<string>("Bogotá D.C.");
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
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=900&q=80",
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
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=900&q=80",
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
        "https://images.unsplash.com/photo-1517846695664-44df0e167232?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80",
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
        "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=900&q=80",
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
        "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80",
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
        "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80",
        "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=900&q=80",
      ],
      is_featured: true,
      is_active: true,
      stock: 14,
    },
  ];

  // Total cart item quantity
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Quick add from card (with default size and auto-open cart)
  const handleQuickAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === "M"
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity: 1,
          selectedSize: "M",
          selectedColor: "Negro Mate",
        },
      ];
    });
    setIsCartOpen(true);
  };

  // Add from detailed modal with selected size, color, quantity
  const handleDetailAddToCart = (
    product: Product,
    size: string,
    color: string,
    quantity: number
  ) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedSize: size,
          selectedColor: color,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (index: number, quantity: number) => {
    setCartItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const updated = [...prev];
      updated[index].quantity = quantity;
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    const formatCOP = (num: number) =>
      new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }).format(num);

    const subtotal = cartItems.reduce(
      (acc, i) => acc + i.product.price_retail * i.quantity,
      0
    );

    const message = encodeURIComponent(
      `Hola Gordo Ryders, deseo confirmar mi pedido:\n\n${cartItems
        .map(
          (i) =>
            `• ${i.product.name} (Talla: ${i.selectedSize}, Color: ${i.selectedColor}) x${i.quantity} = ${formatCOP(
              i.product.price_retail * i.quantity
            )}`
        )
        .join("\n")}\n\nTotal Pedido: ${formatCOP(subtotal)}\nCiudad de destino: ${userCity}\n\n¿Por favor me confirman datos de pago (Bancolombia/Nequi/Wompi)?`
    );

    window.open(`https://wa.me/573000000000?text=${message}`, "_blank");
  };

  const filteredProducts =
    selectedFilter === "all"
      ? sampleProducts
      : sampleProducts.filter((p) =>
          p.category_name?.toLowerCase().includes(selectedFilter)
        );

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans selection:bg-orange-500 selection:text-neutral-950">
      
      {/* 1. Header 2-Niveles estilo Retail (Mercado Libre / Amazon) */}
      <Header
        cartCount={totalCartCount}
        userCity={userCity}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLocation={() => setIsLocationOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      <main className="flex-1">
        {/* 2. Hero Slider Principal */}
        <HeroSlider />

        {/* 3. Categorías con Fotografía Real */}
        <CategoryBubbles />

        {/* 4. Carrusel Horizontal de Ofertas Relámpago con Cuenta Regresiva */}
        <ProductCarousel
          title="Ofertas Relámpago de la Semana"
          badge="OFERTA DEL DÍA"
          products={sampleProducts}
          onAddToCart={handleQuickAddToCart}
          onViewDetail={(product) => setSelectedProduct(product)}
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
                Haz clic en cualquier producto para inspeccionar sus 4 ángulos con zoom sutil de alta definición.
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
                onAddToCart={handleQuickAddToCart}
                onViewDetail={(p) => setSelectedProduct(p)}
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
      <Footer
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Modal 1: Detalle de Producto con 4 Ángulos y Zoom Hover Suave */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleDetailAddToCart}
      />

      {/* Modal 2: Carrito Lateral Desplegable (Slide-over Cart) */}
      <SlideOverCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Modal 3: Selector de Ubicación / Ciudad de Envío */}
      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        currentCity={userCity}
        onSelectCity={(city) => {
          setUserCity(city);
          setIsLocationOpen(false);
        }}
      />

      {/* Modal 4: Rastreador de Guías y Envíos en Tiempo Real */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />

      {/* Modal 5: Centro de Contacto Oficial y Redes Sociales */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Widget Flotante 6: Asistente Virtual / Chatbot de Soporte */}
      <ChatbotSupport
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

    </div>
  );
}