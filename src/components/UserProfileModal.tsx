"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useStore } from "@/context/StoreContext";
import { 
  X, 
  User, 
  MapPin, 
  Package, 
  FileText, 
  LogOut, 
  Save, 
  CheckCircle2, 
  Truck, 
  Phone, 
  Mail, 
  CreditCard,
  Building2,
  ExternalLink
} from "lucide-react";

const COLOMBIAN_DEPARTMENTS = [
  "Bogotá D.C.",
  "Cundinamarca",
  "Antioquia",
  "Valle del Cauca",
  "Atlántico",
  "Santander",
  "Bolívar",
  "Risaralda",
  "Caldas",
  "Tolima",
  "Huila",
  "Meta",
  "Boyacá",
  "Nariño",
  "Norte de Santander",
  "Quindío",
  "Cesar",
  "Córdoba",
  "Magdalena",
  "Cauca",
  "Sucre"
];

export default function UserProfileModal() {
  const { 
    isProfileModalOpen, 
    setIsProfileModalOpen, 
    currentUser, 
    updateUserProfile, 
    logout,
    orders,
    invoices,
    setIsTrackingOpen,
    requestWholesaleAccount
  } = useStore();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "shipping" | "orders" | "invoices" | "wholesale">("shipping");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states initialized with currentUser
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [documentType, setDocumentType] = useState<"CC" | "CE" | "NIT" | "Pasaporte">("CC");
  const [cedulaOrNit, setCedulaOrNit] = useState("");
  const [department, setDepartment] = useState("Cundinamarca");
  const [city, setCity] = useState("Bogotá D.C.");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");

  // B2B Wholesale Request Form States
  const [b2bBusinessName, setB2bBusinessName] = useState("");
  const [b2bBusinessType, setB2bBusinessType] = useState<"almacen_repuestos" | "taller_motos" | "tienda_accesorios" | "concesionario" | "distribuidor_digital">("almacen_repuestos");
  const [b2bNitOrRut, setB2bNitOrRut] = useState("");
  const [b2bCity, setB2bCity] = useState("Bogotá D.C.");
  const [b2bPhone, setB2bPhone] = useState("");
  const [b2bAddressOrSocial, setB2bAddressOrSocial] = useState("");
  const [b2bSubmitted, setB2bSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
      setPhone(currentUser.phone || "");
      setDocumentType(currentUser.documentType || "CC");
      setCedulaOrNit(currentUser.cedulaOrNit || "");
      setDepartment(currentUser.department || "Cundinamarca");
      setCity(currentUser.city || "Bogotá D.C.");
      setAddress(currentUser.address || "");
      setNeighborhood(currentUser.neighborhood || "");
      setDeliveryNotes(currentUser.deliveryNotes || "");
      if (currentUser.businessName) setB2bBusinessName(currentUser.businessName);
      if (currentUser.businessType) setB2bBusinessType(currentUser.businessType);
      if (currentUser.b2bNitOrRut) setB2bNitOrRut(currentUser.b2bNitOrRut);
      if (currentUser.city) setB2bCity(currentUser.city);
      if (currentUser.phone) setB2bPhone(currentUser.phone);
      if (currentUser.b2bAddressOrSocial) setB2bAddressOrSocial(currentUser.b2bAddressOrSocial);
    }
  }, [currentUser]);

  if (!isProfileModalOpen || !currentUser || !mounted || typeof document === "undefined") {
    return null;
  }

  const handleWholesaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!b2bBusinessName || !b2bPhone || !b2bCity) {
      alert("Por favor completa los datos obligatorios de tu almacén o taller.");
      return;
    }
    requestWholesaleAccount({
      businessName: b2bBusinessName,
      businessType: b2bBusinessType,
      nitOrRut: b2bNitOrRut,
      city: b2bCity,
      phone: b2bPhone,
      addressOrSocial: b2bAddressOrSocial,
    });
    setB2bSubmitted(true);
    setTimeout(() => setB2bSubmitted(false), 3000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      documentType,
      cedulaOrNit,
      department,
      city,
      address,
      neighborhood,
      deliveryNotes,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const formatCOP = (val: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // User-associated orders & invoices
  const userOrders = orders.filter(
    (o) =>
      (o.customerPhone && currentUser.phone && o.customerPhone.includes(currentUser.phone)) ||
      (o.customerName && currentUser.name && o.customerName.toLowerCase().includes(currentUser.name.toLowerCase().split(" ")[0]))
  );

  const userInvoices = invoices.filter(
    (inv) =>
      (inv.customerNitOrCedula && currentUser.cedulaOrNit && inv.customerNitOrCedula.replace(/\D/g, "") === currentUser.cedulaOrNit.replace(/\D/g, "")) ||
      (inv.customerEmail && currentUser.email && inv.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
  );

  return createPortal(
    <div className="fixed inset-0 z-[999999] min-h-[100dvh] w-screen flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-5 sm:p-8 text-white shadow-2xl my-auto animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={() => setIsProfileModalOpen(false)}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top User Card Header (Mercado Libre Style) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
          <div className="flex items-center gap-3.5">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-orange-500 shadow-lg shadow-orange-500/20 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-neutral-950 text-2xl shrink-0 shadow-lg shadow-orange-600/30">
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "M"}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white leading-tight">
                  {currentUser.name}
                </h3>
                {currentUser.b2bStatus === "aprobado" ? (
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/50 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 shadow-sm shadow-amber-500/20">
                    <span>👑</span>
                    <span>DISTRIBUIDOR B2B • {currentUser.b2bCode || "GR-B2B-101"}</span>
                  </span>
                ) : (
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{currentUser.status || "Activo"}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                {currentUser.email}
              </p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-400 font-medium">
                <span className="text-orange-400 font-semibold">{currentUser.authProvider || "Google Workspace"}</span>
                <span>•</span>
                <span>{currentUser.ordersCount || 0} compras realizadas</span>
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-950 hover:bg-red-950/40 border border-neutral-800 hover:border-red-800 text-neutral-400 hover:text-red-400 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 py-4 border-b border-neutral-800/80 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("shipping")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "shipping"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Dirección de Despacho</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "profile"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Datos Personales & Cédula</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "orders"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Mis Compras ({userOrders.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("invoices")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "invoices"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Mis Facturas ({userInvoices.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("wholesale")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "wholesale"
                ? "bg-amber-600 text-neutral-950 font-black shadow-md shadow-amber-600/30"
                : "bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800"
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Cuenta Mayorista B2B</span>
            {currentUser.b2bStatus === "aprobado" && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>
        </div>

        {/* =========================================================================
            TAB 1: DIRECCIÓN DE DESPACHO MERCADO LIBRE
            ========================================================================= */}
        {activeTab === "shipping" && (
          <form onSubmit={handleSave} className="py-4 space-y-4">
            <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 text-xs text-neutral-400 flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <p className="text-[11px] leading-relaxed">
                Esta es tu dirección principal para despachos con <strong>Inter Rapidísimo</strong> y <strong>Servientrega</strong>. Al comprar en la tienda, tu pedido se auto-completará en 1 clic.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Departamento *
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  {COLOMBIAN_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Ciudad o Municipio *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Bogotá D.C., Medellín, Cali..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                Dirección Exacta (Calle, Carrera, Número) *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Calle 127 # 45 - 20"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Barrio o Sector *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Cedritos / El Poblado"
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Apto / Torre / Indicaciones al Transportador
                </label>
                <input
                  type="text"
                  placeholder="Ej: Torre 2 Apto 401 (Portería 24h)"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              {saveSuccess ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Dirección guardada con éxito!</span>
                </span>
              ) : (
                <span className="text-[11px] text-neutral-400">
                  Los cambios se sincronizan en tu cuenta.
                </span>
              )}

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-all shadow-md shadow-orange-600/20 cursor-pointer active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Dirección</span>
              </button>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 2: DATOS PERSONALES & CÉDULA (FACTURACIÓN DIAN)
            ========================================================================= */}
        {activeTab === "profile" && (
          <form onSubmit={handleSave} className="py-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Celular / WhatsApp (10 dígitos) *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="310 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                  <Phone className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Tipo de Documento
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="CC">Cédula de Ciudadanía (CC)</option>
                  <option value="CE">Cédula de Extranjería (CE)</option>
                  <option value="NIT">NIT (Empresas)</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                  Número de Cédula o NIT (Para Facturación Oficial) *
                </label>
                <input
                  type="text"
                  placeholder="Ej: 1.020.849.201"
                  value={cedulaOrNit}
                  onChange={(e) => setCedulaOrNit(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-400 mb-1">
                Correo Electrónico (Asociado a tu cuenta)
              </label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full bg-neutral-950/60 border border-neutral-800/80 rounded-xl px-3 py-2 text-xs text-neutral-400 cursor-not-allowed"
              />
            </div>

            <div className="pt-3 flex items-center justify-between">
              {saveSuccess ? (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Datos fiscales guardados!</span>
                </span>
              ) : (
                <span className="text-[11px] text-neutral-400">
                  Tu cédula se usará en tus facturas oficiales legales.
                </span>
              )}

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-all shadow-md shadow-orange-600/20 cursor-pointer active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Datos</span>
              </button>
            </div>
          </form>
        )}

        {/* =========================================================================
            TAB 3: MIS COMPRAS & RASTREO
            ========================================================================= */}
        {activeTab === "orders" && (
          <div className="py-4 space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
            {userOrders.length === 0 ? (
              <div className="text-center py-10 bg-neutral-950 rounded-2xl border border-neutral-800 p-6">
                <Package className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">Aún no tienes compras registradas</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Cuando realices un pedido con tu cuenta, verás aquí su guía y estado en vivo.
                </p>
              </div>
            ) : (
              userOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2 hover:border-neutral-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-orange-400 uppercase font-mono">
                      {ord.id.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">
                      {ord.status.replace("_", " ")}
                    </span>
                  </div>

                  <p className="text-xs text-white font-bold">{ord.productsSummary}</p>
                  
                  <div className="flex flex-wrap items-center justify-between text-xs text-neutral-400 pt-1 border-t border-neutral-900">
                    <span>Guía: <strong className="text-white font-mono">{ord.guideNumber}</strong> ({ord.carrier})</span>
                    <strong className="text-emerald-400 font-mono text-sm">{formatCOP(ord.total)}</strong>
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        setIsProfileModalOpen(false);
                        setIsTrackingOpen(true);
                      }}
                      className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Rastrear Envío en Vivo</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: MIS FACTURAS OFICIALES
            ========================================================================= */}
        {activeTab === "invoices" && (
          <div className="py-4 space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
            {userInvoices.length === 0 ? (
              <div className="text-center py-10 bg-neutral-950 rounded-2xl border border-neutral-800 p-6">
                <FileText className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
                <p className="text-sm font-bold text-white">No hay facturas emitidas aún</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Tus facturas legales con desglose de IVA y método de pago aparecerán aquí tras cada compra.
                </p>
              </div>
            ) : (
              userInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white font-mono">{inv.invoiceNumber}</span>
                    <span className="text-[10px] text-neutral-400">{inv.date}</span>
                  </div>
                  <div className="flex justify-between text-xs text-neutral-300">
                    <span>Cédula / NIT: <strong className="text-white">{inv.customerNitOrCedula}</strong></span>
                    <strong className="text-emerald-400 font-mono text-sm">{formatCOP(inv.total)}</strong>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    <span>Método de pago: <strong className="text-neutral-300">{inv.paymentMethod}</strong></span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 5: CUENTA MAYORISTA B2B (ALMACENES & TALLERES)
            ========================================================================= */}
        {activeTab === "wholesale" && (
          <div className="py-4 space-y-4">
            {currentUser.b2bStatus === "aprobado" ? (
              <div className="space-y-4 animate-in fade-in">
                {/* Gold VIP Card */}
                <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/70 via-neutral-900 to-amber-950/40 border border-amber-500/40 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                      <span>👑</span>
                      <span>Distribuidor Oficial Autorizado</span>
                    </span>
                    <span className="text-xs font-mono font-black text-amber-400">
                      ID: {currentUser.b2bCode || "GR-B2B-101"}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-white">{currentUser.businessName || "Almacén Vinculado"}</h4>
                    <p className="text-xs text-neutral-300">
                      RUT / NIT: <strong className="font-mono text-white">{currentUser.b2bNitOrRut || currentUser.cedulaOrNit || "Registrado"}</strong> • Ciudad: <strong className="text-white">{currentUser.city}</strong>
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-neutral-800 text-xs text-neutral-300">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Tarifas de Bodega activas (desde 6 unds)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Despacho prioritario nacional</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Facturación Electrónica DIAN con RUT</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Atención directa con Edwin Bernal</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href="/mayoristas"
                    onClick={() => setIsProfileModalOpen(false)}
                    className="flex-1 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs text-center transition-colors shadow-md shadow-orange-600/20"
                  >
                    Ir al Catálogo Mayorista y Armar Pedido
                  </a>
                  <a
                    href={`https://wa.me/573000000000?text=${encodeURIComponent(
                      `Hola Edwin Bernal, soy ${currentUser.name} del almacén ${currentUser.businessName} (Código ${currentUser.b2bCode}). Deseo consultar disponibilidad de bodega.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>Línea VIP WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : currentUser.b2bStatus === "pendiente" ? (
              <div className="p-6 rounded-3xl bg-neutral-950 border border-amber-500/30 text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mx-auto text-xl font-bold">
                  ⏳
                </div>
                <h4 className="text-base font-black text-white">Solicitud Mayorista en Revisión</h4>
                <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                  Tu solicitud para vincular a <strong className="text-amber-400">{currentUser.businessName || "tu negocio"}</strong> como distribuidor autorizado está siendo revisada por el equipo comercial de Gordo Ryders.
                </p>
                <p className="text-[11px] text-neutral-500">
                  Nos comunicaremos al WhatsApp <strong>{currentUser.phone}</strong> para habilitar tus precios de bodega.
                </p>
              </div>
            ) : (
              <form onSubmit={handleWholesaleSubmit} className="space-y-4 animate-in fade-in">
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 text-xs text-neutral-300 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Building2 className="w-4 h-4" />
                    <span>¿Tienes un Almacén, Taller o Tienda de Motos?</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Solicita tu cuenta de distribuidor autorizado para desbloquear precios de fábrica a partir de 6 unidades surtidas, facturas electrónicas y despacho preferencial.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                      Nombre Comercial del Almacén / Taller *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Repuestos & Motos El Paisa"
                      value={b2bBusinessName}
                      onChange={(e) => setB2bBusinessName(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                      Tipo de Negocio *
                    </label>
                    <select
                      value={b2bBusinessType}
                      onChange={(e) => setB2bBusinessType(e.target.value as any)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500 cursor-pointer"
                    >
                      <option value="almacen_repuestos">Almacén de Repuestos & Accesorios</option>
                      <option value="taller_motos">Taller Mecánico de Motos</option>
                      <option value="tienda_accesorios">Tienda Especializada de Cascos</option>
                      <option value="concesionario">Concesionario de Motos</option>
                      <option value="distribuidor_digital">Vendedor Digital / Catálogo</option>
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
                      value={b2bNitOrRut}
                      onChange={(e) => setB2bNitOrRut(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
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
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                      WhatsApp del Contacto *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="310 123 4567"
                      value={b2bPhone}
                      onChange={(e) => setB2bPhone(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                    Dirección del Local Físico o Enlace de Instagram / Redes
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Calle 33 # 45-12 / @motoselpaisa"
                    value={b2bAddressOrSocial}
                    onChange={(e) => setB2bAddressOrSocial(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  {b2bSubmitted ? (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>¡Solicitud enviada a revisión!</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-neutral-400">
                      Revisión comercial en menos de 2 horas.
                    </span>
                  )}

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-95"
                  >
                    <span>Enviar Solicitud Mayorista</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}
