import Link from "next/link";

interface CategoryItem {
  name: string;
  emoji: string;
  href: string;
  count: string;
}

export default function CategoryBubbles() {
  const categories: CategoryItem[] = [
    { name: "Cascos", emoji: "🪖", href: "#cascos", count: "+80 refs" },
    { name: "Guantes", emoji: "🧤", href: "#guantes", count: "+65 refs" },
    { name: "Impermeables", emoji: "🌧️", href: "#impermeables", count: "+35 refs" },
    { name: "Chaquetas", emoji: "🧥", href: "#chaquetas", count: "+40 refs" },
    { name: "Protecciones", emoji: "🛡️", href: "#protecciones", count: "+50 refs" },
    { name: "Accesorios", emoji: "📱", href: "#accesorios", count: "+70 refs" },
    { name: "Mayoristas", emoji: "📦", href: "#mayoristas", count: "Precios B2B" },
  ];

  return (
    <section className="bg-neutral-900/40 border-b border-neutral-800 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-neutral-400">
            Explorar por Categoría
          </h2>
          <span className="text-[11px] text-orange-400 font-bold hover:underline cursor-pointer">
            Ver todas las categorías →
          </span>
        </div>

        {/* Horizontal scrollable bubbles */}
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="flex flex-col items-center gap-2 group shrink-0"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-neutral-900 border border-neutral-700/80 group-hover:border-orange-500 group-hover:scale-105 transition-all flex items-center justify-center text-2xl sm:text-3xl shadow-md group-hover:shadow-orange-500/10">
                {cat.emoji}
              </div>
              <div className="text-center">
                <span className="text-xs font-bold text-neutral-200 group-hover:text-orange-400 block transition-colors">
                  {cat.name}
                </span>
                <span className="text-[10px] text-neutral-500 font-medium block">
                  {cat.count}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
