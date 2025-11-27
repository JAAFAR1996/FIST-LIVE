import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { LuxuryProductShowcase } from "@/components/products/luxury-product-showcase";
import { products } from "@/lib/mock-data";

export default function FeaturedProduct() {
  // Select a high-end product for the showcase (e.g., the Fluval Filter)
  const featuredProduct = products.find(p => p.id === "fluval-407") || products[0];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      <main className="flex-1">
        <LuxuryProductShowcase product={featuredProduct} />
        
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
