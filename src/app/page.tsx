"use client";

import HeroSlider from "@/components/HeroSlider";
import CategoryBubbles from "@/components/CategoryBubbles";
import PromoTiles from "@/components/PromoTiles";
import ProductCarousel from "@/components/ProductCarousel";
import LookbookCollage from "@/components/LookbookCollage";
import CombosSection from "@/components/CombosSection";
import BrandStrip from "@/components/BrandStrip";
import WholesaleBanner from "@/components/WholesaleBanner";
import { useStore } from "@/context/StoreContext";

export default function Home() {
  const { addToCart, products, albums } = useStore();

  const activeProducts = products.filter((p) => p.is_active);

  // Ofertas Relámpago reales (Solo productos con oferta activa activada en Admin)
  const offerProducts = activeProducts.filter(
    (p) => Boolean(p.offer_is_active) && Boolean(p.offer_price || (p.price_original && p.price_original > p.price_retail))
  );

  const newArrivals = activeProducts.filter(
    (p) => p.is_new_arrival || p.badge?.includes("MÁS VENDIDO") || p.badge?.includes("NUEVA") || p.badge?.includes("2026")
  );

  return (
    <div>
      {/* 1. Hero Slider Principal (Carrusel automático con fotos reales) */}
      <HeroSlider />

      {/* 2. Categorías con Fotografía Real */}
      <CategoryBubbles />

      {/* 3. Carrusel de Novedades & Nuevos Ingresos 2026 */}
      <ProductCarousel
        title="Novedades & Nuevos Ingresos 2026"
        badge="RECIÉN LLEGADO"
        products={newArrivals.length > 0 ? newArrivals : activeProducts}
        onAddToCart={(p) => addToCart(p, "M", "Negro", 1)}
        showCountdown={false}
      />

      {/* 4. Banners Triples Promocionales */}
      <PromoTiles />

      {/* 5. Carrusel de Ofertas Relámpago (Solo si hay al menos una oferta activa configurada) */}
      {offerProducts.length > 0 && (
        <ProductCarousel
          title="Ofertas Relámpago de la Semana"
          badge="OFERTA DEL DÍA"
          products={offerProducts}
          onAddToCart={(p) => addToCart(p, "M", "Negro", 1)}
          showCountdown={true}
        />
      )}

      {/* 6. Combos & Packs con Fotos Completas y Descuento Especial */}
      <CombosSection />

      {/* 7. Collages de Cascos por Líneas (Navegación directa al catálogo) */}
      <LookbookCollage albums={albums} />

      {/* 8. Tira de Marcas Oficiales (ICH Helmets, Proviker, etc.) */}
      <BrandStrip />

      {/* 9. Canal Mayorista B2B */}
      <WholesaleBanner />
    </div>
  );
}
