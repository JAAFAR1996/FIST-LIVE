import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart, ArrowRight } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface ProductOfTheWeekProps {
  product: Product;
}

export function ProductOfTheWeek({ product }: ProductOfTheWeekProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "تمت الإضافة للسلة ✓",
      description: `تم إضافة ${product.name} إلى سلة المشتريات`,
    });
  };
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background with subtle pattern/gradient */}
      <div className="absolute inset-0 bg-primary/5 -skew-y-2 scale-110 z-0" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Section with Effects */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative group perspective-1000"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl -rotate-3 scale-95 group-hover:rotate-0 transition-transform duration-700 ease-out blur-xl opacity-50" />
            <OptimizedImage
              src={product.image}
              alt={product.name}
              className="relative w-full rounded-3xl shadow-2xl aspect-square transform transition-transform duration-700 hover:scale-[1.02] hover:rotate-1"
              priority={true}
              objectFit="cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl animate-float hidden md:block">
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-green-500"></span>
                <span className="text-sm font-bold">متوفر في المخزن</span>
              </div>
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2 space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-bold rounded-full uppercase tracking-wider shadow-lg shadow-primary/20 animate-pulse-glow">
                <Star className="w-4 h-4 fill-current" />
                منتج الأسبوع
              </div>
              
              <h2 className="text-4xl md:text-5xl font-extrabold text-foreground leading-tight">
                {product.name}
              </h2>
              
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-3 py-1 rounded-lg">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="text-foreground font-bold">{product.rating}</span>
                  <span className="text-muted-foreground text-sm">({product.reviewCount} تقييم)</span>
                </div>
                {product.difficulty && <DifficultyBadge level={product.difficulty} />}
              </div>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed border-l-4 border-primary/30 pl-4">
              {product.specs}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground line-through">
                  {product.originalPrice ? product.originalPrice.toLocaleString() : (product.price * 1.1).toLocaleString()} د.ع
                </span>
                <span className="text-4xl font-bold text-primary">
                  {product.price.toLocaleString()} <span className="text-lg text-foreground">د.ع</span>
                </span>
              </div>

              <div className="flex-1 w-full sm:w-auto flex gap-3">
                <Button size="lg" className="flex-1 h-14 text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1" onClick={handleAddToCart}>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  أضف إلى العربة
                </Button>
                <Link href={`/products/${product.slug}`}>
                  <Button size="lg" variant="outline" className="h-14 px-6 border-2">
                    تفاصيل <ArrowRight className="mr-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
