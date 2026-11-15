"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  MessageSquare,
  X,
  Send,
  Bot,
  ShieldCheck,
  Sparkles,
  User,
  Truck,
  ExternalLink,
  ChevronRight,
  ShoppingBag,
  CheckCircle2,
  Phone,
  HelpCircle,
  Package,
} from "lucide-react";
import { useStore } from "@/context/StoreContext";
import { ChatMessage, SupportChatSession } from "@/types";

interface ChatbotSupportProps {
  onOpenTracking: () => void;
  onOpenContact: () => void;
}

export default function ChatbotSupport({ onOpenTracking, onOpenContact }: ChatbotSupportProps) {
  const {
    products,
    orders,
    currentUser,
    userCity,
    settings,
    addToCart,
    supportChats,
    sendMessageFromUser,
    requestHumanAgent,
  } = useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or restore session id
  useEffect(() => {
    try {
      if (currentUser) {
        setSessionId(`chat-${currentUser.id}`);
      } else {
        const stored = localStorage.getItem("gr_user_chat_session_id");
        if (stored) {
          setSessionId(stored);
        } else {
          const generated = `session-visitor-${Math.floor(1000 + Math.random() * 9000)}`;
          localStorage.setItem("gr_user_chat_session_id", generated);
          setSessionId(generated);
        }
      }
    } catch {}
  }, [currentUser]);

  // Find active chat session from store
  const activeSession = supportChats.find((c) => c.id === sessionId);

  // Default welcome messages if no session exists yet
  const defaultWelcomeMessages: ChatMessage[] = [
    {
      id: "welcome-1",
      sender: "bot",
      text: `¡Hola, motero! 🏍️ Bienvenido al asistente oficial de Gordo Ryders Colombia.\n\nPuedes preguntarme por cascos con doble visor, guantes, impermeables, consultar tu guía de envío o solicitar hablar con un asesor humano en vivo. ¿En qué te ayudamos hoy?`,
      timestamp: "Ahora",
      options: [
        { label: "🔍 Rastrear mi pedido con guía", action: "track" },
        { label: "📏 Guía interactiva de tallas", action: "sizes" },
        { label: "🪖 Cascos con certificación DOT/ECE", action: "helmets" },
        { label: "👑 Compras por mayor (desde 6 unds)", action: "wholesale" },
        { label: "🧑‍💼 Hablar con asesor humano en vivo", action: "request_human" },
      ],
    },
  ];

  const currentMessages: ChatMessage[] = activeSession?.messages?.length
    ? activeSession.messages
    : defaultWelcomeMessages;

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, currentMessages]);

  // Format currency
  const formatCOP = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Helper to dispatch user message and smart bot reaction
  const processUserMessage = (userText: string) => {
    if (!userText.trim()) return;

    const trimmed = userText.trim();
    const lower = trimmed.toLowerCase();
    const effectiveSessionId = sessionId || `session-visitor-${Math.floor(1000 + Math.random() * 9000)}`;
    if (!sessionId) setSessionId(effectiveSessionId);

    const customerName = currentUser?.name || "Visitante Web";
    const customerInfo = {
      customerName,
      customerEmail: currentUser?.email || "",
      customerPhone: currentUser?.phone || "",
      customerCity: currentUser?.city || userCity || "Bogotá D.C.",
      customerType: currentUser?.type || "detal",
    };

    // 1. Send user message to context
    sendMessageFromUser(effectiveSessionId, trimmed, customerName, customerInfo);

    // 2. SMART BOT REACTION ENGINE
    setTimeout(() => {
      // CASE A: User asks for human agent
      if (
        lower.includes("asesor") ||
        lower.includes("humano") ||
        lower.includes("persona") ||
        lower.includes("alguien") ||
        lower.includes("edwin") ||
        lower.includes("atencion") ||
        lower.includes("operador")
      ) {
        requestHumanAgent(effectiveSessionId);
        return;
      }

      // CASE B: User asks for order tracking or types a guide number
      const isGuidePattern = /(INT|SER|ENV|int|ser|env)[\w\d-]+|\d{7,12}/.test(trimmed);
      if (lower.includes("guia") || lower.includes("guía") || lower.includes("rastreo") || lower.includes("pedido") || lower.includes("envio") || lower.includes("envío") || isGuidePattern) {
        // Try to match order in database
        const foundOrder = orders.find(
          (o) =>
            o.guideNumber.toLowerCase().includes(lower) ||
            lower.includes(o.guideNumber.toLowerCase()) ||
            (currentUser && o.customerName.toLowerCase().includes(currentUser.name.toLowerCase()))
        );

        if (foundOrder) {
          sendMessageFromUser(
            effectiveSessionId,
            `📦 Encontré tu despacho: Guía ${foundOrder.guideNumber} con ${foundOrder.carrier}. Estado actual: ${foundOrder.status.replace("_", " ").toUpperCase()}. Destino: ${foundOrder.city}.`,
            "Bot Gordo Ryders",
            customerInfo,
            undefined,
            {
              guideNumber: foundOrder.guideNumber,
              carrier: foundOrder.carrier,
              status: foundOrder.status,
              customerName: foundOrder.customerName,
              city: foundOrder.city,
              date: foundOrder.date,
            }
          );
        } else {
          sendMessageFromUser(
            effectiveSessionId,
            `🔍 Para consultar el estado de tu paquete en vivo con Inter Rapidísimo o Envía, ingresa tu número de guía exacto (ej. INT-7009482) o abre nuestro rastreador satelital:`,
            "Bot Gordo Ryders",
            customerInfo
          );
        }
        return;
      }

      // CASE C: Sizing Guide (Fit Finder)
      if (lower.includes("talla") || lower.includes("tallas") || lower.includes("medir") || lower.includes("medida") || lower.includes("cabeza") || lower.includes("cm")) {
        sendMessageFromUser(
          effectiveSessionId,
          `📏 **GUÍA OFICIAL DE TALLAS GORDO RYDERS:**\n\n🪖 **Cascos ICH y Shaft:**\nMide el contorno de tu cabeza con cinta métrica 2 cm arriba de tus cejas:\n• **S:** 55 - 56 cm\n• **M:** 57 - 58 cm\n• **L:** 59 - 60 cm\n• **XL:** 61 - 62 cm\n*(Nota: Los primeros 3 días debe sentirse ajustado mientras el acolchado cede un 10%)*.\n\n🧤 **Guantes:** Ancho de palma sin pulgar: M (8 cm) | L (9 cm) | XL (10 cm).`,
          "Bot Gordo Ryders",
          customerInfo
        );
        return;
      }

      // CASE D: Wholesale B2B
      if (lower.includes("mayorista") || lower.includes("por mayor") || lower.includes("al por mayor") || lower.includes("docena") || lower.includes("taller") || lower.includes("distribuidor") || lower.includes("almacen")) {
        sendMessageFromUser(
          effectiveSessionId,
          `👑 **CANAL MAYORISTA B2B GORDO RYDERS:**\n\nManejamos venta al por mayor a partir de **6 unidades** para talleres y almacenes de motos con despachos a toda Colombia:\n• **Nivel Plata (6-11 unds):** -28% de margen\n• **Nivel Oro (12-23 unds):** -35% de margen\n• **Nivel Platino (24+ unds):** -42% de margen\n\nPuedes generar tu cotización formal con PDF en la sección /mayoristas o solicitar la atención de Edwin.`,
          "Bot Gordo Ryders",
          customerInfo
        );
        return;
      }

      // CASE E: Product Catalog Search
      const matchedProduct = products.find(
        (p) =>
          lower.includes(p.name.toLowerCase()) ||
          p.name.toLowerCase().includes(lower) ||
          p.category_name?.toLowerCase().includes(lower) ||
          (lower.includes("casco") && p.category_name?.toLowerCase().includes("casco")) ||
          (lower.includes("guante") && p.category_name?.toLowerCase().includes("guante")) ||
          (lower.includes("impermeable") && p.category_name?.toLowerCase().includes("impermeable"))
      );

      if (matchedProduct) {
        sendMessageFromUser(
          effectiveSessionId,
          `🏍️ Te recomiendo el **${matchedProduct.name}**:\nCuenta con certificación oficial y garantía directa de fábrica. Tenemos stock disponible para despacho hoy mismo.`,
          "Bot Gordo Ryders",
          customerInfo,
          {
            id: matchedProduct.id,
            name: matchedProduct.name,
            price: matchedProduct.price_retail,
            price_original: matchedProduct.price_original,
            image_url: matchedProduct.images?.[0] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600",
            slug: matchedProduct.slug,
            category: matchedProduct.category_name,
          }
        );
        return;
      }

      // CASE F: Fallback friendly response
      sendMessageFromUser(
        effectiveSessionId,
        `Recibido, motero. Si deseas una recomendación personalizada de cascos, combos o tiempo de entrega a tu ciudad, un asesor del equipo de bodega te puede responder aquí mismo o por WhatsApp.`,
        "Bot Gordo Ryders",
        customerInfo
      );
    }, 600);
  };

  const handleOptionClick = (action: string) => {
    if (action === "track") {
      setIsOpen(false);
      onOpenTracking();
      return;
    }

    if (action === "sizes") {
      processUserMessage("¿Cómo sé mi talla de casco y guantes?");
      return;
    }

    if (action === "helmets") {
      processUserMessage("Muéstrame cascos certificados disponibles");
      return;
    }

    if (action === "wholesale") {
      processUserMessage("Información de compras al por mayor y descuentos mayoristas");
      return;
    }

    if (action === "request_human") {
      processUserMessage("Deseo hablar con un asesor humano en vivo");
      return;
    }

    if (action === "contact") {
      setIsOpen(false);
      onOpenContact();
      return;
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const textToSend = inputText;
    setInputText("");
    processUserMessage(textToSend);
  };

  // WhatsApp transfer with intelligent pre-filled text
  const openWhatsAppWithContext = () => {
    const phone = (settings.whatsappSales || "+573000000000").replace(/\D/g, "");
    const lastUserQuery = currentMessages.filter((m) => m.sender === "user").slice(-1)[0]?.text || "información general";
    const text = `Hola Edwin y equipo Gordo Ryders, estaba en la tienda online y tengo una duda sobre: "${lastUserQuery}". ¿Me pueden asesorar?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Status indicator label
  const isAgentConnected = activeSession?.status === "agent_replying";
  const isWaitingHuman = activeSession?.status === "needs_human";

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700/80 p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:scale-105 transition-all group cursor-pointer"
            aria-label="Abrir asistente de soporte en vivo"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-orange-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-pulse" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-xs font-bold block text-white leading-tight">
                ¿Ayuda en línea?
              </span>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Asesor en vivo
              </span>
            </div>
            {activeSession && activeSession.unreadCountForUser > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-orange-500 text-neutral-950 font-black text-[10px] animate-bounce">
                {activeSession.unreadCountForUser} nuevo
              </span>
            )}
          </button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[92vw] sm:w-[410px] bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl text-white flex flex-col overflow-hidden animate-in fade-in zoom-in-95 max-h-[600px] h-[540px]">
          
          {/* Header */}
          <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold border border-orange-500/30">
                  {isAgentConnected ? <User className="w-5 h-5 text-emerald-400" /> : <Bot className="w-5 h-5" />}
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 ring-2 ring-neutral-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black uppercase text-white">
                    {isAgentConnected ? "Asesor Humano en Vivo" : "Soporte Gordo Ryders"}
                  </h3>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </div>
                <div className="text-[10px] flex items-center gap-1.5">
                  {isWaitingHuman ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1 animate-pulse">
                      <span>⏳</span> Conectando con asesor...
                    </span>
                  ) : isAgentConnected ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span>🧑‍💼</span> Edwin Bernal atendiendo
                    </span>
                  ) : (
                    <span className="text-neutral-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Smart Bot & Asesoría en vivo
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={openWhatsAppWithContext}
                title="Abrir en WhatsApp"
                className="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs scrollbar-thin scrollbar-thumb-neutral-800">
            {currentMessages.map((msg, i) => {
              const isUser = msg.sender === "user";
              const isAgent = msg.sender === "agent";

              return (
                <div
                  key={msg.id || i}
                  className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                >
                  {/* Sender Name Pill */}
                  {!isUser && (
                    <span className="text-[10px] font-bold text-neutral-400 mb-1 flex items-center gap-1">
                      {isAgent ? (
                        <>
                          <span className="text-emerald-400 font-black">🧑‍💼 {msg.senderName || "Asesor Edwin Bernal"}</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">OFICIAL</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 text-orange-400" />
                          <span>{msg.senderName || "Asistente Virtual"}</span>
                        </>
                      )}
                      <span className="text-neutral-600">• {msg.timestamp}</span>
                    </span>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl max-w-[88%] leading-relaxed ${
                      isUser
                        ? "bg-orange-500 text-neutral-950 font-bold rounded-tr-none shadow-md shadow-orange-500/10"
                        : isAgent
                        ? "bg-neutral-900 border-2 border-emerald-500/40 text-neutral-100 rounded-tl-none shadow-md shadow-emerald-500/5"
                        : "bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-tl-none"
                    }`}
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {msg.text}

                    {/* Integrated Product Card Preview */}
                    {msg.productCard && (
                      <div className="mt-3 p-2.5 rounded-xl bg-neutral-900 border border-neutral-700/80 space-y-2 text-white">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={msg.productCard.image_url}
                            alt={msg.productCard.name}
                            className="w-12 h-12 rounded-lg object-cover bg-neutral-950"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] text-orange-400 font-bold uppercase block">
                              {msg.productCard.category || "Accesorio Motero"}
                            </span>
                            <h5 className="text-xs font-black truncate text-white">
                              {msg.productCard.name}
                            </h5>
                            <div className="flex items-center gap-1.5 font-mono">
                              <span className="text-emerald-400 font-black">
                                {formatCOP(msg.productCard.price)}
                              </span>
                              {msg.productCard.price_original && (
                                <span className="text-neutral-500 text-[10px] line-through">
                                  {formatCOP(msg.productCard.price_original)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 pt-1 border-t border-neutral-800">
                          <Link
                            href={`/producto/${msg.productCard.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="flex-1 py-1 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-center text-[10px] font-bold text-white transition-colors"
                          >
                            Ver Producto
                          </Link>
                          <button
                            onClick={() => {
                              const found = products.find((p) => p.id === msg.productCard?.id);
                              if (found) addToCart(found);
                            }}
                            className="p-1 px-2.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Agregar</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Integrated Order Tracking Card Preview */}
                    {msg.orderCard && (
                      <div className="mt-3 p-3 rounded-xl bg-neutral-900 border border-emerald-500/40 space-y-2 text-white">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-emerald-400 flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5" />
                            <span>{msg.orderCard.carrier}</span>
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">{msg.orderCard.date}</span>
                        </div>
                        <div>
                          <span className="text-xs font-mono font-black text-white block">
                            Guía: {msg.orderCard.guideNumber}
                          </span>
                          <span className="text-[11px] text-neutral-300">
                            Destino: <strong>{msg.orderCard.city}</strong>
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            onOpenTracking();
                          }}
                          className="w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-black text-[10px] text-center transition-colors cursor-pointer"
                        >
                          Ver Rastreo Satelital Completo
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Interactive Options */}
                  {msg.options && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {msg.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleOptionClick(opt.action)}
                          className="text-[11px] font-bold bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-orange-400 border border-neutral-700/80 px-3 py-1.5 rounded-xl transition-all text-left flex items-center gap-1 cursor-pointer"
                        >
                          <span>{opt.label}</span>
                          <ChevronRight className="w-3 h-3 text-neutral-500" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="px-3 py-2 bg-neutral-950/80 border-t border-neutral-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[10px]">
            <button
              onClick={() => handleOptionClick("sizes")}
              className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 cursor-pointer transition-colors"
            >
              📏 Tallas
            </button>
            <button
              onClick={() => handleOptionClick("track")}
              className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 cursor-pointer transition-colors"
            >
              🔍 Rastrear
            </button>
            <button
              onClick={() => handleOptionClick("wholesale")}
              className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 cursor-pointer transition-colors font-bold"
            >
              👑 Mayoristas B2B
            </button>
            <button
              onClick={() => handleOptionClick("request_human")}
              className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 cursor-pointer transition-colors font-bold"
            >
              🧑‍💼 Hablar con Asesor
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-neutral-950 border-t border-neutral-800 flex gap-2 items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Pregunta por cascos, tallas o tu pedido..."
              className="flex-1 bg-neutral-900 border border-neutral-800 text-xs rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              className="p-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 rounded-xl transition-all cursor-pointer font-bold"
              title="Enviar mensaje"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
