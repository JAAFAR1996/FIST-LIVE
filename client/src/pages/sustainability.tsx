import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Leaf, Droplets, Wind, Recycle, Heart, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function Sustainability() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop"
            alt="Sustainability"
            loading="lazy"
            decoding="async"
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-background" />
        </div>

        <div className="container relative z-10 text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="outline" className="mb-4 border-white/50 text-white bg-white/10 backdrop-blur-md px-4 py-1 text-sm uppercase tracking-widest">
              استدامة
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              لأجل محيطاتنا
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              نحن نؤمن بأن هواية تربية الأسماك يجب أن تساهم في حماية البيئة المائية، لا أن تضر بها.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="flex-1">
        {/* 1% for the Planet */}
        <section className="py-24 container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                <Globe className="w-10 h-10" />
              </div>
              <h2 className="text-4xl font-bold">التزام الـ 1%</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                نحن فخورون بكوننا أعضاء في مبادرة "1% for the Planet". نتبرع بـ 1% من إجمالي مبيعاتنا السنوية للمنظمات المكرسة لحماية وتنظيف المحيطات والشعاب المرجانية.
              </p>
              <ul className="space-y-4">
                {[
                  "دعم مشاريع استزراع الشعاب المرجانية",
                  "تمويل حملات تنظيف الشواطئ",
                  "حماية الأنواع المهددة بالانقراض"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img
                src="https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop"
                alt="Clean Water"
                loading="lazy"
                decoding="async"
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">كيف نجعل هوايتك صديقة للبيئة؟</h2>
              <p className="text-muted-foreground">نختار منتجاتنا وعملياتنا بعناية لتقليل البصمة الكربونية.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Recycle,
                  title: "تغليف قابل للتدوير",
                  desc: "نستخدم كرتون معاد تدويره ومواد تعبئة خالية من البلاستيك بنسبة 100%."
                },
                {
                  icon: Wind,
                  title: "معدات موفرة للطاقة",
                  desc: "نروج للفلاتر والإضاءة التي تستهلك طاقة أقل بنسبة تصل إلى 50%."
                },
                {
                  icon: Leaf,
                  title: "منتجات طبيعية",
                  desc: "نفضل الأغذية والعلاجات الطبيعية الخالية من المواد الكيميائية الضارة."
                }
              ].map((feature, i) => (
                <div key={i} className="bg-card p-8 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-primary/5 rounded-xl flex items-center justify-center text-primary mb-6">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
