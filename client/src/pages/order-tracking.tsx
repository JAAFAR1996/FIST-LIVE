import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Search, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  ShoppingBag,
  PackageCheck,
  Home,
  AlertCircle,
  ChevronLeft
} from "lucide-react";
import { useState } from "react";

interface OrderStatus {
  id: string;
  title: string;
  description: string;
  time: string;
  completed: boolean;
  current: boolean;
}

interface OrderDetails {
  orderNumber: string;
  orderDate: string;
  estimatedDelivery: string;
  status: string;
  customerName: string;
  shippingAddress: string;
  phone: string;
  courier: string;
  trackingNumber: string;
  shippingMethod: string;
  items: {
    name: string;
    quantity: number;
    price: string;
    image: string;
  }[];
  timeline: OrderStatus[];
}

export default function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [error, setError] = useState("");

  const sampleOrder: OrderDetails = {
    orderNumber: "FW-2024-00847",
    orderDate: "25 نوفمبر 2024",
    estimatedDelivery: "28 نوفمبر 2024",
    status: "في الطريق",
    customerName: "أحمد محمد",
    shippingAddress: "بغداد، الكرادة، شارع 52، بناية 15",
    phone: "+964 770 123 4567",
    courier: "شركة التوصيل السريع",
    trackingNumber: "IQ-5847291036",
    shippingMethod: "توصيل سريع (1-2 أيام)",
    items: [
      {
        name: "حوض زجاجي 60 لتر مع غطاء LED",
        quantity: 1,
        price: "125,000 د.ع",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=100&fit=crop"
      },
      {
        name: "فلتر خارجي Fluval 207",
        quantity: 1,
        price: "85,000 د.ع",
        image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=100&h=100&fit=crop"
      },
      {
        name: "طعام أسماك استوائية TetraMin",
        quantity: 2,
        price: "15,000 د.ع",
        image: "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=100&h=100&fit=crop"
      }
    ],
    timeline: [
      {
        id: "ordered",
        title: "تم استلام الطلب",
        description: "تم تأكيد طلبك بنجاح وجاري تجهيزه",
        time: "25 نوفمبر، 10:30 ص",
        completed: true,
        current: false
      },
      {
        id: "processing",
        title: "جاري التجهيز",
        description: "فريقنا يجهز منتجاتك بعناية",
        time: "25 نوفمبر، 2:15 م",
        completed: true,
        current: false
      },
      {
        id: "shipped",
        title: "تم الشحن",
        description: "طلبك في الطريق مع مندوب التوصيل",
        time: "26 نوفمبر، 9:00 ص",
        completed: true,
        current: false
      },
      {
        id: "out_for_delivery",
        title: "في الطريق للتوصيل",
        description: "المندوب في طريقه إليك - سيتواصل معك قريباً",
        time: "27 نوفمبر، 11:45 ص",
        completed: false,
        current: true
      },
      {
        id: "delivered",
        title: "تم التسليم",
        description: "تم تسليم طلبك بنجاح",
        time: "متوقع: 28 نوفمبر",
        completed: false,
        current: false
      }
    ]
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!orderNumber.trim()) {
      setError("الرجاء إدخال رقم الطلب");
      return;
    }

    setIsSearching(true);
    
    setTimeout(() => {
      setOrderDetails(sampleOrder);
      setIsSearching(false);
    }, 1500);
  };

  const getStatusIcon = (status: OrderStatus) => {
    if (status.completed) {
      return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    }
    if (status.current) {
      return <Truck className="w-6 h-6 text-primary animate-pulse" />;
    }
    return <Clock className="w-6 h-6 text-muted-foreground" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans" data-testid="order-tracking-page">
      <Navbar />
      
      <section className="relative py-20 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-20 w-48 h-48 bg-green-500 rounded-full blur-3xl" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4 border-primary/50 text-primary bg-primary/10 px-4 py-1 text-sm">
              <Package className="w-4 h-4 ml-2" />
              تتبع الشحنات
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6" data-testid="text-page-title">
              تتبع طلبك
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              أدخل رقم طلبك لمعرفة حالة الشحنة ووقت التسليم المتوقع
            </p>
          </motion.div>
        </div>
      </section>

      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <Card className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">رقم الطلب</label>
                  <div className="relative">
                    <Package className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="مثال: FW-2024-00847"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      className="pr-10 py-6 text-lg"
                      data-testid="input-order-number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">رقم الهاتف (اختياري)</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      type="tel"
                      placeholder="للتحقق الإضافي"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pr-10"
                      dir="ltr"
                      data-testid="input-phone-number"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-red-500 bg-red-500/10 p-3 rounded-lg">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg"
                  disabled={isSearching}
                  data-testid="button-track-order"
                >
                  {isSearching ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                      جاري البحث...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 ml-2" />
                      تتبع الطلب
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t space-y-3">
                <p className="text-sm text-muted-foreground text-center">
                  ستجد رقم الطلب في رسالة التأكيد عبر البريد الإلكتروني أو واتساب
                </p>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
                  <p className="text-xs text-muted-foreground mb-1">للتجربة، استخدم رقم الطلب التجريبي:</p>
                  <code className="text-primary font-mono font-bold">FW-2024-00847</code>
                </div>
              </div>
            </Card>
          </motion.div>

          {orderDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h2 className="text-2xl font-bold">{orderDetails.orderNumber}</h2>
                          <p className="text-muted-foreground">تاريخ الطلب: {orderDetails.orderDate}</p>
                        </div>
                        <Badge className="bg-primary/20 text-primary border-0 px-4 py-2 text-base">
                          <Truck className="w-4 h-4 ml-2" />
                          {orderDetails.status}
                        </Badge>
                      </div>

                      <div className="relative">
                        <div className="absolute right-[23px] top-0 bottom-0 w-0.5 bg-muted" />
                        
                        <div className="space-y-8">
                          {orderDetails.timeline.map((status, index) => (
                            <div 
                              key={status.id} 
                              className={`relative flex gap-4 ${status.completed || status.current ? "" : "opacity-50"}`}
                            >
                              <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                                status.completed 
                                  ? "bg-green-500/20" 
                                  : status.current 
                                    ? "bg-primary/20 ring-4 ring-primary/30" 
                                    : "bg-muted"
                              }`}>
                                {getStatusIcon(status)}
                              </div>
                              <div className="flex-1 pb-2">
                                <div className="flex items-center justify-between">
                                  <h3 className="font-semibold text-lg">{status.title}</h3>
                                  <span className="text-sm text-muted-foreground">{status.time}</span>
                                </div>
                                <p className="text-muted-foreground mt-1">{status.description}</p>
                                {status.current && (
                                  <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                                    <p className="text-sm text-primary font-medium">
                                      المندوب سيتواصل معك قبل الوصول بـ 30 دقيقة
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        محتويات الطلب
                      </h3>
                      <div className="space-y-4">
                        {orderDetails.items.map((item, index) => (
                          <div 
                            key={index}
                            className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg"
                          >
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">الكمية: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">{item.price}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Truck className="w-5 h-5 text-primary" />
                        معلومات الشحن
                      </h3>
                      <div className="space-y-3">
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">شركة التوصيل</p>
                          <p className="font-medium">{orderDetails.courier}</p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">رقم التتبع</p>
                          <p className="font-mono font-medium" dir="ltr">{orderDetails.trackingNumber}</p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">طريقة الشحن</p>
                          <p className="font-medium">{orderDetails.shippingMethod}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        عنوان التوصيل
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Home className="w-5 h-5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{orderDetails.customerName}</p>
                            <p className="text-sm text-muted-foreground">{orderDetails.shippingAddress}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-muted-foreground" />
                          <p className="text-sm" dir="ltr">{orderDetails.phone}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        موعد التسليم
                      </h3>
                      <div className="text-center p-4 bg-green-500/10 rounded-xl">
                        <p className="text-sm text-muted-foreground mb-1">الموعد المتوقع</p>
                        <p className="text-2xl font-bold text-green-600">{orderDetails.estimatedDelivery}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-bl from-primary/10 to-blue-500/10 border-0">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold mb-4">هل تحتاج مساعدة؟</h3>
                      <div className="space-y-3">
                        <a 
                          href="https://wa.me/9647700000000"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-background/80 rounded-lg hover:bg-background transition-colors"
                        >
                          <MessageCircle className="w-5 h-5 text-green-500" />
                          <span className="text-sm">تواصل عبر واتساب</span>
                        </a>
                        <a 
                          href="tel:+9647700000000"
                          className="flex items-center gap-3 p-3 bg-background/80 rounded-lg hover:bg-background transition-colors"
                        >
                          <Phone className="w-5 h-5 text-primary" />
                          <span className="text-sm">اتصل بخدمة العملاء</span>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {!orderDetails && !error && (
            <motion.section 
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-3">
                <ChevronLeft className="w-6 h-6 text-primary" />
                كيف يعمل تتبع الطلب؟
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  { icon: ShoppingBag, title: "تم الطلب", desc: "نستلم طلبك ونبدأ بتجهيزه" },
                  { icon: PackageCheck, title: "جاري التجهيز", desc: "نغلف منتجاتك بعناية" },
                  { icon: Truck, title: "في الطريق", desc: "المندوب في طريقه إليك" },
                  { icon: Home, title: "تم التسليم", desc: "وصل طلبك بأمان" }
                ].map((step, index) => (
                  <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </Card>
                ))}
              </div>
            </motion.section>
          )}

          <motion.section 
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-gradient-to-l from-primary/10 to-green-500/10 border-0">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-4">لديك استفسار عن طلبك؟</h2>
                  <p className="text-muted-foreground">فريقنا جاهز لمساعدتك في أي وقت</p>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <a 
                    href="tel:+9647700000000"
                    className="flex items-center gap-4 p-4 bg-background/80 rounded-xl hover:bg-background transition-colors group"
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">اتصل بنا</p>
                      <p className="text-sm text-muted-foreground" dir="ltr">+964 770 000 0000</p>
                    </div>
                  </a>
                  <a 
                    href="https://wa.me/9647700000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 bg-background/80 rounded-xl hover:bg-background transition-colors group"
                  >
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                      <MessageCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">واتساب</p>
                      <p className="text-sm text-muted-foreground">رد فوري</p>
                    </div>
                  </a>
                  <a 
                    href="mailto:support@fishweb.iq"
                    className="flex items-center gap-4 p-4 bg-background/80 rounded-xl hover:bg-background transition-colors group"
                  >
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <Mail className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-medium">البريد الإلكتروني</p>
                      <p className="text-sm text-muted-foreground">support@fishweb.iq</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
