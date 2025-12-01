import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Leaf, Droplets, Sun, Recycle, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function EcoFriendlyGuide() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 bg-green-50 dark:bg-green-950/30 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center">
             <Leaf className="w-16 h-16 mx-auto text-green-600 mb-6 animate-bounce" />
             <h1 className="text-4xl md:text-6xl font-bold mb-6 text-green-900 dark:text-green-100">
               دليل الحوض الصديق للبيئة
             </h1>
             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
               كيف تنشئ نظاماً بيئياً مستداماً في منزلك يقلل من استهلاك الطاقة والموارد.
             </p>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              
              <div className="space-y-6">
                 <div className="flex items-start gap-4">
                   <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full text-blue-600">
                     <Droplets className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="text-2xl font-bold mb-2">1. توفير المياه</h3>
                     <p className="text-muted-foreground leading-relaxed">
                       استخدم مياه الحوض القديمة عند التغيير الدوري لسقي النباتات المنزلية. فهي غنية بالنترات والفوسفات التي تعتبر سماداً طبيعياً ممتازاً.
                     </p>
                   </div>
                 </div>

                 <div className="flex items-start gap-4">
                   <div className="bg-yellow-100 dark:bg-yellow-900/50 p-3 rounded-full text-yellow-600">
                     <Sun className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="text-2xl font-bold mb-2">2. إضاءة LED موفرة</h3>
                     <p className="text-muted-foreground leading-relaxed">
                       الإضاءة الحديثة LED تستهلك 80% طاقة أقل من المصابيح التقليدية وتدوم لفترات أطول، مما يقلل النفايات الإلكترونية.
                     </p>
                   </div>
                 </div>

                 <div className="flex items-start gap-4">
                   <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-full text-emerald-600">
                     <Recycle className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="text-2xl font-bold mb-2">3. فلترة بيولوجية</h3>
                     <p className="text-muted-foreground leading-relaxed">
                       الاعتماد على النباتات الطبيعية والفلترة البيولوجية يقلل الحاجة للمواد الكيميائية وتغيير المياه المتكرر.
                     </p>
                   </div>
                 </div>
              </div>

              <div className="bg-muted rounded-3xl p-8 flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=800&auto=format&fit=crop" 
                  alt="Eco Aquarium" 
                  className="rounded-xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500"
                />
              </div>

            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary/5">
           <div className="container mx-auto px-4 text-center">
             <h2 className="text-3xl font-bold mb-6">ابدأ رحلتك المستدامة اليوم</h2>
             <Link href="/products?eco=true">
               <Button size="lg" className="gap-2 text-lg">
                 تصفح المنتجات الصديقة للبيئة <ArrowRight className="w-5 h-5" />
               </Button>
             </Link>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
