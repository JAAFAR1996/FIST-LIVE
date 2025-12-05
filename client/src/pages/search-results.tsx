import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SearchIcon, Filter, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import { ProductCard } from "@/components/products/product-card";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

type FilterType = "all" | "products" | "fish" | "pages";
type SortType = "relevance" | "price-asc" | "price-desc" | "rating";

export default function SearchResults() {
  const [location] = useLocation();
  const queryParams = new URLSearchParams(window.location.search);
  const initialQuery = queryParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 12;

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5,
  });

  // Update search query when URL changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || "";
    setSearchQuery(q);
    setCurrentPage(1); // Reset to first page on new search
  }, [location]);

  const products = data?.products || [];

  // Filter and search logic
  const filteredResults = products.filter((product) => {
    if (!searchQuery.trim()) return true;

    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(lowerQuery) ||
      product.brand.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery);

    if (filterType === "all") return matchesSearch;
    if (filterType === "products") return matchesSearch;
    // Add more filter types as needed
    return matchesSearch;
  });

  // Sort results
  const sortedResults = [...filteredResults].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "relevance":
      default:
        // Simple relevance: prioritize exact name matches
        const aScore = a.name.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0;
        const bScore = b.name.toLowerCase().includes(searchQuery.toLowerCase()) ? 1 : 0;
        return bScore - aScore;
    }
  });

  // Pagination
  const totalResults = sortedResults.length;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const paginatedResults = sortedResults.slice(startIndex, endIndex);

  // Suggest alternative searches for typos (simple implementation)
  const suggestedQuery = searchQuery && filteredResults.length === 0 ? getSuggestion(searchQuery, products) : null;

  function getSuggestion(query: string, products: any[]): string | null {
    const lowerQuery = query.toLowerCase();

    // Check for common typos in product names
    for (const product of products) {
      const name = product.name.toLowerCase();
      const brand = product.brand.toLowerCase();

      // Simple Levenshtein-like check: if query is similar to name/brand
      if (
        name.includes(lowerQuery.slice(0, -1)) ||
        brand.includes(lowerQuery.slice(0, -1))
      ) {
        return product.name;
      }
    }

    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8" id="main-content">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">نتائج البحث</h1>

          {/* Search Bar */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="ابحث عن المنتجات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            {searchQuery && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSearchQuery("")}
                aria-label="مسح البحث"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant={filterType === "all" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilterType("all")}
              >
                الكل
              </Badge>
              <Badge
                variant={filterType === "products" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilterType("products")}
              >
                المنتجات ({products.length})
              </Badge>
            </div>

            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortType)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="الترتيب حسب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">الأكثر صلة</SelectItem>
                <SelectItem value="price-asc">السعر: من الأقل للأعلى</SelectItem>
                <SelectItem value="price-desc">السعر: من الأعلى للأقل</SelectItem>
                <SelectItem value="rating">الأعلى تقييماً</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        {searchQuery && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              تم العثور على <span className="font-bold text-foreground">{totalResults}</span> نتيجة
              {searchQuery && ` لـ "${searchQuery}"`}
            </p>
          </div>
        )}

        {/* Suggestion for typos */}
        {suggestedQuery && (
          <div className="mb-6 p-4 rounded-lg bg-muted/50 border">
            <p className="text-sm">
              هل تقصد:{" "}
              <button
                onClick={() => setSearchQuery(suggestedQuery)}
                className="text-primary font-medium hover:underline"
              >
                {suggestedQuery}
              </button>
              ؟
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && searchQuery && paginatedResults.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-muted/30 p-8 rounded-full mb-6">
              <SearchIcon className="h-24 w-24 text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-bold mb-2">لم نعثر على نتائج</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              حاول البحث بكلمات مختلفة أو تصفح جميع المنتجات
            </p>
            <Button onClick={() => setSearchQuery("")}>عرض جميع المنتجات</Button>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && paginatedResults.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedResults.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  السابق
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => setCurrentPage(page)}
                          className="w-10"
                        >
                          {page}
                        </Button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 flex items-center">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  التالي
                </Button>
              </div>
            )}
          </>
        )}

        {/* Empty State (no search query) */}
        {!isLoading && !searchQuery && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="bg-muted/30 p-8 rounded-full mb-6">
              <SearchIcon className="h-24 w-24 text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-bold mb-2">ابدأ البحث</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              استخدم شريط البحث أعلاه للعثور على المنتجات التي تبحث عنها
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
