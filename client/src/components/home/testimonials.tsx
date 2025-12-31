import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
  productUsed?: string;
}

const testimonials: Testimonial[] = [
  {
    name: "أحمد الكعبي",
    location: "بغداد",
    rating: 5,
    comment: "تجربة ممتازة! المنتجات ذات جودة عالية والتوصيل كان سريع. حوضي أصبح أجمل من أي وقت مضى بفضل نصائحكم.",
    date: "منذ أسبوعين",
    productUsed: "Seachem Prime",
  },
  {
    name: "فاطمة محمد",
    location: "البصرة",
    rating: 5,
    comment: "خدمة عملاء رائعة! ساعدوني في اختيار المعدات المناسبة لحوضي الصغير. سأطلب منهم مرة أخرى بالتأكيد.",
    date: "منذ 3 أيام",
  },
  {
    name: "علي حسين",
    location: "أربيل",
    rating: 4,
    comment: "منتجات أصلية ونادرة. سعيد جداً بمشترياتي. فقط أتمنى أن تكون الأسعار أقل قليلاً.",
    date: "منذ شهر",
    productUsed: "Fluval Filter",
  },
  {
    name: "سارة عبدالله",
    location: "الموصل",
    rating: 5,
    comment: "موقع احترافي ومنظم. استخدمت أداة مخطط الحوض وكانت مفيدة جداً! أنصح الجميع بتجربتها.",
    date: "منذ 5 أيام",
  },
  {
    name: "حسن الجبوري",
    location: "كركوك",
    rating: 5,
    comment: "أفضل متجر أحواض في العراق! المنتجات متنوعة والتغليف ممتاز. شكراً لكم.",
    date: "منذ أسبوع",
    productUsed: "LED Aquarium Light",
  },
  {
    name: "مريم صالح",
    location: "النجف",
    rating: 5,
    comment: "موسوعة الأسماك ساعدتني كثيراً في اختيار الأسماك المتوافقة. المحتوى التعليمي ممتاز!",
    date: "منذ 3 أسابيع",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16" dir="rtl">
          <h2 className="text-4xl font-bold mb-4 text-foreground">
            ماذا يقول عملاؤنا
          </h2>
          <p className="text-xl text-muted-foreground">
            آلاف العملاء السعداء في جميع أنحاء العراق يثقون بنا
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir="rtl">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.name}
              className="hover:shadow-lg transition-shadow duration-300 relative overflow-hidden"
            >
              <div className="absolute top-4 left-4 text-primary/10">
                <Quote className="w-12 h-12" />
              </div>

              <CardContent className="pt-6 space-y-4">
                {/* Rating */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < testimonial.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-muted-foreground leading-relaxed min-h-[80px]">
                  "{testimonial.comment}"
                </p>

                {/* Product Used */}
                {testimonial.productUsed && (
                  <div className="text-xs text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">
                    استخدم: {testimonial.productUsed}
                  </div>
                )}

                {/* User Info */}
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">
                      {testimonial.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{testimonial.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {testimonial.location} • {testimonial.date}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center" dir="rtl">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">5000+</div>
            <p className="text-sm text-muted-foreground">عميل سعيد</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">4.9</div>
            <p className="text-sm text-muted-foreground">تقييم متوسط</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">98%</div>
            <p className="text-sm text-muted-foreground">رضا العملاء</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">3 أيام</div>
            <p className="text-sm text-muted-foreground">متوسط التوصيل</p>
          </div>
        </div>
      </div>
    </section>
  );
}
