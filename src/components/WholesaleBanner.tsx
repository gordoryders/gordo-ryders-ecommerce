import Link from "next/link";
import { Building2, MessageCircle, Truck, Percent, CheckCircle, Calculator } from "lucide-react";

export default function WholesaleBanner() {
  return (
    <section id="mayoristas" className="py-12 bg-neutral-950 border-y border-neutral-800 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 border border-neutral-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <Building2 className="w-3.5 h-3.5" />
                <span>Canal Corporativo & Distribuidores</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
                ¿Tienes almacén de motos o eres distribuidor?
              </h2>

              <p className="text-sm text-neutral-300 max-w-2xl leading-relaxed">
                Accede a nuestra lista oficial de precios mayoristas en cascos certificados, guantes Proviker y accesorios con descuentos por volumen a partir de 6 o 12 unidades.
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-neutral-300 font-semibold">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Márgenes de ganancia hasta 45%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Despachos a nivel nacional</span>
                </div>
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Facturación y catálogo en PDF</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center lg:border-l lg:border-neutral-700/70 lg:pl-8 space-y-2.5">
              <span className="text-xs text-neutral-400 font-medium">
                Atención personalizada con Edwin Bernal
              </span>
              <Link
                href="/mayoristas"
                className="w-full bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black py-3.5 px-6 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-xl shadow-orange-500/10 transition-all uppercase tracking-wider"
              >
                <Calculator className="w-4 h-4" />
                <span>Simulador de Rentabilidad B2B</span>
              </Link>
              <a
                href="https://wa.me/573000000000?text=Hola%20Edwin,%20deseo%20solicitar%20el%20catálogo%20mayorista%20y%20lista%20de%20precios"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 border border-neutral-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Pedir Catálogo por WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
