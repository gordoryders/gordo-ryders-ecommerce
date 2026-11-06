"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Package, 
  Search, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  MessageCircle,
  HelpCircle,
  AlertCircle
} from "lucide-react";

export default function RastreoPage() {
  const [guideInput, setGuideInput] = useState("");
  const [carrier, setCarrier] = useState("Inter Rapidísimo");
  const [trackingResult, setTrackingResult] = useState<null | {
    guide: string;
    carrier: string;
    destination: string;
    status: string;
    estimatedDelivery: string;
    steps: { title: string; date: string; description: string; done: boolean }[];
  }>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideInput.trim()) return;

    // Simulated carrier response
    setTrackingResult({
      guide: guideInput.toUpperCase(),
      carrier,
      destination: "Bogotá D.C., Colombia",
      status: "En reparto local hacia tu dirección",
      estimatedDelivery: "Hoy antes de las 6:30 PM",
      steps: [
        {
          title: "Orden confirmada y empacada en bodega",
          date: "Ayer, 09:30 AM",
          description: "Producto verificado con control de calidad y sellado hermético.",
          done: true,
        },
        {
          title: `Recolectado por transportadora (${carrier})`,
          date: "Ayer, 02:45 PM",
          description: "Asignación de guía y manifiesto de carga nacional.",
          done: true,
        },
        {
          title: "En tránsito en centro logístico principal",
          date: "Hoy, 04:15 AM",
          description: "Clasificación de paquete y salida hacia el punto de distribución local.",
          done: true,
        },
        {
          title: "En reparto local con mensajero",
          date: "Hoy, 08:30 AM",
          description: "El paquete va en la camioneta/moto del transportador hacia tu dirección.",
          done: true,
        },
        {
          title: "Entrega exitosa al destinatario",
          date: "Estimado hoy",
          description: "Firma de recibido a satisfacción.",
          done: false,
        },
      ],
    });
  };

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
        <Link href="/" className="hover:text-orange-400 transition-colors">Inicio</Link>
        <span>/</span>
        <span className="text-white font-bold">Rastreo de Pedidos & Guías</span>
      </nav>

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/10">
          <Package className="w-6 h-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
          Rastrea tu Despacho en Tiempo Real
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          Ingresa el número de guía de transportadora que te compartimos por WhatsApp o correo al despachar tu pedido desde nuestra bodega en Bogotá.
        </p>
      </div>

      {/* Search Box */}
      <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8 shadow-2xl mb-10">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            
            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Transportadora
              </label>
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-700 text-xs sm:text-sm rounded-2xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 cursor-pointer"
              >
                <option value="Inter Rapidísimo">Inter Rapidísimo</option>
                <option value="Servientrega">Servientrega</option>
                <option value="Envia">Envia Colvanes</option>
                <option value="Coordinadora">Coordinadora</option>
              </select>
            </div>

            <div className="sm:col-span-8">
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Número de Guía
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  required
                  value={guideInput}
                  onChange={(e) => setGuideInput(e.target.value)}
                  placeholder="Ej: 70008492019 / INT-948271"
                  className="w-full bg-neutral-950 border border-neutral-700 text-xs sm:text-sm rounded-2xl pl-4 pr-32 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 font-mono uppercase"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black text-xs uppercase px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Rastrear</span>
                </button>
              </div>
            </div>

          </div>
          <p className="text-[11px] text-neutral-500 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
            <span>¿No tienes tu guía? Escríbenos a WhatsApp con tu nombre y te la compartimos al instante.</span>
          </p>
        </form>
      </div>

      {/* Result Display */}
      {trackingResult && (
        <div className="rounded-3xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95">
          
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                  GUÍA: {trackingResult.guide}
                </span>
                <span className="text-xs text-neutral-400 font-semibold">• {trackingResult.carrier}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase">
                {trackingResult.status}
              </h2>
            </div>
            <div className="sm:text-right p-3 rounded-2xl bg-neutral-950 border border-neutral-800">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Entrega Estimada</span>
              <strong className="text-sm font-bold text-emerald-400">{trackingResult.estimatedDelivery}</strong>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-6 pt-2">
            {trackingResult.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4 relative">
                
                {/* Line connector */}
                {idx < trackingResult.steps.length - 1 && (
                  <div
                    className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-[1px] ${
                      step.done ? "bg-emerald-500" : "bg-neutral-800"
                    }`}
                  />
                )}

                {/* Circle Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                    step.done
                      ? "bg-emerald-500 text-neutral-950 shadow-lg shadow-emerald-500/25"
                      : "bg-neutral-800 text-neutral-500 border border-neutral-700"
                  }`}
                >
                  {step.done ? (
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                </div>

                {/* Step Info */}
                <div className="flex-1 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className={`text-sm font-bold ${step.done ? "text-white" : "text-neutral-400"}`}>
                      {step.title}
                    </h3>
                    <span className="text-[11px] font-mono text-neutral-500">{step.date}</span>
                  </div>
                  <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>

              </div>
            ))}
          </div>

          {/* Help Footer */}
          <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-neutral-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
              <span>¿Tienes dudas con la entrega de tu paquete?</span>
            </div>
            <a
              href={`https://wa.me/573000000000?text=Hola%20Gordo%20Ryders,%20deseo%20soporte%20sobre%20mi%20guía%20${trackingResult.guide}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors flex items-center gap-2 border border-neutral-700"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Contactar Soporte de Envíos</span>
            </a>
          </div>

        </div>
      )}

    </div>
  );
}
