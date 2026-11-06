"use client";

import React, { ReactNode } from "react";
import { StoreProvider, useStore } from "@/context/StoreContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SlideOverCart from "@/components/SlideOverCart";
import LocationModal from "@/components/LocationModal";
import OrderTrackingModal from "@/components/OrderTrackingModal";
import ContactModal from "@/components/ContactModal";
import ChatbotSupport from "@/components/ChatbotSupport";

function ShellInner({ children }: { children: ReactNode }) {
  const {
    cartItems,
    totalCartCount,
    isCartOpen,
    setIsCartOpen,
    userCity,
    setUserCity,
    isLocationOpen,
    setIsLocationOpen,
    isTrackingOpen,
    setIsTrackingOpen,
    isContactOpen,
    setIsContactOpen,
    updateQuantity,
    removeItem,
  } = useStore();

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
      `Hola Gordo Ryders, deseo pagar y finalizar mi compra:\n\n${cartItems
        .map(
          (i) =>
            `• ${i.product.name} (Talla: ${i.selectedSize}${
              i.selectedColor ? `, Color: ${i.selectedColor}` : ""
            }) x${i.quantity} = ${formatCOP(i.product.price_retail * i.quantity)}`
        )
        .join("\n")}\n\nTotal Pedido: ${formatCOP(subtotal)}\nCiudad de despacho: ${userCity}\n\n¿Me indican las cuentas para transferencia?`
    );

    window.open(`https://wa.me/573000000000?text=${message}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col font-sans selection:bg-orange-500 selection:text-neutral-950">
      {/* 1. Header Oficial Permanente */}
      <Header
        cartCount={totalCartCount}
        userCity={userCity}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLocation={() => setIsLocationOpen(true)}
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* 2. Contenido Dinámico de Cada Página */}
      <main className="flex-1 w-full">{children}</main>

      {/* 3. Footer Oficial Permanente */}
      <Footer
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* 4. Carrito Slide-Over Global */}
      <SlideOverCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />

      {/* 5. Modal Selector de Ciudad de Envío */}
      <LocationModal
        isOpen={isLocationOpen}
        onClose={() => setIsLocationOpen(false)}
        currentCity={userCity}
        onSelectCity={(city) => {
          setUserCity(city);
          setIsLocationOpen(false);
        }}
      />

      {/* 6. Modal Rápido de Rastreo de Guía */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
      />

      {/* 7. Modal Rápido de Contacto */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* 8. Asistente Virtual Flotante */}
      <ChatbotSupport
        onOpenTracking={() => setIsTrackingOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />
    </div>
  );
}

export default function StoreShell({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <ShellInner>{children}</ShellInner>
    </StoreProvider>
  );
}
