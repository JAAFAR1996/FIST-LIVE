import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Phone, Mail, MapPin, Fish, CreditCard, Truck, Shield, Clock, ChevronLeft, Youtube, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/products", label: "المنتجات" },
    { href: "/calculators", label: "الحاسبات" },
    { href: "/journey", label: "رحلتك" },
    { href: "/fish-finder", label: "مكتشف الأسماك" },
  ];

  const supportLinks = [
    { href: "/sustainability", label: "الاستدامة البيئية" },
    { href: "/guides/eco-friendly", label: "دليل العناية" },
    { href: "/return-policy", label: "سياسة الإرجاع" },
    { href: "/faq", label: "الأسئلة الشائعة" },
    { href: "/order-tracking", label: "تتبع الطلب" },
  ];

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-slate-200 mt-auto relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-b border-slate-800/50">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
            <div className="p-2 bg-primary/20 rounded-full">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-white text-sm">توصيل سريع</p>
              <p className="text-xs text-slate-400">لجميع أنحاء العراق</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
            <div className="p-2 bg-green-500/20 rounded-full">
              <Shield className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="font-medium text-white text-sm">ضمان الجودة</p>
              <p className="text-xs text-slate-400">منتجات أصلية 100%</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
            <div className="p-2 bg-amber-500/20 rounded-full">
              <CreditCard className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="font-medium text-white text-sm">الدفع عند الاستلام</p>
              <p className="text-xs text-slate-400">أو التحويل البنكي</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
            <div className="p-2 bg-blue-500/20 rounded-full">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="font-medium text-white text-sm">دعم على مدار الساعة</p>
              <p className="text-xs text-slate-400">نحن هنا لمساعدتك</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          <div className="space-y-5 lg:col-span-1">
            <Link href="/">
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="bg-primary/20 p-2.5 rounded-full group-hover:bg-primary/30 transition-colors">
                  <Fish className="h-7 w-7 text-primary" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-primary to-blue-400">
                  Fish Web
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              وجهتك الأولى لمستلزمات أحواض الأسماك في العراق. نوفر أفضل المنتجات العالمية لضمان بيئة صحية وسعيدة لأسماكك.
            </p>
            <div className="flex gap-3 pt-2">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-blue-600 rounded-full transition-all hover:scale-110"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 rounded-full transition-all hover:scale-110"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-red-600 rounded-full transition-all hover:scale-110"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a 
                href="https://wa.me/9647700000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-green-600 rounded-full transition-all hover:scale-110"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <ChevronLeft className="h-4 w-4 text-primary" />
              روابط سريعة
            </h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <span className="text-slate-400 hover:text-primary hover:translate-x-1 transition-all inline-block cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <ChevronLeft className="h-4 w-4 text-primary" />
              الدعم والمساعدة
            </h4>
            <ul className="space-y-2.5 text-sm">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href}>
                    <span className="text-slate-400 hover:text-primary hover:translate-x-1 transition-all inline-block cursor-pointer">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h4 className="text-lg font-semibold text-white flex items-center gap-2">
              <ChevronLeft className="h-4 w-4 text-primary" />
              تواصل معنا
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <a 
                  href="tel:+9647700000000" 
                  className="flex items-center gap-3 hover:text-primary transition-colors group"
                >
                  <div className="p-2 bg-slate-800 group-hover:bg-primary/20 rounded-full transition-colors">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <span dir="ltr">+964 770 000 0000</span>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@fishweb.iq"
                  className="flex items-center gap-3 hover:text-primary transition-colors group"
                >
                  <div className="p-2 bg-slate-800 group-hover:bg-primary/20 rounded-full transition-colors">
                    <Mail className="h-4 w-4 text-primary" />
                  </div>
                  <span>info@fishweb.iq</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 bg-slate-800 rounded-full">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <span>بغداد – العراق<br />شارع الكرادة الرئيسي</span>
              </li>
            </ul>

            <div className="pt-2">
              <p className="text-slate-400 text-sm mb-3">اشترك للحصول على آخر العروض:</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="البريد الإلكتروني" 
                  className="bg-slate-800/80 border border-slate-700 rounded-lg px-4 py-2.5 text-sm w-full focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                />
                <button 
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:scale-105 whitespace-nowrap"
                >
                  {subscribed ? "✓" : "اشتراك"}
                </button>
              </form>
              {subscribed && (
                <p className="text-green-400 text-xs mt-2 animate-pulse">تم الاشتراك بنجاح!</p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/50 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Fish Web. جميع الحقوق محفوظة.
            </p>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <Link href="/privacy-policy">
                <span className="hover:text-primary transition-colors cursor-pointer">سياسة الخصوصية</span>
              </Link>
              <Link href="/terms">
                <span className="hover:text-primary transition-colors cursor-pointer">الشروط والأحكام</span>
              </Link>
              <Link href="/return-policy">
                <span className="hover:text-primary transition-colors cursor-pointer">سياسة الإرجاع</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">طرق الدفع:</span>
              <div className="flex gap-1">
                <div className="bg-slate-800 px-2 py-1 rounded text-xs">كي كارد</div>
                <div className="bg-slate-800 px-2 py-1 rounded text-xs">زين كاش</div>
                <div className="bg-slate-800 px-2 py-1 rounded text-xs">نقدي</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
