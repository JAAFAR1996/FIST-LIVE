import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  Calendar,
  Truck,
  DollarSign,
  Check,
  Star,
  Gift,
  Sparkles,
  Droplets,
  Fish,
  Leaf
} from "lucide-react";

interface SubscriptionPlan {
  id: string;
  name: string;
  arabicName: string;
  price: number;
  originalPrice: number;
  interval: "monthly" | "quarterly" | "yearly";
  intervalText: string;
  savings: number;
  items: string[];
  popular: boolean;
  icon: any;
  color: string;
}

const plans: SubscriptionPlan[] = [
  {
    id: "basic-monthly",
    name: "Basic Maintenance",
    arabicName: "صيانة أساسية",
    price: 50000,
    originalPrice: 65000,
    interval: "monthly",
    intervalText: "شهرياً",
    savings: 23,
    items: [
      "محلول تنقية المياه (500 مل)",
      "طعام أسماك مجفف (100 جم)",
      "بكتيريا مفيدة (250 مل)",
      "شرائط اختبار المياه (10 قطع)"
    ],
    popular: false,
    icon: Package,
    color: "blue"
  },
  {
    id: "premium-monthly",
    name: "Premium Care",
    arabicName: "عناية متميزة",
    price: 95000,
    originalPrice: 130000,
    interval: "monthly",
    intervalText: "شهرياً",
    savings: 27,
    items: [
      "محلول تنقية + معالج كلور",
      "طعام متنوع (مجفف + مجمد)",
      "بكتيريا + إنزيمات",
      "شرائط اختبار (20 قطعة)",
      "منظف زجاج مغناطيسي",
      "مكافأة شهرية مفاجئة 🎁"
    ],
    popular: true,
    icon: Star,
    color: "amber"
  },
  {
    id: "planted-monthly",
    name: "Planted Tank",
    arabicName: "حوض مزروع",
    price: 85000,
    originalPrice: 110000,
    interval: "monthly",
    intervalText: "شهرياً",
    savings: 23,
    items: [
      "سماد نباتات سائل",
      "CO2 سائل (500 مل)",
      "ركيزة مغذية (كيس)",
      "أقراص سماد للجذور",
      "طعام أسماك عالي الجودة",
      "بكتيريا مفيدة"
    ],
    popular: false,
    icon: Leaf,
    color: "green"
  }
];

export default function SubscriptionBoxes() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    notes: ""
  });
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPlan) return;

    toast({
      title: "تم الاشتراك بنجاح",
      description: `سنرسل لك ${selectedPlan.arabicName} شهرياً. سيصل أول صندوق خلال 3-5 أيام.`
    });

    setIsDialogOpen(false);
    setFormData({ name: "", phone: "", address: "", notes: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/20 px-6 py-2 rounded-full mb-6">
              <Gift className="h-5 w-5 text-primary" />
              <span className="font-bold text-primary">صناديق الاشتراك الشهرية</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              لا تنفد منك المستلزمات أبداً!
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              اشترك واستلم صندوق صيانة شهري يوفر لك الوقت والمال
            </p>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                <span className="font-semibold">توصيل مجاني</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <span className="font-semibold">إلغاء في أي وقت</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <span className="font-semibold">وفر حتى 30%</span>
              </div>
            </div>
          </div>
        </section>

        {/* Plans */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              اختر الباقة المناسبة لك
            </h2>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan) => {
                const Icon = plan.icon;
                return (
                  <Card
                    key={plan.id}
                    className={`relative ${plan.popular ? 'border-2 border-primary shadow-xl scale-105' : ''}`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                        الأكثر شعبية
                      </Badge>
                    )}

                    <CardHeader>
                      <div className={`w-16 h-16 bg-${plan.color}-100 dark:bg-${plan.color}-950 rounded-full flex items-center justify-center mb-4`}>
                        <Icon className={`h-8 w-8 text-${plan.color}-600`} />
                      </div>

                      <CardTitle className="text-2xl">{plan.arabicName}</CardTitle>
                      <CardDescription>{plan.name}</CardDescription>

                      <div className="mt-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold">{(plan.price / 1000).toFixed(0)}k</span>
                          <span className="text-muted-foreground">د.ع</span>
                          <span className="text-muted-foreground">/ {plan.intervalText}</span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          <span className="line-through">{(plan.originalPrice / 1000).toFixed(0)}k د.ع</span>
                          <Badge variant="secondary" className="mr-2 bg-green-100 text-green-700">
                            وفر {plan.savings}%
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        {plan.items.map((item, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                            <span className="text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter>
                      <Dialog open={isDialogOpen && selectedPlan?.id === plan.id} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full"
                            variant={plan.popular ? "default" : "outline"}
                            onClick={() => setSelectedPlan(plan)}
                          >
                            اشترك الآن
                          </Button>
                        </DialogTrigger>

                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>اشترك في {plan.arabicName}</DialogTitle>
                          </DialogHeader>

                          <form onSubmit={handleSubscribe} className="space-y-4">
                            <div>
                              <Label>الاسم الكامل</Label>
                              <Input
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="محمد أحمد"
                                required
                              />
                            </div>

                            <div>
                              <Label>رقم الهاتف</Label>
                              <Input
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                placeholder="+964 770 000 0000"
                                required
                              />
                            </div>

                            <div>
                              <Label>العنوان الكامل</Label>
                              <Input
                                value={formData.address}
                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                placeholder="بغداد - الكرادة - شارع..."
                                required
                              />
                            </div>

                            <div>
                              <Label>ملاحظات (اختياري)</Label>
                              <Input
                                value={formData.notes}
                                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                                placeholder="أي تفضيلات خاصة"
                              />
                            </div>

                            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>السعر الشهري:</span>
                                <span className="font-bold">{plan.price.toLocaleString()} د.ع</span>
                              </div>
                              <div className="flex justify-between text-green-600">
                                <span>التوصيل:</span>
                                <span className="font-bold">مجاني</span>
                              </div>
                            </div>

                            <Button type="submit" className="w-full">
                              تأكيد الاشتراك
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">
                              يمكنك إلغاء الاشتراك في أي وقت بدون رسوم
                            </p>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">كيف يعمل؟</h2>

            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {[
                { step: "1", title: "اختر باقتك", desc: "حدد الباقة المناسبة لحوضك", icon: Package },
                { step: "2", title: "املأ البيانات", desc: "أدخل عنوانك ومعلومات التواصل", icon: Gift },
                { step: "3", title: "استلم صندوقك", desc: "يصلك الصندوق كل شهر تلقائياً", icon: Truck },
                { step: "4", title: "استمتع", desc: "حوض نظيف وصحي بدون عناء", icon: Sparkles }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center mb-12">الأسئلة الشائعة</h2>

            <div className="space-y-6">
              {[
                {
                  q: "هل يمكنني إلغاء الاشتراك؟",
                  a: "نعم، يمكنك إلغاء الاشتراك في أي وقت بدون أي رسوم إضافية."
                },
                {
                  q: "متى سيصل أول صندوق؟",
                  a: "سيصلك الصندوق الأول خلال 3-5 أيام عمل من تاريخ الاشتراك."
                },
                {
                  q: "هل يمكنني تغيير الباقة؟",
                  a: "بالتأكيد! يمكنك الترقية أو التخفيض في أي وقت."
                },
                {
                  q: "ماذا إذا كنت مسافراً؟",
                  a: "يمكنك تعليق الاشتراك مؤقتاً عبر التواصل معنا."
                }
              ].map((faq, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
