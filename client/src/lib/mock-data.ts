import seachemImg from "@assets/stock_images/seachem_prime_500ml__b70abe42.jpg";
import fluvalImg from "@assets/stock_images/fluval_407_canister__4d80d974.jpg";
import heaterImg from "@assets/stock_images/eheim_jager_aquarium_f65664bd.jpg";
import aquaClearImg from "@assets/stock_images/aquaclear_70_power_f_dfd543e8.jpg";
import plantImg from "@assets/stock_images/anubias_nana_aquariu_554af5dc.jpg";
import { Product } from "@/types";

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
    difficulty: "easy",
    ecoFriendly: true,
  },
  {
    id: "fluval-407",
    name: "Fluval 407 Performance Canister Filter",
    brand: "Fluval",
    price: 285000,
    rating: 4.9,
    reviewCount: 45,
    image: fluvalImg,
    category: "Filters",
    specs: "التدفق: ١٤٥٠ لتر/ساعة | القدرة: ٢٠ واط",
    isBestSeller: true,
    difficulty: "medium",
    videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
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
    difficulty: "easy",
  },
  {
    id: "aquaclear-70",
    name: "AquaClear 70 Power Filter",
    brand: "AquaClear",
    price: 125000,
    originalPrice: 145000,
    rating: 4.6,
    reviewCount: 32,
    image: aquaClearImg,
    category: "Filters",
    specs: "التدفق: ١١٣٥ لتر/ساعة | القدرة: ٨ واط",
    isBestSeller: true,
    difficulty: "easy",
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
    ecoFriendly: true,
    difficulty: "easy",
  }
];
