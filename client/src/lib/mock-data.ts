import seachemImg from "@assets/stock_images/aquarium_water_condi_76f4e911.jpg";
import filterImg from "@assets/stock_images/aquarium_canister_fi_ebe5d7af.jpg";
import heaterImg from "@assets/stock_images/aquarium_heater_prod_b5512720.jpg";
import plantImg from "@assets/stock_images/planted_aquarium_tan_46df6ed7.jpg";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  category: string;
  specs: string;
  isNew?: boolean;
  isBestSeller?: boolean;
}

export const products: Product[] = [
  {
    id: "seachem-prime",
    name: "Seachem Prime Water Conditioner 500ml",
    brand: "Seachem",
    price: 55000,
    rating: 4.8,
    reviewCount: 67,
    image: seachemImg,
    category: "Conditioners",
    specs: "التوافق: جميع الأحجام",
    isBestSeller: true,
  },
  {
    id: "fluval-407",
    name: "Fluval 407 Performance Canister Filter",
    brand: "Fluval",
    price: 285000,
    rating: 4.9,
    reviewCount: 45,
    image: filterImg,
    category: "Filters",
    specs: "التدفق: ١٤٥٠ لتر/ساعة | القدرة: ٢٠ واط",
    isBestSeller: true,
  },
  {
    id: "eheim-jager",
    name: "EHEIM Jager 200W Aquarium Heater",
    brand: "EHEIM",
    price: 95000,
    rating: 4.7,
    reviewCount: 28,
    image: heaterImg,
    category: "Heaters",
    specs: "القدرة: ٢٠٠ واط | للأحواض ١٥٠-٣٠٠ لتر",
    isBestSeller: true,
  },
  {
    id: "aquaclear-70",
    name: "AquaClear 70 Power Filter",
    brand: "AquaClear",
    price: 125000,
    originalPrice: 145000,
    rating: 4.6,
    reviewCount: 32,
    image: filterImg, // Reusing filter img for mockup
    category: "Filters",
    specs: "التدفق: ١١٣٥ لتر/ساعة | القدرة: ٨ واط",
    isBestSeller: true,
  },
  {
    id: "anubias-nana",
    name: "Anubias Nana Live Aquarium Plant",
    brand: "Aquatic Plants",
    price: 35000,
    rating: 4.5,
    reviewCount: 18,
    image: plantImg,
    category: "Plants",
    specs: "للأحواض ٢٠-٥٠٠ لتر",
    isNew: true,
  }
];
