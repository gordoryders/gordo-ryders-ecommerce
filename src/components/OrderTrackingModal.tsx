"use client";

import { useState } from "react";
import { Package, X, Search, CheckCircle2, Clock, Truck, MapPin } from "lucide-react";

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderTrackingModal({ isOpen, onClose }: OrderTrackingModalProps) {
  const [guideInput, setGuideInput] = useState("");
  const [trackingResult, setTrackingResult] = useState<null | {
    guide: string;
    carrier: string;
    destination: string;
    status: string;
    steps: { title: string; date: string; done: boolean }[];
  }>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideInput.trim()) return;

    // Simulated lookup
    setTrackingResult({
      guide: guideInput.toUpperCase(),
      carrier: "Inter Rapidísimo",
      destination: "Bogotá D.C., Colombia",
      status: "En tránsito hacia destino",
      steps: [
        { title: "Orden confirmada y empacada en bodega", date: "Hoy, 09:30 AM", done: true },
        { title: "Recolectado por transportadora (Inter Rapidísimo)", date: "Hoy, 02:15 PM", done: true },
        { title: "En camino al centro logístico principal", date: "Hoy, 05:40 PM", done: true },
        { title: "En reparto local hacia tu dirección", date: "Estimado mañana", done: false },
        { title: "Entrega exitosa", date: "Pendiente", done: false },
      ],
    });
  };

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

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Rastreo de Pedidos</h3>
            <p className="text-xs text-neutral-400">
              Consulta en tiempo real el estado de tu guía de despacho
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 mb-5">
          <input
            type="text"
            value={guideInput}
            onChange={(e) => setGuideInput(e.target.value)}
            placeholder="Ingresa tu número de guía o cédula..."
            className="flex-1 bg-neutral-950 border border-neutral-700 text-xs sm:text-sm rounded-2xl px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-neutral-950 font-bold px-4 rounded-2xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors shrink-0"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Rastrear</span>
          </button>
        </form>

        {trackingResult ? (
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 text-xs">
              <div>
                <span className="text-neutral-500 block text-[10px]">Guía oficial</span>
                <span className="font-mono font-bold text-orange-400">{trackingResult.guide}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">Transportadora</span>
                <span className="font-bold text-white">{trackingResult.carrier}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">Destino</span>
                <span className="font-bold text-white">{trackingResult.destination}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-3 pt-1">
              {trackingResult.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-neutral-600 shrink-0" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-semibold ${step.done ? "text-white" : "text-neutral-500"}`}>
                      {step.title}
                    </p>
                    <span className="text-[10px] text-neutral-400 block">{step.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-neutral-500 text-xs bg-neutral-950/40 rounded-2xl border border-dashed border-neutral-800">
            <Truck className="w-8 h-8 mx-auto mb-2 text-neutral-600" />
            <p>Ingresa el número de guía enviado a tu WhatsApp o correo al despachar.</p>
            <p className="text-[11px] text-neutral-400 mt-1">Ejemplo demo: <button type="button" onClick={() => setGuideInput("GR-2026-BOG")} className="text-orange-400 underline font-bold">GR-2026-BOG</button></p>
          </div>
        )}

      </div>
    </div>
  );
}
