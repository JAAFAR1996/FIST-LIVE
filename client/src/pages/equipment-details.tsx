import { useRoute } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ExplodedView } from "@/components/equipment/exploded-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Cog, Gauge, Zap, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProductBySlug } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types";

export default function EquipmentDetails() {
  const [, params] = useRoute("/equipment/:slug");
  const slug = params?.slug;
  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug || ""),
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });
  const product: Product | undefined = data;

  if (!product) {
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

  // Mock parts data for exploded view if not present
  const parts = (product.explodedViewParts || [
    { id: "1", name: "رأس المحرك", imageUrl: product.image, description: "محرك قوي وصامت" },
    { id: "2", name: "غطاء المروحة", imageUrl: product.image, description: "يحمي المروحة" },
    { id: "3", name: "علبة الفلتر", imageUrl: product.image, description: "مساحة كبيرة لتخزين الوسائط" },
  ]).map((part, index) => ({
    ...part,
    x: (index + 1) * 25, // Mock positions
    y: 50
  }));

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      
      <main className="flex-1">
        {/* Industrial Hero */}
        <section className="relative bg-zinc-900 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <Badge variant="outline" className="text-zinc-400 border-zinc-700">درجة صناعية</Badge>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">{product.name}</h1>
              <p className="text-xl text-zinc-400 max-w-xl">{product.specs}</p>
              <div className="flex gap-4 pt-4">
                <Button size="lg" className="bg-white text-black hover:bg-zinc-200 font-bold">
                  <ShoppingCart className="mr-2 h-5 w-5" /> اشترِ الآن
                </Button>
                <Button size="lg" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800">
                  تحميل الدليل
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              {isLoading ? (
                <Skeleton className="w-full max-w-[400px] h-[320px] rounded-3xl" />
              ) : (
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="max-w-[400px] drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]" 
                />
              )}
            </div>
          </div>
        </section>

        {/* Technical Specs Grid */}
        <section className="py-20 bg-muted/10">
          <div className="container mx-auto px-4">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: Gauge, label: "معدل التدفق", value: "1450 L/h" },
                  { icon: Zap, label: "القوة", value: "23 واط" },
                  { icon: Shield, label: "الضمان", value: "3 سنوات" },
                  { icon: Cog, label: "سعة الوسائط", value: "4.2 لتر" },
                ].map((spec, i) => (
                  <div key={i} className="bg-card border p-6 rounded-xl flex flex-col items-center text-center gap-2 hover:border-primary transition-colors">
                    <spec.icon className="h-8 w-8 text-primary mb-2" />
                    <span className="text-muted-foreground text-sm font-bold uppercase tracking-wide">{spec.label}</span>
                    <span className="text-2xl font-bold">{spec.value}</span>
                  </div>
                ))}
             </div>
          </div>
        </section>

        {/* Exploded View */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">تشريح الأداء</h2>
              <p className="text-muted-foreground">استكشف المكونات التي تجعل هذا الفلتر متفوقاً.</p>
            </div>
            
            <ExplodedView imageUrl={product.image} parts={parts} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
