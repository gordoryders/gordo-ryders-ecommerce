import Link from "next/link";
import { ArrowRight, Flame, Building2, CloudRain } from "lucide-react";

export default function PromoTiles() {
  const promos = [
    {
      id: 1,
      badge: "LIQUIDACIÓN 2026",
      title: "Cascos Shaft y Certificados",
      discount: "HASTA 35% OFF",
      desc: "Modelos abatibles e integrales con doble visor y certificación ECE 22.06.",
      image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
      link: "#catalogo",
      icon: Flame,
      badgeColor: "bg-red-600 text-white",
    },
    {
      id: 2,
      badge: "DISTRIBUCIÓN B2B",
      title: "Precios Mayoristas a Talleres",
      discount: "DESDE 6 UNIDADES",
      desc: "Abastece tu almacén con guantes Proviker, chaquetas y accesorios con margen garantizado.",
      image: "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=800&q=80",
      link: "https://wa.me/573000000000?text=Hola%20Gordo%20Ryders,%20deseo%20el%20catálogo%20mayorista",
      icon: Building2,
      badgeColor: "bg-emerald-600 text-neutral-950 font-black",
    },
    {
      id: 3,
      badge: "TEMPORADA LLUVIAS",
      title: "Impermeables de Alto Calibre",
      discount: "100% SELLADO TÉRMICO",
      desc: "Enterizos y dos piezas con tula de transporte y reflectivos de alta visibilidad nocturna.",
      image: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80",
      link: "#catalogo",
      icon: CloudRain,
      badgeColor: "bg-blue-600 text-white",
    },
  ];

  return (
    <section className="bg-neutral-950 py-10 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promos.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className="relative h-72 rounded-3xl overflow-hidden border border-neutral-800 group shadow-xl flex flex-col justify-end p-6"
              >
                {/* Background Image */}
                <img
                  src={p.image}
                  alt={p.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />

                {/* Content */}
                <div className="relative z-10 space-y-2">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase font-bold px-2.5 py-0.5 rounded shadow ${p.badgeColor}`}>
                    <Icon className="w-3 h-3" />
                    <span>{p.badge}</span>
                  </span>

                  <h3 className="text-xl font-black text-white uppercase leading-tight">
                    {p.title}
                  </h3>

                  <p className="text-orange-400 font-extrabold text-xs uppercase tracking-wider">
                    {p.discount}
                  </p>

                  <p className="text-[11px] text-neutral-300 line-clamp-2">
                    {p.desc}
                  </p>

                  <div className="pt-2">
                    <Link
                      href={p.link}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-orange-400 transition-colors"
                    >
                      <span>Ver promociones</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
