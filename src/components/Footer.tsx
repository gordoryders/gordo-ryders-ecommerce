import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-black text-neutral-950 text-sm">
                GR
              </div>
              <span className="text-lg font-black text-white tracking-wider uppercase">
                GORDO <span className="text-orange-500">RYDERS</span>
              </span>
            </div>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Especialistas en equipamiento, accesorios y seguridad para motociclistas. Distribución minorista y venta mayorista para almacenes en todo el territorio nacional.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram SVG */}
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-orange-400 hover:border-orange-500 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              {/* Facebook SVG */}
              <a href="#" className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-orange-400 hover:border-orange-500 transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Categorías Populares
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link href="#cascos" className="hover:text-orange-400 transition-colors">Cascos Integrales y Abatibles</Link></li>
              <li><Link href="#guantes" className="hover:text-orange-400 transition-colors">Guantes Proviker Ref E44</Link></li>
              <li><Link href="#impermeables" className="hover:text-orange-400 transition-colors">Impermeables de Alta Resistencia</Link></li>
              <li><Link href="#protecciones" className="hover:text-orange-400 transition-colors">Rodilleras y Protecciones Urbanas</Link></li>
              <li><Link href="#accesorios" className="hover:text-orange-400 transition-colors">Portacelulares y Maleteros</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Atención & Compras
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Cómo comprar online</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Políticas de garantía y cambios</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Tiempos y costos de envío</a></li>
              <li><a href="#mayoristas" className="hover:text-orange-400 transition-colors">Condiciones para mayoristas</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Seguimiento de pedidos con guía</a></li>
            </ul>
          </div>

          {/* Col 4: Physical Location & Contacts */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Punto Físico y Contacto
            </h4>
            <div className="flex items-start gap-2 text-[11px]">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>Bogotá, Colombia • Sede física y bodega de despachos</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>WhatsApp Ventas: +57 300 000 0000</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <span>contacto@gordoryders.com</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <Clock className="w-4 h-4 text-neutral-500 shrink-0" />
              <span>Lunes a Sábado: 8:00 AM - 6:30 PM</span>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Payments */}
        <div className="mt-10 pt-6 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-neutral-500">
          <p>© 2026 Gordo Ryders. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            <span>Pagos seguros procesados con:</span>
            <span className="font-bold text-neutral-300">Wompi (Bancolombia)</span>
            <span>•</span>
            <span className="font-bold text-neutral-300">Mercado Pago</span>
            <span>•</span>
            <span className="font-bold text-neutral-300">PSE / Nequi</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
