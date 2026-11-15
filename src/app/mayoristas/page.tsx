"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { 
  Building2, 
  ShieldCheck, 
  Truck, 
  Calculator, 
  Download, 
  MessageCircle, 
  CheckCircle2, 
  ChevronRight, 
  Package, 
  FileText, 
  BadgePercent, 
  Sparkles, 
  AlertCircle, 
  ShoppingCart, 
  Printer, 
  X, 
  Search, 
  Phone,
  Flame,
  Award,
  Layers
} from "lucide-react";

export default function MayoristasPage() {
  const { products, addToCart, currentUser, requestWholesaleAccount, setIsProfileModalOpen, setIsAuthModalOpen } = useStore();

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Matrix of selected quantities: { [productId]: quantity }
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({
    "ich-3110-ts": 2,
    "ich-3110-ktm": 2,
    "ich-3110-fluor": 2,
  });

  // Modal for formal printable quotation
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);

  // Form for B2B distributor registration
  const [b2bName, setB2bName] = useState("");
  const [b2bType, setB2bType] = useState<"almacen_repuestos" | "taller_motos" | "tienda_accesorios" | "concesionario" | "distribuidor_digital">("almacen_repuestos");
  const [b2bNit, setB2bNit] = useState("");
  const [b2bCity, setB2bCity] = useState("Bogotá D.C.");
  const [b2bPhone, setB2bPhone] = useState("");
  const [b2bAddress, setB2bAddress] = useState("");
  const [b2bSuccess, setB2bSuccess] = useState(false);

  const formatCOP = (num: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(num);

  // Calculate total units selected
  const totalUnits = useMemo(() => {
    return Object.values(quantities).reduce((sum, q) => sum + (q || 0), 0);
  }, [quantities]);

  // Determine wholesale discount tier based on totalUnits (Starting at 6 units)
  const currentTier = useMemo(() => {
    if (totalUnits >= 24) return { tier: 3, label: "Caja Máster VIP (-42%)", factor: 0.58, min: 24 };
    if (totalUnits >= 12) return { tier: 2, label: "Tarifa Docena (-35%)", factor: 0.65, min: 12 };
    if (totalUnits >= 6) return { tier: 1, label: "Tarifa Mayorista Base (-28%)", factor: 0.72, min: 6 };
    return { tier: 0, label: "Tarifa Detal (Sin descuento)", factor: 1.0, min: 0 };
  }, [totalUnits]);

  // Helper to calculate unit wholesale price based on current tier
  const getProductWholesalePrice = (product: (typeof products)[0]) => {
    if (totalUnits < 6) return product.price_retail;
    if (currentTier.tier === 3) {
      return product.price_wholesale ? Math.round(product.price_wholesale * 0.90) : Math.round(product.price_retail * 0.58);
    }
    if (currentTier.tier === 2) {
      return product.price_wholesale ? Math.round(product.price_wholesale * 0.95) : Math.round(product.price_retail * 0.65);
    }
    // Tier 1 (6-11 units)
    return product.price_wholesale || Math.round(product.price_retail * 0.72);
  };

  // Calculations for total retail, total wholesale and profit
  const orderSummary = useMemo(() => {
    let totalRetail = 0;
    let totalWholesale = 0;
    const itemsList: { product: (typeof products)[0]; quantity: number; unitPrice: number; subtotal: number }[] = [];

    products.forEach((p) => {
      const q = quantities[p.id] || 0;
      if (q > 0) {
        const unitWholesale = getProductWholesalePrice(p);
        totalRetail += p.price_retail * q;
        totalWholesale += unitWholesale * q;
        itemsList.push({
          product: p,
          quantity: q,
          unitPrice: unitWholesale,
          subtotal: unitWholesale * q,
        });
      }
    });

    const netProfit = totalRetail - totalWholesale;
    const profitMargin = totalRetail > 0 ? Math.round((netProfit / totalRetail) * 100) : 0;

    return {
      totalRetail,
      totalWholesale,
      netProfit,
      profitMargin,
      itemsList,
    };
  }, [products, quantities, currentTier, totalUnits]);

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleSetExactQuantity = (productId: string, val: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, val),
    }));
  };

  // Quick Starter Pack Selection
  const applyStarterPack = (packType: "cascos" | "urbano" | "lluvia") => {
    if (packType === "cascos") {
      setQuantities({
        "ich-3110-ts": 2,
        "ich-3110-ktm": 2,
        "ich-3110-fluor": 2,
      });
    } else if (packType === "urbano") {
      setQuantities({
        "ich-501-lila": 2,
        "ich-501-beige": 2,
        "ich-501-negro": 2,
        "proviker-e44": 6,
      });
    } else if (packType === "lluvia") {
      setQuantities({
        "imp-siliconado": 10,
        "soporte-cnc": 6,
      });
    }
  };

  const handleAddAllToCart = () => {
    if (totalUnits < 6) {
      alert("Para compras mayoristas el pedido mínimo es de 6 unidades.");
      return;
    }
    orderSummary.itemsList.forEach((item) => {
      addToCart(item.product, "L", "Mayorista", item.quantity);
    });
  };

  const handleSendWhatsAppOrder = () => {
    if (totalUnits < 6) {
      alert("Para acceder a precio mayorista debes sumar al menos 6 unidades.");
      return;
    }

    const itemsText = orderSummary.itemsList
      .map((item) => `• ${item.quantity}x ${item.product.name} — ${formatCOP(item.subtotal)}`)
      .join("\n");

    const message = encodeURIComponent(
      `Hola Edwin Bernal, deseo realizar un pedido mayorista B2B para mi almacén:\n\n` +
      `📦 RESUMEN DEL PEDIDO (${totalUnits} Unidades - ${currentTier.label}):\n` +
      `${itemsText}\n\n` +
      `💰 Total Inversión Mayorista: ${formatCOP(orderSummary.totalWholesale)}\n` +
      `📈 Ganancia Estimada en Venta: ${formatCOP(orderSummary.netProfit)} (+${orderSummary.profitMargin}%)\n\n` +
      `¿Me confirmas disponibilidad de bodega y cuenta para transferencia?`
    );

    window.open(`https://wa.me/573000000000?text=${message}`, "_blank");
  };

  const handleRegisterB2B = (e: React.FormEvent) => {
    e.preventDefault();
    if (!b2bName || !b2bPhone || !b2bCity) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    requestWholesaleAccount({
      businessName: b2bName,
      businessType: b2bType,
      nitOrRut: b2bNit,
      city: b2bCity,
      phone: b2bPhone,
      addressOrSocial: b2bAddress,
    });
    setB2bSuccess(true);
    setTimeout(() => setB2bSuccess(false), 3500);
  };

  // Filter products for the table
  const filteredProducts = products.filter((p) => {
    const matchesCat = categoryFilter === "all" || p.category_id === categoryFilter || (categoryFilter === "cascos" && p.name.toLowerCase().includes("casco"));
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400">
        <Link href="/" className="hover:text-orange-400 transition-colors">Inicio</Link>
        <span>/</span>
        <span className="text-white font-bold">Canal Mayoristas & Distribuidores B2B</span>
      </nav>

      {/* =========================================================================
          HERO BANNER B2B
          ========================================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950/60 border border-amber-500/30 p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
              <span>👑</span>
              <span>Canal Oficial de Fábrica • Desde 6 Unidades</span>
            </span>
            {currentUser?.b2bStatus === "aprobado" && (
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                ✓ Tu Cuenta B2B está Activa ({currentUser.b2bCode})
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight leading-tight">
            Suministro Mayorista <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Gordo Ryders</span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
            Abastécete directamente con Edwin Bernal para tu almacén o taller de motos. Accede a precios de fábrica en cascos certificados ICH 3110 y 501, guantes Proviker E44 e impermeables siliconados de alta rotación nacional.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#matriz-pedidos"
              className="bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-600/25 flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Armar Pedido al por Mayor (Desde 6 unds)</span>
            </a>

            <button
              onClick={() => {
                if (!currentUser) setIsAuthModalOpen(true);
                else setIsProfileModalOpen(true);
              }}
              className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase px-5 py-3.5 rounded-xl transition-colors border border-neutral-700 flex items-center gap-2 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>{currentUser?.b2bStatus === "aprobado" ? "Ver Mi Código Distribuidor" : "Solicitar Cuenta Distribuidor B2B"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          LAS 3 ESCALAS DE PRECIO MAYORISTA (TIERS B2B)
          ========================================================================= */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">
            Regla de Negocio Transparente
          </span>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-white">
            Escalas de Descuento por Volumen
          </h2>
          <p className="text-xs text-neutral-400">
            Puedes surtir diferentes referencias y tallas; el descuento se aplica automáticamente sobre la suma total de unidades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* TIER 1 */}
          <div className={`p-6 rounded-3xl border transition-all ${
            currentTier.tier === 1 
              ? "bg-neutral-900 border-orange-500 shadow-xl shadow-orange-500/10 ring-1 ring-orange-500" 
              : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700"
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-xs font-black text-white uppercase">Nivel 1: Inicio</span>
              <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full">
                6 a 11 Unidades
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-2xl font-black text-white font-mono">-28% <span className="text-xs font-normal text-neutral-400">vs Detal</span></div>
              <p className="text-xs text-neutral-300 font-semibold">Tarifa Mayorista de Bodega</p>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Ideal para almacenes pequeños que desean probar la rotación de cascos ICH y guantes Proviker sin sobre-stockearse.
              </p>
            </div>
          </div>

          {/* TIER 2 */}
          <div className={`p-6 rounded-3xl border transition-all relative ${
            currentTier.tier === 2 
              ? "bg-neutral-900 border-amber-500 shadow-xl shadow-amber-500/15 ring-1 ring-amber-500" 
              : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700"
          }`}>
            <div className="absolute -top-3 right-6 bg-amber-500 text-neutral-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Más Solicitado
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-xs font-black text-white uppercase">Nivel 2: Docena</span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                12 a 23 Unidades
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-2xl font-black text-amber-400 font-mono">-35% <span className="text-xs font-normal text-neutral-400">vs Detal</span></div>
              <p className="text-xs text-white font-bold">Tarifa Distribuidor Preferente</p>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Margen comercial óptimo (+45% bruto) para mantener stock completo de tallas M, L y XL en mostrador.
              </p>
            </div>
          </div>

          {/* TIER 3 */}
          <div className={`p-6 rounded-3xl border transition-all ${
            currentTier.tier === 3 
              ? "bg-neutral-900 border-emerald-500 shadow-xl shadow-emerald-500/15 ring-1 ring-emerald-500" 
              : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700"
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-xs font-black text-white uppercase">Nivel 3: Caja Máster</span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                24+ Unidades
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-2xl font-black text-emerald-400 font-mono">-42% <span className="text-xs font-normal text-neutral-400">vs Detal</span></div>
              <p className="text-xs text-white font-bold">Tarifa Máster Fábrica VIP</p>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Tarifa máxima para mayoristas regionales. Incluye 50% de flete subsidiado por transportadora de carga pesada.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          STARTER PACKS B2B (PACKS DE ARRANQUE LISTOS)
          ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              <span>Surtidos de Rápida Rotación</span>
            </span>
            <h3 className="text-lg font-black uppercase text-white mt-1">
              Packs de Arranque B2B Pre-armados (1 Clic)
            </h3>
            <p className="text-xs text-neutral-400">
              Si no quieres seleccionar referencia por referencia, carga un combo probado directamente a tu cotizador:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* PACK 1 */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-orange-500/50 transition-all space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                6 Unidades Surtidas
              </span>
              <h4 className="text-sm font-black text-white mt-2">Pack Top Ventas Cascos ICH 3110</h4>
              <p className="text-xs text-neutral-400 mt-1">
                2x Top Speed + 2x Racing Orange + 2x Flúor Yellow (Tallas 2M, 3L, 1XL).
              </p>
            </div>
            <div className="pt-2 border-t border-neutral-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 block">Inversión Aprox:</span>
                <strong className="text-xs text-emerald-400 font-mono font-bold">{formatCOP(1099000)}</strong>
              </div>
              <button
                type="button"
                onClick={() => applyStarterPack("cascos")}
                className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cargar Pack
              </button>
            </div>
          </div>

          {/* PACK 2 */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-orange-500/50 transition-all space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                12 Unidades Surtidas
              </span>
              <h4 className="text-sm font-black text-white mt-2">Pack Vitrina Ciudad Scooter</h4>
              <p className="text-xs text-neutral-400 mt-1">
                6x Cascos ICH 501 Jet (Lila, Beige, Mate) + 6x Guantes Proviker E44 Touch.
              </p>
            </div>
            <div className="pt-2 border-t border-neutral-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 block">Inversión Aprox:</span>
                <strong className="text-xs text-emerald-400 font-mono font-bold">{formatCOP(1050000)}</strong>
              </div>
              <button
                type="button"
                onClick={() => applyStarterPack("urbano")}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-neutral-950 text-xs font-black transition-colors cursor-pointer"
              >
                Cargar Pack
              </button>
            </div>
          </div>

          {/* PACK 3 */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-orange-500/50 transition-all space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                16 Unidades Surtidas
              </span>
              <h4 className="text-sm font-black text-white mt-2">Pack Clima Extremo Lluvia</h4>
              <p className="text-xs text-neutral-400 mt-1">
                10x Impermeables Enterizos Siliconados con Tula + 6x Soportes Antivibración CNC.
              </p>
            </div>
            <div className="pt-2 border-t border-neutral-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 block">Inversión Aprox:</span>
                <strong className="text-xs text-emerald-400 font-mono font-bold">{formatCOP(1085000)}</strong>
              </div>
              <button
                type="button"
                onClick={() => applyStarterPack("lluvia")}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Cargar Pack
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          MATRIZ DE PEDIDO AL POR MAYOR (DESDE 6 UNIDADES)
          ========================================================================= */}
      <div id="matriz-pedidos" className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-6">
        
        {/* Matrix Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                Constructor de Pedido B2B
              </span>
              <span className="text-xs text-neutral-400 font-mono font-bold">
                Mínimo 6 unidades
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase text-white mt-1">
              Catálogo Mayorista de Bodega
            </h3>
            <p className="text-xs text-neutral-400">
              Modifica las cantidades deseadas para cada referencia. El precio unitario bajará automáticamente según tu escala.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por referencia..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-neutral-950 border border-neutral-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500 w-44 sm:w-56"
              />
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
            >
              <option value="all">Todas las Categorías</option>
              <option value="cascos">Cascos</option>
              <option value="guantes">Guantes</option>
              <option value="impermeables">Impermeables</option>
              <option value="accesorios">Accesorios</option>
            </select>
          </div>
        </div>

        {/* Dynamic Status / Progress Alert */}
        <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          totalUnits >= 6
            ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
            : "bg-amber-950/40 border-amber-500/40 text-amber-300"
        }`}>
          <div className="flex items-center gap-2.5 text-xs">
            {totalUnits >= 6 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            )}
            <div>
              <p className="font-bold">
                {totalUnits >= 6 ? (
                  <span>¡Tarifa Mayorista Activada! ({totalUnits} unidades en tu pedido - {currentTier.label})</span>
                ) : (
                  <span>Llevas {totalUnits} unidades. Agrega {6 - totalUnits} unidades más para activar el precio mayorista.</span>
                )}
              </p>
              <p className="text-[11px] opacity-80 mt-0.5">
                {totalUnits >= 12
                  ? "Estás disfrutando de tarifa preferencial distribuidor."
                  : totalUnits >= 6
                  ? `Suma ${12 - totalUnits} unidades más para desbloquear la Tarifa de Docena (-35%).`
                  : "El precio mayorista se activa a partir de 6 unidades surtidas de cualquier referencia."}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Unidades:</span>
            <span className="text-lg font-black font-mono text-white">{totalUnits} unds</span>
          </div>
        </div>

        {/* Table of Wholesale Items */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400 text-[11px] uppercase tracking-wider">
                <th className="py-3 px-3">Producto / Referencia</th>
                <th className="py-3 px-3 text-center">PVP Detal</th>
                <th className="py-3 px-3 text-center">Precio Mayorista</th>
                <th className="py-3 px-3 text-center">Margen Almacén</th>
                <th className="py-3 px-3 text-center">Cantidad</th>
                <th className="py-3 px-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredProducts.map((p) => {
                const qty = quantities[p.id] || 0;
                const wholesalePrice = getProductWholesalePrice(p);
                const subtotal = wholesalePrice * qty;
                const profitPerUnit = p.price_retail - wholesalePrice;
                const marginPercent = Math.round((profitPerUnit / p.price_retail) * 100);

                return (
                  <tr key={p.id} className="hover:bg-neutral-950/60 transition-colors">
                    
                    {/* Product Name & Image */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                        />
                        <div className="space-y-0.5">
                          <p className="font-bold text-white leading-tight">{p.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                            <span>SKU: {p.sku}</span>
                            <span>•</span>
                            <span className="text-orange-400">{p.specs?.find((s) => s.label.includes("Certificación"))?.value || "DOT / ECE"}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Retail Price */}
                    <td className="py-3 px-3 text-center font-mono text-neutral-400 line-through">
                      {formatCOP(p.price_retail)}
                    </td>

                    {/* Wholesale Unit Price */}
                    <td className="py-3 px-3 text-center font-mono font-bold text-amber-400">
                      {formatCOP(wholesalePrice)}
                    </td>

                    {/* Profit Margin */}
                    <td className="py-3 px-3 text-center font-mono">
                      <span className="text-emerald-400 font-bold">+{marginPercent}%</span>
                      <span className="block text-[10px] text-neutral-500">
                        (+{formatCOP(profitPerUnit)}/u)
                      </span>
                    </td>

                    {/* Quantity Controls */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-1 gap-1">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(p.id, -1)}
                          className="w-7 h-7 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-black text-xs flex items-center justify-center transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="0"
                          value={qty}
                          onChange={(e) => handleSetExactQuantity(p.id, Number(e.target.value))}
                          className="w-10 text-center bg-transparent text-xs text-white font-mono font-bold focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleUpdateQuantity(p.id, 1)}
                          className="w-7 h-7 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-black text-xs flex items-center justify-center transition-colors cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    {/* Subtotal */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-white">
                      {formatCOP(subtotal)}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Matrix Bottom Summary & Action Bar */}
        <div className="pt-6 border-t border-neutral-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-neutral-950/80 p-6 rounded-2xl">
          
          {/* Numbers Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">Total Unidades:</span>
              <strong className="text-lg font-black text-white font-mono">{totalUnits} unds</strong>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-bold block">Valor al Detal (PVP):</span>
              <strong className="text-sm font-bold text-neutral-400 font-mono line-through">{formatCOP(orderSummary.totalRetail)}</strong>
            </div>
            <div>
              <span className="text-[10px] text-amber-400 uppercase font-bold block">Inversión Mayorista:</span>
              <strong className="text-xl font-black text-amber-400 font-mono">{formatCOP(orderSummary.totalWholesale)}</strong>
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 uppercase font-bold block">Ganancia Proyectada:</span>
              <strong className="text-xl font-black text-emerald-400 font-mono">+{formatCOP(orderSummary.netProfit)}</strong>
              <span className="text-[10px] text-emerald-400 block font-bold">(+{orderSummary.profitMargin}% neto)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsQuotationModalOpen(true)}
              className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-2 transition-colors border border-neutral-700 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-orange-400" />
              <span>Cotización Formal (PDF)</span>
            </button>

            <button
              type="button"
              onClick={handleSendWhatsAppOrder}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar Pedido a WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleAddAllToCart}
              className="py-3 px-5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs flex items-center gap-2 transition-colors shadow-md shadow-orange-600/20 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Pagar Pedido Mayorista</span>
            </button>
          </div>

        </div>

      </div>

      {/* =========================================================================
          BENEFICIOS DE DISTRIBUIDOR AUTORIZADO
          ========================================================================= */}
      <div>
        <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
            Respaldo de Marca
          </span>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-white">
            Beneficios Exclusivos para Distribuidores
          </h2>
          <p className="text-xs text-neutral-400">
            No solo te vendemos producto; te ayudamos a vender más rápido con material de apoyo para tu local y tus redes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          
          <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold">
              <Download className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Banco Multimedia 4K</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Fotos y videos profesionales sin marca de agua para publicar en el Instagram, TikTok y estados de WhatsApp de tu negocio.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Homologación y Ley 1080</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Certificados de importación y normas ECE / DOT listos para imprimir y exhibir ante inspecciones de autoridades en tu almacén.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
              <Truck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Fletes de Carga Pesada</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Convenios con TCC, Coordinadora y Envía Carga para que el envío de cajas grandes sea económico y llegue en 24 a 48 horas.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white">Facturación con RUT</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Emitimos factura legal con tu NIT para deducir costos en tu declaración de renta y contabilidad comercial.
            </p>
          </div>

        </div>
      </div>

      {/* =========================================================================
          FORMULARIO DE VINCULACIÓN COMERCIAL B2B
          ========================================================================= */}
      <div className="p-6 sm:p-10 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
              Alianza Comercial
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              Vincula tu Almacén como Distribuidor B2B
            </h3>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Si tienes tienda física, taller mecánico o vendes por catálogo en tu ciudad, regístrate para que Edwin Bernal te asigne un código de distribuidor oficial y te habilite crédito y precios preferenciales.
            </p>
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs text-neutral-400 space-y-1">
              <p className="text-white font-bold">📞 Atención Comercial Mayorista:</p>
              <p>Edwin Bernal • Coordinador Canal Distribuidores</p>
              <p className="text-orange-400 font-mono">WhatsApp: +57 300 000 0000</p>
            </div>
          </div>

          <form onSubmit={handleRegisterB2B} className="lg:col-span-7 space-y-4 bg-neutral-950 p-6 rounded-3xl border border-neutral-800">
            <h4 className="text-sm font-black text-white uppercase pb-2 border-b border-neutral-800">
              Formulario de Solicitud de Distribuidor
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Nombre Comercial del Almacén o Taller *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Repuestos & Motos El Paisa"
                  value={b2bName}
                  onChange={(e) => setB2bName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Tipo de Negocio *
                </label>
                <select
                  value={b2bType}
                  onChange={(e) => setB2bType(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="almacen_repuestos">Almacén de Repuestos & Accesorios</option>
                  <option value="taller_motos">Taller Mecánico de Motos</option>
                  <option value="tienda_accesorios">Tienda Especializada de Cascos</option>
                  <option value="concesionario">Concesionario de Motos</option>
                  <option value="distribuidor_digital">Venta por Catálogo / Redes</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  NIT o Cédula Comercial
                </label>
                <input
                  type="text"
                  placeholder="Ej: 900.849.201-4"
                  value={b2bNit}
                  onChange={(e) => setB2bNit(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Ciudad o Municipio *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Medellín, Cali..."
                  value={b2bCity}
                  onChange={(e) => setB2bCity(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  WhatsApp Directo *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="310 123 4567"
                  value={b2bPhone}
                  onChange={(e) => setB2bPhone(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                Dirección del Local Físico o Instagram de la Tienda
              </label>
              <input
                type="text"
                placeholder="Ej: Calle 33 # 45-12 / @motoselpaisa"
                value={b2bAddress}
                onChange={(e) => setB2bAddress(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              {b2bSuccess ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Solicitud enviada a revisión con Edwin Bernal!</span>
                </span>
              ) : (
                <span className="text-[11px] text-neutral-400">
                  Respuesta comercial en menos de 2 horas.
                </span>
              )}

              <button
                type="submit"
                className="py-2.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
              >
                <span>Solicitar Código Mayorista</span>
              </button>
            </div>
          </form>

        </div>
      </div>

      {/* =========================================================================
          MODAL: COTIZACIÓN FORMAL IMPRIMIBLE / PDF
          ========================================================================= */}
      {isQuotationModalOpen && (
        <div className="fixed inset-0 z-[999999] min-h-[100dvh] w-screen flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl my-auto animate-in fade-in zoom-in-95 space-y-6">
            
            <button
              onClick={() => setIsQuotationModalOpen(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Quote Header */}
            <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-600 font-black text-neutral-950 text-sm flex items-center justify-center">
                    GR
                  </div>
                  <h3 className="text-lg font-black uppercase text-white">
                    Gordo Ryders Colombia
                  </h3>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Distribuidora Mayorista de Cascos & Accesorios Moteros • NIT 900.849.201-4
                </p>
                <p className="text-[10px] text-neutral-500">
                  Bodega Principal: Bogotá D.C. • Despacho Nacional
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-orange-400 block">
                  COT-B2B-2026-{Math.floor(1000 + Math.random() * 9000)}
                </span>
                <span className="text-[10px] text-neutral-400 block">
                  Fecha: {new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date())}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold block">
                  Validez: 15 días calendario
                </span>
              </div>
            </div>

            {/* Recipient */}
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs grid grid-cols-2 gap-2 text-neutral-300">
              <div>
                <span className="text-[10px] uppercase text-neutral-500 font-bold block">Cotizado A:</span>
                <strong>{currentUser?.businessName || currentUser?.name || "Almacén / Comerciante Mayorista"}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-500 font-bold block">Ciudad / Despacho:</span>
                <strong>{currentUser?.city || "A convenir con bodega"}</strong>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 text-[10px] uppercase">
                    <th className="py-2">Ref / Descripción</th>
                    <th className="py-2 text-center">Cant.</th>
                    <th className="py-2 text-right">Precio Bodega</th>
                    <th className="py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                  {orderSummary.itemsList.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 text-white font-semibold">{item.product.name}</td>
                      <td className="py-2 text-center font-mono">{item.quantity}</td>
                      <td className="py-2 text-right font-mono text-neutral-300">{formatCOP(item.unitPrice)}</td>
                      <td className="py-2 text-right font-mono font-bold text-white">{formatCOP(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Total Unidades:</span>
                <strong className="text-white font-mono">{totalUnits} unds</strong>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Escala Aplicada:</span>
                <strong className="text-amber-400 font-semibold">{currentTier.label}</strong>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-neutral-850">
                <span>Total Inversión Neta:</span>
                <span className="text-amber-400 font-mono">{formatCOP(orderSummary.totalWholesale)}</span>
              </div>
            </div>

            {/* Print / WhatsApp actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={() => window.print()}
                className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir / Guardar PDF</span>
              </button>

              <button
                type="button"
                onClick={handleSendWhatsAppOrder}
                className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar a Bodega por WhatsApp</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
