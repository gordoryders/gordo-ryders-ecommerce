"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { ChevronLeft, ChevronRight, ArrowRight, ShieldCheck, CreditCard, Truck, MessageCircle } from "lucide-react";

export default function HeroSlider() {
  const { banners } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const isHorizontalSwipe = useRef<boolean>(false);

  const activeSlides = banners.filter((b) => b.isActive);
  const slides = activeSlides.length > 0 ? activeSlides : banners;

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length, currentSlide]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = null;
    isHorizontalSwipe.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = Math.abs(currentX - touchStartX.current);
    const diffY = Math.abs(currentY - touchStartY.current);

    if (diffX > diffY && diffX > 10) {
      isHorizontalSwipe.current = true;
      touchEndX.current = currentX;
    }
  };

  const handleTouchEnd = () => {
    if (!isHorizontalSwipe.current || touchStartX.current === null || touchEndX.current === null) {
      touchStartX.current = null;
      touchStartY.current = null;
      touchEndX.current = null;
      return;
    }
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;
    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    touchStartX.current = null;
    touchStartY.current = null;
    touchEndX.current = null;
    isHorizontalSwipe.current = false;
  };

  return (
    <div className="relative bg-neutral-950">
      
      {/* 1. SLIDER CONTAINER (Touch-swipeable on Mobile & Tablet) */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative min-h-[490px] sm:min-h-0 sm:h-[520px] lg:h-[600px] w-full overflow-hidden touch-pan-y select-none bg-neutral-950"
      >
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`transition-opacity duration-700 ease-in-out ${
                isActive
                  ? "relative sm:absolute sm:inset-0 opacity-100 z-10"
                  : "absolute inset-0 opacity-0 z-0 pointer-events-none"
              }`}
            >
              {/* MOBILE IMAGE BANNER (Clean unobstructed photo above text) */}
              <div className="relative h-[215px] w-full sm:hidden overflow-hidden bg-neutral-900">
                <img
                  src={slide.bgImage}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center brightness-105 contrast-105 saturate-110"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-transparent" />
                <div className="absolute top-3 left-4 right-4 flex items-center">
                  <div className="inline-flex items-center gap-2 bg-neutral-950/85 border border-neutral-700/80 px-3 py-1 rounded-full backdrop-blur-md max-w-full shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping shrink-0" />
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-orange-400 truncate">
                      {slide.tag}
                    </span>
                  </div>
                </div>
              </div>

              {/* DESKTOP / TABLET BACKGROUND IMAGE */}
              <div
                className="hidden sm:block absolute inset-0 bg-cover bg-center brightness-105 contrast-105 saturate-110"
                style={{
                  backgroundImage: `url(${slide.bgImage})`,
                }}
              >
                {/* Soft left vignette to guarantee 100% white text legibility, leaving the right side 100% clear & bright */}
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/40 to-transparent w-[70%]" />
                {/* Subtle bottom fade only where slider meets the next section */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-transparent" />
              </div>

              {/* Slide Content */}
              <div className="relative sm:h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-12 sm:py-0 flex flex-col justify-center">
                <div className="max-w-2xl space-y-2.5 sm:space-y-5">
                  
                  {/* Desktop Badge */}
                  <div className="hidden sm:inline-flex items-center gap-2 bg-neutral-900/90 border border-neutral-700/80 px-3.5 py-1.5 rounded-full backdrop-blur-md max-w-full">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping shrink-0" />
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-orange-400 truncate">
                      {slide.tag}
                    </span>
                  </div>

                  {/* Title with Luminous Color Highlight */}
                  <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[1.06] sm:leading-[0.95] drop-shadow-md break-words">
                    {slide.title} <br />
                    <span className={`text-transparent bg-clip-text bg-gradient-to-r ${slide.accentColor} filter drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]`}>
                      {slide.highlight}
                    </span>
                  </h1>

                  {/* Subtitle */}
                  <p className="text-neutral-300 text-xs sm:text-base font-normal leading-relaxed max-w-md sm:max-w-xl line-clamp-3 sm:line-clamp-none">
                    {slide.subtitle}
                  </p>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
                    <Link
                      href={slide.buttonLink}
                      className="bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-neutral-950 font-black px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 hover:gap-3 transition-all"
                    >
                      <span>{slide.buttonText}</span>
                      <ArrowRight className="w-4 h-4 shrink-0" />
                    </Link>

                    {slide.secondaryText && (
                      <a
                        href={slide.secondaryLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-neutral-900/90 hover:bg-neutral-800 active:scale-[0.98] border border-neutral-700 text-white font-bold px-5 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm uppercase tracking-wider backdrop-blur-md transition-all flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{slide.secondaryText}</span>
                      </a>
                    )}
                  </div>

                </div>
              </div>

            </div>
          );
        })}

        {/* Navigation Arrows (Desktop Only — Mobile & Tablet use touch swipe) */}
        <button
          onClick={prevSlide}
          className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-neutral-900/70 hover:bg-neutral-800 text-white items-center justify-center border border-neutral-700/80 backdrop-blur-md transition-all shadow-lg hover:scale-110 cursor-pointer"
          aria-label="Diapositiva anterior"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-neutral-900/70 hover:bg-neutral-800 text-white items-center justify-center border border-neutral-700/80 backdrop-blur-md transition-all shadow-lg hover:scale-110 cursor-pointer"
          aria-label="Siguiente diapositiva"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                i === currentSlide
                  ? "w-8 bg-orange-500"
                  : "w-2 bg-neutral-500/80 hover:bg-neutral-400"
              }`}
              aria-label={`Ir a la diapositiva ${i + 1}`}
            />
          ))}
        </div>

      </div>

      {/* 2. MERCADO LIBRE STYLE FAST-BENEFITS BAR (Underneath Hero) */}
      <div className="bg-neutral-900 border-y border-neutral-800 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs">
            
            <div className="flex items-center gap-2.5 sm:gap-3 text-neutral-200 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white text-[11px] sm:text-xs leading-tight truncate">Envíos a toda Colombia</p>
                <p className="text-[10px] text-neutral-400 truncate">Guía Servientrega e Inter</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 text-neutral-200 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white text-[11px] sm:text-xs leading-tight truncate">Hasta 12 cuotas</p>
                <p className="text-[10px] text-neutral-400 truncate">PSE, Nequi y Tarjetas</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 text-neutral-200 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white text-[11px] sm:text-xs leading-tight truncate">Garantía Directa</p>
                <p className="text-[10px] text-neutral-400 truncate">100% repuestos originales</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-3 text-neutral-200 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white text-[11px] sm:text-xs leading-tight truncate">Canal Mayorista</p>
                <p className="text-[10px] text-neutral-400 truncate">Descuentos por volumen</p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
