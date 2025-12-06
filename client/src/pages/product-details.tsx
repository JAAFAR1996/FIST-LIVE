import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { fetchProductBySlug, fetchProducts } from "@/lib/api";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShoppingCart, Star, Truck, RotateCcw, Shield, Info, Heart, Share2, Leaf, ShieldCheck } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { useCart } from "@/contexts/cart-context";
import { useToast } from "@/hooks/use-toast";
import { ProductReviews } from "@/components/products/product-reviews";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { BackToTop } from "@/components/back-to-top";
import { MetaTags, ProductSchema, BreadcrumbSchema } from "@/components/seo/meta-tags";

export default function ProductDetails() {
  const params = useParams();
  const slug = params.slug;
  const [, setLocation] = useLocation();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProductBySlug(slug!),
    enabled: !!slug,
  });

  const { data: allProductsData } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const relatedProducts = allProductsData?.products
    ?.filter((p) => p.id !== product?.id && p.category === product?.category)
    ?.slice(0, 4) || [];

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

  const handleShare = async () => {
    if (!product) return;

    const shareData = {
      title: product.name,
      text: `${product.name} - ${product.price.toLocaleString()} د.ع`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "تمت المشاركة بنجاح",
          description: "شكراً لمشاركة المنتج!",
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "تم نسخ الرابط",
          description: "تم نسخ رابط المنتج إلى الحافظة",
        });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        toast({
          title: "خطأ",
          description: "تعذرت مشاركة المنتج",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto py-8">
          <Skeleton className="h-[400px] w-full rounded-xl" />
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 container mx-auto py-8 text-center bg-destructive/5 rounded-lg p-8 m-8 border border-destructive/20">
          <h1 className="text-2xl font-bold mb-4">المنتج غير موجود</h1>
          <p className="text-muted-foreground mb-4">عذراً، لم نتمكن من العثور على المنتج المطلوب.</p>
          <Button onClick={() => setLocation("/products")}>تصفح المنتجات</Button>
        </main>
        <Footer />
      </div>
    );
  }

  // Calculate rating (mock)
  const productRating = 4.8;
  const reviewCount = 24;
  const inStock = true; // Mock stock for now as property missing
  const formattedPrice = new Intl.NumberFormat('ar-IQ').format(product.price);

  const breadcrumbItems = [
    { name: "الرئيسية", url: "https://fishweb.iq/" },
    { name: "المنتجات", url: "https://fishweb.iq/products" },
    { name: product.name, url: `https://fishweb.iq/products/${product.slug}` }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <MetaTags
        title={product.name}
        description={product.specs?.substring(0, 160) || `تسوق ${product.name} من فيش ويب بأفضل الأسعار.`}
        image={product.image || 'https://fishweb.iq/og-image.jpg'}
        type="product"
        price={product.price}
      />

      <ProductSchema
        name={product.name}
        description={product.specs || ""} // Changed product.description to product.specs as per original code
        image={product.image || ""} // Changed product.images?.[0] to product.image as per original code
        price={product.price}
        brand={product.brand}
        inStock={inStock}
        rating={productRating}
        reviewCount={reviewCount}
      />

      <BreadcrumbSchema items={breadcrumbItems} />

      <Navbar />
      <main id="main-content" className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <>
            {/* Breadcrumbs */}
            <Breadcrumbs
              items={[
                { label: "المنتجات", href: "/products" },
                { label: product.category },
                { label: product.name },
              ]}
              className="mb-6"
            />

            {/* Product Header */}
            <div className="grid md:grid-cols-2 gap-12">
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
                  <Button size="lg" variant="outline" onClick={handleShare}>
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
            <Tabs defaultValue="benefits" className="mb-12">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="benefits">لماذا هذا المنتج؟</TabsTrigger>
                <TabsTrigger value="specs">المواصفات الفنية</TabsTrigger>
                <TabsTrigger value="reviews">التقييمات ({product.reviewCount})</TabsTrigger>
                <TabsTrigger value="shipping">الشحن والإرجاع</TabsTrigger>
                <TabsTrigger value="usage">إرشادات الاستخدام</TabsTrigger>
              </TabsList>

              <TabsContent value="benefits" className="mt-6">
                <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Leaf className="w-5 h-5" />
                      لماذا تختار هذا المنتج؟
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border">
                          <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm">جودة مضمونة</h4>
                            <p className="text-sm text-muted-foreground">منتج أصلي 100% من علامة {product.brand} العالمية</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border">
                          <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Star className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm">تقييم عالي</h4>
                            <p className="text-sm text-muted-foreground">حصل على {product.rating} من 5 نجوم من {product.reviewCount} عميل</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border">
                          <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <Truck className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm">شحن سريع</h4>
                            <p className="text-sm text-muted-foreground">يصلك خلال 2-3 أيام عمل مع تغليف آمن</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h4 className="font-bold">الفوائد الرئيسية:</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            يساعد في الحفاظ على بيئة صحية لأسماكك
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            سهل الاستخدام ومناسب لجميع المستويات
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            منتج موثوق ومستخدم من قبل آلاف الهواة
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            يوفر الوقت والجهد في صيانة الحوض
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

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

              <TabsContent value="reviews" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                      تقييمات العملاء
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Overall Rating */}
                    <div className="flex flex-col md:flex-row gap-8 pb-6 border-b">
                      <div className="text-center md:text-right space-y-2">
                        <div className="text-5xl font-bold text-primary">{product.rating}</div>
                        <div className="flex text-amber-400 justify-center md:justify-start">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-current" : ""}`}
                            />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          بناءً على {product.reviewCount} تقييم
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => {
                          const percentage = stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 8 : stars === 2 ? 2 : 0;
                          return (
                            <div key={stars} className="flex items-center gap-2">
                              <span className="text-sm w-12">{stars} نجوم</span>
                              <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-amber-400 h-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                              <span className="text-sm text-muted-foreground w-12 text-left">
                                {percentage}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Sample Reviews */}
                    <div className="space-y-4">
                      {[
                        {
                          name: "أحمد محمد",
                          rating: 5,
                          date: "منذ أسبوع",
                          comment: "منتج ممتاز وبجودة عالية جداً. استخدمه في حوضي منذ شهرين ولم ألاحظ أي مشاكل. التوصيل كان سريع والتغليف محترف.",
                          verified: true,
                        },
                        {
                          name: "فاطمة علي",
                          rating: 5,
                          date: "منذ أسبوعين",
                          comment: "ممتاز للمبتدئين! كنت قلقة من استخدامه لكن التعليمات واضحة جداً. أسماكي سعيدة والماء نظيف جداً.",
                          verified: true,
                        },
                        {
                          name: "محمد حسن",
                          rating: 4,
                          date: "منذ شهر",
                          comment: "جيد جداً لكن السعر كان يمكن أن يكون أفضل. بشكل عام راضي عن الشراء والأداء ممتاز.",
                          verified: false,
                        },
                      ].map((review, idx) => (
                        <div key={idx} className="p-4 border rounded-lg space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-semibold">{review.name}</span>
                                {review.verified && (
                                  <Badge variant="secondary" className="text-xs">
                                    ✓ عملية شراء مؤكدة
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex text-amber-400">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3 h-3 ${i < review.rating ? "fill-current" : ""}`}
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {review.comment}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Alert className="bg-blue-50 border-blue-200">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-sm text-blue-900">
                        اشتريت هذا المنتج؟ شاركنا تجربتك لمساعدة العملاء الآخرين!
                      </AlertDescription>
                    </Alert>
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

            {/* Product Reviews */}
            <div className="mt-16">
              <ProductReviews productId={product.id} productName={product.name} />
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
              <div className="mt-16">
                <h2 className="text-3xl font-bold mb-8">منتجات ذات صلة</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <Card key={relatedProduct.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative aspect-square bg-muted/20 overflow-hidden">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                        />
                        {relatedProduct.isNew && (
                          <Badge className="absolute top-2 right-2 bg-blue-500">جديد</Badge>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="text-xs text-muted-foreground mb-1">{relatedProduct.brand}</div>
                        <h3 className="font-semibold text-sm line-clamp-2 h-10 mb-2">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(relatedProduct.rating) ? "fill-current" : ""}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({relatedProduct.reviewCount})
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-lg font-bold text-primary">
                            {relatedProduct.price.toLocaleString()} <span className="text-xs">د.ع</span>
                          </span>
                          {relatedProduct.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              {relatedProduct.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            addItem(relatedProduct);
                            toast({
                              title: "تمت الإضافة للسلة ✓",
                              description: `تم إضافة ${relatedProduct.name} إلى السلة`,
                            });
                          }}
                        >
                          <ShoppingCart className="w-4 h-4 ml-2" />
                          أضف للسلة
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        </div>
      </main>
      <WhatsAppWidget />
      <BackToTop />
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
