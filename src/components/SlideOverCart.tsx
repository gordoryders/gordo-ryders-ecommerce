"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CartItem } from "@/types";
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, MessageCircle } from "lucide-react";

interface SlideOverCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

export default function SlideOverCart({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: SlideOverCartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !mounted || typeof document === "undefined") return null;

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price_retail * item.quantity,
    0
  );

  const freeShippingThreshold = 180000;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const whatsappCheckoutText = encodeURIComponent(
    `Hola Gordo Ryders, deseo finalizar mi pedido:\n\n${items
      .map(
        (i) =>
          `• ${i.product.name} (Talla: ${i.selectedSize}${i.selectedColor ? `, Color: ${i.selectedColor}` : ""}) x${i.quantity} = ${formatCOP(
            i.product.price_retail * i.quantity
          )}`
      )
      .join("\n")}\n\nTotal Pedido: ${formatCOP(subtotal)}\n\n¿Me indican los datos para el pago y despacho?`
  );

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer (Full width on mobile without horizontal overflow, max 420px on sm+) */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[420px] max-w-full flex">
        <div className="w-full h-[100dvh] bg-neutral-900 sm:border-l border-neutral-800 text-white flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 overflow-hidden">
          
          {/* Header */}
          <div className="px-4 py-3.5 sm:p-5 border-b border-neutral-800 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <ShoppingBag className="w-5 h-5 text-orange-400 shrink-0" />
              <h2 className="text-sm sm:text-lg font-black uppercase text-white truncate">
                Tu Carrito ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-300 hover:text-white rounded-xl bg-neutral-800/70 hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer"
              aria-label="Cerrar carrito"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-neutral-950 px-4 sm:px-5 py-3 border-b border-neutral-800 shrink-0">
            <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
              <span className="text-neutral-300 font-semibold flex items-center gap-1.5 min-w-0">
                <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                {remainingForFreeShipping === 0 ? (
                  <strong className="text-emerald-400 font-bold truncate">¡Tienes ENVÍO GRATIS a toda Colombia! 🇨🇴</strong>
                ) : (
                  <span className="truncate">
                    Te faltan <strong className="text-orange-400">{formatCOP(remainingForFreeShipping)}</strong> para envío gratis
                  </span>
                )}
              </span>
              <span className="text-[10px] text-neutral-500 font-mono shrink-0">{progressPercent}%</span>
            </div>
            <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 scrollbar-thin">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-neutral-800/80 flex items-center justify-center text-neutral-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase">Tu carrito está vacío</h3>
                <p className="text-xs text-neutral-400 max-w-xs">
                  Explora cascos certificados, guantes Proviker y equipamiento para rodar seguro.
                </p>
                <button
                  onClick={onClose}
                  className="bg-orange-500 hover:bg-orange-600 text-neutral-950 font-bold text-xs uppercase px-5 py-2.5 rounded-xl transition-colors mt-2 cursor-pointer"
                >
                  Explorar Catálogo
                </button>
              </div>
            ) : (
              items.map((item, index) => {
                const img = (item.product.images && item.product.images[0]) || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=300&q=80";
                return (
                  <div
                    key={`${item.product.id}-${index}`}
                    className="flex gap-3 bg-neutral-950 p-3 rounded-2xl border border-neutral-800/80"
                  >
                    <img
                      src={img}
                      alt={item.product.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shrink-0 bg-neutral-900"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(index)}
                            className="text-neutral-500 hover:text-red-400 transition-colors p-1 shrink-0 cursor-pointer"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] text-neutral-400 mt-1">
                          <span>Talla: <strong className="text-white">{item.selectedSize}</strong></span>
                          {item.selectedColor && (
                            <span>• Color: <strong className="text-white">{item.selectedColor}</strong></span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 mt-2">
                        <span className="text-xs sm:text-sm font-black text-white whitespace-nowrap">
                          {formatCOP(item.product.price_retail * item.quantity)}
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center border border-neutral-800 rounded-lg bg-neutral-900 text-xs shrink-0">
                          <button
                            onClick={() => onUpdateQuantity(index, Math.max(1, item.quantity - 1))}
                            className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
                            aria-label="Disminuir cantidad"
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-bold text-white text-[11px]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 pb-[max(1rem,env(safe-area-inset-bottom))] bg-neutral-950 border-t border-neutral-800 space-y-3 shrink-0">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between gap-2 text-neutral-400">
                  <span>Subtotal</span>
                  <span className="text-white font-semibold whitespace-nowrap">{formatCOP(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-2 text-neutral-400">
                  <span>Envío estimado</span>
                  <span className={`whitespace-nowrap ${remainingForFreeShipping === 0 ? "text-emerald-400 font-bold" : "text-white"}`}>
                    {remainingForFreeShipping === 0 ? "GRATIS" : "$ 12.000 COP"}
                  </span>
                </div>
                <div className="flex justify-between gap-2 text-sm font-black text-white pt-2 border-t border-neutral-800">
                  <span>Total a Pagar</span>
                  <span className="text-orange-400 text-base whitespace-nowrap">{formatCOP(subtotal + (remainingForFreeShipping === 0 ? 0 : 12000))}</span>
                </div>
              </div>

              {/* Checkout Triggers */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={onCheckout}
                  className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-neutral-950 font-black py-3 px-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-xl shadow-orange-500/20 cursor-pointer"
                >
                  <span className="truncate">Iniciar Pago Seguro (PSE / Wompi)</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>

                <a
                  href={`https://wa.me/573000000000?text=${whatsappCheckoutText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-neutral-950 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span className="truncate">Finalizar Pedido por WhatsApp</span>
                </a>
              </div>

              <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Transacciones encriptadas y protegidas</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>,
    document.body
  );
}
