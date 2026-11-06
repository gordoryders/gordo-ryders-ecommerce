"use client";

import { useRef, useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types";
import { ChevronLeft, ChevronRight, Zap, Clock } from "lucide-react";

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  badge?: string;
  products: Product[];
  onAddToCart?: (product: Product) => void;
  onViewDetail?: (product: Product) => void;
  showCountdown?: boolean;
}

export default function ProductCarousel({
  title,
  subtitle,
  badge = "OFERTA RELÁMPAGO",
  products,
  onAddToCart,
  onViewDetail,
  showCountdown = true,
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState({ hours: 6, minutes: 42, seconds: 15 });

  useEffect(() => {
    if (!showCountdown) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showCountdown]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-10 bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with Title and Countdown Timer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Zap className="w-5 h-5 fill-orange-500 text-orange-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded">
                  {badge}
                </span>
                {showCountdown && (
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-neutral-300 bg-neutral-900 border border-neutral-800 px-2.5 py-0.5 rounded-full">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Termina en:</span>
                    <span className="text-orange-400">
                      {String(timeLeft.hours).padStart(2, "0")}:{String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                  </div>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight mt-1">
                {title}
              </h2>
            </div>
          </div>

          {/* Carousel Arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center transition-colors shadow-md"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center transition-colors shadow-md"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[280px] sm:w-[310px] shrink-0 snap-start"
            >
              <ProductCard 
                product={product} 
                onAddToCart={onAddToCart} 
                onViewDetail={onViewDetail}
              />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
