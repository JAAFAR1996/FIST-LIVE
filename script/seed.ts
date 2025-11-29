import { db } from "../server/storage";
import { products } from "../shared/schema";

const seedProducts = [
  {
    id: "seachem-prime",
    slug: "seachem-prime-water-conditioner",
    name: "Seachem Prime Water Conditioner 500ml",
    brand: "Seachem",
    category: "Water Treatment",
    subcategory: "Conditioners",
    description: "Premium water conditioner for all aquarium types. Removes chlorine and chloramine while detoxifying ammonia and nitrite.",
    price: "55000",
    currency: "IQD",
    images: ["/attached_assets/stock_images/seachem_prime_500ml__b70abe42.jpg"],
    thumbnail: "/attached_assets/stock_images/seachem_prime_500ml__b70abe42.jpg",
    rating: "4.8",
    reviewCount: 67,
    stock: 150,
    lowStockThreshold: 20,
    isNew: false,
    isBestSeller: true,
    specifications: {
      size: "500ml",
      compatibility: "All tank sizes",
      ecoFriendly: true,
      difficulty: "easy"
    }
  },
  {
    id: "fluval-407",
    slug: "fluval-407-canister-filter",
    name: "Fluval 407 Performance Canister Filter",
    brand: "Fluval",
    category: "Filtration",
    subcategory: "Filters",
    description: "High-performance canister filter with multi-stage filtration. Ideal for large aquariums up to 400 liters.",
    price: "285000",
    currency: "IQD",
    images: ["/attached_assets/stock_images/fluval_407_canister__4d80d974.jpg"],
    thumbnail: "/attached_assets/stock_images/fluval_407_canister__4d80d974.jpg",
    rating: "4.9",
    reviewCount: 45,
    stock: 25,
    lowStockThreshold: 5,
    isNew: false,
    isBestSeller: true,
    specifications: {
      flowRate: "1450 L/hr",
      power: "20W",
      tankSize: "Up to 400L",
      difficulty: "medium",
      videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
    }
  },
  {
    id: "eheim-jager",
    slug: "eheim-jager-aquarium-heater",
    name: "EHEIM Jager 200W Aquarium Heater",
    brand: "EHEIM",
    category: "Equipment",
    subcategory: "Heaters",
    description: "Precision aquarium heater with automatic temperature control. Shatterproof glass construction for safety.",
    price: "95000",
    currency: "IQD",
    images: ["/attached_assets/stock_images/eheim_jager_aquarium_f65664bd.jpg"],
    thumbnail: "/attached_assets/stock_images/eheim_jager_aquarium_f65664bd.jpg",
    rating: "4.7",
    reviewCount: 28,
    stock: 80,
    lowStockThreshold: 15,
    isNew: false,
    isBestSeller: true,
    specifications: {
      power: "200W",
      tankSize: "150-300L",
      difficulty: "easy"
    }
  },
  {
    id: "aquaclear-70",
    slug: "aquaclear-70-power-filter",
    name: "AquaClear 70 Power Filter",
    brand: "AquaClear",
    category: "Filtration",
    subcategory: "Filters",
    description: "Reliable hang-on-back filter with adjustable flow control. Energy-efficient and easy to maintain.",
    price: "125000",
    originalPrice: "145000",
    currency: "IQD",
    images: ["/attached_assets/stock_images/aquaclear_70_power_f_dfd543e8.jpg"],
    thumbnail: "/attached_assets/stock_images/aquaclear_70_power_f_dfd543e8.jpg",
    rating: "4.6",
    reviewCount: 32,
    stock: 60,
    lowStockThreshold: 10,
    isNew: false,
    isBestSeller: true,
    specifications: {
      flowRate: "1135 L/hr",
      power: "8W",
      difficulty: "easy"
    }
  },
  {
    id: "anubias-nana",
    slug: "anubias-nana-live-plant",
    name: "Anubias Nana Live Aquarium Plant",
    brand: "Aquatic Plants",
    category: "Plants",
    subcategory: "Live Plants",
    description: "Hardy low-light aquarium plant. Perfect for beginners and creates natural hiding spots for fish.",
    price: "35000",
    currency: "IQD",
    images: ["/attached_assets/stock_images/anubias_nana_aquariu_554af5dc.jpg"],
    thumbnail: "/attached_assets/stock_images/anubias_nana_aquariu_554af5dc.jpg",
    rating: "4.5",
    reviewCount: 18,
    stock: 200,
    lowStockThreshold: 30,
    isNew: true,
    isBestSeller: false,
    specifications: {
      tankSize: "20-500L",
      lighting: "Low to Medium",
      ecoFriendly: true,
      difficulty: "easy"
    }
  }
];

async function seed() {
  try {
    console.log("Starting database seed...");
    
    for (const product of seedProducts) {
      console.log(`Inserting product: ${product.name}`);
      await db.insert(products).values(product).onConflictDoNothing();
    }
    
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
