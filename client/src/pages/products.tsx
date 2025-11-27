import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { products } from "@/lib/mock-data";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

export default function Products() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-slate-900">جميع المنتجات</h1>
          <p className="text-xl text-slate-500">تصفح مجموعتنا الكاملة من المنتجات عالية الجودة</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {/* Duplicate for demo */}
          {products.map((product) => (
            <ProductCard key={`${product.id}-dup`} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <Card className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {product.originalPrice && (
          <span className="absolute top-3 right-3 z-10 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded-md">
            خصم
          </span>
        )}
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
        <div className="text-xs text-slate-500 mb-1 font-medium">{product.brand}</div>
        <h3 className="font-bold text-slate-900 line-clamp-2 mb-2 h-10 leading-tight group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-current" : "text-slate-200"}`} />
            ))}
          </div>
          <span className="text-xs text-slate-400">({product.reviewCount})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">{product.price.toLocaleString()} د.ع.</span>
          {product.originalPrice && (
            <span className="text-sm text-slate-400 line-through">{product.originalPrice.toLocaleString()} د.ع.</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-slate-900 hover:bg-primary transition-colors">
          أضف إلى العربة
        </Button>
      </CardFooter>
    </Card>
  );
}
