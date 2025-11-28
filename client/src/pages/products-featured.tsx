import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { LuxuryProductShowcase } from "@/components/products/luxury-product-showcase";
import { products } from "@/lib/mock-data";
import { ProductVideo } from "@/components/products/product-video";
import { ARViewer } from "@/components/products/ar-viewer";
import { BundleRecommendation } from "@/components/products/bundle-recommendation";

export default function FeaturedProduct() {
  // Select a high-end product for the showcase (e.g., the Fluval Filter)
  const featuredProduct = products.find(p => p.id === "fluval-407") || products[0];
  
  const bundle = {
    id: "b1",
    name: "Professional Filtration Bundle",
    description: "Everything you need for crystal clear water.",
    products: [featuredProduct.id, "seachem-prime"],
    discountPercentage: 15,
    totalPrice: (featuredProduct.price + 20) * 0.85
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      <main className="flex-1">
        <LuxuryProductShowcase product={featuredProduct} />
        
        {/* Bundle Recommendation */}
        <section className="py-12 bg-primary/5">
          <div className="container mx-auto px-4 max-w-3xl">
            <BundleRecommendation 
              bundle={bundle}
              products={[featuredProduct, products.find(p => p.id === "seachem-prime") || products[1]]}
              onAddToCart={() => console.log("Bundle added")}
            />
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
