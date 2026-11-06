"use client";

import { useState } from "react";
import { MessageSquare, X, Send, Bot, ShieldCheck, Sparkles } from "lucide-react";

interface Message {
  sender: "bot" | "user";
  text: string;
  options?: { label: string; action: string }[];
}

interface ChatbotSupportProps {
  onOpenTracking: () => void;
  onOpenContact: () => void;
}

export default function ChatbotSupport({ onOpenTracking, onOpenContact }: ChatbotSupportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "¡Hola, motero! 🏍️ Bienvenido al asistente de Gordo Ryders. ¿En qué te podemos ayudar hoy?",
      options: [
        { label: "🔍 Rastrear mi pedido con guía", action: "track" },
        { label: "📏 Guía de tallas (Cascos / Guantes)", action: "sizes" },
        { label: "📦 Precios y catálogo mayorista", action: "wholesale" },
        { label: "💬 Hablar con un asesor en WhatsApp", action: "human" },
      ],
    },
  ]);
  const [inputText, setInputText] = useState("");

  const handleOptionClick = (action: string) => {
    if (action === "track") {
      setIsOpen(false);
      onOpenTracking();
      return;
    }

    if (action === "human") {
      window.open(
        "https://wa.me/573000000000?text=Hola%20Gordo%20Ryders,%20necesito%20atención%20humana%20con%20un%20asesor",
        "_blank"
      );
      return;
    }

    if (action === "wholesale") {
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: "Precios y catálogo mayorista" },
        {
          sender: "bot",
          text: "¡Excelente! Manejamos ventas al por mayor a partir de 6 o 12 unidades con márgenes de hasta el 45% para almacenes y talleres. Puedes descargar el catálogo o hablar directo con Edwin.",
          options: [
            { label: "💬 Hablar con Edwin (Mayoristas)", action: "human" },
            { label: "📍 Ver bodega física", action: "contact" },
          ],
        },
      ]);
      return;
    }

    if (action === "contact") {
      setIsOpen(false);
      onOpenContact();
      return;
    }

    if (action === "sizes") {
      setMessages((prev) => [
        ...prev,
        { sender: "user", text: "Guía de tallas de cascos y guantes" },
        {
          sender: "bot",
          text: "📌 **Cascos:** Mide la circunferencia de tu cabeza 2 cm arriba de las cejas:\n• S: 55-56 cm\n• M: 57-58 cm\n• L: 59-60 cm\n• XL: 61-62 cm\n\n📌 **Guantes:** Mide el ancho de la palma de tu mano sin el pulgar:\n• M: 8-8.5 cm | L: 8.5-9 cm | XL: 9-10 cm.",
          options: [
            { label: "💬 ¿Dudas? Pregúntanos por WhatsApp", action: "human" },
          ],
        },
      ]);
      return;
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText.trim();
    setInputText("");
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMsg },
      {
        sender: "bot",
        text: "Recibido. Un asesor de Gordo Ryders puede responderte de inmediato en WhatsApp para confirmar existencias y fotos de la bodega.",
        options: [
          { label: "💬 Abrir chat en WhatsApp", action: "human" },
          { label: "🔍 Rastrear guía", action: "track" },
        ],
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button (Bottom Right) */}
      <div className="fixed bottom-4 right-4 z-40">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700/80 p-3 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:scale-105 transition-all group"
            aria-label="Abrir asistente de soporte"
          >
            <div className="relative">
              <Bot className="w-5 h-5 text-orange-400" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-pulse" />
            </div>
            <span className="text-xs font-bold hidden sm:inline text-neutral-200">
              ¿Ayuda en línea?
            </span>
          </button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[92vw] sm:w-96 bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl text-white flex flex-col overflow-hidden animate-in fade-in zoom-in-95 max-h-[550px] h-[500px]">
          
          {/* Header */}
          <div className="bg-neutral-950 p-4 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-black uppercase text-white">Soporte Gordo Ryders</h3>
                  <Sparkles className="w-3 h-3 text-amber-400" />
                </div>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  En línea • Respuesta inmediata
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs scrollbar-thin">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-orange-500 text-neutral-950 font-semibold"
                      : "bg-neutral-950 border border-neutral-800 text-neutral-200"
                  }`}
                  style={{ whiteSpace: "pre-line" }}
                >
                  {msg.text}
                </div>

                {/* Quick Action Options */}
                {msg.options && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => handleOptionClick(opt.action)}
                        className="text-[11px] font-bold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-orange-400 border border-neutral-700/80 px-3 py-1.5 rounded-full transition-colors text-left"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-neutral-950 border-t border-neutral-800 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="flex-1 bg-neutral-900 border border-neutral-800 text-xs rounded-xl px-3 py-2 text-white placeholder-neutral-500 focus:outline-none focus:border-orange-500"
            />
            <button
              type="submit"
              className="p-2 bg-orange-500 hover:bg-orange-600 text-neutral-950 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
