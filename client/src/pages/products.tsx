import { useMemo, useState, useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { AlertCircle, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MetaTags, OrganizationSchema } from "@/components/seo/meta-tags";
import { ProductComparisonTable as ProductComparison, ComparisonDrawer } from "@/components/products/product-comparison";
import { ProductCard } from "@/components/products/product-card";
import { ProductFilters, FilterState } from "@/components/products/product-filters";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import { ProductCardSkeleton } from "@/components/ui/loading-skeleton";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { BackToTop } from "@/components/back-to-top";
import { QuickViewModal } from "@/components/products/quick-view-modal";
import type { Product } from "@/types";

type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "rating-desc";

export default function Products() {
  const [location] = useLocation();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  const products = data?.products ?? [];

  // Calculate max price
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 1000000;
    return Math.max(...products.map((p: Product) => p.price));
  }, [products]);



  // Initialize filters from URL params or defaults
  const [filters, setFilters] = useState<FilterState>(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // Start with default filters
    const initialFilters: FilterState = {
      priceRange: [0, maxPrice],
      categories: category ? [category] : [],
      brands: [],
      difficulties: [],
      tags: [],
    };

    return initialFilters;
  });

  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Update filters when URL params change (e.g. navigation from search)
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const category = searchParams.get("category");
    if (category) {
      setFilters(prev => ({
        ...prev,
        categories: [category]
      }));
    }
  }, [location]);

  // Update price range when products are loaded
  useEffect(() => {
    if (products.length > 0 && maxPrice > 0) {
      setFilters(prev => ({
        ...prev,
        priceRange: [0, maxPrice]
      }));
    }
  }, [maxPrice, products.length]);

  // Get available categories and brands
  const availableCategories = useMemo(() => {
    const categories = new Set(products.map((p: Product) => p.category));
    return Array.from(categories).sort();
  }, [products]);

  const availableBrands = useMemo(() => {
    const brands = new Set(products.map((p: Product) => p.brand));
    return Array.from(brands).sort();
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }

      // Difficulty filter
      if (filters.difficulties.length > 0 && product.difficulty && !filters.difficulties.includes(product.difficulty)) {
        return false;
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasTag = filters.tags.some((tag) => {
          if (tag === "جديد") return product.isNew;
          if (tag === "الأكثر مبيعاً") return product.isBestSeller;
          if (tag === "صديق للبيئة") return product.ecoFriendly;
          return false;
        });
        if (!hasTag) return false;
      }

      return true;
    });
  }, [products, filters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "name-asc":
        return sorted.sort((a, b) => a.name.localeCompare(b.name, "ar"));
      case "rating-desc":
        return sorted.sort((a, b) => b.rating - a.rating);
      default:
        return sorted;
    }
  }, [filteredProducts, sortBy]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== maxPrice) count++;
    count += filters.categories.length;
    count += filters.brands.length;
    count += filters.difficulties.length;
    count += filters.tags.length;
    return count;
  }, [filters, maxPrice]);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans transition-colors duration-300">
      <MetaTags
        title="المنتجات"
        description="تسوق أحدث منتجات أحواض الأسماك، الأحياء المائية، والمعدات في العراق."
      />
      <OrganizationSchema />
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold text-foreground">جميع المنتجات</h1>
          <p className="text-xl text-muted-foreground">تصفح مجموعتنا الكاملة من المنتجات عالية الجودة</p>
        </div>

        <Tabs defaultValue="grid" className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="grid">عرض الشبكة</TabsTrigger>
              <TabsTrigger value="compare">مقارنة المنتجات</TabsTrigger>
            </TabsList>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="ترتيب حسب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">الافتراضي</SelectItem>
                  <SelectItem value="price-asc">السعر: من الأقل للأعلى</SelectItem>
                  <SelectItem value="price-desc">السعر: من الأعلى للأقل</SelectItem>
                  <SelectItem value="name-asc">الاسم: أ - ي</SelectItem>
                  <SelectItem value="rating-desc">الأعلى تقييماً</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="grid">
            <div className="flex gap-6">
              {/* Filters Sidebar */}
              <aside className="w-64 flex-shrink-0">
                <ProductFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  availableCategories={availableCategories}
                  availableBrands={availableBrands}
                  maxPrice={maxPrice}
                  activeFiltersCount={activeFiltersCount}
                />
              </aside>

              {/* Products Grid */}
              <div className="flex-1">
                {isLoading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))}
                  </div>
                )}

                {!isLoading && (
                  <>
                    {/* Results Count */}
                    <div className="mb-4 text-sm text-muted-foreground">
                      عرض {sortedProducts.length} من {products.length} منتج
                    </div>

                    {sortedProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20 lg:pb-6">
                        {sortedProducts.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            onQuickView={(p) => setQuickViewProduct(p)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 bg-muted/30 rounded-xl">
                        <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
                          <AlertCircle className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">
                          لم يتم العثور على منتجات
                        </h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                          جرب تغيير أو إزالة بعض الفلاتر للحصول على نتائج أكثر
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setFilters({
                            priceRange: [0, maxPrice],
                            categories: [],
                            brands: [],
                            difficulties: [],
                            tags: [],
                          })}
                        >
                          مسح جميع الفلاتر
                        </Button>
                      </div>
                    )}
                  </>
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
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compare">
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <ProductComparison products={products} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <WhatsAppWidget />
      <BackToTop />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <ComparisonDrawer products={products} />

      <Footer />
    </div>
  );
}
