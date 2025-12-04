import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, ArrowRight, Search } from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-20 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Animated 404 with fish bubbles */}
          <div className="relative">
            <h1 className="text-9xl font-black text-primary/20 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-bounce">
                <svg
                  className="w-32 h-32 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-4" dir="rtl">
            <h2 className="text-4xl font-bold text-foreground">
              عذراً! هذه الصفحة غير موجودة
            </h2>
            <p className="text-xl text-muted-foreground max-w-md mx-auto">
              يبدو أن هذه السمكة سبحت بعيداً... دعنا نعيدك إلى المياه الآمنة.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="lg"
              className="gap-2 text-lg"
              onClick={() => setLocation("/")}
            >
              <Home className="w-5 h-5" />
              العودة للرئيسية
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-lg"
              onClick={() => setLocation("/products")}
            >
              تصفح المنتجات
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Quick links */}
          <div className="pt-12 space-y-4" dir="rtl">
            <p className="text-sm text-muted-foreground">ربما تبحث عن:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: "موسوعة الأسماك", path: "/fish-encyclopedia" },
                { label: "مخطط الحوض", path: "/fish-finder-advanced" },
                { label: "بدء رحلتك", path: "/journey" },
                { label: "العروض", path: "/deals" },
              ].map((link) => (
                <button
                  key={link.path}
                  onClick={() => setLocation(link.path)}
                  className="px-4 py-2 text-sm bg-primary/10 hover:bg-primary/20 text-primary rounded-full transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
