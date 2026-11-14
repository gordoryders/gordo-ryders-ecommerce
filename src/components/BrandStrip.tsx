export default function BrandStrip() {
  const brands = [
    { name: "ICH HELMETS", tag: "Línea Oficial Inducascos" },
    { name: "PROVIKER", tag: "Protección Urbana" },
    { name: "SHAFT PRO", tag: "Cascos Certificados" },
    { name: "HRO HELMETS", tag: "Corazas Termoplásticas" },
    { name: "LS2 HELMETS", tag: "Homologación ECE" },
    { name: "MT HELMETS", tag: "Tecnología Europea" },
  ];

  return (
    <section className="bg-neutral-900/60 border-b border-neutral-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400 text-center mb-6">
          Distribuidor Autorizado de Marcas Oficiales
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center">
          {brands.map((b) => (
            <div
              key={b.name}
              className="bg-neutral-900 border border-neutral-800 hover:border-neutral-700 p-4 rounded-xl text-center group transition-all"
            >
              <span className="text-sm font-black text-white group-hover:text-orange-400 tracking-wider block transition-colors">
                {b.name}
              </span>
              <span className="text-[10px] text-neutral-400 block mt-0.5">
                {b.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
