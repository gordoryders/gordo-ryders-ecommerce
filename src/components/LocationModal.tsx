"use client";

import { useState } from "react";
import { MapPin, X, Check } from "lucide-react";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: string;
  onSelectCity: (city: string) => void;
}

export default function LocationModal({
  isOpen,
  onClose,
  currentCity,
  onSelectCity,
}: LocationModalProps) {
  if (!isOpen) return null;

  const popularCities = [
    { city: "Bogotá D.C.", dept: "Cundinamarca", delivery: "Mismo día o 24 hrs" },
    { city: "Medellín", dept: "Antioquia", delivery: "24 a 48 hrs" },
    { city: "Cali", dept: "Valle del Cauca", delivery: "24 a 48 hrs" },
    { city: "Barranquilla", dept: "Atlántico", delivery: "48 a 72 hrs" },
    { city: "Bucaramanga", dept: "Santander", delivery: "24 a 48 hrs" },
    { city: "Pereira", dept: "Risaralda", delivery: "24 a 48 hrs" },
    { city: "Cartagena", dept: "Bolívar", delivery: "48 a 72 hrs" },
    { city: "Ibagué", dept: "Tolima", delivery: "24 a 48 hrs" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-md w-full p-6 text-white relative shadow-2xl animate-in fade-in zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-xl hover:bg-neutral-800 transition-colors"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Elige tu ubicación de entrega</h3>
            <p className="text-xs text-neutral-400">
              Calculamos tiempos de entrega y tarifas de despacho para tu ciudad
            </p>
          </div>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1 mt-4 scrollbar-thin">
          {popularCities.map((item) => {
            const isSelected = currentCity.toLowerCase().includes(item.city.toLowerCase());
            return (
              <button
                key={item.city}
                onClick={() => {
                  onSelectCity(item.city);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? "bg-orange-500/10 border-orange-500 text-white"
                    : "bg-neutral-950/60 border-neutral-800 hover:border-neutral-700 text-neutral-300"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white">{item.city}</span>
                    <span className="text-[10px] text-neutral-500">{item.dept}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium block mt-0.5">
                    ⚡ Entrega estimada: {item.delivery}
                  </span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-orange-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-neutral-800/80 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>🇨🇴 Despachos a todos los municipios</span>
          <span className="text-orange-400 font-bold">Inter / Servientrega</span>
        </div>

      </div>
    </div>
  );
}
