import { ShieldCheck, Truck, CreditCard, Headphones } from "lucide-react";

export default function TrustBadges() {
  const perks = [
    {
      icon: Truck,
      title: "Envíos a Toda Colombia",
      desc: "Servientrega, Inter Rapidísimo y Envía con número de guía.",
    },
    {
      icon: ShieldCheck,
      title: "Calidad y Garantía",
      desc: "Productos 100% originales con garantía directa de fábrica.",
    },
    {
      icon: CreditCard,
      title: "Pagos 100% Seguros",
      desc: "Integración protegida por Wompi y Mercado Pago (PSE, Tarjetas, Nequi).",
    },
    {
      icon: Headphones,
      title: "Soporte de Motero a Motero",
      desc: "Te asesoramos en la elección exacta de tu talla antes del despacho.",
    },
  ];

  return (
    <section className="bg-neutral-900 border-b border-neutral-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((perk, i) => {
            const Icon = perk.icon;
            return (
              <div key={i} className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-orange-600/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    {perk.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-normal">
                    {perk.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
