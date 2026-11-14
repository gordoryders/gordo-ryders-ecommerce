"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { StoreProvider, useStore } from "@/context/StoreContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SlideOverCart from "@/components/SlideOverCart";
import CheckoutModal from "@/components/CheckoutModal";
import LocationModal from "@/components/LocationModal";
import OrderTrackingModal from "@/components/OrderTrackingModal";
import ContactModal from "@/components/ContactModal";
import ChatbotSupport from "@/components/ChatbotSupport";

function ShellInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

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

  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);

  // If in /admin, isolate completely as an independent backoffice application
  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-orange-500 selection:text-neutral-950">
        {children}
      </div>
    );
  }

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
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

      {/* 4.1 Modal Oficial de Finalización de Compra (Checkout Nivel 1) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
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
