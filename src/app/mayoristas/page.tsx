"use client";

import { useState, useMemo, useEffect } from "react";
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
  AlertCircle, 
  ShoppingCart, 
  X, 
  Search, 
  Phone,
  Flame,
  Award,
  Layers,
  Trash2,
  Filter,
  Check,
  TrendingUp,
  PackageCheck,
  Mail,
  User
} from "lucide-react";

export default function MayoristasPage() {
  const { 
    products, 
    addToCart, 
    setIsCartOpen,
    currentUser, 
    requestWholesaleAccount, 
    setIsProfileModalOpen, 
    setIsAuthModalOpen 
  } = useStore();

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlySelectedFilter, setOnlySelectedFilter] = useState(false);
  
  // Matrix of selected quantities: { [productId]: quantity }
  const [quantities, setQuantities] = useState<{ [productId: string]: number }>({
    "ich-3110-ts": 2,
    "ich-3110-ktm": 2,
    "ich-3110-fluor": 2,
  });

  // Modal for formal printable quotation
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false);

  // Form for B2B distributor registration
  const [b2bEmail, setB2bEmail] = useState(currentUser?.email || "");
  const [b2bContactName, setB2bContactName] = useState(currentUser?.name || "");
  const [b2bName, setB2bName] = useState(currentUser?.businessName || "");
  const [b2bType, setB2bType] = useState<"almacen_repuestos" | "taller_motos" | "tienda_accesorios" | "concesionario" | "distribuidor_digital">("almacen_repuestos");
  const [b2bNit, setB2bNit] = useState(currentUser?.b2bNitOrRut || currentUser?.cedulaOrNit || "");
  const [b2bCity, setB2bCity] = useState(currentUser?.city || "Bogotá D.C.");
  const [b2bPhone, setB2bPhone] = useState(currentUser?.phone || "");
  const [b2bAddress, setB2bAddress] = useState(currentUser?.b2bAddressOrSocial || currentUser?.address || "");
  const [b2bSuccess, setB2bSuccess] = useState(false);

  useEffect(() => {
    if (currentUser?.email && !b2bEmail) setB2bEmail(currentUser.email);
    if (currentUser?.name && !b2bContactName) setB2bContactName(currentUser.name);
    if (currentUser?.businessName && !b2bName) setB2bName(currentUser.businessName);
    if (currentUser?.phone && !b2bPhone) setB2bPhone(currentUser.phone);
    if (currentUser?.city && !b2bCity) setB2bCity(currentUser.city);
    if (currentUser?.b2bNitOrRut && !b2bNit) setB2bNit(currentUser.b2bNitOrRut);
    if (currentUser?.b2bAddressOrSocial && !b2bAddress) setB2bAddress(currentUser.b2bAddressOrSocial);
  }, [currentUser]);

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

  // How many distinct product lines have quantity > 0
  const selectedProductsCount = useMemo(() => {
    return Object.values(quantities).filter((q) => q > 0).length;
  }, [quantities]);

  // Determine wholesale discount tier based on totalUnits (Starting at 6 units)
  const currentTier = useMemo(() => {
    if (totalUnits >= 24) return { tier: 3, label: "Distribuidor Platino VIP (-42%)", factor: 0.58, min: 24, discountPct: 42 };
    if (totalUnits >= 12) return { tier: 2, label: "Tarifa Mayorista Oro (-35%)", factor: 0.65, min: 12, discountPct: 35 };
    if (totalUnits >= 6) return { tier: 1, label: "Tarifa Mayorista Base (-28%)", factor: 0.72, min: 6, discountPct: 28 };
    return { tier: 0, label: "Tarifa Detal (Sin descuento)", factor: 1.0, min: 0, discountPct: 0 };
  }, [totalUnits]);

  // Next tier progress calculation
  const nextTierInfo = useMemo(() => {
    if (totalUnits < 6) {
      return {
        nextLabel: "Mayorista Base (-28%)",
        needed: 6 - totalUnits,
        progress: Math.min(100, Math.round((totalUnits / 6) * 100)),
      };
    }
    if (totalUnits < 12) {
      return {
        nextLabel: "Mayorista Oro (-35%)",
        needed: 12 - totalUnits,
        progress: Math.min(100, Math.round(((totalUnits - 6) / 6) * 100)),
      };
    }
    if (totalUnits < 24) {
      return {
        nextLabel: "Platino VIP (-42%)",
        needed: 24 - totalUnits,
        progress: Math.min(100, Math.round(((totalUnits - 12) / 12) * 100)),
      };
    }
    return {
      nextLabel: "Máxima Escala Alcanzada",
      needed: 0,
      progress: 100,
    };
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

  const handleClearAllQuantities = () => {
    if (confirm("¿Deseas vaciar todas las cantidades seleccionadas?")) {
      setQuantities({});
    }
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
      const wholesaleProduct = {
        ...item.product,
        price_retail: item.unitPrice,
      };
      addToCart(wholesaleProduct, "L", `Mayorista (${currentTier.label})`, item.quantity);
    });
    setIsCartOpen(true);
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
      `Hola Gordo Ryders, deseo cotizar y ordenar el siguiente pedido mayorista B2B para mi almacén:\n\n` +
      `📦 RESUMEN DEL PEDIDO (${totalUnits} Unidades - ${currentTier.label}):\n` +
      `${itemsText}\n\n` +
      `💰 Inversión Neta Mayorista: ${formatCOP(orderSummary.totalWholesale)}\n` +
      `📈 Ganancia Proyectada en Mostrador: ${formatCOP(orderSummary.netProfit)} (+${orderSummary.profitMargin}%)\n\n` +
      `¿Me confirman disponibilidad de bodega y cuenta Bancolombia / Wompi para pago?\n` +
      `Nombre del comercio: ${currentUser?.businessName || currentUser?.name || "Almacén Mayorista"}\n` +
      `Ciudad de despacho: ${currentUser?.city || "Bogotá D.C."}`
    );

    window.open(`https://wa.me/573161492880?text=${message}`, "_blank");
  };

  const handleSaveQuotePDF = () => {
    const originalTitle = document.title;
    document.title = `Cotizacion-Oficial-Mayorista-Gordo-Ryders-${totalUnits}unds-${new Date().toISOString().slice(0, 10)}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  const handleRegisterB2B = (e: React.FormEvent) => {
    e.preventDefault();
    const targetEmail = (b2bEmail || currentUser?.email || "").trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes("@")) {
      alert("Por favor ingresa un correo electrónico corporativo válido.");
      return;
    }
    if (!b2bName || !b2bPhone || !b2bCity) {
      alert("Por favor completa los campos obligatorios del comercio.");
      return;
    }

    requestWholesaleAccount({
      email: targetEmail,
      contactName: b2bContactName || b2bName,
      businessName: b2bName,
      businessType: b2bType,
      nitOrRut: b2bNit,
      city: b2bCity,
      phone: b2bPhone,
      addressOrSocial: b2bAddress,
    });

    setB2bSuccess(true);
  };

  // Filter products for the table
  const filteredProducts = products.filter((p) => {
    if (onlySelectedFilter && (!quantities[p.id] || quantities[p.id] <= 0)) {
      return false;
    }
    const matchesCat = categoryFilter === "all" || p.category_id === categoryFilter || (categoryFilter === "cascos" && p.name.toLowerCase().includes("casco"));
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-neutral-100 font-sans selection:bg-orange-500 selection:text-neutral-950">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-neutral-400">
        <Link href="/" className="hover:text-orange-400 transition-colors">Inicio</Link>
        <span>/</span>
        <span className="text-white font-bold">Canal Mayoristas & Distribuidores B2B</span>
      </nav>

      {/* =========================================================================
          HERO BANNER B2B
          ========================================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-r from-neutral-950 via-neutral-900 to-amber-950/40 border border-amber-500/30 p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5 font-mono">
              <Building2 className="w-3.5 h-3.5" />
              <span>Canal Corporativo B2B • Despacho Nacional Directo</span>
            </span>
            {currentUser?.b2bStatus === "aprobado" && (
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
                ✓ Cuenta B2B Verificada ({currentUser.b2bCode})
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight leading-tight">
            Suministro Mayorista <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Gordo Ryders</span>
          </h1>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-2xl">
            Abastécete directamente con precios de distribuidor para tu almacén o taller de motos. Cascos certificados ICH 3110 y 501 Jet, guantes Proviker E44 e impermeables siliconados de alta rotación nacional con despacho prioritario asegurado.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href="#matriz-pedidos"
              className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 font-black text-xs uppercase px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2 cursor-pointer"
            >
              <Calculator className="w-4 h-4 stroke-[2.5]" />
              <span>Cotizador Mayorista en Vivo (Desde 6 unds)</span>
            </a>

            <button
              onClick={() => {
                if (!currentUser) setIsAuthModalOpen(true);
                else setIsProfileModalOpen(true);
              }}
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase px-5 py-3.5 rounded-2xl transition-colors border border-neutral-700 flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
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
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 font-mono">
            Tarifario Corporativo Transparente
          </span>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide">
            Escalas de Descuento por Volumen
          </h2>
          <p className="text-xs text-neutral-400">
            Puedes combinar y surtir diferentes referencias y tallas; el descuento se aplica automáticamente sobre la suma total de unidades en tu pedido.
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
              <span className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                <span>Nivel 1: Inicio</span>
                {currentTier.tier === 1 && <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />}
              </span>
              <span className="text-xs font-mono font-bold text-orange-400 bg-orange-500/10 px-2.5 py-0.5 rounded-full border border-orange-500/20">
                6 a 11 Unidades
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-2xl font-black text-white font-mono">-28% <span className="text-xs font-normal text-neutral-400">vs Detal</span></div>
              <p className="text-xs text-neutral-200 font-bold">Tarifa Mayorista de Bodega</p>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Ideal para almacenes pequeños o talleres que desean probar la rotación de cascos ICH y accesorios sin sobre-inventariarse.
              </p>
            </div>
          </div>

          {/* TIER 2 */}
          <div className={`p-6 rounded-3xl border transition-all relative ${
            currentTier.tier === 2 
              ? "bg-neutral-900 border-amber-500 shadow-xl shadow-amber-500/15 ring-1 ring-amber-500" 
              : "bg-neutral-900/60 border-neutral-800 hover:border-neutral-700"
          }`}>
            <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-orange-500 text-neutral-950 text-[10px] font-black px-3 py-0.5 rounded-full uppercase tracking-wider shadow">
              Más Solicitado
            </div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <span className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                <span>Nivel 2: Docena</span>
                {currentTier.tier === 2 && <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />}
              </span>
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                12 a 23 Unidades
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-2xl font-black text-amber-400 font-mono">-35% <span className="text-xs font-normal text-neutral-400">vs Detal</span></div>
              <p className="text-xs text-white font-bold">Tarifa Distribuidor Preferente</p>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Margen comercial óptimo (+45% a +50% bruto) para mantener stock completo de tallas M, L y XL en mostrador.
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
              <span className="text-xs font-black text-white uppercase flex items-center gap-1.5">
                <span>Nivel 3: Caja Máster</span>
                {currentTier.tier === 3 && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                24+ Unidades
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="text-2xl font-black text-emerald-400 font-mono">-42% <span className="text-xs font-normal text-neutral-400">vs Detal</span></div>
              <p className="text-xs text-white font-bold">Tarifa Máster Fábrica VIP</p>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Tarifa máxima para mayoristas regionales. Incluye prioridad de empaque y flete bonificado asegurado con transportadora nacional.
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
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 flex items-center gap-1.5 font-mono">
              <Flame className="w-3.5 h-3.5" />
              <span>Surtidos de Alta Rotación en Vitrina</span>
            </span>
            <h3 className="text-lg font-black uppercase text-white mt-1">
              Packs de Arranque B2B Pre-armados (1 Clic)
            </h3>
            <p className="text-xs text-neutral-400">
              Si prefieres no armar referencia por referencia, carga un combo probado directamente a tu cotizador:
            </p>
          </div>

          {totalUnits > 0 && (
            <button
              type="button"
              onClick={handleClearAllQuantities}
              className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Vaciar Selección ({totalUnits} unds)</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* PACK 1 */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-orange-500/50 transition-all space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded font-mono">
                6 Unidades Surtidas
              </span>
              <h4 className="text-sm font-black text-white mt-2">Pack Top Ventas Cascos ICH 3110</h4>
              <p className="text-xs text-neutral-400 mt-1">
                2x Top Speed + 2x Racing Orange + 2x Flúor Yellow (Tallas 2M, 3L, 1XL).
              </p>
            </div>
            <div className="pt-2 border-t border-neutral-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 block font-mono">Inversión Aprox:</span>
                <strong className="text-xs text-emerald-400 font-mono font-bold">{formatCOP(1099000)}</strong>
              </div>
              <button
                type="button"
                onClick={() => applyStarterPack("cascos")}
                className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-neutral-950 text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Cargar Pack
              </button>
            </div>
          </div>

          {/* PACK 2 */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 transition-all space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded font-mono">
                12 Unidades Surtidas
              </span>
              <h4 className="text-sm font-black text-white mt-2">Pack Vitrina Ciudad Scooter</h4>
              <p className="text-xs text-neutral-400 mt-1">
                6x Cascos ICH 501 Jet (Lila, Beige, Mate) + 6x Guantes Proviker E44 Touch.
              </p>
            </div>
            <div className="pt-2 border-t border-neutral-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 block font-mono">Inversión Aprox:</span>
                <strong className="text-xs text-emerald-400 font-mono font-bold">{formatCOP(1050000)}</strong>
              </div>
              <button
                type="button"
                onClick={() => applyStarterPack("urbano")}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Cargar Pack
              </button>
            </div>
          </div>

          {/* PACK 3 */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-blue-500/50 transition-all space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded font-mono">
                16 Unidades Surtidas
              </span>
              <h4 className="text-sm font-black text-white mt-2">Pack Clima Extremo Lluvia</h4>
              <p className="text-xs text-neutral-400 mt-1">
                10x Impermeables Enterizos Siliconados con Tula + 6x Soportes Antivibración CNC.
              </p>
            </div>
            <div className="pt-2 border-t border-neutral-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-400 block font-mono">Inversión Aprox:</span>
                <strong className="text-xs text-emerald-400 font-mono font-bold">{formatCOP(1085000)}</strong>
              </div>
              <button
                type="button"
                onClick={() => applyStarterPack("lluvia")}
                className="px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-neutral-950 text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95"
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
      <div id="matriz-pedidos" className="p-5 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-6">
        
        {/* Matrix Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-orange-400 bg-orange-500/10 px-3 py-0.5 rounded-full border border-orange-500/20 font-mono">
                Constructor de Pedido B2B
              </span>
              <span className="text-xs text-neutral-400 font-mono font-bold">
                Mínimo 6 unidades
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black uppercase text-white mt-1">
              Catálogo de Mercancía para Almacenes
            </h3>
            <p className="text-xs text-neutral-400">
              Ajusta las cantidades por referencia. Los precios unitarios de bodega bajan automáticamente según tu volumen acumulado.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar referencia o SKU..."
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

            <button
              type="button"
              onClick={() => setOnlySelectedFilter(!onlySelectedFilter)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                onlySelectedFilter 
                  ? "bg-amber-500 text-neutral-950 font-black border-amber-500 shadow-sm" 
                  : "bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700"
              }`}
              title="Filtrar solo los productos agregados a este pedido"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Ver Seleccionados ({selectedProductsCount})</span>
            </button>
          </div>
        </div>

        {/* Dynamic Status / Progress Alert with Live Progress Bar */}
        <div className={`p-5 rounded-2xl border transition-all space-y-3 ${
          totalUnits >= 24
            ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-300"
            : totalUnits >= 12
            ? "bg-amber-950/40 border-amber-500/50 text-amber-300"
            : totalUnits >= 6
            ? "bg-orange-950/40 border-orange-500/50 text-orange-300"
            : "bg-neutral-950 border-neutral-800 text-neutral-300"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {totalUnits >= 6 ? (
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
              )}
              <div>
                <p className="font-bold text-sm text-white">
                  {totalUnits >= 24 ? (
                    <span className="text-emerald-400">🏆 ¡Tarifa Máxima VIP Desbloqueada! (-42% Fábrica • Flete Prioritario)</span>
                  ) : totalUnits >= 12 ? (
                    <span className="text-amber-300">🔥 ¡Tarifa Mayorista Oro Activa (-35%)! ({totalUnits} unidades en tu pedido)</span>
                  ) : totalUnits >= 6 ? (
                    <span className="text-orange-300">⚡ ¡Tarifa Mayorista Base Activa (-28%)! ({totalUnits} unidades en tu pedido)</span>
                  ) : (
                    <span>Llevas {totalUnits} unidades. Agrega {6 - totalUnits} unidades más para activar precio mayorista.</span>
                  )}
                </p>
                <p className="text-xs opacity-80 mt-0.5">
                  {nextTierInfo.needed > 0 ? (
                    <span>Te faltan <strong>{nextTierInfo.needed} unidades</strong> para subir a <strong>{nextTierInfo.nextLabel}</strong>.</span>
                  ) : (
                    <span>Tienes el mayor descuento posible por volumen para este despacho.</span>
                  )}
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] uppercase font-bold text-neutral-400 block font-mono">Volumen Acumulado:</span>
              <span className="text-2xl font-black font-mono text-white">{totalUnits} <span className="text-xs font-normal text-neutral-400">unds</span></span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="space-y-1 pt-1">
            <div className="w-full h-2.5 rounded-full bg-neutral-900 border border-neutral-800 overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 rounded-full ${
                  totalUnits >= 24 ? "bg-emerald-500" : totalUnits >= 12 ? "bg-amber-400" : totalUnits >= 6 ? "bg-orange-500" : "bg-neutral-600"
                }`}
                style={{ width: `${Math.min(100, Math.max(5, (totalUnits / 24) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-neutral-500">
              <span>0 unds</span>
              <span className={totalUnits >= 6 ? "text-orange-400 font-bold" : ""}>6 unds (-28%)</span>
              <span className={totalUnits >= 12 ? "text-amber-400 font-bold" : ""}>12 unds (-35%)</span>
              <span className={totalUnits >= 24 ? "text-emerald-400 font-bold" : ""}>24+ unds (-42%)</span>
            </div>
          </div>
        </div>

        {/* Table of Wholesale Items */}
        <div className="overflow-x-auto rounded-2xl border border-neutral-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 text-[11px] uppercase tracking-wider font-mono">
              <tr>
                <th className="py-3.5 px-4">Producto & Referencia</th>
                <th className="py-3.5 px-3 text-center">PVP Detal</th>
                <th className="py-3.5 px-3 text-center">Precio Mayorista</th>
                <th className="py-3.5 px-3 text-center">Margen Almacén</th>
                <th className="py-3.5 px-4 text-center">Cantidad (Unds)</th>
                <th className="py-3.5 px-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 bg-neutral-900">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-400">
                    <p className="font-bold text-white">No hay productos que coincidan con el filtro.</p>
                    {onlySelectedFilter && (
                      <button
                        type="button"
                        onClick={() => setOnlySelectedFilter(false)}
                        className="mt-2 text-xs text-orange-400 underline font-bold"
                      >
                        Ver todo el catálogo
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const qty = quantities[p.id] || 0;
                  const wholesalePrice = getProductWholesalePrice(p);
                  const subtotal = wholesalePrice * qty;
                  const profitPerUnit = p.price_retail - wholesalePrice;
                  const marginPercent = Math.round((profitPerUnit / p.price_retail) * 100);
                  const isSelected = qty > 0;

                  return (
                    <tr 
                      key={p.id} 
                      className={`transition-colors ${
                        isSelected 
                          ? "bg-amber-500/[0.04] border-l-4 border-l-amber-500" 
                          : "hover:bg-neutral-950/40"
                      }`}
                    >
                      
                      {/* Product Name & Image */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0] || "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80"}
                            alt={p.name}
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80";
                            }}
                            className="w-12 h-12 rounded-xl object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                          />
                          <div className="space-y-0.5 min-w-0">
                            <p className="font-bold text-white leading-tight truncate">{p.name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-mono">
                              <span>SKU: {p.sku}</span>
                              <span>•</span>
                              <span className="text-orange-400">{p.specs?.find((s) => s.label.includes("Certificación"))?.value || "DOT / NTC"}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Retail Price */}
                      <td className="py-3.5 px-3 text-center font-mono text-neutral-500 line-through">
                        {formatCOP(p.price_retail)}
                      </td>

                      {/* Wholesale Unit Price */}
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-amber-400 text-sm">
                        {formatCOP(wholesalePrice)}
                      </td>

                      {/* Profit Margin */}
                      <td className="py-3.5 px-3 text-center font-mono">
                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 inline-block">
                          +{marginPercent}%
                        </span>
                        <span className="block text-[10px] text-neutral-400 mt-0.5">
                          (+{formatCOP(profitPerUnit)}/u)
                        </span>
                      </td>

                      {/* Quantity Controls + Fast Batch Chips */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <div className="inline-flex items-center bg-neutral-950 border border-neutral-800 rounded-xl p-1 gap-1 shadow-inner">
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(p.id, -1)}
                              className="w-7 h-7 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-black text-xs flex items-center justify-center transition-colors cursor-pointer"
                              title="Restar 1"
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
                              title="Sumar 1"
                            >
                              +
                            </button>
                          </div>

                          {/* Quick Batch Chips */}
                          <div className="flex items-center gap-1 mt-1.5">
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(p.id, 6)}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white font-mono font-bold transition-colors cursor-pointer"
                              title="Sumar media docena (+6)"
                            >
                              +6
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(p.id, 12)}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white font-mono font-bold transition-colors cursor-pointer"
                              title="Sumar una docena (+12)"
                            >
                              +12
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(p.id, 24)}
                              className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white font-mono font-bold transition-colors cursor-pointer"
                              title="Sumar caja máster (+24)"
                            >
                              +24
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Subtotal */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-white text-sm">
                        {formatCOP(subtotal)}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Matrix Bottom Summary & Action Bar */}
        <div className="pt-6 border-t border-neutral-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-neutral-950 p-6 rounded-2xl border border-neutral-800">
          
          {/* Numbers Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-bold block font-mono">Total Unidades:</span>
              <strong className="text-xl font-black text-white font-mono">{totalUnits} unds</strong>
              <span className="text-[10px] text-neutral-500 block font-mono">({selectedProductsCount} referencias)</span>
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase font-bold block font-mono">Valor al Detal (PVP):</span>
              <strong className="text-sm font-bold text-neutral-500 font-mono line-through">{formatCOP(orderSummary.totalRetail)}</strong>
            </div>
            <div>
              <span className="text-[10px] text-amber-400 uppercase font-bold block font-mono">Inversión Mayorista:</span>
              <strong className="text-xl font-black text-amber-400 font-mono">{formatCOP(orderSummary.totalWholesale)}</strong>
              <span className="text-[10px] text-amber-400 block font-mono">Flete Bonificado</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-400 uppercase font-bold block font-mono">Ganancia Proyectada:</span>
              <strong className="text-xl font-black text-emerald-400 font-mono">+{formatCOP(orderSummary.netProfit)}</strong>
              <span className="text-[10px] text-emerald-400 block font-bold font-mono">(+{orderSummary.profitMargin}% neto en venta)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsQuotationModalOpen(true)}
              className="py-3 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-2 transition-colors border border-neutral-700 cursor-pointer shadow"
            >
              <Download className="w-4 h-4 text-orange-400" />
              <span>Guardar Cotización en PDF</span>
            </button>

            <button
              type="button"
              onClick={handleSendWhatsAppOrder}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar Pedido a WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handleAddAllToCart}
              className="py-3 px-5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-neutral-950 font-black text-xs flex items-center gap-2 transition-all shadow-lg shadow-orange-500/20 cursor-pointer active:scale-95 uppercase tracking-wider"
            >
              <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
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
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 font-mono">
            Respaldo Comercial
          </span>
          <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-wide">
            Beneficios Exclusivos para Distribuidores
          </h2>
          <p className="text-xs text-neutral-400">
            Únete a la red oficial de almacenes y talleres que distribuyen Gordo Ryders en Colombia:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center font-black">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-white uppercase">Garantía Directa</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Respaldo total en cambios por talla o garantías de fábrica sin intermediarios molestos para tu cliente.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-black">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-white uppercase">Despachos Prioritarios</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Envíos nacionales coordinados por Servientrega, Envia o Inter Rapidísimo con guía asignada el mismo día.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
              <BadgePercent className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-white uppercase">Margen Comercial Alto</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Márgenes protegidos entre el 28% y el 42% real para asegurar la rentabilidad neta de tu negocio.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-black">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-black text-white uppercase">Factura Oficial DIAN</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Soporte contable legal completo con RUT, desglose tributario y remisiones de carga para transporte seguro.
            </p>
          </div>
        </div>
      </div>

      {/* =========================================================================
          REGISTRO DE COMERCIO / SOLICITAR CUENTA B2B
          ========================================================================= */}
      <div className="rounded-3xl bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 border border-amber-500/30 p-6 sm:p-10 shadow-2xl space-y-6 relative overflow-hidden">
        
        {/* Glow de acento superior */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-600" />
        
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 font-mono flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Canal de Afiliación B2B Corporativo</span>
            </span>
            {currentUser && (
              <span className="text-[10px] font-mono text-neutral-400">
                Sesión: <strong className="text-white">{currentUser.email}</strong>
              </span>
            )}
          </div>

          <h3 className="text-xl sm:text-3xl font-black uppercase text-white tracking-tight">
            Vincula tu Almacén o Taller como Distribuidor
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            No necesitas crear una cuenta nueva ni contraseñas adicionales. Diligencia los datos de tu establecimiento con tu correo electrónico y nuestro sistema transformará tu perfil para habilitar tarifas mayoristas directas de bodega.
          </p>
        </div>

        {currentUser?.b2bStatus === "aprobado" ? (
          <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm">
                  👑 ¡Tu cuenta ya es Distribuidor Autorizado Gordo Ryders!
                </p>
                <p className="text-neutral-300 text-xs mt-0.5">
                  Código oficial: <strong className="text-amber-400 font-mono">{currentUser.b2bCode}</strong> • Descuentos aplicados automáticamente en tus pedidos.
                </p>
              </div>
            </div>
            <a
              href="#matriz-pedidos"
              className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-wider shrink-0 transition-colors"
            >
              Hacer Pedido
            </a>
          </div>
        ) : (
          <form onSubmit={handleRegisterB2B} className="space-y-4 max-w-3xl">
            
            {/* Fila 1: Correo Electrónico (El enlace central) y Razón Social */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-amber-300 mb-1 font-mono uppercase flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Correo Electrónico del Negocio o Comerciante *</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="ejemplo@tualmacen.com"
                  value={b2bEmail}
                  onChange={(e) => setB2bEmail(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none font-mono"
                />
                <span className="text-[10px] text-neutral-400 font-mono block mt-1">
                  {currentUser?.email ? (
                    <span className="text-amber-400 font-semibold">✓ Tu cuenta actual se transformará a estatus Distribuidor Mayorista.</span>
                  ) : (
                    <span>Si ya compraste antes, transformaremos tu cuenta. Si eres nuevo, la crearemos de inmediato.</span>
                  )}
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1 font-mono uppercase flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-orange-400" />
                  <span>Nombre del Comercio o Razón Social *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Almacén Motos El Paisa / Taller Del Valle"
                  value={b2bName}
                  onChange={(e) => setB2bName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Fila 2: Nombre de Contacto y Tipo de Negocio */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1 font-mono uppercase flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Nombre del Titular o Representante Comercial *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Carlos Gómez / Administrador"
                  value={b2bContactName}
                  onChange={(e) => setB2bContactName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1 font-mono uppercase">
                  Tipo de Negocio *
                </label>
                <select
                  value={b2bType}
                  onChange={(e) => setB2bType(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none cursor-pointer font-sans"
                >
                  <option value="almacen_repuestos">Almacén de Repuestos & Autopartes</option>
                  <option value="taller_motos">Taller Mecánico Especializado</option>
                  <option value="tienda_accesorios">Tienda de Accesorios / Ropa Motera</option>
                  <option value="concesionario">Concesionario de Motos</option>
                  <option value="distribuidor_digital">Distribuidor Digital / E-commerce</option>
                </select>
              </div>
            </div>

            {/* Fila 3: NIT/Cédula, Ciudad y WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1 font-mono uppercase">
                  NIT o Cédula *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 900.123.456-7"
                  value={b2bNit}
                  onChange={(e) => setB2bNit(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1 font-mono uppercase">
                  Ciudad de Despacho *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Medellín, Cali, Bucaramanga..."
                  value={b2bCity}
                  onChange={(e) => setB2bCity(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1 font-mono uppercase">
                  WhatsApp Directo *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="Ej: 316 149 2880"
                  value={b2bPhone}
                  onChange={(e) => setB2bPhone(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Fila 4: Dirección o Instagram */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-300 mb-1 font-mono uppercase">
                Dirección del Local Físico o Instagram de la Tienda
              </label>
              <input
                type="text"
                placeholder="Ej: Carrera 15 # 45-20 / @motosalpaisa_oficial"
                value={b2bAddress}
                onChange={(e) => setB2bAddress(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 focus:border-orange-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none"
              />
            </div>

            {/* Alerta de Éxito o Botón de Envío */}
            {b2bSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 flex items-start gap-3 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold text-emerald-300 text-xs">
                    ¡Solicitud Mayorista Recibida y Registrada Exitosamente!
                  </p>
                  <p className="text-[11px] text-emerald-400/90 leading-relaxed">
                    Tu correo <strong className="text-white">{b2bEmail}</strong> quedó vinculado en el sistema como solicitud de Distribuidor Mayorista. Ya fue enviada al <strong>Panel de Control Central de Administración y Bodega</strong> para habilitar tus tarifas B2B permanentes.
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="text-[11px] text-neutral-400 font-mono">
                ⚡ Notificación en vivo enviada directamente al ERP corporativo.
              </span>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 cursor-pointer active:scale-95 uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>Vincular y Solicitar Código Mayorista</span>
              </button>
            </div>
          </form>
        )}

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
                  <div className="w-8 h-8 rounded-xl bg-orange-500 font-black text-neutral-950 text-sm flex items-center justify-center">
                    GR
                  </div>
                  <h3 className="text-lg font-black uppercase text-white tracking-wide">
                    Gordo Ryders Colombia
                  </h3>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Distribuidora Mayorista de Cascos & Accesorios Moteros • NIT 900.849.201-4
                </p>
                <p className="text-[10px] text-neutral-500 font-mono">
                  Bodega Central: Bogotá D.C. • Despacho Nacional
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold text-orange-400 block">
                  COT-B2B-2026-40291
                </span>
                <span className="text-[10px] text-neutral-400 block font-mono">
                  Fecha: {new Intl.DateTimeFormat("es-CO", { dateStyle: "medium" }).format(new Date())}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold block font-mono">
                  Validez: 15 días calendario
                </span>
              </div>
            </div>

            {/* Recipient */}
            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs grid grid-cols-2 gap-2 text-neutral-300">
              <div>
                <span className="text-[10px] uppercase text-neutral-500 font-bold block font-mono">Cotizado A:</span>
                <strong className="text-white">{currentUser?.businessName || currentUser?.name || "Almacén / Comerciante Mayorista"}</strong>
              </div>
              <div>
                <span className="text-[10px] uppercase text-neutral-500 font-bold block font-mono">Ciudad / Despacho:</span>
                <strong className="text-white">{currentUser?.city || "A convenir con bodega nacional"}</strong>
              </div>
            </div>

            {/* Items Table */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-neutral-800 text-neutral-400 text-[10px] uppercase font-mono">
                    <th className="py-2">Ref / Descripción</th>
                    <th className="py-2 text-center">Cant.</th>
                    <th className="py-2 text-right">Precio Bodega</th>
                    <th className="py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/50">
                  {orderSummary.itemsList.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 text-white font-semibold">{item.product.name}</td>
                      <td className="py-2 text-center font-mono font-bold">{item.quantity}</td>
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
              <div className="flex justify-between text-neutral-400">
                <span>Flete de Transporte:</span>
                <strong className="text-emerald-400 font-semibold">¡Bonificado 100%!</strong>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-neutral-800">
                <span>Total Inversión Neta:</span>
                <span className="text-amber-400 font-mono text-lg">{formatCOP(orderSummary.totalWholesale)}</span>
              </div>
            </div>

            {/* PDF / WhatsApp actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={handleSaveQuotePDF}
                className="py-2.5 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-orange-400" />
                <span>Guardar Cotización en PDF</span>
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
