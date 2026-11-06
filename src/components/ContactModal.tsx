"use client";

import { X, Phone, MessageCircle, MapPin, Mail, Clock, ShieldCheck } from "lucide-react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 text-white relative shadow-2xl animate-in fade-in zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-xl hover:bg-neutral-800 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">
              Atención y Canales Oficiales
            </h3>
            <p className="text-xs text-neutral-400">
              Gordo Ryders • Bodega de Despachos y Venta Directa
            </p>
          </div>
        </div>

        <div className="space-y-3">
          
          {/* WhatsApp Direct */}
          <a
            href="https://wa.me/573000000000?text=Hola%20Gordo%20Ryders,%20necesito%20asesoría%20sobre%20un%20producto"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-700/60 hover:bg-emerald-900/40 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-emerald-300">
                  Línea WhatsApp Ventas y Asesoría
                </span>
                <span className="text-[11px] text-emerald-400/80">
                  +57 300 000 0000 • Respuesta inmediata
                </span>
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-bold">Chatear →</span>
          </a>

          {/* WhatsApp Wholesale B2B */}
          <a
            href="https://wa.me/573000000000?text=Hola%20Edwin,%20deseo%20comprar%20por%20mayor%20para%20mi%20almacén"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-950/40 border border-orange-700/60 hover:bg-orange-900/40 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block group-hover:text-orange-300">
                  Atención Exclusiva Mayoristas (Edwin Bernal)
                </span>
                <span className="text-[11px] text-orange-400/80">
                  Cotizaciones por docenas y listas en PDF
                </span>
              </div>
            </div>
            <span className="text-xs text-orange-400 font-bold">Cotizar →</span>
          </a>

          {/* Bodega física */}
          <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-neutral-800 text-orange-400 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Sede y Bodega Principal</span>
                <p className="text-[11px] text-neutral-400 leading-snug">
                  Bogotá, Colombia • Sector comercial de repuestos y accesorios moteros.
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-neutral-500">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Lunes a Sábado: 8:00 AM – 6:30 PM (Jornada continua)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Networks & Email */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 text-pink-400 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>@gordoryders.co</span>
            </a>
            <a
              href="mailto:contacto@gordoryders.com"
              className="flex items-center gap-2 p-3 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-xs text-neutral-300 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Correo Oficial</span>
            </a>
          </div>

        </div>

        <div className="mt-5 pt-4 border-t border-neutral-800 text-center">
          <p className="text-[10px] text-neutral-500">
            Envíos garantizados con número de guía a cualquier municipio de Colombia.
          </p>
        </div>

      </div>
    </div>
  );
}
