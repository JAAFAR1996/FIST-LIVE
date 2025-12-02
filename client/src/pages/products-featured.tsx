import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { LuxuryProductShowcase } from "@/components/products/luxury-product-showcase";
import { ProductVideo } from "@/components/products/product-video";
import { ARViewer } from "@/components/products/ar-viewer";
import { BundleRecommendation } from "@/components/products/bundle-recommendation";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct, fetchProducts } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { resolveAssetUrl } from "@/lib/config/env";
import type { Product } from "@/types";

export default function FeaturedProduct() {
  const { toast } = useToast();
  const { data: listData } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  const { data: featuredData, isLoading } = useQuery({
    queryKey: ["product", "fluval-407"],
    queryFn: () => fetchProduct("fluval-407"),
    staleTime: 1000 * 60 * 5,
  });

  const products = listData?.products ?? [];
  const normalizeProduct = (product: Product | undefined): Product | undefined =>
    product ? { ...product, image: resolveAssetUrl(product.image) } : undefined;

  const resolvedProducts = products
    .map((product) => normalizeProduct(product))
    .filter(Boolean) as Product[];

  const featuredProduct =
    normalizeProduct(featuredData) ||
    resolvedProducts.find((p) => p.id === "fluval-407") ||
    resolvedProducts[0];
  
  if (!featuredProduct) {
    return (
      <div className="min-h-screen flex flex-col bg-background font-sans">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-12">
          <Skeleton className="w-full h-[420px] rounded-3xl" />
        </main>
        <Footer />
      </div>
    );
  }
  
  const bundle = {
    id: "b1",
    name: "Professional Filtration Bundle",
    description: "Everything you need for crystal clear water.",
    products: [featuredProduct.id, "seachem-prime"],
    discountPercentage: 15,
    totalPrice: (featuredProduct.price + 20) * 0.85
  };

  const handleBundleAdd = () => {
    toast({
      title: "تمت إضافة المجموعة للسلة",
      description: `تم إضافة ${bundle.products.length} منتجات من التوصيات.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      <main className="flex-1">
        {featuredProduct ? (
          <LuxuryProductShowcase product={featuredProduct} />
        ) : (
          <div className="container mx-auto px-4 py-12">
            <Skeleton className="w-full h-[420px] rounded-3xl" />
          </div>
        )}
        
        {/* Bundle Recommendation */}
        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4 max-w-3xl">
            {(() => {
              const bundleProducts = [
                featuredProduct,
                resolvedProducts.find(p => p.id === "seachem-prime") || resolvedProducts[1]
              ].filter(Boolean) as Product[];
              
              if (bundleProducts.length < 2) return null;
              
              return (
                <BundleRecommendation
                  bundle={bundle}
                  products={bundleProducts}
                  onAddToCart={handleBundleAdd}
                />
              );
            })()}
          </div>
        </section>

        {/* Multimedia Section */}
        <section className="py-24 bg-background relative overflow-hidden">
           <div className="absolute inset-0 bg-accent/5 -skew-y-3 scale-110 z-0" />
           <div className="container mx-auto px-4 relative z-10">
             <h2 className="text-4xl font-bold mb-16 text-center">تجربة تفاعلية</h2>
             <div className="grid md:grid-cols-2 gap-12 items-center">
               <div className="space-y-6">
                 <h3 className="text-2xl font-bold">شاهد المنتج أثناء العمل</h3>
                 <p className="text-lg text-muted-foreground leading-relaxed">
                   تعرف على كيفية عمل الفلتر المتطور بصمت وكفاءة عالية للحفاظ على نقاء المياه.
                 </p>
                 <ProductVideo 
                   videoUrl="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" // Mock video
                   thumbnailUrl={featuredProduct.image}
                   className="aspect-video shadow-2xl border-4 border-card"
                 />
               </div>
               
               <div className="space-y-6">
                 <h3 className="text-2xl font-bold">شاهده في منزلك (AR)</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    استخدم تقنية الواقع المعزز لرؤية كيف سيبدو المنتج في مساحتك الخاصة قبل الشراء.
                  </p>
                  <ARViewer 
                    modelUrl="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
                    posterUrl={featuredProduct.image}
                    className="aspect-square shadow-2xl border-4 border-card"
                  />
                </div>
             </div>
           </div>
        </section>

        {/* Additional Details Section */}
        <section className="py-24 bg-muted/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-12">تفاصيل دقيقة</h2>
            <div className="grid md:grid-cols-3 gap-8">
               <div className="space-y-4">
                 <div className="h-64 bg-background rounded-2xl shadow-sm border p-8 flex items-center justify-center">
                   <img src={featuredProduct.image} className="w-full h-full object-contain opacity-80" alt="Detail 1" />
                 </div>
                 <h3 className="text-xl font-bold">تصميم عصري</h3>
                 <p className="text-muted-foreground">يناسب جميع الديكورات الحديثة</p>
               </div>
               <div className="space-y-4">
                 <div className="h-64 bg-background rounded-2xl shadow-sm border p-8 flex items-center justify-center">
                   <img src={featuredProduct.image} className="w-full h-full object-contain scale-150 opacity-80" alt="Detail 2" />
                 </div>
                 <h3 className="text-xl font-bold">أداء قوي</h3>
                 <p className="text-muted-foreground">{featuredProduct.specs}</p>
               </div>
               <div className="space-y-4">
                 <div className="h-64 bg-background rounded-2xl shadow-sm border p-8 flex items-center justify-center">
                   <img src={featuredProduct.image} className="w-full h-full object-contain -rotate-12 opacity-80" alt="Detail 3" />
                 </div>
                 <h3 className="text-xl font-bold">سهولة الاستخدام</h3>
                 <p className="text-muted-foreground">مصمم لراحتك وراحة أسماكك</p>
               </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
