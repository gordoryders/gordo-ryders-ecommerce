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
  MessageCircle,
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
    sendMessageFromBot,
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
      senderName: "Asistente Gordo Ryders",
      text: `¡Hola, motero! 🏍️ Bienvenido al asistente oficial de Gordo Ryders Colombia.\n\nEstoy aquí para ayudarte a elegir tu talla, recomendarte cascos homologados, cotizar compras al por mayor o conectarte con un asesor en bodega. ¿En qué te ayudamos hoy?`,
      timestamp: "Ahora",
      options: [
        { label: "📏 ¿Cómo sé mi talla de casco y guantes?", action: "sizes" },
        { label: "🪖 Ver cascos con doble visor homologados", action: "helmets" },
        { label: "📦 Rastrear un pedido", action: "track" },
        { label: "👑 Precios al por mayor (desde 6 unds)", action: "wholesale" },
        { label: "🧑‍💼 Hablar con un asesor humano en vivo", action: "request_human" },
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

  // Helper to format text with bold formatting and bullets cleanly (no raw **)
  const renderFormattedText = (text: string) => {
    return text.split("\n").map((line, lIdx) => {
      if (!line.trim()) {
        return <span key={lIdx} className="block h-2" />;
      }
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={lIdx} className="block leading-relaxed">
          {parts.map((part, pIdx) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <strong key={pIdx} className="text-white font-bold">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </span>
      );
    });
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
        sendMessageFromBot(
          effectiveSessionId,
          `🔔 **Solicitud enviada al equipo de bodega:**\nEdwin Bernal o uno de nuestros asesores oficiales ha recibido tu conversación. Te responderá directamente en esta pantalla.\n\nSi prefieres una respuesta inmediata a tu celular:`,
          "Asistente Gordo Ryders",
          customerInfo,
          undefined,
          undefined,
          [
            { label: "💬 Continuar por WhatsApp Oficial", action: "open_whatsapp" }
          ]
        );
        return;
      }

      // CASE B: User asks for order tracking or types a guide number
      const isGuidePattern = /(ORD|INT|SER|ENV|ord|int|ser|env)[\w\d-]+|\d{7,12}/.test(trimmed);
      if (
        lower.includes("guia") ||
        lower.includes("guía") ||
        lower.includes("rastreo") ||
        lower.includes("pedido") ||
        lower.includes("envio") ||
        lower.includes("envío") ||
        isGuidePattern
      ) {
        // Try to match order in database
        const foundOrder = orders.find(
          (o) =>
            o.guideNumber.toLowerCase().includes(lower) ||
            o.id.toLowerCase().includes(lower) ||
            lower.includes(o.guideNumber.toLowerCase()) ||
            lower.includes(o.id.toLowerCase()) ||
            (currentUser && o.customerName.toLowerCase().includes(currentUser.name.toLowerCase()))
        );

        if (foundOrder) {
          sendMessageFromBot(
            effectiveSessionId,
            `📦 **¡Despacho Encontrado!**\nGuía oficial: **${foundOrder.guideNumber}** con transportadora **${foundOrder.carrier}**.\nEstado: **${foundOrder.status.replace("_", " ").toUpperCase()}**.\nDestino: **${foundOrder.city}**.`,
            "Asistente Gordo Ryders",
            customerInfo,
            undefined,
            {
              guideNumber: foundOrder.guideNumber,
              carrier: foundOrder.carrier,
              status: foundOrder.status,
              customerName: foundOrder.customerName,
              city: foundOrder.city,
              date: foundOrder.date,
            },
            [
              { label: "🔍 Ver Seguimiento Satelital Completo", action: "open_tracking_page" }
            ]
          );
        } else {
          sendMessageFromBot(
            effectiveSessionId,
            `🔍 **Rastreo de Envíos Nacionales:**\nPara ver el estado en vivo con Inter Rapidísimo o Envía, por favor escribe tu **número de guía** (ej: INT-7009482) o tu **número de orden** (ej: ORD-GR-1024).\n\nTambién puedes abrir la plataforma de rastreo:`,
            "Asistente Gordo Ryders",
            customerInfo,
            undefined,
            undefined,
            [
              { label: "🚀 Abrir Módulo de Rastreo", action: "open_tracking_page" }
            ]
          );
        }
        return;
      }

      // CASE C: Sizing Guide (Fit Finder)
      if (
        lower.includes("talla") ||
        lower.includes("tallas") ||
        lower.includes("medir") ||
        lower.includes("medida") ||
        lower.includes("cabeza") ||
        lower.includes("cm")
      ) {
        sendMessageFromBot(
          effectiveSessionId,
          `📏 **GUÍA OFICIAL DE TALLAS GORDO RYDERS:**\n\n🪖 **Cascos ICH, Shaft & HRO:**\nMide el contorno de tu cabeza con una cinta métrica 2 cm arriba de tus cejas:\n• **Talla S:** 55 - 56 cm\n• **Talla M:** 57 - 58 cm\n• **Talla L:** 59 - 60 cm\n• **Talla XL:** 61 - 62 cm\n*(Tip motero: Los primeros 3 días el casco debe sentirse ajustado mientras el acolchado cede un 10%)*.\n\n🧤 **Guantes:** Mide el ancho de tu palma sin incluir el pulgar:\n• **M:** 8 a 8.5 cm | **L:** 9 a 9.5 cm | **XL:** 10 cm en adelante.`,
          "Asistente Gordo Ryders",
          customerInfo,
          undefined,
          undefined,
          [
            { label: "🪖 Ver Cascos Abatibles ICH", action: "helmets" },
            { label: "🧑‍💼 Confirmar Talla con un Asesor", action: "request_human" },
          ]
        );
        return;
      }

      // CASE D: Wholesale B2B
      if (
        lower.includes("mayorista") ||
        lower.includes("por mayor") ||
        lower.includes("al por mayor") ||
        lower.includes("docena") ||
        lower.includes("taller") ||
        lower.includes("distribuidor") ||
        lower.includes("almacen")
      ) {
        sendMessageFromBot(
          effectiveSessionId,
          `👑 **CANAL MAYORISTA B2B GORDO RYDERS:**\n\nDespachamos al por mayor desde **6 unidades** con precios de importador directo para almacenes, talleres y moteros emprendedores:\n\n• **Nivel Plata (6 a 11 unds):** -28% de descuento\n• **Nivel Oro (12 a 23 unds):** -35% de descuento\n• **Nivel Platino (24+ unds):** -42% de descuento\n\nPuedes armar tu pedido con cotización formal en PDF en nuestra sección mayorista:`,
          "Asistente Gordo Ryders",
          customerInfo,
          undefined,
          undefined,
          [
            { label: "👑 Ver Catálogo y Cotizador Mayorista", action: "open_wholesale_page" },
            { label: "🧑‍💼 Cotizar por WhatsApp con Bodega", action: "open_whatsapp" },
          ]
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
        sendMessageFromBot(
          effectiveSessionId,
          `🏍️ Te recomiendo el **${matchedProduct.name}**:\nCuenta con certificación oficial para rodar seguro por Colombia y garantía de fábrica. Tenemos stock disponible para despacho inmediato hoy.`,
          "Asistente Gordo Ryders",
          customerInfo,
          {
            id: matchedProduct.id,
            name: matchedProduct.name,
            price: matchedProduct.price_retail,
            price_original: matchedProduct.price_original,
            image_url: matchedProduct.images?.[0] || "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=600",
            slug: matchedProduct.slug,
            category: matchedProduct.category_name,
          },
          undefined,
          [
            { label: "📏 ¿Qué talla soy para este producto?", action: "sizes" },
            { label: "🧑‍💼 Consultar disponibilidad en bodega", action: "request_human" },
          ]
        );
        return;
      }

      // CASE F: Fallback friendly response
      sendMessageFromBot(
        effectiveSessionId,
        `Recibido, motero. Si tienes una consulta sobre referencias de cascos, combos o tiempos de entrega a tu ciudad, un asesor del equipo de bodega te puede responder aquí mismo o por WhatsApp.`,
        "Asistente Gordo Ryders",
        customerInfo,
        undefined,
        undefined,
        [
          { label: "📏 Guía de Tallas", action: "sizes" },
          { label: "🧑‍💼 Hablar con Asesor en Vivo", action: "request_human" },
        ]
      );
    }, 500);
  };

  const handleOptionClick = (action: string) => {
    if (action === "track") {
      processUserMessage("Deseo rastrear mi pedido");
      return;
    }

    if (action === "open_tracking_page") {
      setIsOpen(false);
      onOpenTracking();
      return;
    }

    if (action === "sizes") {
      processUserMessage("¿Cómo sé mi talla de casco y guantes?");
      return;
    }

    if (action === "helmets") {
      processUserMessage("Muéstrame cascos certificados con doble visor");
      return;
    }

    if (action === "wholesale") {
      processUserMessage("Información de compras al por mayor y descuentos mayoristas");
      return;
    }

    if (action === "open_wholesale_page") {
      window.location.href = "/mayoristas";
      return;
    }

    if (action === "request_human") {
      processUserMessage("Deseo hablar con un asesor humano en vivo");
      return;
    }

    if (action === "open_whatsapp") {
      openWhatsAppWithContext();
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
      <div className="fixed bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 z-40">
        <div className="relative">
          {!isOpen && (
            <button
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2 sm:gap-2.5 bg-neutral-900/95 backdrop-blur-md hover:bg-neutral-800 text-white border border-neutral-700/80 p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group cursor-pointer"
              aria-label="Abrir asistente de soporte en vivo"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30 group-hover:bg-orange-500 group-hover:text-neutral-950 transition-colors">
                  <Bot className="w-4 h-4" />
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 ring-2 ring-neutral-900 animate-pulse" />
              </div>
              <div className="hidden sm:block text-left pr-1">
                <span className="text-[11px] font-black uppercase tracking-wider block text-white leading-none">
                  Soporte & Asesoría
                </span>
                <span className="text-[9px] text-emerald-400 font-medium">
                  {isAgentConnected ? "Asesor en vivo" : "En línea • Pregúntanos"}
                </span>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 z-50 w-[calc(100vw-1.75rem)] sm:w-96 max-h-[82vh] h-[580px] bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header Bar */}
          <div className="bg-neutral-900/90 backdrop-blur-md px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center">
                  {isAgentConnected ? <User className="w-4 h-4 text-emerald-400" /> : <Bot className="w-4 h-4" />}
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 ring-2 ring-neutral-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black uppercase text-white tracking-wide">
                    {isAgentConnected ? "Edwin Bernal (Asesor Oficial)" : "Soporte Gordo Ryders"}
                  </h3>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </div>
                <div className="text-[10px] flex items-center gap-1.5">
                  {isWaitingHuman ? (
                    <span className="text-amber-400 font-bold flex items-center gap-1 animate-pulse">
                      <span>⏳</span> Conectando con asesor de bodega...
                    </span>
                  ) : isAgentConnected ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <span>🟢</span> Asesor en vivo atendiendo
                    </span>
                  ) : (
                    <span className="text-neutral-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Asistente Virtual • Respuesta Inmediata
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
                aria-label="Cerrar chat"
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
                          <span className="text-emerald-400 font-black">🧑‍💼 {msg.senderName || "Edwin Bernal"}</span>
                          <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 rounded border border-emerald-500/20">ASESOR OFICIAL</span>
                        </>
                      ) : (
                        <>
                          <Bot className="w-3 h-3 text-orange-400" />
                          <span>{msg.senderName || "Asistente Gordo Ryders"}</span>
                        </>
                      )}
                      <span className="text-neutral-600">• {msg.timestamp}</span>
                    </span>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed text-xs ${
                      isUser
                        ? "bg-orange-500 text-neutral-950 font-bold rounded-tr-sm shadow-md shadow-orange-500/10 ml-auto max-w-[85%]"
                        : isAgent
                        ? "bg-neutral-900 border border-emerald-500/40 text-neutral-100 rounded-tl-sm shadow-md shadow-emerald-500/5 mr-auto max-w-[90%]"
                        : "bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-sm mr-auto max-w-[90%]"
                    }`}
                  >
                    {renderFormattedText(msg.text)}

                    {/* Integrated Product Card Preview */}
                    {msg.productCard && (
                      <div className="mt-3 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-white">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={msg.productCard.image_url}
                            alt={msg.productCard.name}
                            className="w-12 h-12 rounded-lg object-cover bg-neutral-900 shrink-0"
                            loading="lazy"
                            decoding="async"
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
                            Ver en Tienda
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
                      <div className="mt-3 p-3 rounded-xl bg-neutral-950 border border-emerald-500/40 space-y-2 text-white">
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

                  {/* Contextual Suggestion Chips (Under Bot Message) */}
                  {msg.options && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {msg.options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleOptionClick(opt.action)}
                          className="text-[11px] font-medium bg-neutral-900/90 hover:bg-neutral-800 text-neutral-200 hover:text-orange-400 border border-neutral-800 hover:border-orange-500/40 px-3 py-1.5 rounded-xl transition-all text-left flex items-center gap-1 cursor-pointer active:scale-95"
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

          {/* Clean Input Form (No Clunky Static Bottom Bar) */}
          <form onSubmit={handleSend} className="p-3 bg-neutral-900/90 border-t border-neutral-800 flex gap-2 items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu duda, talla o número de guía..."
              className="flex-1 bg-neutral-950 border border-neutral-800 text-xs rounded-xl px-3.5 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              className="p-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-neutral-950 rounded-xl transition-all cursor-pointer font-bold shadow-md shadow-orange-500/20"
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
