import Link from "next/link";
import { ArrowRight, Flame, Building2, CloudRain } from "lucide-react";

export default function PromoTiles() {
  const promos = [
    {
      id: 1,
      badge: "LANZAMIENTO 2026",
      title: "Cascos Abatibles ICH 3110",
      discount: "DOBLE VISOR DOT",
      desc: "Gafas de sol internas retráctiles, mentonera abatible y homologación estadounidense DOT FMVSS 218.",
      image: "/products/cascos/ich-3110-top-speed.jpg",
      link: "/categoria/cascos",
      icon: Flame,
      badgeColor: "bg-red-600 text-white",
    },
    {
      id: 2,
      badge: "DISTRIBUCIÓN B2B",
      title: "Cascos ICH al por Mayor",
      discount: "DESDE 6 UNIDADES",
      desc: "Abastece tu taller o almacén con cascos ICH 3110 y 501 con margen comercial y factura oficial.",
      image: "/products/cascos/ich-3110-ktm-orange.jpg",
      link: "/mayoristas",
      icon: Building2,
      badgeColor: "bg-emerald-600 text-neutral-950 font-black",
    },
    {
      id: 3,
      badge: "LÍNEA PASTEL & SCOOTER",
      title: "Cascos Urbanos ICH 501",
      discount: "DESDE $155.000 COP",
      desc: "Diseño Jet semi-integral ultraliviano con visor panorámico largo. Tonos lila, beige y negro.",
      image: "/products/cascos/ich-501-lila.jpg",
      link: "/categoria/cascos",
      icon: CloudRain,
      badgeColor: "bg-purple-600 text-white",
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
