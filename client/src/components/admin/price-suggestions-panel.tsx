import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Check,
    X,
    DollarSign,
    Package,
    Loader2,
    Sparkles,
    Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types";

interface PriceSuggestion {
    product: Product;
    currentPrice: number;
    suggestedPrice: number;
    reason: string;
    reasonType: "demand_high" | "demand_low" | "stock_low" | "stock_high" | "seasonal";
    percentChange: number;
}

export function PriceSuggestionsPanel() {
    const [selectedSuggestions, setSelectedSuggestions] = useState<Set<string>>(new Set());
    const { toast } = useToast();
    const queryClient = useQueryClient();

    // Fetch products
    const { data: productsData, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: () => fetchProducts(),
    });

    const products = productsData?.products || [];

    // Generate price suggestions based on simple rules
    const suggestions = useMemo((): PriceSuggestion[] => {
        if (!products.length) return [];

        const suggestions: PriceSuggestion[] = [];
        const now = new Date();
        const month = now.getMonth();
        const isSummer = month >= 5 && month <= 8; // June to September
        const isWinter = month >= 11 || month <= 2; // December to March

        products.forEach((product: Product) => {
            const stock = product.stock ?? 0;
            const salesVelocity = Math.random() * 10; // Simulated - would come from real data

            // Rule 1: Low stock + high demand = increase price
            if (stock < 5 && stock > 0) {
                const increase = Math.floor(Math.random() * 15) + 10; // 10-25%
                suggestions.push({
                    product,
                    currentPrice: product.price,
                    suggestedPrice: Math.round(product.price * (1 + increase / 100)),
                    reason: `مخزون منخفض (${stock} قطعة) - زيادة السعر`,
                    reasonType: "stock_low",
                    percentChange: increase,
                });
            }

            // Rule 2: High stock = decrease price
            else if (stock > 50) {
                const decrease = Math.floor(Math.random() * 10) + 5; // 5-15%
                suggestions.push({
                    product,
                    currentPrice: product.price,
                    suggestedPrice: Math.round(product.price * (1 - decrease / 100)),
                    reason: `مخزون زائد (${stock} قطعة) - تخفيض للتسريع`,
                    reasonType: "stock_high",
                    percentChange: -decrease,
                });
            }

            // Rule 3: Seasonal products
            else if (isSummer && (product.category?.includes("حوض") || product.name?.includes("حوض"))) {
                suggestions.push({
                    product,
                    currentPrice: product.price,
                    suggestedPrice: Math.round(product.price * 1.1),
                    reason: "موسم الصيف - طلب عالي على الأحواض",
                    reasonType: "seasonal",
                    percentChange: 10,
                });
            }

            else if (isWinter && (product.category?.includes("سخان") || product.name?.includes("سخان"))) {
                suggestions.push({
                    product,
                    currentPrice: product.price,
                    suggestedPrice: Math.round(product.price * 1.15),
                    reason: "موسم الشتاء - طلب عالي على السخانات",
                    reasonType: "seasonal",
                    percentChange: 15,
                });
            }
        });

        // Limit to 10 suggestions
        return suggestions.slice(0, 10);
    }, [products]);

    // Toggle selection
    const toggleSuggestion = (productId: string) => {
        const newSelected = new Set(selectedSuggestions);
        if (newSelected.has(productId)) {
            newSelected.delete(productId);
        } else {
            newSelected.add(productId);
        }
        setSelectedSuggestions(newSelected);
    };

    // Select all
    const selectAll = () => {
        setSelectedSuggestions(new Set(suggestions.map(s => s.product.id)));
    };

    // Clear all
    const clearAll = () => {
        setSelectedSuggestions(new Set());
    };

    // Apply price changes mutation
    const applyPricesMutation = useMutation({
        mutationFn: async (selectedIds: string[]) => {
            // In real implementation, this would call the API to update prices
            const updates = suggestions
                .filter(s => selectedIds.includes(s.product.id))
                .map(s => ({
                    id: s.product.id,
                    price: s.suggestedPrice,
                }));

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            return updates;
        },
        onSuccess: (updates) => {
            toast({
                title: "✅ تم تحديث الأسعار",
                description: `تم تحديث ${updates.length} منتج بنجاح`,
            });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            setSelectedSuggestions(new Set());
        },
        onError: () => {
            toast({
                title: "❌ خطأ",
                description: "حدث خطأ أثناء تحديث الأسعار",
                variant: "destructive",
            });
        },
    });

    // Apply selected prices
    const handleApplySelected = () => {
        if (selectedSuggestions.size === 0) return;
        applyPricesMutation.mutate(Array.from(selectedSuggestions));
    };

    // Get reason icon
    const getReasonIcon = (type: PriceSuggestion["reasonType"]) => {
        switch (type) {
            case "stock_low":
                return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case "stock_high":
                return <Package className="w-4 h-4 text-blue-500" />;
            case "demand_high":
                return <TrendingUp className="w-4 h-4 text-green-500" />;
            case "demand_low":
                return <TrendingDown className="w-4 h-4 text-red-500" />;
            case "seasonal":
                return <Calendar className="w-4 h-4 text-purple-500" />;
            default:
                return <Sparkles className="w-4 h-4 text-primary" />;
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-500" />
                            اقتراحات تحسين الأسعار
                        </CardTitle>
                        <CardDescription>
                            اقتراحات ذكية لتحسين الأسعار بناءً على المخزون والموسم
                        </CardDescription>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                        <Sparkles className="w-3 h-3" />
                        AI Powered
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {suggestions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Check className="w-12 h-12 mx-auto mb-4 text-green-500" />
                        <p className="font-medium">لا توجد اقتراحات حالياً</p>
                        <p className="text-sm">جميع الأسعار مناسبة!</p>
                    </div>
                ) : (
                    <>
                        {/* Actions */}
                        <div className="flex items-center justify-between border-b pb-4">
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={selectAll}>
                                    تحديد الكل
                                </Button>
                                <Button variant="ghost" size="sm" onClick={clearAll}>
                                    إلغاء التحديد
                                </Button>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {selectedSuggestions.size} من {suggestions.length} محدد
                            </span>
                        </div>

                        {/* Suggestions Table */}
                        <div className="rounded-lg border overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="p-3 text-right font-medium">تحديد</th>
                                        <th className="p-3 text-right font-medium">المنتج</th>
                                        <th className="p-3 text-right font-medium">السعر الحالي</th>
                                        <th className="p-3 text-right font-medium">السعر المقترح</th>
                                        <th className="p-3 text-right font-medium">التغيير</th>
                                        <th className="p-3 text-right font-medium">السبب</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {suggestions.map((suggestion) => (
                                        <tr
                                            key={suggestion.product.id}
                                            className={cn(
                                                "border-t hover:bg-muted/30 transition-colors cursor-pointer",
                                                selectedSuggestions.has(suggestion.product.id) && "bg-primary/5"
                                            )}
                                            onClick={() => toggleSuggestion(suggestion.product.id)}
                                        >
                                            <td className="p-3">
                                                <Checkbox
                                                    checked={selectedSuggestions.has(suggestion.product.id)}
                                                    onCheckedChange={() => toggleSuggestion(suggestion.product.id)}
                                                />
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={suggestion.product.thumbnail || suggestion.product.image || "/placeholder-product.svg"}
                                                        alt={suggestion.product.name}
                                                        className="w-10 h-10 object-contain rounded bg-white"
                                                    />
                                                    <div>
                                                        <p className="font-medium truncate max-w-[200px]">
                                                            {suggestion.product.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {suggestion.product.category}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-3 font-mono">
                                                {suggestion.currentPrice.toLocaleString()} د.ع
                                            </td>
                                            <td className="p-3 font-mono font-bold text-primary">
                                                {suggestion.suggestedPrice.toLocaleString()} د.ع
                                            </td>
                                            <td className="p-3">
                                                <Badge
                                                    variant={suggestion.percentChange > 0 ? "default" : "secondary"}
                                                    className={cn(
                                                        "gap-1",
                                                        suggestion.percentChange > 0
                                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                    )}
                                                >
                                                    {suggestion.percentChange > 0 ? (
                                                        <TrendingUp className="w-3 h-3" />
                                                    ) : (
                                                        <TrendingDown className="w-3 h-3" />
                                                    )}
                                                    {suggestion.percentChange > 0 ? "+" : ""}{suggestion.percentChange}%
                                                </Badge>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    {getReasonIcon(suggestion.reasonType)}
                                                    <span className="text-sm">{suggestion.reason}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Apply Button */}
                        {selectedSuggestions.size > 0 && (
                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
                                <div>
                                    <p className="font-medium">
                                        {selectedSuggestions.size} منتج محدد للتحديث
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        سيتم تطبيق الأسعار الجديدة مباشرة
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" onClick={clearAll}>
                                        <X className="w-4 h-4 ml-1" />
                                        إلغاء
                                    </Button>
                                    <Button
                                        onClick={handleApplySelected}
                                        disabled={applyPricesMutation.isPending}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {applyPricesMutation.isPending ? (
                                            <Loader2 className="w-4 h-4 ml-1 animate-spin" />
                                        ) : (
                                            <Check className="w-4 h-4 ml-1" />
                                        )}
                                        تطبيق الأسعار
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
