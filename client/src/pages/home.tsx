import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { products } from "@/lib/mock-data";
import { ArrowRight, Star, Truck, ShieldCheck, Phone, Leaf, Droplets, Thermometer, Package } from "lucide-react";
import { Link } from "wouter";
import heroImg from "@assets/stock_images/planted_aquarium_tan_46df6ed7.jpg";

export default function Home() {
  const featuredProduct = products.find(p => p.id === "seachem-prime");
  const bestSellers = products.filter(p => p.isBestSeller);
  const newArrivals = products.filter(p => p.isNew);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src={heroImg} 
          alt="Aquarium Hero" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center items-start text-white space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 px-4 py-1.5 rounded-full text-primary-foreground text-sm font-medium animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Leaf className="h-4 w-4" />
            <span>طبيعة خلابة في منزلك</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold max-w-3xl leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            اكتشف عالم البحار <br />
            <span className="text-primary">في منزلك</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            نوفر لك أفضل المعدات والأسماك والنباتات لإنشاء حوض أحلامك. جودة عالية، أسعار تنافسية، وتوصيل لجميع أنحاء العراق.
          </p>
          <div className="flex flex-wrap gap-4 pt-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Button size="lg" className="text-lg px-8 h-12 bg-primary hover:bg-primary/90">
              تسوق الآن
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 h-12 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
              تصفح العروض
            </Button>
          </div>
        </div>
      </section>

      {/* Features / Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: "توصيل لجميع العراق", desc: "شحن سريع وآمن لباب منزلك" },
              { icon: ShieldCheck, title: "إرجاع خلال 14 يوم", desc: "ضمان إرجاع مجاني وسهل" },
              { icon: Phone, title: "دعم فني متخصص", desc: "فريق دعم يتحدث العربية 24/7" },
              { icon: Star, title: "منتجات أصلية", desc: "نضمن لك جودة جميع المنتجات" },
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all duration-300 group">
                <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product of the Week */}
      {featuredProduct && (
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="w-full lg:w-1/2 relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl -rotate-3 scale-95 group-hover:rotate-0 transition-transform duration-500" />
                <img 
                  src={featuredProduct.image} 
                  alt={featuredProduct.name} 
                  className="relative w-full rounded-3xl shadow-2xl object-cover aspect-square"
                />
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                <div className="inline-block px-3 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  منتج الأسبوع
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">{featuredProduct.name}</h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  منتج متكامل ومركز للمياه العذبة والمالحة. يزيل الكلور والكلورامين ويزيل سمية الأمونيا والنتريت والنترات.
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-primary">{featuredProduct.price.toLocaleString()} د.ع.</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    <Star className="h-5 w-5 fill-current" />
                    <span className="text-slate-900 font-medium">{featuredProduct.rating}</span>
                    <span className="text-slate-400 text-sm">({featuredProduct.reviewCount} تقييم)</span>
                  </div>
                </div>
                <div className="pt-4">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6">
                    أضف إلى العربة
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories / Tools */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">أدوات تساعدك في رحلتك</h2>
            <p className="text-slate-500">استخدم أدواتنا المجانية لحساب احتياجات حوضك بدقة</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "حاسبة السخان", desc: "احسب القدرة المطلوبة للسخان", icon: Thermometer, color: "text-rose-500", bg: "bg-rose-50" },
              { title: "حاسبة الفلترة", desc: "احسب معدل التدفق المناسب", icon: Droplets, color: "text-blue-500", bg: "bg-blue-50" },
              { title: "حاسبة الملوحة", desc: "قريباً", icon: Package, color: "text-slate-400", bg: "bg-slate-50" },
            ].map((tool, idx) => (
              <div key={idx} className="group p-8 rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 cursor-pointer">
                <div className={`w-14 h-14 ${tool.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <tool.icon className={`h-7 w-7 ${tool.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-primary transition-colors">{tool.title}</h3>
                <p className="text-slate-500 mb-6">{tool.desc}</p>
                <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                  جرب الآن <ArrowRight className="h-4 w-4 mr-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Grid */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">الأكثر مبيعاً</h2>
              <p className="text-slate-500">اختيارات عملائنا المفضلة</p>
            </div>
            <Button variant="ghost" className="hidden sm:flex gap-2 hover:bg-white">
              عرض الكل <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
             <Button variant="outline" className="w-full">عرض الكل</Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <Card className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {product.originalPrice && (
          <span className="absolute top-3 right-3 z-10 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            خصم
          </span>
        )}
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
          <Button size="sm" className="w-full bg-white text-slate-900 hover:bg-white/90">
            نظرة سريعة
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="text-xs text-slate-500 mb-1 font-medium">{product.brand}</div>
        <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 h-10 leading-tight group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-current" : "text-slate-200"}`} />
            ))}
          </div>
          <span className="text-xs text-slate-400">({product.reviewCount})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">{product.price.toLocaleString()} د.ع.</span>
          {product.originalPrice && (
            <span className="text-sm text-slate-400 line-through">{product.originalPrice.toLocaleString()} د.ع.</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-slate-900 hover:bg-primary transition-colors">
          أضف إلى العربة
        </Button>
      </CardFooter>
    </Card>
  );
}
