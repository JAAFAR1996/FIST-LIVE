/**
 * Product Variant Linker - Simple UI to link existing products as variants
 * "توصيل خطوط" - Connect products together
 */
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Link2, Search, Save } from "lucide-react";
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

interface ProductVariantLinkerProps {
  productId: string;
  productName: string;
  currentVariantGroupId?: string;
  onUpdate: () => void;
}

export function ProductVariantLinker({
  productId,
  productName,
  currentVariantGroupId,
  onUpdate,
}: ProductVariantLinkerProps) {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    currentVariantGroupId ? [] : [productId]
  );
  const [isSaving, setIsSaving] = useState(false);

  // Fetch similar products (same brand + category)
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      return data.products || [];
    },
  });

  // Get current product info
  const currentProduct = products.find((p) => p.id === productId);

  // Filter similar products (same brand + category, excluding current if already grouped)
  const similarProducts = products.filter((p) => {
    if (p.id === productId) return false;
    if (!currentProduct) return false;

    // Same brand and category
    const isSimilar = p.brand === currentProduct.brand &&
                     p.category === currentProduct.category;

    // Match search query
    const matchesSearch = searchQuery === "" ||
                         p.name.toLowerCase().includes(searchQuery.toLowerCase());

    return isSimilar && matchesSearch;
  });

  // Get already linked products (same variantGroupId)
  const linkedProducts = currentVariantGroupId
    ? products.filter((p) => p.variantGroupId === currentVariantGroupId)
    : [];

  const handleToggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleLinkProducts = async () => {
    if (selectedProducts.length < 2) {
      toast({
        title: "خطأ",
        description: "اختر منتجين على الأقل للربط",
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

      if (!response.ok) throw new Error("Failed to link products");

      toast({
        title: "نجح! ✅",
        description: `تم ربط ${selectedProducts.length} منتجات كخيارات`,
      });

      onUpdate();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في ربط المنتجات",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUnlinkAll = async () => {
    if (!currentVariantGroupId) return;
    if (!confirm("هل أنت متأكد من فك ربط جميع الخيارات؟")) return;

    setIsSaving(true);
    try {
      const response = await fetch("/api/products/unlink-variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantGroupId: currentVariantGroupId,
        }),
      });

      if (!response.ok) throw new Error("Failed to unlink");

      toast({
        title: "نجح",
        description: "تم فك ربط جميع الخيارات",
      });

      onUpdate();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في فك الربط",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Link2 className="w-5 h-5" />
              ربط المنتجات كخيارات (توصيل خطوط)
            </CardTitle>
            <CardDescription>
              {productName} - ربط منتجات موجودة كخيارات (أحجام/ألوان)
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Currently Linked Products */}
        {linkedProducts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">المنتجات المرتبطة ({linkedProducts.length}):</h3>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleUnlinkAll}
                disabled={isSaving}
              >
                فك ربط الكل
              </Button>
            </div>
            <div className="grid gap-2">
              {linkedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-green-50 dark:bg-green-950"
                >
                  <img
                    src={product.images[0] || "/placeholder.png"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {Number(product.price).toLocaleString()} د.ع
                    </p>
                  </div>
                  <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                    {product.stock} قطعة
                  </Badge>
                  {product.id === productId && (
                    <Badge variant="secondary">المنتج الحالي</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search and Select */}
        <div className="space-y-3">
          <h3 className="font-semibold">اختر منتجات للربط:</h3>

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="ابحث في المنتجات المشابهة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Loading */}
          {isLoading && (
            <p className="text-center text-muted-foreground py-4">جاري التحميل...</p>
          )}

          {/* Similar Products List */}
          {!isLoading && similarProducts.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              لا توجد منتجات مشابهة ({currentProduct?.brand} - {currentProduct?.category})
            </p>
          )}

          {!isLoading && similarProducts.length > 0 && (
            <div className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-3">
              {similarProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-2 hover:bg-muted rounded cursor-pointer"
                  onClick={() => handleToggleProduct(product.id)}
                >
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => handleToggleProduct(product.id)}
                  />
                  <img
                    src={product.images[0] || "/placeholder.png"}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {Number(product.price).toLocaleString()} د.ع - {product.stock} قطعة
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            تم اختيار {selectedProducts.length} منتج
          </p>
          <Button
            onClick={handleLinkProducts}
            disabled={selectedProducts.length < 2 || isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "جاري الحفظ..." : "ربط المنتجات"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
