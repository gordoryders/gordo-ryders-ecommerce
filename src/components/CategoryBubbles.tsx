import Link from "next/link";

interface CategoryItem {
  name: string;
  image: string;
  href: string;
  subtitle: string;
}

export default function CategoryBubbles() {
  const categories: CategoryItem[] = [
    {
      name: "Cascos",
      image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80",
      href: "/categoria/cascos",
      subtitle: "Certificación ECE",
    },
    {
      name: "Guantes",
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=400&q=80",
      href: "/categoria/guantes",
      subtitle: "Proviker & Cuero",
    },
    {
      name: "Impermeables",
      image: "https://images.unsplash.com/photo-1517846695664-44df0e167232?auto=format&fit=crop&w=400&q=80",
      href: "/categoria/impermeables",
      subtitle: "Siliconados",
    },
    {
      name: "Chaquetas",
      image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=400&q=80",
      href: "/categoria/impermeables",
      subtitle: "Térmicas y CE",
    },
    {
      name: "Protecciones",
      image: "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=400&q=80",
      href: "/categoria/protecciones",
      subtitle: "Rodilleras Acero",
    },
    {
      name: "Accesorios",
      image: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=400&q=80",
      href: "/categoria/accesorios",
      subtitle: "Portacelulares CNC",
    },
  ];

  return (
    <section className="bg-neutral-950 py-8 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base sm:text-lg font-black uppercase text-white tracking-wide">
              Categorías Principales
            </h2>
            <p className="text-xs text-neutral-400">
              Explora las líneas de equipamiento más buscadas por moteros
            </p>
          </div>
          <Link
            href="#catalogo"
            className="text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
          >
            Ver catálogo completo →
          </Link>
        </div>

        {/* Real photo circles with dark border */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex flex-col items-center text-center p-2 rounded-2xl hover:bg-neutral-900 transition-all"
            >
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-neutral-700 group-hover:border-orange-500 group-hover:scale-105 transition-all shadow-lg shadow-black/60 mb-2">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-neutral-950/25 group-hover:bg-transparent transition-colors" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                {cat.name}
              </span>
              <span className="text-[10px] text-neutral-400 font-medium hidden sm:block">
                {cat.subtitle}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
