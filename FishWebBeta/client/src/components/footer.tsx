import { Facebook, Instagram, Twitter, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Fish Web</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              وجهتك الأولى لمستلزمات أحواض الأسماك في العراق. نوفر أفضل المنتجات العالمية لضمان بيئة صحية وسعيدة لأسماكك.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:text-primary transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">روابط سريعة</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-primary transition-colors">الرئيسية</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">المنتجات</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">الحاسبات</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">سياسة الإرجاع</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">تواصل معنا</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">تواصل معنا</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-primary" />
                <span dir="ltr">+964 770 000 0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@fishweb.iq</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-1" />
                <span>بغداد – العراق، الكرادة</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">النشرة البريدية</h4>
            <p className="text-slate-400 text-sm">اشترك للحصول على آخر العروض والنصائح.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="البريد الإلكتروني" 
                className="bg-slate-800 border-none rounded-md px-3 py-2 text-sm w-full focus:ring-1 focus:ring-primary outline-none"
              />
              <button className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                اشتراك
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Fish Web. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
