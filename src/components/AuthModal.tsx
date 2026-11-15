"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useStore } from "@/context/StoreContext";
import { X, Mail, ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, loginWithGoogle, loginWithEmail } = useStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"quick" | "email">("quick");
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isAuthModalOpen || !mounted || typeof document === "undefined") {
    return null;
  }

  const handleGoogleClick = async () => {
    setIsLoading(true);
    setStatusMessage("Conectando con Google Accounts...");
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error(err);
      setStatusMessage("Error al conectar. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      setStatusMessage("Por favor ingresa un correo electrónico válido.");
      return;
    }
    setIsLoading(true);
    setStatusMessage("Iniciando sesión...");
    try {
      await loginWithEmail(emailInput, nameInput);
    } catch (err) {
      console.error(err);
      setStatusMessage("Ocurrió un error. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999999] min-h-[100dvh] w-screen flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 text-white shadow-2xl my-auto animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center font-black text-neutral-950 text-2xl mx-auto mb-3 shadow-lg shadow-orange-600/30">
            GR
          </div>
          <h3 className="text-xl font-black uppercase text-white tracking-wide">
            Ingresa a Gordo Ryders
          </h3>
          <p className="text-xs text-neutral-400 mt-1.5 max-w-xs mx-auto">
            Guarda tus datos de despacho tipo Mercado Libre, emite facturas oficiales y rastrea tus compras en vivo.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-neutral-950 p-1 rounded-2xl border border-neutral-800 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("quick")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "quick"
                ? "bg-neutral-800 text-white shadow"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Acceso Rápido
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("email")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "email"
                ? "bg-neutral-800 text-white shadow"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            Con Correo
          </button>
        </div>

        {/* TAB 1: QUICK ACCESS (GOOGLE OAUTH) */}
        {activeTab === "quick" && (
          <div className="space-y-4">
            <button
              onClick={handleGoogleClick}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white hover:bg-neutral-100 text-neutral-950 font-black text-xs sm:text-sm transition-all cursor-pointer shadow-lg active:scale-[0.98] disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>{isLoading ? "Iniciando con Google..." : "Continuar con Google"}</span>
            </button>

            <div className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800/80 text-xs text-neutral-400 space-y-1.5">
              <div className="flex items-center gap-2 text-neutral-300 font-bold">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>¿Por qué ingresar con Google?</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Sin contraseñas difíciles de recordar. Tus compras, facturas colombianas y guías de mensajería quedan seguras y vinculadas a tu cuenta.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: EMAIL LOGIN / SIGNUP */}
        {activeTab === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                Nombre Completo (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej: Juan Camilo Pérez"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-300 mb-1">
                Correo Electrónico *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="tu_correo@ejemplo.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
                />
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-orange-600/20 active:scale-95 disabled:opacity-50"
            >
              <span>{isLoading ? "Procesando..." : "Ingresar o Crear Cuenta"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Status Feedback */}
        {statusMessage && (
          <p className="text-center text-xs text-orange-400 font-semibold mt-4">
            {statusMessage}
          </p>
        )}

        {/* Footer Security Badges */}
        <div className="pt-6 mt-6 border-t border-neutral-800/80 flex items-center justify-center gap-4 text-[10px] text-neutral-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>OAuth 2.0 & Cifrado SSL</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />
            <span>Datos Seguros Colombia</span>
          </span>
        </div>

      </div>
    </div>,
    document.body
  );
}
