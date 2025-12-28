/**
 * Product Merger Component
 * Allows admin to merge duplicate products by transferring images
 */
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { GitMerge, Search, ArrowRight, AlertTriangle, Check } from "lucide-react";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";

export function ProductMerger() {
    const { toast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [targetProduct, setTargetProduct] = useState<Product | null>(null);
    const [sourceProduct, setSourceProduct] = useState<Product | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
    const [isMerging, setIsMerging] = useState(false);

    // Fetch all products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/products");
                if (!response.ok) throw new Error("Failed to fetch products");
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error("Error fetching products:", error);
                toast({
                    title: "خطأ",
                    description: "فشل في تحميل المنتجات",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [toast]);

    // Filter products based on search
    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        const term = searchTerm.toLowerCase();
        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(term) ||
                p.brand.toLowerCase().includes(term) ||
                p.id.toLowerCase().includes(term)
        );
    }, [products, searchTerm]);

    // Calculate merged images preview
    const mergedImages = useMemo(() => {
        if (!targetProduct || !sourceProduct) return [];
        // Remove duplicates
        return Array.from(new Set([...targetProduct.images, ...sourceProduct.images]));
    }, [targetProduct, sourceProduct]);

    const handleSelectTarget = (product: Product) => {
        if (sourceProduct?.id === product.id) {
            toast({
                title: "تنبيه",
                description: "لا يمكن اختيار نفس المنتج كمصدر وهدف",
                variant: "destructive",
            });
            return;
        }
        setTargetProduct(product);
    };

    const handleSelectSource = (product: Product) => {
        if (targetProduct?.id === product.id) {
            toast({
                title: "تنبيه",
                description: "لا يمكن اختيار نفس المنتج كمصدر وهدف",
                variant: "destructive",
            });
            return;
        }
        setSourceProduct(product);
    };

    const handleMergeConfirm = () => {
        setIsConfirmDialogOpen(true);
    };

    const handleMergeExecute = async () => {
        if (!targetProduct || !sourceProduct) return;

        setIsMerging(true);
        try {
            const response = await fetch("/api/admin/products/merge", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    targetProductId: targetProduct.id,
                    sourceProductId: sourceProduct.id,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to merge products");
            }

            const result = await response.json();

            toast({
                title: "نجح! ✅",
                description: `تم دمج المنتجات بنجاح. تم نقل ${result.data.mergedImagesCount} صورة.`,
            });

            // Reset state
            setTargetProduct(null);
            setSourceProduct(null);
            setIsConfirmDialogOpen(false);

            // Refresh products list
            const productsResponse = await fetch("/api/products");
            const updatedProducts = await productsResponse.json();
            setProducts(updatedProducts);
        } catch (error) {
            console.error("Merge error:", error);
            toast({
                title: "خطأ",
                description: error instanceof Error ? error.message : "فشل في دمج المنتجات",
                variant: "destructive",
            });
        } finally {
            setIsMerging(false);
        }
    };

    const canMerge = targetProduct && sourceProduct && targetProduct.id !== sourceProduct.id;
    const newImagesCount = sourceProduct ? mergedImages.length - targetProduct!.images.length : 0;

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <Card>
                <CardHeader>
                    <CardTitle>بحث في المنتجات</CardTitle>
                    <CardDescription>ابحث عن المنتجات حسب الاسم أو العلامة التجارية</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="ابحث..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pr-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Product Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Target Product */}
                <Card className={cn(targetProduct && "ring-2 ring-primary")}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <Check className="h-4 w-4 text-primary" />
                            </div>
                            المنتج الرئيسي (سيبقى)
                        </CardTitle>
                        <CardDescription>
                            اختر المنتج الذي سيحتفظ بجميع الصور
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {targetProduct ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-primary/5 rounded-lg border-2 border-primary">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg">{targetProduct.name}</h3>
                                            <p className="text-sm text-muted-foreground">{targetProduct.brand}</p>
                                            <Badge variant="secondary" className="mt-2">
                                                ID: {targetProduct.id}
                                            </Badge>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setTargetProduct(null)}
                                        >
                                            تغيير
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {targetProduct.images.slice(0, 4).map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`${targetProduct.name} ${idx + 1}`}
                                                className="w-full h-16 object-cover rounded border"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {targetProduct.images.length} صورة حالياً
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">
                                اختر منتجاً من القائمة أدناه
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Source Product */}
                <Card className={cn(sourceProduct && "ring-2 ring-orange-500")}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-orange-500/10 flex items-center justify-center">
                                <ArrowRight className="h-4 w-4 text-orange-500" />
                            </div>
                            المنتج المصدر (سيحذف)
                        </CardTitle>
                        <CardDescription>
                            اختر المنتج الذي سيتم نقل صوره ثم حذفه
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {sourceProduct ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-orange-500/5 rounded-lg border-2 border-orange-500">
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg">{sourceProduct.name}</h3>
                                            <p className="text-sm text-muted-foreground">{sourceProduct.brand}</p>
                                            <Badge variant="secondary" className="mt-2">
                                                ID: {sourceProduct.id}
                                            </Badge>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setSourceProduct(null)}
                                        >
                                            تغيير
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {sourceProduct.images.slice(0, 4).map((img, idx) => (
                                            <img
                                                key={idx}
                                                src={img}
                                                alt={`${sourceProduct.name} ${idx + 1}`}
                                                className="w-full h-16 object-cover rounded border"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {sourceProduct.images.length} صورة
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">
                                اختر منتجاً من القائمة أدناه
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Merge Preview */}
            {canMerge && (
                <Card className="border-2 border-dashed">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GitMerge className="h-5 w-5" />
                            معاينة الدمج
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                                <div>
                                    <p className="font-medium">إجمالي الصور بعد الدمج:</p>
                                    <p className="text-sm text-muted-foreground">
                                        {targetProduct.images.length} (حالي) + {newImagesCount} (جديد) = {mergedImages.length} صورة
                                    </p>
                                </div>
                                <Button
                                    onClick={handleMergeConfirm}
                                    size="lg"
                                    className="gap-2"
                                >
                                    <GitMerge className="h-4 w-4" />
                                    دمج المنتجات
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Products Table */}
            <Card>
                <CardHeader>
                    <CardTitle>جميع المنتجات ({filteredProducts.length})</CardTitle>
                    <CardDescription>انقر على السطر لاختيار المنتج</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">جاري التحميل...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>المنتج</TableHead>
                                        <TableHead>العلامة</TableHead>
                                        <TableHead>الصور</TableHead>
                                        <TableHead className="text-center">إجراءات</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map((product) => {
                                        const isTarget = targetProduct?.id === product.id;
                                        const isSource = sourceProduct?.id === product.id;

                                        return (
                                            <TableRow
                                                key={product.id}
                                                className={cn(
                                                    "cursor-pointer hover:bg-muted/50",
                                                    isTarget && "bg-primary/5",
                                                    isSource && "bg-orange-500/5"
                                                )}
                                            >
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={product.thumbnail}
                                                            alt={product.name}
                                                            className="w-12 h-12 object-cover rounded border"
                                                        />
                                                        <div>
                                                            <p className="font-medium">{product.name}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                ID: {product.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>{product.brand}</TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        {product.images.length} صورة
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2 justify-center">
                                                        <Button
                                                            size="sm"
                                                            variant={isTarget ? "default" : "outline"}
                                                            onClick={() => handleSelectTarget(product)}
                                                            disabled={isSource}
                                                        >
                                                            {isTarget ? "✓ رئيسي" : "رئيسي"}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant={isSource ? "destructive" : "outline"}
                                                            onClick={() => handleSelectSource(product)}
                                                            disabled={isTarget}
                                                        >
                                                            {isSource ? "✓ مصدر" : "مصدر"}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Confirmation Dialog */}
            <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-orange-600">
                            <AlertTriangle className="h-6 w-6" />
                            تأكيد دمج المنتجات
                        </DialogTitle>
                        <DialogDescription>
                            هذا الإجراء غير قابل للتراجع. يرجى المراجعة بعناية قبل المتابعة.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4" dir="rtl">
                        <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                            <h4 className="font-bold mb-2 text-orange-900">ملخص العملية:</h4>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                                    <span>
                                        سيتم نقل <strong>{newImagesCount}</strong> صورة من "{sourceProduct?.name}" إلى "{targetProduct?.name}"
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                                    <span>
                                        سيصبح إجمالي الصور في "{targetProduct?.name}": <strong>{mergedImages.length}</strong> صورة
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5" />
                                    <span className="text-red-900">
                                        سيتم حذف المنتج "{sourceProduct?.name}" نهائياً
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-900 font-medium">
                                ⚠️ تنبيه: هذا الإجراء غير قابل للتراجع ولا يمكن التراجع عنه بعد التنفيذ.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsConfirmDialogOpen(false)}
                            disabled={isMerging}
                        >
                            إلغاء
                        </Button>
                        <Button
                            onClick={handleMergeExecute}
                            disabled={isMerging}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            {isMerging ? "جاري الدمج..." : "تأكيد الدمج"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
