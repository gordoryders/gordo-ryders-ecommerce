"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Truck,
  Building2
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    subject: "Asesoría de Producto",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(
      `Hola Gordo Ryders, contacto desde la web:\n\nNombre: ${formData.name}\nTeléfono: ${formData.phone}\nCiudad: ${formData.city}\nMotivo: ${formData.subject}\nMensaje: ${formData.message}`
    );
    window.open(`https://wa.me/573000000000?text=${text}`, "_blank");
    setSent(true);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400 mb-6">
        <Link href="/" className="hover:text-orange-400 transition-colors">Inicio</Link>
        <span>/</span>
        <span className="text-white font-bold">Contacto & Bodega Principal</span>
      </nav>

      {/* Header Banner */}
      <div className="mb-10 text-center sm:text-left">
        <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
          Atención Directa & Bodega de Despachos
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight mt-3">
          Contacto Oficial Gordo Ryders
        </h1>
        <p className="text-sm text-neutral-400 max-w-2xl mt-2 leading-relaxed">
          Encuentra nuestros canales oficiales de WhatsApp para atención minorista y mayorista, la ubicación de nuestra bodega física en Bogotá y el formulario de contacto directo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Direct Channels & Information (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 1: WhatsApp Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Retail WhatsApp */}
            <div className="p-5 rounded-3xl bg-neutral-900 border border-emerald-900/60 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Línea de Ventas & Asesoría</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Resuelve dudas sobre tallas de guantes y cascos antes de despachar.
                </p>
                <p className="text-sm font-mono font-bold text-emerald-400 mt-3">
                  +57 300 000 0000
                </p>
              </div>
              <a
                href="https://wa.me/573000000000?text=Hola%20Gordo%20Ryders,%20necesito%20asesoría%20sobre%20un%20producto"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase py-2.5 rounded-xl text-center block transition-colors"
              >
                Chatear con Asesor →
              </a>
            </div>

            {/* Wholesale B2B WhatsApp */}
            <div className="p-5 rounded-3xl bg-neutral-900 border border-orange-900/60 shadow-xl flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-orange-500/15 text-orange-400 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Atención Mayoristas B2B</h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Contacto directo con Edwin Bernal para cotizaciones por docenas y distribución.
                </p>
                <p className="text-sm font-mono font-bold text-orange-400 mt-3">
                  Ventas al por mayor
                </p>
              </div>
              <a
                href="https://wa.me/573000000000?text=Hola%20Edwin,%20deseo%20comprar%20por%20mayor%20para%20mi%20almacén"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black text-xs uppercase py-2.5 rounded-xl text-center block transition-colors"
              >
                Hablar con Edwin Bernal →
              </a>
            </div>

          </div>

          {/* Card 2: Physical Warehouse & Logistics */}
          <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-xl space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-2xl bg-neutral-800 text-orange-400 flex items-center justify-center shrink-0 mt-1">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Bodega Principal y Centro de Despachos</h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Bogotá D.C., Colombia • Corredor comercial motero. Desde aquí se realizan las inspecciones de calidad, embalaje y despachos diarios por Inter Rapidísimo, Servientrega y Envia.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-neutral-800/80 text-xs">
              <div className="flex items-center gap-2.5 text-neutral-300">
                <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>Lunes a Sábado: 8:00 AM – 6:30 PM</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-300">
                <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>contacto@gordoryders.com</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-300">
                <Truck className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>Corte de despachos: 3:00 PM todos los días</span>
              </div>
              <div className="flex items-center gap-2.5 text-neutral-300">
                <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                <span>Bogotá D.C., Cundinamarca</span>
              </div>
            </div>
          </div>

          {/* Card 3: Interactive Google Maps Embed */}
          <div className="rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-bold text-white">Ubicación Geográfica Bogotá</span>
              </div>
              <span className="text-[10px] text-neutral-400">Sector Repuestos y Accesorios</span>
            </div>
            <div className="w-full h-64 bg-neutral-950 relative">
              <iframe
                title="Ubicación Bogotá Gordo Ryders"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127244.60946252906!2d-74.1531818!3d4.6482837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9bfd2da6cb29%3A0x239d635520a33914!2zQm9nb3TDoSwgQ29sb21iaWE!5e0!3m2!1ses!2sco!4v1700000000000!5m2!1es!2sco"
                className="w-full h-full border-0 filter grayscale invert contrast-125 opacity-85"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>

        {/* Right Column: Direct Contact Form (5 cols) */}
        <div className="lg:col-span-5">
          <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl sticky top-24">
            
            <div className="mb-6">
              <h2 className="text-xl font-black uppercase text-white">Envíanos un Mensaje</h2>
              <p className="text-xs text-neutral-400 mt-1">
                Completa tus datos y nos pondremos en contacto contigo de inmediato vía WhatsApp o correo.
              </p>
            </div>

            {sent ? (
              <div className="p-6 rounded-2xl bg-emerald-950/40 border border-emerald-600/40 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">¡Mensaje Enviado con Éxito!</h4>
                <p className="text-xs text-emerald-300/80">
                  Hemos abierto tu chat de WhatsApp con la información lista para atenderte.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-xs font-bold text-orange-400 underline pt-2 block mx-auto"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Carlos Mendoza"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Número de WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="300 123 4567"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                      Ciudad / Municipio *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Ej. Medellín"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Motivo de Consulta
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-orange-500 transition-colors cursor-pointer"
                  >
                    <option value="Asesoría de Producto">Asesoría de producto o tallas</option>
                    <option value="Cotización Mayorista B2B">Cotización para almacén (Mayoristas)</option>
                    <option value="Estado de mi Despacho">Estado de mi pedido / Guía de envío</option>
                    <option value="Garantías y Cambios">Garantía o cambio de talla</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Mensaje o Producto de Interés
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Cuéntanos qué producto necesitas o cualquier inquietud..."
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar Consulta Directa</span>
                </button>

              </form>
            )}

            <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center gap-3 text-[11px] text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Gordo Ryders garantiza la confidencialidad de tus datos de contacto.</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
