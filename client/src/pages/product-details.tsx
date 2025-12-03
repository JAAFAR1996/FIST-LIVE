import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchProductBySlug } from "@/lib/api";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Star, Truck, RotateCcw, Shield, Info, Heart, Share2, Leaf } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetails() {
  const params = useParams();
  const slug = params.slug;
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug!),
    enabled: !!slug,
  });

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      toast({
        title: "تمت الإضافة للسلة ✓",
        description: `تم إضافة ${quantity} من ${product.name} إلى سلة المشتريات.`,
      });
    }
  };

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">خطأ في تحميل المنتج</h2>
            <p className="text-muted-foreground">تعذر العثور على المنتج المطلوب</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main id="main-content" className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {isLoading || !product ? (
            <ProductSkeleton />
          ) : (
            <>
              {/* Product Header */}
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-12">
                {/* Product Image */}
                <div className="relative">
                  <Card className="overflow-hidden border-none shadow-lg">
                    <div className="relative bg-muted/20 aspect-square">
                      <img
                        src={product.image}
                        alt={`صورة منتج ${product.name}`}
                        className="w-full h-full object-contain p-8"
                      />
                      {/* Badges */}
                      <div className="absolute top-4 right-4 flex flex-col gap-2">
                        {product.isNew && <Badge className="bg-blue-500">جديد</Badge>}
                        {product.isBestSeller && <Badge className="bg-amber-500">الأكثر مبيعاً</Badge>}
                        {product.ecoFriendly && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 gap-1">
                            <Leaf className="w-3 h-3" /> صديق للبيئة
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-primary font-semibold text-sm">{product.brand}</span>
                    <DifficultyBadge level={product.difficulty} />
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-current" : ""}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {product.rating} ({product.reviewCount} تقييم)
                    </span>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold text-primary">
                        {product.price.toLocaleString()} <span className="text-lg">د.ع</span>
                      </span>
                      {product.originalPrice && (
                        <>
                          <span className="text-xl text-muted-foreground line-through">
                            {product.originalPrice.toLocaleString()} د.ع
                          </span>
                          <Badge variant="destructive" className="text-sm">
                            خصم {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    {product.specs}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-4 mb-6">
                    <label className="text-sm font-medium">الكمية:</label>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        -
                      </Button>
                      <span className="w-12 text-center font-semibold">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <Button size="lg" className="flex-1" onClick={handleAddToCart}>
                      <ShoppingCart className="ml-2 w-5 h-5" />
                      أضف إلى السلة
                    </Button>
                    <Button size="lg" variant="outline">
                      <Heart className="ml-2 w-5 h-5" />
                      المفضلة
                    </Button>
                    <Button size="lg" variant="outline">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Quick Info */}
                  <Card className="border-primary/20">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Truck className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">توصيل سريع</p>
                            <p className="text-xs text-muted-foreground">2-3 أيام</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <RotateCcw className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">إرجاع سهل</p>
                            <p className="text-xs text-muted-foreground">خلال 14 يوم</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Shield className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">ضمان الجودة</p>
                            <p className="text-xs text-muted-foreground">منتج أصلي</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Detailed Information Tabs */}
              <Tabs defaultValue="specs" className="mb-12">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="specs">المواصفات الفنية</TabsTrigger>
                  <TabsTrigger value="shipping">الشحن والإرجاع</TabsTrigger>
                  <TabsTrigger value="usage">إرشادات الاستخدام</TabsTrigger>
                </TabsList>

                <TabsContent value="specs" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        المواصفات التفصيلية
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-2">معلومات المنتج</h4>
                          <dl className="space-y-2">
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">العلامة التجارية:</dt>
                              <dd className="font-medium">{product.brand}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">الفئة:</dt>
                              <dd className="font-medium">{product.category}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">مستوى الخبرة:</dt>
                              <dd className="font-medium">{product.difficulty}</dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-muted-foreground">التقييم:</dt>
                              <dd className="font-medium">{product.rating}/5</dd>
                            </div>
                          </dl>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">الوصف</h4>
                          <p className="text-muted-foreground leading-relaxed">
                            {product.specs}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="shipping" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Truck className="w-5 h-5" />
                        معلومات الشحن والإرجاع
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">سياسة الشحن</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>توصيل مجاني للطلبات فوق 100,000 دينار عراقي</li>
                          <li>التوصيل خلال 2-3 أيام عمل داخل بغداد</li>
                          <li>التوصيل خلال 4-7 أيام عمل لبقية المحافظات</li>
                          <li>إمكانية تتبع الطلب عبر رقم الشحنة</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">سياسة الإرجاع</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>يمكن إرجاع المنتج خلال 14 يوم من تاريخ الاستلام</li>
                          <li>يجب أن يكون المنتج في حالته الأصلية مع العبوة</li>
                          <li>يتم استرداد المبلغ كاملاً في حالة عيب المنتج</li>
                          <li>رسوم الشحن غير قابلة للاسترداد في حالة تغيير الرأي</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="usage" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        إرشادات الاستخدام والأمان
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">طريقة الاستخدام</h4>
                        <ul className="list-decimal list-inside space-y-1 text-muted-foreground">
                          <li>اقرأ التعليمات الموجودة على العبوة بعناية</li>
                          <li>استخدم المنتج حسب التوصيات المذكورة</li>
                          <li>احفظ المنتج في مكان بارد وجاف بعيداً عن أشعة الشمس</li>
                          <li>تأكد من صلاحية المنتج قبل الاستخدام</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">تحذيرات الأمان</h4>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>احفظ المنتج بعيداً عن متناول الأطفال</li>
                          <li>لا تستخدم المنتج بكميات أكبر من الموصى بها</li>
                          <li>في حالة ملامسة العينين، اغسلهما فوراً بالماء</li>
                          <li>استشر خبير أحواض السمك عند الشك</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

const ProductSkeleton = () => (
  <div className="grid md:grid-cols-2 gap-12">
    <Skeleton className="w-full h-auto aspect-square rounded-lg" />
    <div className="space-y-4">
      <Skeleton className="h-6 w-1/4" />
      <Skeleton className="h-10 w-3/4" />
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-10 w-1/2" />
      <Skeleton className="h-12 w-full md:w-1/2" />
    </div>
  </div>
);
