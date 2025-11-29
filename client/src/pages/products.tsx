import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, AlertCircle } from "lucide-react";
import { DifficultyBadge } from "@/components/ui/difficulty-badge";
import { ProductComparison } from "@/components/products/product-comparison";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function Products() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  const products = data?.products ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans transition-colors duration-300">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-foreground">جميع المنتجات</h1>
          <p className="text-xl text-muted-foreground">تصفح مجموعتنا الكاملة من المنتجات عالية الجودة</p>
        </div>

        <Tabs defaultValue="grid" className="mb-12">
           <div className="flex justify-between items-center mb-6">
             <TabsList>
               <TabsTrigger value="grid">عرض الشبكة</TabsTrigger>
               <TabsTrigger value="compare">مقارنة المنتجات</TabsTrigger>
             </TabsList>
           </div>

           <TabsContent value="grid">
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-72 w-full rounded-xl" />
                ))}
              </div>
            )}
            {!isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
            {isError && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>خطأ في تحميل المنتجات</AlertTitle>
                <AlertDescription>
                  تعذر تحميل المنتجات. يرجى المحاولة مرة أخرى لاحقاً.
                </AlertDescription>
              </Alert>
            )}
            {!isLoading && !isError && products.length === 0 && (
              <p className="text-center text-muted-foreground mt-6">
                لا توجد منتجات متاحة حالياً.
              </p>
            )}
           </TabsContent>
           
           <TabsContent value="compare">
             <div className="animate-in fade-in slide-in-from-bottom-4">
               <ProductComparison products={products} />
             </div>
           </TabsContent>
        </Tabs>

      </main>
      <Footer />
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <Card className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-card">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {product.originalPrice && (
          <span className="absolute top-3 right-3 z-10 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            خصم
          </span>
        )}
        <div className="absolute top-3 left-3 z-10 flex gap-1">
           {product.difficulty && <DifficultyBadge level={product.difficulty} className="text-[10px] px-1.5 py-0.5 h-5" />}
        </div>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
          <Button size="sm" className="w-full bg-white text-slate-900 hover:bg-white/90">
            نظرة سريعة
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="text-xs text-muted-foreground mb-1 font-medium">{product.brand}</div>
        <h3 className="font-bold text-foreground line-clamp-2 mb-2 h-10 leading-tight group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-current" : "text-slate-200 dark:text-slate-700"}`} />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">{product.price.toLocaleString()} د.ع.</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">{product.originalPrice.toLocaleString()} د.ع.</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full hover:bg-primary transition-colors">
          أضف إلى العربة
        </Button>
      </CardFooter>
    </Card>
  );
}
