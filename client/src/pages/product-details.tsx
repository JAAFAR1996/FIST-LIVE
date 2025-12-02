import { useRoute } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, CheckCircle, Package, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProductBySlug } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/types";

export default function ProductDetails() {
  const [, params] = useRoute("/products/:slug");
  const slug = params?.slug;
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug || ""),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });

  const product: Product | undefined = data;

  const handleAddToCart = () => {
    if (product) {
      addItem(product);
      toast({
        title: "تمت الإضافة للسلة ✓",
        description: `تم إضافة ${product.name} إلى سلة المشتريات`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background font-sans">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="w-full h-[500px] rounded-xl" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-background font-sans">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-20 text-center space-y-6">
          <h1 className="text-3xl font-bold">المنتج غير موجود</h1>
          <p className="text-muted-foreground">
            تأكد من صحة الرابط أو عُد لصفحة المنتجات.
          </p>
          <Button asChild>
            <a href="/products">العودة للمنتجات</a>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Product Hero */}
        <section className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-zinc-900 dark:to-zinc-800 py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Product Image */}
              <div className="relative">
                <div className="bg-white dark:bg-zinc-950 rounded-2xl p-8 shadow-xl">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-auto max-h-[500px] object-contain"
                  />
                </div>
                {product.isNew && (
                  <Badge className="absolute top-4 right-4 bg-green-500">
                    جديد
                  </Badge>
                )}
                {product.isBestSeller && (
                  <Badge className="absolute top-4 left-4 bg-orange-500">
                    الأكثر مبيعاً
                  </Badge>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
                  <p className="text-lg text-muted-foreground">{product.brand}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount} تقييم)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-primary">
                    {product.price.toLocaleString()} د.ع
                  </span>
                  {product.originalPrice && (
                    <span className="text-2xl text-muted-foreground line-through">
                      {product.originalPrice.toLocaleString()} د.ع
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-lg leading-relaxed">{product.specs}</p>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 py-4">
                  {product.difficulty && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>مستوى: {product.difficulty === 'easy' ? 'سهل' : product.difficulty === 'medium' ? 'متوسط' : 'خبير'}</span>
                    </div>
                  )}
                  {product.ecoFriendly && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>صديق للبيئة</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="h-5 w-5 text-blue-500" />
                    <span>متوفر في المخزون</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="h-5 w-5 text-blue-500" />
                    <span>ضمان الجودة</span>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  size="lg"
                  className="w-full h-14 text-lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="ml-2 h-5 w-5" />
                  أضف إلى السلة
                </Button>

                {/* Category */}
                <div className="pt-4 border-t">
                  <span className="text-sm text-muted-foreground">التصنيف: </span>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Video Section (if available) */}
        {product.videoUrl && (
          <section className="py-12 bg-muted/30">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center">شاهد المنتج</h2>
              <div className="max-w-4xl mx-auto">
                <video
                  controls
                  className="w-full rounded-xl shadow-lg"
                  src={product.videoUrl}
                >
                  متصفحك لا يدعم تشغيل الفيديو.
                </video>
              </div>
            </div>
          </section>
        )}

        {/* Related Products */}
        <section className="py-12 container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">منتجات ذات صلة</h2>
          <p className="text-muted-foreground text-center">قريباً...</p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
