/**
 * MultiDimensionVariantSelector - For products with multiple variant dimensions
 * Example: Colors (Black, White) + Sizes (S, M, L)
 * Shows separate rows for each dimension
 */
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ProductVariant } from "@/types";
import { Check, Palette, Ruler } from "lucide-react";

interface VariantDimension {
    name: string;
    values: string[];
    icon?: React.ComponentType<{ className?: string }>;
}

interface MultiDimensionVariantSelectorProps {
    variants: ProductVariant[];
    selectedVariantId: string;
    onVariantSelect: (variant: ProductVariant) => void;
    dimensions?: VariantDimension[];
}

/**
 * Extract dimensions from variants based on specifications
 */
function extractDimensions(variants: ProductVariant[]): VariantDimension[] {
    const colorSet = new Set<string>();
    const sizeSet = new Set<string>();

    variants.forEach((variant) => {
        const specs = variant.specifications || {};
        if (specs["اللون"]) colorSet.add(specs["اللون"]);
        if (specs["الحجم"]) sizeSet.add(specs["الحجم"]);
    });

    const dimensions: VariantDimension[] = [];

    if (colorSet.size > 0) {
        dimensions.push({
            name: "اللون",
            values: Array.from(colorSet),
            icon: Palette,
        });
    }

    if (sizeSet.size > 0) {
        dimensions.push({
            name: "الحجم",
            values: Array.from(sizeSet),
            icon: Ruler,
        });
    }

    return dimensions;
}

/**
 * Multi-dimensional variant selector
 * Shows separate rows for colors and sizes
 */
export function MultiDimensionVariantSelector({
    variants,
    selectedVariantId,
    onVariantSelect,
}: MultiDimensionVariantSelectorProps) {
    const dimensions = useMemo(() => extractDimensions(variants), [variants]);

    // Track selected values for each dimension
    const [selectedValues, setSelectedValues] = useState<Record<string, string>>({});

    // Initialize selected values from current selected variant
    useEffect(() => {
        const selectedVariant = variants.find((v) => v.id === selectedVariantId);
        if (selectedVariant?.specifications) {
            const initial: Record<string, string> = {};
            dimensions.forEach((dim) => {
                const value = selectedVariant.specifications?.[dim.name];
                if (value) initial[dim.name] = value;
            });
            setSelectedValues(initial);
        }
    }, [selectedVariantId, variants, dimensions]);

    // If no multi-dimensions detected, return null (use standard selector)
    if (dimensions.length < 2) {
        return null;
    }

    // Handle dimension value selection
    const handleDimensionSelect = (dimensionName: string, value: string) => {
        const newSelectedValues = { ...selectedValues, [dimensionName]: value };
        setSelectedValues(newSelectedValues);

        // Find matching variant
        const matchingVariant = variants.find((variant) => {
            return dimensions.every((dim) => {
                const variantValue = variant.specifications?.[dim.name];
                const selectedValue = newSelectedValues[dim.name];
                return variantValue === selectedValue;
            });
        });

        if (matchingVariant) {
            onVariantSelect(matchingVariant);
        }
    };

    // Get selected variant
    const selectedVariant = variants.find((v) => v.id === selectedVariantId);

    return (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent" dir="rtl">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    ✨ اختر الخصائص
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Render each dimension as a separate row */}
                {dimensions.map((dimension) => {
                    const Icon = dimension.icon || Palette;
                    const selectedValue = selectedValues[dimension.name];

                    return (
                        <div key={dimension.name} className="space-y-3">
                            {/* Dimension label */}
                            <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4 text-primary" />
                                <span className="font-medium">{dimension.name}:</span>
                                {selectedValue && (
                                    <Badge variant="secondary">{selectedValue}</Badge>
                                )}
                            </div>

                            {/* Dimension options */}
                            <div className="flex flex-wrap gap-2">
                                {dimension.values.map((value) => {
                                    const isSelected = selectedValue === value;

                                    // Check if this combination is available
                                    const isAvailable = variants.some((v) => {
                                        const matchesDimension = v.specifications?.[dimension.name] === value;
                                        const matchesOthers = dimensions
                                            .filter((d) => d.name !== dimension.name)
                                            .every((d) => {
                                                const otherSelected = selectedValues[d.name];
                                                return !otherSelected || v.specifications?.[d.name] === otherSelected;
                                            });
                                        return matchesDimension && matchesOthers && v.stock > 0;
                                    });

                                    return (
                                        <button
                                            key={value}
                                            onClick={() => handleDimensionSelect(dimension.name, value)}
                                            disabled={!isAvailable}
                                            className={cn(
                                                "relative px-4 py-2 rounded-lg border-2 font-medium transition-all",
                                                "min-w-[80px] text-center",
                                                isSelected
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-muted hover:border-primary/50 bg-background",
                                                !isAvailable && "opacity-40 cursor-not-allowed"
                                            )}
                                        >
                                            {/* Selection indicator */}
                                            {isSelected && (
                                                <div className="absolute top-1 left-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                                    <Check className="w-2.5 h-2.5 text-white" />
                                                </div>
                                            )}
                                            {value}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {/* Show selected variant price */}
                {selectedVariant && (
                    <div className="pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">السعر:</span>
                            <div className="text-xl font-bold text-primary">
                                {selectedVariant.price.toLocaleString()} د.ع
                            </div>
                        </div>
                        {selectedVariant.stock > 0 ? (
                            <Badge variant="outline" className="mt-2 text-green-600 border-green-600">
                                ✓ متوفر ({selectedVariant.stock} قطعة)
                            </Badge>
                        ) : (
                            <Badge variant="destructive" className="mt-2">
                                غير متوفر
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
