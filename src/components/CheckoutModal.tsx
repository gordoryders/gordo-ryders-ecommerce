"use client";

import { useState } from "react";
import { useStore } from "@/context/StoreContext";
import { CartItem, Order, Invoice } from "@/types";
import { 
  X, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  QrCode, 
  FileText, 
  Copy, 
  ExternalLink,
  MessageCircle,
  Building2,
  Lock
} from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderCompleted?: (orderId: string) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
  onOrderCompleted,
}: CheckoutModalProps) {
  const { addOrder, addInvoice, clearCart, userCity } = useStore();

  const [step, setStep] = useState<"form" | "payment" | "success">("form");

  // Shipping Form State (Requisitos transportadoras y DIAN Colombia)
  const [fullName, setFullName] = useState("");
  const [cedulaOrNit, setCedulaOrNit] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState(userCity || "Bogotá D.C.");
  const [department, setDepartment] = useState("Cundinamarca");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [notes, setNotes] = useState("");

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<"wompi" | "nequi" | "contraentrega">("wompi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [completedInvoice, setCompletedInvoice] = useState<Invoice | null>(null);

  if (!isOpen) return null;

  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const subtotal = items.reduce((acc, i) => acc + i.product.price_retail * i.quantity, 0);
  const freeShippingThreshold = 180000;
  const shippingCost = subtotal >= freeShippingThreshold ? 0 : 12000;
  const total = subtotal + shippingCost;

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !cedulaOrNit || !phone || !address || !city) {
      alert("Por favor completa los campos obligatorios de envío.");
      return;
    }
    setStep("payment");
  };

  const handleConfirmOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const orderNumber = `ORD-GR-${Math.floor(1000 + Math.random() * 9000)}`;
      const invoiceNumber = `FACT-GR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      const dateStr = new Intl.DateTimeFormat("es-CO", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date());

      const productsSummary = items
        .map((i) => `${i.quantity}x ${i.product.name} (${i.selectedSize})`)
        .join(", ");

      // 1. Create Official Order (Nivel 1 para despacho en bodega)
      const newOrder: Order = {
        id: orderNumber.toLowerCase(),
        guideNumber: "POR ASIGNAR",
        carrier: "Inter Rapidísimo",
        customerName: fullName,
        customerPhone: phone,
        city: `${city}, ${department}`,
        total: total,
        itemsCount: items.reduce((acc, i) => acc + i.quantity, 0),
        status: "empacado",
        date: dateStr,
        productsSummary: productsSummary,
      };

      // 2. Create Official Digital Invoice
      const newInvoice: Invoice = {
        id: `inv-${Date.now()}`,
        invoiceNumber: invoiceNumber,
        orderId: orderNumber,
        date: dateStr,
        customerName: fullName,
        customerNitOrCedula: cedulaOrNit,
        customerPhone: phone,
        customerEmail: email || "cliente@gordoryders.com",
        customerCity: `${city}, ${department}`,
        customerAddress: `${address} ${neighborhood ? `- ${neighborhood}` : ""}`,
        carrier: "Inter Rapidísimo",
        guideNumber: "Pendiente asignación por bodega",
        items: items.map((i) => ({
          productName: i.product.name,
          sku: i.product.sku,
          size: i.selectedSize,
          quantity: i.quantity,
          unitPrice: i.product.price_retail,
          subtotal: i.product.price_retail * i.quantity,
        })),
        subtotal: subtotal,
        shippingCost: shippingCost,
        tax: 0,
        total: total,
        paymentMethod:
          paymentMethod === "wompi"
            ? "Wompi (Bancolombia)"
            : paymentMethod === "nequi"
            ? "PSE / Nequi"
            : "Contra Entrega Nacional",
        paymentStatus: paymentMethod === "contraentrega" ? "pendiente" : "pagado",
      };

      addOrder(newOrder);
      addInvoice(newInvoice);
      setCompletedOrder(newOrder);
      setCompletedInvoice(newInvoice);
      clearCart();
      setIsProcessing(false);
      setStep("success");

      if (onOrderCompleted) onOrderCompleted(orderNumber);
    }, 1200);
  };

  const whatsappConfirmationText = completedOrder
    ? encodeURIComponent(
        `Hola Gordo Ryders, acabo de realizar el pedido ${completedOrder.id.toUpperCase()} a nombre de ${fullName} por valor de ${formatCOP(
          total
        )} en ${city}. Deseo confirmar la guía y el despacho.`
      )
    : "";

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/85 backdrop-blur-sm transition-opacity" />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 relative z-10">
        <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl text-white overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Header Bar */}
          <div className="bg-neutral-950 px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-500 text-neutral-950 font-black flex items-center justify-center text-xs shadow-md">
                GR
              </div>
              <div>
                <h3 className="text-sm font-black uppercase text-white tracking-wide">
                  Finalizar Compra Segura
                </h3>
                <p className="text-[10px] text-neutral-400">
                  Despacho oficial asegurado para toda Colombia
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Progress */}
          <div className="bg-neutral-900/60 px-6 py-3 border-b border-neutral-800/80 flex items-center justify-between text-xs font-bold">
            <span className={`flex items-center gap-1.5 ${step === "form" ? "text-orange-400" : "text-neutral-400"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${step === "form" ? "bg-orange-500 text-neutral-950" : "bg-neutral-800"}`}>
                1
              </span>
              <span>Datos de Envío</span>
            </span>
            <span className="text-neutral-600">→</span>
            <span className={`flex items-center gap-1.5 ${step === "payment" ? "text-orange-400" : "text-neutral-400"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${step === "payment" ? "bg-orange-500 text-neutral-950" : "bg-neutral-800"}`}>
                2
              </span>
              <span>Método de Pago</span>
            </span>
            <span className="text-neutral-600">→</span>
            <span className={`flex items-center gap-1.5 ${step === "success" ? "text-emerald-400" : "text-neutral-400"}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${step === "success" ? "bg-emerald-500 text-neutral-950" : "bg-neutral-800"}`}>
                3
              </span>
              <span>Confirmación & Factura</span>
            </span>
          </div>

          {/* Modal Body */}
          <div className="p-6">
            
            {/* STEP 1: FORMULARIO DE ENVÍO */}
            {step === "form" && (
              <form onSubmit={handleProceedToPayment} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Nombre y Apellidos *
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej: Carlos Mario Restrepo"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Cédula de Ciudadanía / NIT *
                    </label>
                    <input
                      type="text"
                      required
                      value={cedulaOrNit}
                      onChange={(e) => setCedulaOrNit(e.target.value)}
                      placeholder="Para la guía de transporte y DIAN"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Celular / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej: 310 123 4567"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Correo Electrónico (Para Factura)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu-correo@gmail.com"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Ciudad o Municipio *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ej: Bogotá D.C., Medellín, Cali..."
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Departamento
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="Ej: Antioquia, Valle, Cundinamarca..."
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Dirección Exacta de Entrega *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Ej: Calle 72 # 15-40, Torre 4 Apto 302"
                    className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Barrio
                    </label>
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Ej: Chapinero / El Poblado"
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Instrucciones de Entrega (Opcional)
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Dejar en portería, timbre 201..."
                      className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Order Summary Strip */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between mt-4">
                  <div>
                    <span className="text-xs text-neutral-400 block">Total a Despachar:</span>
                    <span className="text-xl font-black text-orange-400 font-mono">{formatCOP(total)}</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Truck className="w-4 h-4" />
                    <span>{shippingCost === 0 ? "Envío Nacional Gratis" : "+ $12.000 Envío"}</span>
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 font-black py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continuar a Selección de Pago</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: MÉTODO DE PAGO */}
            {step === "payment" && (
              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-black uppercase text-white">Selecciona tu Forma de Pago</h4>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Transacciones 100% encriptadas y aseguradas para Colombia.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Wompi / PSE / Nequi */}
                  <label
                    onClick={() => setPaymentMethod("wompi")}
                    className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === "wompi"
                        ? "bg-orange-500/10 border-orange-500 ring-2 ring-orange-500/20"
                        : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-black">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black uppercase text-white">Wompi / PSE / Nequi</span>
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-black">
                              RECOMENDADO
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400">
                            Paga al instante con tu cuenta Nequi, Bancolombia, PSE o Tarjeta Débito/Crédito.
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === "wompi"}
                        onChange={() => setPaymentMethod("wompi")}
                        className="accent-orange-500 w-4 h-4"
                      />
                    </div>
                  </label>

                  {/* Transferencia Directa Nequi / Bancolombia */}
                  <label
                    onClick={() => setPaymentMethod("nequi")}
                    className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === "nequi"
                        ? "bg-orange-500/10 border-orange-500 ring-2 ring-orange-500/20"
                        : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-black">
                          <QrCode className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-black uppercase text-white">Transferencia Nequi / Bancolombia</span>
                          <p className="text-[11px] text-neutral-400">
                            Transfiere a nuestra cuenta empresarial y adjunta comprobante en 1 toque.
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === "nequi"}
                        onChange={() => setPaymentMethod("nequi")}
                        className="accent-orange-500 w-4 h-4"
                      />
                    </div>
                  </label>

                  {/* Contra Entrega */}
                  <label
                    onClick={() => setPaymentMethod("contraentrega")}
                    className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === "contraentrega"
                        ? "bg-orange-500/10 border-orange-500 ring-2 ring-orange-500/20"
                        : "bg-neutral-950 border-neutral-800 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-xs font-black uppercase text-white">Pago Contra Entrega</span>
                          <p className="text-[11px] text-neutral-400">
                            Pagas en efectivo al mensajero de Inter Rapidísimo cuando llegue a tu casa.
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === "contraentrega"}
                        onChange={() => setPaymentMethod("contraentrega")}
                        className="accent-orange-500 w-4 h-4"
                      />
                    </div>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep("form")}
                    className="w-1/3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-colors"
                  >
                    Volver
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleConfirmOrder}
                    className="w-2/3 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-neutral-950 font-black py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span>Procesando Orden...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Confirmar y Generar Factura</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ÉXITO, FACTURA Y RASTREO */}
            {step === "success" && completedOrder && (
              <div className="text-center space-y-5 py-2">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                  <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
                </div>

                <div>
                  <h3 className="text-xl font-black uppercase text-white">
                    ¡Tu Pedido ha sido Registrado con Éxito!
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Número de Orden: <strong className="text-orange-400 font-mono text-sm">{completedOrder.id.toUpperCase()}</strong>
                  </p>
                </div>

                {/* Receipt Details Card */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 text-left text-xs space-y-2 max-w-lg mx-auto">
                  <div className="flex justify-between border-b border-neutral-800 pb-2">
                    <span className="text-neutral-400">Cliente:</span>
                    <strong className="text-white">{fullName} ({cedulaOrNit})</strong>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-2">
                    <span className="text-neutral-400">Destino:</span>
                    <span className="text-white font-medium">{address}, {city}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800 pb-2">
                    <span className="text-neutral-400">Transportadora:</span>
                    <span className="text-orange-400 font-bold">Inter Rapidísimo (En alistamiento)</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-neutral-400">Total Pagado:</span>
                    <strong className="text-emerald-400 text-sm font-mono">{formatCOP(total)}</strong>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 max-w-lg mx-auto">
                  <a
                    href={`https://wa.me/573000000000?text=${whatsappConfirmationText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Notificar Despacho por WhatsApp</span>
                  </a>

                  <button
                    onClick={onClose}
                    className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors"
                  >
                    Cerrar y Continuar en la Tienda
                  </button>
                </div>

                <p className="text-[11px] text-neutral-500 italic">
                  Tu orden ya se encuentra registrada en el Backoffice Central de bodega para empaque inmediato.
                </p>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
