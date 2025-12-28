/**
 * ImageSelector Component
 * Allows admin to select an image from available product images for a variant
 */
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImageSelectorProps {
    /** قائمة الصور المتاحة للاختيار */
    images: string[];
    /** الصورة المختارة حالياً */
    selectedImage?: string;
    /** Callback عند اختيار صورة */
    onSelect: (imageUrl: string) => void;
    /** العنوان المعروض */
    label?: string;
    /** Optional: callback عند بدء السحب */
    onImageDragStart?: (imageUrl: string) => void;
    /** Optional: callback عند انتهاء السحب */
    onImageDragEnd?: () => void;
}

/**
 * مكون لاختيار صورة من معرض الصور المتاحة
 * يعرض الصور في Grid مع إمكانية الاختيار
 */
export function ImageSelector({
    images,
    selectedImage,
    onSelect,
    label = "اختر صورة المتغير",
    onImageDragStart,
    onImageDragEnd,
}: ImageSelectorProps) {
    const [showPreview, setShowPreview] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleImageClick = (img: string) => {
        onSelect(img);
    };

    const handlePreview = (img: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setPreviewImage(img);
        setShowPreview(true);
    };

    const closePreview = () => {
        setShowPreview(false);
        setPreviewImage(null);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label>{label}</Label>
                {selectedImage && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelect("")}
                        className="h-7 text-xs"
                    >
                        <X className="w-3 h-3 ml-1" />
                        إزالة الصورة
                    </Button>
                )}
            </div>

            {images.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded-lg bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                        لا توجد صور متاحة. أضف صوراً للمنتج أولاً.
                    </p>
                </div>
            ) : (
                <ScrollArea className="h-[300px] w-full rounded-md border p-4">
                    <div className="grid grid-cols-3 gap-3">
                        {/* خيار "بدون صورة" */}
                        <div
                            className={cn(
                                "relative cursor-pointer rounded-lg border-2 p-2 transition-all",
                                "hover:border-primary/50 hover:shadow-md flex items-center justify-center h-24",
                                !selectedImage
                                    ? "border-primary ring-2 ring-primary bg-primary/5"
                                    : "border-gray-200 dark:border-gray-700"
                            )}
                            onClick={() => handleImageClick("")}
                        >
                            <p className="text-xs text-muted-foreground text-center">
                                بدون صورة
                                <br />
                                (افتراضي)
                            </p>
                            {!selectedImage && (
                                <div className="absolute top-1 right-1">
                                    <CheckCircle className="w-4 h-4 text-primary" />
                                </div>
                            )}
                        </div>

                        {/* الصور المتاحة */}
                        {images.map((img) => (
                            <div
                                key={img}
                                draggable={!!onImageDragStart}
                                onDragStart={() => onImageDragStart?.(img)}
                                onDragEnd={onImageDragEnd}
                                className={cn(
                                    "relative cursor-pointer rounded-lg border-2 overflow-hidden transition-all group",
                                    "hover:border-primary/50 hover:shadow-md",
                                    onImageDragStart && "cursor-move",
                                    selectedImage === img
                                        ? "border-primary ring-2 ring-primary"
                                        : "border-gray-200 dark:border-gray-700"
                                )}
                                onClick={() => handleImageClick(img)}
                            >
                                <img
                                    src={img}
                                    alt="صورة المنتج"
                                    className="w-full h-24 object-cover"
                                    draggable={false}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/placeholder-product.svg";
                                    }}
                                />

                                {/* علامة الاختيار */}
                                {selectedImage === img && (
                                    <div className="absolute top-1 right-1 bg-white dark:bg-gray-900 rounded-full">
                                        <CheckCircle className="w-5 h-5 text-primary" />
                                    </div>
                                )}

                                {/* زر المعاينة عند التحويم */}
                                <div
                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                    onClick={(e) => handlePreview(img, e)}
                                >
                                    <span className="text-white text-xs font-medium">
                                        معاينة
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            )}

            {/* معاينة الصورة المختارة */}
            {selectedImage && (
                <div className="mt-3 p-3 bg-muted/50 rounded-lg border">
                    <Label className="text-xs text-muted-foreground mb-2 block">
                        الصورة المختارة:
                    </Label>
                    <div className="relative inline-block">
                        <img
                            src={selectedImage}
                            alt="الصورة المختارة"
                            className="w-32 h-32 object-cover rounded border-2 border-primary"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder-product.svg";
                            }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 truncate">
                        {selectedImage.split("/").pop()}
                    </p>
                </div>
            )}

            {/* نافذة المعاينة الكاملة */}
            {showPreview && previewImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                    onClick={closePreview}
                >
                    <div className="relative max-w-4xl max-h-[90vh]">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-white/10 hover:bg-white/20"
                            onClick={closePreview}
                        >
                            <X className="w-5 h-5 text-white" />
                        </Button>
                        <img
                            src={previewImage}
                            alt="معاينة كاملة"
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
