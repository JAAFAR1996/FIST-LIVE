import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, Truck, ShieldCheck, Phone, Leaf, Droplets, Thermometer, Package } from "lucide-react";
import { Link } from "wouter";
import heroImg from "@assets/stock_images/planted_aquarium_tan_46df6ed7.jpg";
import { BubbleTrail } from "@/components/effects/bubble-trail";
import { ProductOfTheWeek } from "@/components/home/product-of-the-week";
import { MasonryGalleryGrid } from "@/components/gallery/masonry-gallery-grid";
import { WaterRippleButton } from "@/components/effects/water-ripple-button";
import { ProductCard } from "@/components/products/product-card";
import { WaveScrollEffect } from "@/components/effects/wave-scroll-effect";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  const products = data?.products ?? [];
  const featuredProduct = products.find((p) => p.id === "seachem-prime") || products[0];
  const bestSellers = products.filter((p) => p.isBestSeller);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans transition-colors duration-300">
      <BubbleTrail />
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[700px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" />
        <img 
          src={heroImg} 
          alt="Aquarium Hero" 
          className="absolute inset-0 w-full h-full object-cover animate-slow-zoom"
          style={{ animation: 'float 20s ease-in-out infinite alternate' }}
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-start text-white space-y-8">
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md border border-primary/30 px-6 py-2 rounded-full text-primary-foreground font-bold animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Leaf className="h-5 w-5" />
            <span>طبيعة خلابة في منزلك</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold max-w-4xl leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 text-shadow-glow">
            اكتشف <span className="text-primary">عالم البحار</span> <br />
            بدون مغادرة منزلك
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 max-w-xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            وجهتك الأولى للمعدات الاحترافية، النباتات النادرة، والنصائح الخبيرة لإنشاء حوض أحلامك.
          </p>
          <div className="flex flex-wrap gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <WaterRippleButton size="lg" className="text-xl px-10 h-16 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
              ابدأ رحلتك الآن
            </WaterRippleButton>
            <Button size="lg" variant="outline" className="text-xl px-10 h-16 bg-white/5 backdrop-blur-md border-white/20 text-white hover:bg-white/10">
              تصفح العروض
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <WaveScrollEffect>
        <section className="py-20 bg-card border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Truck, title: "توصيل لجميع العراق", desc: "شحن سريع وآمن لباب منزلك" },
                { icon: ShieldCheck, title: "إرجاع خلال 14 يوم", desc: "ضمان إرجاع مجاني وسهل" },
                { icon: Phone, title: "دعم فني متخصص", desc: "فريق دعم يتحدث العربية 24/7" },
                { icon: Star, title: "منتجات أصلية", desc: "نضمن لك جودة جميع المنتجات" },
              ].map((feature, idx) => (
                <div key={idx} className="flex flex-col items-center text-center space-y-4 p-8 rounded-3xl bg-muted/30 border border-border/50 hover:bg-muted/50 hover:scale-105 transition-all duration-300 group">
                  <div className="p-5 bg-background rounded-2xl shadow-sm group-hover:shadow-md transition-shadow duration-300 text-primary">
                    <feature.icon className="h-10 w-10" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </WaveScrollEffect>

      {/* Product of the Week */}
      {featuredProduct && <ProductOfTheWeek product={featuredProduct} />}

      {/* Categories / Tools */}
      <WaveScrollEffect>
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div className="max-w-2xl">
                <h2 className="text-4xl font-bold mb-4 text-foreground">أدوات تساعدك في رحلتك</h2>
                <p className="text-xl text-muted-foreground">استخدم أدواتنا المجانية لحساب احتياجات حوضك بدقة</p>
              </div>
              <Link href="/calculators">
                 <Button variant="ghost" className="gap-2 text-lg">عرض الكل <ArrowRight className="w-5 h-5" /></Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "حاسبة السخان", desc: "احسب القدرة المطلوبة للسخان", icon: Thermometer, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/20" },
                { title: "حاسبة الفلترة", desc: "احسب معدل التدفق المناسب", icon: Droplets, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
                { title: "مكتشف الأسماك", desc: "اكتشف الأسماك المناسبة لحوضك", icon: Package, color: "text-primary", bg: "bg-primary/10" },
              ].map((tool, idx) => (
                <div key={idx} className="group p-8 rounded-3xl bg-card border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 cursor-pointer relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${tool.bg} rounded-bl-full -mr-16 -mt-16 opacity-50 transition-transform group-hover:scale-150 duration-700`} />
                  
                  <div className={`w-16 h-16 ${tool.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                    <tool.icon className={`h-8 w-8 ${tool.color}`} />
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">{tool.title}</h3>
                    <p className="text-muted-foreground mb-8 text-lg">{tool.desc}</p>
                    <div className="flex items-center font-bold text-primary group-hover:gap-3 transition-all">
                      جرب الآن <ArrowRight className="h-5 w-5 mr-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </WaveScrollEffect>

      {/* Social Proof / Gallery */}
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-4">
           <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">إبداعات مجتمعنا</h2>
            <p className="text-xl text-muted-foreground">شاهد كيف يحول عملاؤنا منازلهم إلى واحات طبيعية</p>
          </div>
          <MasonryGalleryGrid />
        </div>
      </section>

      {/* Best Sellers Grid */}
      <WaveScrollEffect>
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl font-bold mb-3 text-foreground">الأكثر مبيعاً</h2>
                <p className="text-xl text-muted-foreground">اختيارات عملائنا المفضلة لهذا الشهر</p>
              </div>
              <Button variant="ghost" className="hidden sm:flex gap-2 hover:bg-background">
                عرض الكل <ArrowRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            <div className="mt-12 text-center sm:hidden">
               <Button variant="outline" size="lg" className="w-full">عرض جميع المنتجات</Button>
            </div>
          </div>
        </section>
      </WaveScrollEffect>

      {/* Sustainability CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-green-900 dark:bg-green-950 z-0" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-10" />
        <div className="container mx-auto px-4 relative z-20 text-center text-white">
          <Leaf className="w-16 h-16 mx-auto mb-6 text-green-400 animate-bounce" />
          <h2 className="text-4xl md:text-6xl font-bold mb-6">نحن نهتم بكوكبك بقدر اهتمامنا بحوضك</h2>
          <p className="text-xl md:text-2xl text-green-100 max-w-2xl mx-auto mb-10">
            نتبرع بـ 1% من كل عملية شراء لدعم مشاريع تنظيف الأنهار في العراق.
          </p>
          <Link href="/sustainability">
            <Button size="lg" className="bg-white text-green-900 hover:bg-green-100 text-lg px-8 h-14 font-bold">
              اكتشف مبادراتنا البيئية
            </Button>
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
