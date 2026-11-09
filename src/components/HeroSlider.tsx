"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, CreditCard, Truck, MessageCircle } from "lucide-react";

export default function HeroSlider() {
  const { banners } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const activeSlides = banners.filter((b) => b.isActive);
  const slides = activeSlides.length > 0 ? activeSlides : banners;

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="relative bg-neutral-950">
      
      {/* 1. SLIDER CONTAINER */}
      <div className="relative h-[480px] sm:h-[540px] lg:h-[600px] w-full overflow-hidden">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* Background Image with Dark Vignette */}
              <div
                className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-[7000ms]"
                style={{
                  backgroundImage: `url(${slide.bgImage})`,
                  transform: isActive ? "scale(1)" : "scale(1.08)",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 to-neutral-950/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/60" />
              </div>

              {/* Slide Content */}
              <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
                <div className="max-w-2xl space-y-4 sm:space-y-6">
                  
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 bg-neutral-900/90 border border-neutral-700/80 px-3.5 py-1.5 rounded-full backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-400">
                      {slide.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[0.95]">
                    {slide.title} <br />
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.accentColor}`}>
                      {slide.highlight}
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-neutral-300 text-sm sm:text-base font-normal leading-relaxed max-w-xl">
                    {slide.subtitle}
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link
                      href={slide.buttonLink}
                      className="bg-orange-500 hover:bg-orange-600 text-neutral-950 font-black px-6 py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-orange-500/25 hover:gap-3 transition-all"
                    >
                      <span>{slide.buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {slide.secondaryText && (
                      <a
                        href={slide.secondaryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-white font-bold px-5 py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider backdrop-blur-md transition-all flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-400" />
                        <span>{slide.secondaryText}</span>
                      </a>
                    )}
                  </div>

                </div>
              </div>

            </div>
          );
        })}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-neutral-900/70 hover:bg-neutral-800 text-white flex items-center justify-center border border-neutral-700/80 backdrop-blur-md transition-all shadow-lg hover:scale-110"
          aria-label="Diapositiva anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-neutral-900/70 hover:bg-neutral-800 text-white flex items-center justify-center border border-neutral-700/80 backdrop-blur-md transition-all shadow-lg hover:scale-110"
          aria-label="Siguiente diapositiva"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide
                  ? "w-8 bg-orange-500"
                  : "w-2 bg-neutral-600 hover:bg-neutral-400"
              }`}
              aria-label={`Ir a la diapositiva ${i + 1}`}
            />
          ))}
        </div>

      </div>

      {/* 2. MERCADO LIBRE STYLE FAST-BENEFITS BAR (Underneath Hero) */}
      <div className="bg-neutral-900 border-y border-neutral-800 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            
            <div className="flex items-center gap-3 text-neutral-200">
              <div className="w-9 h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white text-[11px] sm:text-xs leading-tight">Envíos a toda Colombia</p>
                <p className="text-[10px] text-neutral-400">Guía Servientrega e Inter</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-neutral-200">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white text-[11px] sm:text-xs leading-tight">Hasta 12 cuotas</p>
                <p className="text-[10px] text-neutral-400">PSE, Nequi y Tarjetas</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-neutral-200">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white text-[11px] sm:text-xs leading-tight">Garantía Directa</p>
                <p className="text-[10px] text-neutral-400">100% repuestos originales</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-neutral-200">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white text-[11px] sm:text-xs leading-tight">Canal Mayorista</p>
                <p className="text-[10px] text-neutral-400">Descuentos por volumen</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
