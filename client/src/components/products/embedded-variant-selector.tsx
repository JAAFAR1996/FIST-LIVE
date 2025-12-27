/**
 * EmbeddedVariantSelector - For products with variants stored in the product record
 * Shows size/power options that update price without page navigation
 */
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ProductVariant } from "@/types";
import { Check, Ruler, Zap, Thermometer, Star } from "lucide-react";

interface EmbeddedVariantSelectorProps {
    variants: ProductVariant[];
    selectedVariantId: string;
    onVariantSelect: (variant: ProductVariant) => void;
    title?: string;
    productCategory?: string;
}

/**
 * Variant selector for products with embedded variants
 * Updates price in place without page navigation (like Amazon/HYGGER)
 */
export function EmbeddedVariantSelector({
    variants,
    selectedVariantId,
    onVariantSelect,
    title = "اختر الحجم المناسب",
    productCategory,
}: EmbeddedVariantSelectorProps) {
    if (!variants || variants.length <= 1) {
        return null;
    }

    // Determine icon based on category
    const isHeater = productCategory?.toLowerCase().includes("heater");
    const Icon = isHeater ? Thermometer : Zap;

    // Sort variants by price (ascending)
    const sortedVariants = useMemo(() => {
        return [...variants].sort((a, b) => a.price - b.price);
    }, [variants]);

    return (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent" dir="rtl">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Icon className="w-5 h-5 text-primary" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {sortedVariants.map((variant) => {
                        const isSelected = variant.id === selectedVariantId;
                        const inStock = variant.stock > 0;

                        return (
                            <button
                                key={variant.id}
                                onClick={() => onVariantSelect(variant)}
                                disabled={!inStock}
                                className={cn(
                                    "relative rounded-xl border-2 p-4 transition-all duration-200 text-right",
                                    "hover:border-primary/50 hover:shadow-md",
                                    isSelected
                                        ? "border-primary bg-primary/10 shadow-sm"
                                        : "border-muted bg-background",
                                    !inStock && "opacity-60 cursor-not-allowed"
                                )}
                            >
                                {/* Selection checkmark */}
                                {isSelected && (
                                    <div className="absolute top-2 left-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                        <Check className="w-3 h-3 text-primary-foreground" />
                                    </div>
                                )}

                                {/* Default/Popular badge */}
                                {variant.isDefault && (
                                    <div className="absolute top-2 right-2">
                                        <Badge variant="secondary" className="text-[10px] gap-1">
                                            <Star className="w-2 h-2 fill-current" />
                                            الأكثر شعبية
                                        </Badge>
                                    </div>
                                )}

                                {/* Variant label */}
                                <div className="text-center mb-2 mt-4">
                                    <span className={cn(
                                        "text-xl font-bold",
                                        isSelected ? "text-primary" : "text-foreground"
                                    )}>
                                        {variant.label}
                                    </span>
                                </div>

                                {/* Tank size if available */}
                                {variant.specifications?.["قياس الحوض"] && (
                                    <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground mb-2">
                                        <Ruler className="w-3 h-3" />
                                        <span>{variant.specifications["قياس الحوض"]}</span>
                                    </div>
                                )}

                                {/* Price */}
                                <div className="text-center">
                                    <span className="text-sm font-semibold">
                                        {variant.price.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-muted-foreground mr-1">د.ع</span>
                                </div>

                                {/* Discount badge */}
                                {variant.originalPrice && variant.originalPrice > variant.price && (
                                    <div className="text-center mt-1">
                                        <Badge variant="destructive" className="text-[10px]">
                                            خصم {Math.round(((variant.originalPrice - variant.price) / variant.originalPrice) * 100)}%
                                        </Badge>
                                    </div>
                                )}

                                {/* Out of stock badge */}
                                {!inStock && (
                                    <Badge variant="secondary" className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px]">
                                        غير متوفر
                                    </Badge>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Tip */}
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                        <span className="text-lg">💡</span>
                        <span>
                            <strong>نصيحة:</strong> اختر الحجم بناءً على طول حوضك.
                            {isHeater
                                ? " قوة السخان يجب أن تتناسب مع حجم الماء."
                                : " الإضاءة الأقوى تناسب الأحواض الأكبر والنباتات."}
                        </span>
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

/**
 * Compact version for quick display
 */
export function EmbeddedVariantSelectorCompact({
    variants,
    selectedVariantId,
    onVariantSelect,
}: Omit<EmbeddedVariantSelectorProps, "title" | "productCategory">) {
    if (!variants || variants.length <= 1) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2" dir="rtl">
            {variants.map((variant) => {
                const isSelected = variant.id === selectedVariantId;

                return (
                    <button
                        key={variant.id}
                        onClick={() => onVariantSelect(variant)}
                        disabled={variant.stock <= 0}
                        className={cn(
                            "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                            isSelected
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground",
                            variant.stock <= 0 && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        {variant.label}
                    </button>
                );
            })}
        </div>
    );
}
