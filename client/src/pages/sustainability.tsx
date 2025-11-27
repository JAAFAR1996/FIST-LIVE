import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import riverImg from "@assets/stock_images/clean_river_ecosyste_f6301bd2.jpg";
import packagingImg from "@assets/stock_images/sustainable_eco_frie_c88ff0b1.jpg";
import { Leaf, Droplets, Recycle, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sustainability() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans transition-colors duration-300">
      <Navbar />
      
      {/* Hero */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img src={riverImg} alt="Nature" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-20 text-center text-white max-w-3xl px-4 space-y-6 animate-in fade-in zoom-in-95 duration-1000">
           <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-md border border-green-500/30 px-4 py-2 rounded-full text-green-100 font-bold uppercase tracking-wider">
             <Leaf className="w-4 h-4" /> بيئة أنظف، مستقبل أفضل
           </div>
           <h1 className="text-5xl md:text-7xl font-bold leading-tight">نحمي ما نحب</h1>
           <p className="text-xl text-slate-200">
             في Fish Web، نؤمن بأن هواية تربية الأسماك يجب أن تكون صديقة للبيئة. 
             لذلك نتبرع بـ 1% من كل طلب لحماية أنهار العراق.
           </p>
        </div>
      </section>

      <main className="flex-1">
        {/* Mission Stats */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
               <div className="p-8 bg-card rounded-2xl shadow-sm border space-y-4 hover:-translate-y-2 transition-transform duration-300">
                 <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                   <Droplets className="w-8 h-8" />
                 </div>
                 <h3 className="text-4xl font-bold text-primary">10,000+</h3>
                 <p className="text-muted-foreground">لتر من المياه تم تنظيفها</p>
               </div>
               <div className="p-8 bg-card rounded-2xl shadow-sm border space-y-4 hover:-translate-y-2 transition-transform duration-300">
                 <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto">
                   <Recycle className="w-8 h-8" />
                 </div>
                 <h3 className="text-4xl font-bold text-primary">85%</h3>
                 <p className="text-muted-foreground">تغليف قابل لإعادة التدوير</p>
               </div>
               <div className="p-8 bg-card rounded-2xl shadow-sm border space-y-4 hover:-translate-y-2 transition-transform duration-300">
                 <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                   <Heart className="w-8 h-8" />
                 </div>
                 <h3 className="text-4xl font-bold text-primary">1%</h3>
                 <p className="text-muted-foreground">تبرع دائم للبيئة</p>
               </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="w-full md:w-1/2 space-y-6">
                <h2 className="text-4xl font-bold text-foreground">تغليف ذكي، نفايات أقل</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  نحن نستخدم مواد تغليف صديقة للبيئة وقابلة للتحلل. هدفنا هو تقليل البلاستيك المستخدم مرة واحدة في عمليات الشحن لدينا إلى الصفر بحلول عام 2026.
                </p>
                <ul className="space-y-3">
                  {["كرتون معاد تدويره 100%", "أحبار نباتية صديقة للبيئة", "بدائل بلاستيكية قابلة للتحلل"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full" /> {item}
                    </li>
                  ))}
                </ul>
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                  اقرأ تقريرنا السنوي
                </Button>
              </div>
              <div className="w-full md:w-1/2">
                <img src={packagingImg} alt="Eco Packaging" className="rounded-3xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
