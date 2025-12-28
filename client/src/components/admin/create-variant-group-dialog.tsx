/**
 * Create Variant Group Dialog
 * Create a new variant group from scratch by selecting products
 */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link2, Search, Save, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  images: string[];
  stock: number;
  variantGroupId?: string;
}

interface CreateVariantGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateVariantGroupDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateVariantGroupDialogProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      return data.products || [];
    },
    enabled: open,
  });

  // Get unique brands and categories
  const brands = Array.from(new Set(products.map((p) => p.brand))).sort();
  const categories = Array.from(new Set(products.map((p) => p.category))).sort();

  // Filter products
  const filteredProducts = products.filter((p) => {
    // Exclude products already in a group
    if (p.variantGroupId) return false;

    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());

    // Brand filter
    const matchesBrand = selectedBrand === "all" || p.brand === selectedBrand;

    // Category filter
    const matchesCategory =
      selectedCategory === "all" || p.category === selectedCategory;

    return matchesSearch && matchesBrand && matchesCategory;
  });

  const handleToggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const handleCreateGroup = async () => {
    if (selectedProducts.length < 2) {
      toast({
        title: "خطأ",
        description: "اختر منتجين على الأقل لإنشاء مجموعة",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/products/link-variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productIds: selectedProducts,
        }),
      });

      if (!response.ok) throw new Error("Failed to create group");

      toast({
        title: "نجح! ✅",
        description: `تم إنشاء مجموعة من ${selectedProducts.length} منتجات`,
      });

      setSelectedProducts([]);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إنشاء المجموعة",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            إنشاء مجموعة منتجات جديدة
          </DialogTitle>
          <DialogDescription>
            اختر منتجين أو أكثر لربطهم كخيارات (أحجام/ألوان)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4" dir="rtl">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ابحث في المنتجات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* Brand Filter */}
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">جميع البراندات</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="all">جميع الفئات</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Select All */}
          {filteredProducts.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={
                    selectedProducts.length === filteredProducts.length &&
                    filteredProducts.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  تحديد الكل ({filteredProducts.length} منتج)
                </span>
              </div>
              <Badge variant="secondary">
                {selectedProducts.length} محدد
              </Badge>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <p className="text-center text-muted-foreground py-8">
              جاري التحميل...
            </p>
          )}

          {/* No Products */}
          {!isLoading && filteredProducts.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              لا توجد منتجات متاحة. جميع المنتجات مرتبطة بمجموعات.
            </p>
          )}

          {/* Products Grid */}
          {!isLoading && filteredProducts.length > 0 && (
            <div className="max-h-96 overflow-y-auto border rounded-lg">
              <div className="grid gap-2 p-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 hover:bg-muted rounded cursor-pointer transition-colors"
                    onClick={() => handleToggleProduct(product.id)}
                  >
                    <Checkbox
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => handleToggleProduct(product.id)}
                    />
                    <img
                      src={product.images[0] || "/placeholder.png"}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {product.brand}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {Number(product.price).toLocaleString()} د.ع
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={product.stock > 0 ? "default" : "destructive"}
                    >
                      {product.stock} قطعة
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Products Summary */}
          {selectedProducts.length > 0 && (
            <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                ✓ تم اختيار {selectedProducts.length} منتج للربط
              </p>
              <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                سيتم ربط هذه المنتجات كخيارات واحدة على الموقع
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            <X className="w-4 h-4 mr-2" />
            إلغاء
          </Button>
          <Button
            onClick={handleCreateGroup}
            disabled={selectedProducts.length < 2 || isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "جاري الحفظ..." : "إنشاء المجموعة"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
