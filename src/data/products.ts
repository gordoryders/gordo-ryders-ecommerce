import { Product } from "@/types";

export interface SubCategory {
  name: string;
  slug: string;
  description?: string;
  badge?: string;
}

export interface MegaCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  highlight?: string;
  subcategories: SubCategory[];
}

export const MEGA_CATEGORIES: MegaCategory[] = [
  {
    id: "cascos",
    name: "Cascos y Visores",
    slug: "cascos",
    iconName: "Shield",
    highlight: "Norma ECE 22.06",
    subcategories: [
      { name: "Cascos Integrales Certificados", slug: "cascos-integrales", badge: "ECE 22.06" },
      { name: "Cascos Abatibles con Doble Visor", slug: "cascos-abatibles" },
      { name: "Cascos Cross & Enduro", slug: "cascos-cross" },
      { name: "Visores Anti-scratch (Iridium / Humo)", slug: "visores" },
      { name: "Intercomunicadores Bluetooth", slug: "intercomunicadores", badge: "Audio HD" },
    ],
  },
  {
    id: "guantes",
    name: "Guantes de Protección",
    slug: "guantes",
    iconName: "Hand",
    highlight: "Línea Oficial Proviker",
    subcategories: [
      { name: "Guantes Proviker Ref E44", slug: "proviker-e44", badge: "TOP 1 Venta" },
      { name: "Guantes Térmicos y Cuero", slug: "guantes-cuero" },
      { name: "Guantes Caña Larga Pista", slug: "guantes-cana-larga" },
      { name: "Guantes Ciudad con Touch Screen", slug: "guantes-urbanos" },
    ],
  },
  {
    id: "impermeables",
    name: "Impermeables y Chaquetas",
    slug: "impermeables",
    iconName: "CloudRain",
    highlight: "100% Siliconados",
    subcategories: [
      { name: "Impermeables Enterizos de Alta Resistencia", slug: "enterizos", badge: "Siliconado" },
      { name: "Trajes Dos Piezas con Reflectivo 3M", slug: "dos-piezas" },
      { name: "Chaquetas Térmicas con Protecciones CE", slug: "chaquetas-termicas", badge: "Nivel 2" },
      { name: "Cubrecalzado y Zapatones Herméticos", slug: "zapatones" },
      { name: "Tulas y Bolsos Secos Estancos", slug: "bolsos-secos" },
    ],
  },
  {
    id: "protecciones",
    name: "Protecciones y Seguridad",
    slug: "protecciones",
    iconName: "ShieldCheck",
    highlight: "Acero y Policarbonato",
    subcategories: [
      { name: "Kit Rodilleras y Coderas Articuladas", slug: "rodilleras", badge: "Acero Reforzado" },
      { name: "Petos y Armaduras de Espalda", slug: "petos-armaduras" },
      { name: "Fajas Lumbares Anatómicas", slug: "fajas-lumbares" },
      { name: "Chalecos Reflectivos Reglamentarios", slug: "chalecos" },
    ],
  },
  {
    id: "accesorios",
    name: "Accesorios y Soportería",
    slug: "accesorios",
    iconName: "Smartphone",
    highlight: "Aluminio CNC",
    subcategories: [
      { name: "Soportes Portacelular Antivibración CNC", slug: "portacelulares", badge: "Antivibración" },
      { name: "Maleteros y Baúles Traseros", slug: "maleteros" },
      { name: "Candados de Disco con Alarma 110dB", slug: "candados-alarma" },
      { name: "Sliders y Protectores de Motor", slug: "sliders" },
      { name: "Mallas y Pulpos Elásticos de Carga", slug: "mallas" },
    ],
  },
  {
    id: "mayoristas",
    name: "Canal Mayoristas B2B",
    slug: "mayoristas",
    iconName: "Package",
    highlight: "Precios de Fábrica desde 6 unds",
    subcategories: [
      { name: "Cajas de Guantes Proviker por Docena", slug: "mayorista-guantes", badge: "B2B" },
      { name: "Lotes de Impermeables al por Mayor", slug: "mayorista-impermeables" },
      { name: "Packs de Accesorios para Talleres", slug: "mayorista-talleres" },
      { name: "Catálogo Completo en PDF y Lista de Precios", slug: "catalogo-pdf" },
    ],
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "1",
    sku: "E44-PROVIKER",
    name: "Guante Proviker Protección Urbana Ref E44",
    slug: "guante-proviker-e44",
    category_id: "guantes",
    category_name: "Guantes",
    price_retail: 85000,
    price_original: 110000,
    price_wholesale: 55000,
    badge: "MÁS VENDIDO 1°",
    rating: 4.9,
    reviews_count: 84,
    description: "El guante de protección urbana más vendido en Colombia. Diseñado con protecciones de impacto rígidas en nudillos, palma reforzada antideslizante con absorción de vibración del manubrio, tela transpirable 3D y tecnología touch screen en dedo índice para manipular celular sin desarmarte.",
    images: [
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80",
    ],
    specs: [
      { label: "Marca", value: "Proviker Oficial" },
      { label: "Modelo / Referencia", value: "Ref E44 Urban Tech" },
      { label: "Material", value: "Microfibra de alta resistencia, malla 3D y TPU" },
      { label: "Protección Nudillos", value: "Carcasa rígida ergonómica de impacto" },
      { label: "Palma", value: "Grip antideslizante de silicona con absorción de vibración" },
      { label: "Compatibilidad", value: "Touch screen capacitivo en dedo índice y pulgar" },
      { label: "Ajuste", value: "Velcro termofijado de alto agarre en muñeca" },
      { label: "Garantía", value: "3 meses por costuras y materiales de fábrica" },
    ],
    is_featured: true,
    is_active: true,
    stock: 4,
  },
  {
    id: "2",
    sku: "C-SHAFT-582",
    name: "Casco Integral Shaft Pro 582 Certificado ECE 22.06",
    slug: "casco-integral-shaft-pro-582",
    category_id: "cascos",
    category_name: "Cascos",
    price_retail: 289900,
    price_original: 345000,
    price_wholesale: 220000,
    badge: "OFERTA RELÁMPAGO",
    rating: 5.0,
    reviews_count: 62,
    description: "Casco integral certificado bajo la máxima homologación europea de seguridad ECE 22.06. Fabricado en calota de policarbonato termoinyectado de alto impacto con alerón aerodinámico posterior para evitar turbulencias a alta velocidad. Visor de policarbonato óptico anti-scratch preparado para Pinlock.",
    images: [
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80",
    ],
    specs: [
      { label: "Marca", value: "Shaft Pro" },
      { label: "Certificación", value: "ECE 22.06 Europea + DOT (Resolución 1080 Colombia)" },
      { label: "Calota", value: "Termoplástico ABS de alta resistencia a perforación" },
      { label: "Visor", value: "Policarbonato 2.2mm anti-rayas con protección UV 99%" },
      { label: "Interior", value: "Acolchado hipoalergénico cortado por láser, desmontable y lavable" },
      { label: "Sistema de Cierre", value: "Hebilla micrométrica metálica de liberación rápida" },
      { label: "Peso", value: "1.450 gr ± 50 gr" },
      { label: "Preparado para Intercom", value: "Espacios pre-moldeados para parlantes bluetooth" },
    ],
    is_featured: true,
    is_active: true,
    stock: 7,
  },
  {
    id: "3",
    sku: "IMP-PRO-HD",
    name: "Impermeable Enterizo Siliconado Alta Resistencia con Tula",
    slug: "impermeable-enterizo-siliconado",
    category_id: "impermeables",
    category_name: "Impermeables",
    price_retail: 119000,
    price_original: 145000,
    price_wholesale: 82000,
    badge: "LLUVIA READY",
    rating: 4.8,
    reviews_count: 39,
    description: "Cero filtraciones en los peores aguaceros de carretera o ciudad. Confeccionado en tela náutica siliconada con termosellado electrónico en cada costura y entrepierna reforzada sin costura central para máxima durabilidad sobre el sillín de la moto. Bandas reflectivas 3M de 500 candelas para alta visibilidad nocturna.",
    images: [
      "https://images.unsplash.com/photo-1517846695664-44df0e167232?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80",
    ],
    specs: [
      { label: "Tipo", value: "Enterizo 100% impermeable termosellado" },
      { label: "Material", value: "PVC Siliconado calibre 16 extra flexible" },
      { label: "Cierre", value: "Cremallera gruesa con solapa hermética doble y velcro" },
      { label: "Reflectivos", value: "Cintas reflectivas 3M en pecho, brazos y espalda" },
      { label: "Cuello", value: "Forro interior en microfibra suave que no raya el cuello" },
      { label: "Accesorios", value: "Incluye tula transportadora compacta con mosquetón" },
    ],
    is_featured: true,
    is_active: true,
    stock: 12,
  },
  {
    id: "4",
    sku: "CH-BOMBER-AIR",
    name: "Chaqueta Térmica con Protecciones Removibles CE Nivel 2",
    slug: "chaqueta-termica-protecciones-ce",
    category_id: "impermeables",
    category_name: "Chaquetas",
    price_retail: 245000,
    price_original: 295000,
    price_wholesale: 175000,
    badge: "NUEVA COLECCIÓN",
    rating: 5.0,
    reviews_count: 31,
    description: "Chaqueta de cordura 600D resistente a la abrasión con membrana impermeable interna y forro térmico desmontable para climas fríos como Bogotá o la Línea. Viene equipada de fábrica con 5 protecciones certificadas CE Nivel 2 en codos, hombros y protector de columna.",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80",
    ],
    specs: [
      { label: "Material Exterior", value: "Cordura Poliéster 600D de alta tenacidad" },
      { label: "Protecciones", value: "5 piezas CE EN 1621-1 Nivel 2 (removibles)" },
      { label: "Forro", value: "Térmico desmontable con bolsillo porta-celular" },
      { label: "Ventilación", value: "Tomas de aire frontales y extractores posteriores con cremallera impermeable" },
      { label: "Ajustes", value: "Correas en cintura, brazos y muñecas" },
    ],
    is_featured: true,
    is_active: true,
    stock: 5,
  },
  {
    id: "5",
    sku: "PRO-KNEE-4",
    name: "Kit de Rodilleras y Coderas Articuladas Acero Reforzado",
    slug: "kit-rodilleras-coderas-acero",
    category_id: "protecciones",
    category_name: "Protecciones",
    price_retail: 78000,
    price_original: 99000,
    price_wholesale: 49000,
    badge: "RECOMENDADO",
    rating: 4.7,
    reviews_count: 27,
    description: "Set completo de 4 piezas (2 rodilleras articuladas y 2 coderas) con placas exteriores en aleación de acero inoxidable y polímero flexible. Su doble articulación permite doblar la rodilla 90° con total naturalidad sin presionar el pantalón ni bloquear el movimiento.",
    images: [
      "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
    ],
    specs: [
      { label: "Piezas", value: "Juego de 4 unidades (2 rodilleras + 2 coderas)" },
      { label: "Material Exterior", value: "Placas de acero inoxidable cepillado y TPU" },
      { label: "Acolchado Interior", value: "Espuma EVA de 12mm de alta densidad con forro antitranspirante" },
      { label: "Sistema Articulado", value: "Doble pivote biomecánico" },
      { label: "Fijación", value: "3 bandas elásticas con velcro ancho de sujeción firme" },
    ],
    is_featured: true,
    is_active: true,
    stock: 3,
  },
  {
    id: "6",
    sku: "ACC-HOLDER-M8",
    name: "Soporte Antivibración Portacelular para Moto en Aluminio CNC",
    slug: "soporte-portacelular-antivibracion",
    category_id: "accesorios",
    category_name: "Accesorios",
    price_retail: 65000,
    price_original: 85000,
    price_wholesale: 39000,
    badge: "TENDENCIA",
    rating: 4.9,
    reviews_count: 53,
    description: "Mecanizado en aleación de aluminio de aviación por CNC con 4 amortiguadores de silicona especiales para proteger el estabilizador óptico de la cámara de tu iPhone o smartphone de las vibraciones del motor. Agarre de bloqueo rápido antirrobo.",
    images: [
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558980664-769d59546b3d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80",
    ],
    specs: [
      { label: "Material", value: "Aluminio 6061-T6 mecanizado CNC anodizado negro" },
      { label: "Amortiguación", value: "Módulo antivibración con 4 elastómeros de silicona (protege cámaras OIS)" },
      { label: "Compatibilidad Celulares", value: "Pantallas de 4.7 a 7.2 pulgadas (iPhone, Samsung, Xiaomi)" },
      { label: "Montaje", value: "Manubrio de 22mm a 32mm o espejo retrovisor (incluye adaptador)" },
      { label: "Rotación", value: "Cabezal de bola 360° con bloqueo firme" },
    ],
    is_featured: true,
    is_active: true,
    stock: 14,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug || p.id === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const norm = categorySlug.toLowerCase();
  return PRODUCTS.filter(
    (p) =>
      p.category_id?.toLowerCase() === norm ||
      p.category_name?.toLowerCase().includes(norm) ||
      p.slug.toLowerCase().includes(norm)
  );
}
