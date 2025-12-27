/**
 * ImageReorderManager - Component for managing and reordering product images
 * Allows drag-drop reordering and thumbnail selection
 */
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
    GripVertical,
    Star,
    Trash2,
    ChevronUp,
    ChevronDown,
    Image as ImageIcon,
    Check,
} from "lucide-react";

interface ImageReorderManagerProps {
    images: string[];
    thumbnail: string;
    onImagesChange: (images: string[]) => void;
    onThumbnailChange: (thumbnail: string) => void;
    onDeleteImage?: (image: string) => void;
}

export function ImageReorderManager({
    images,
    thumbnail,
    onImagesChange,
    onThumbnailChange,
    onDeleteImage,
}: ImageReorderManagerProps) {
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [dropIndex, setDropIndex] = useState<number | null>(null);

    // Move image up in the list
    const moveUp = useCallback((index: number) => {
        if (index <= 0) return;
        const newImages = [...images];
        [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
        onImagesChange(newImages);
    }, [images, onImagesChange]);

    // Move image down in the list
    const moveDown = useCallback((index: number) => {
        if (index >= images.length - 1) return;
        const newImages = [...images];
        [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
        onImagesChange(newImages);
    }, [images, onImagesChange]);

    // Set as thumbnail
    const setAsThumbnail = useCallback((image: string) => {
        onThumbnailChange(image);
    }, [onThumbnailChange]);

    // Handle drag start
    const handleDragStart = (index: number) => {
        setDragIndex(index);
    };

    // Handle drag over
    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        setDropIndex(index);
    };

    // Handle drop
    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        if (dragIndex === null || dragIndex === targetIndex) {
            setDragIndex(null);
            setDropIndex(null);
            return;
        }

        const newImages = [...images];
        const [removed] = newImages.splice(dragIndex, 1);
        newImages.splice(targetIndex, 0, removed);
        onImagesChange(newImages);
        setDragIndex(null);
        setDropIndex(null);
    };

    // Handle drag end
    const handleDragEnd = () => {
        setDragIndex(null);
        setDropIndex(null);
    };

    if (images.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <ImageIcon className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">لا توجد صور للترتيب</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card dir="rtl">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    ترتيب الصور ({images.length})
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                    اسحب الصور لترتيبها، أو استخدم الأزرار. الصورة الأولى ستكون الصورة الرئيسية.
                </p>
            </CardHeader>
            <CardContent className="space-y-2">
                {images.map((image, index) => {
                    const isThumbnail = image === thumbnail || (index === 0 && !thumbnail);
                    const isDragging = dragIndex === index;
                    const isDropTarget = dropIndex === index && dragIndex !== null && dragIndex !== index;

                    return (
                        <div
                            key={`${image}-${index}`}
                            draggable
                            onDragStart={() => handleDragStart(index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                            className={cn(
                                "flex items-center gap-3 p-3 rounded-lg border transition-all cursor-move",
                                isDragging && "opacity-50 border-primary",
                                isDropTarget && "border-primary border-2 bg-primary/5",
                                isThumbnail && "border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20"
                            )}
                        >
                            {/* Drag Handle */}
                            <div className="flex-shrink-0 text-muted-foreground">
                                <GripVertical className="w-5 h-5" />
                            </div>

                            {/* Image Preview */}
                            <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden border">
                                <img
                                    src={image}
                                    alt={`صورة ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/placeholder-product.svg";
                                    }}
                                />
                                {isThumbnail && (
                                    <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                                        <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                                    </div>
                                )}
                            </div>

                            {/* Image Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium">صورة {index + 1}</span>
                                    {isThumbnail && (
                                        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                                            <Star className="w-3 h-3 ml-1" />
                                            الصورة الرئيسية
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate" title={image}>
                                    {image.split("/").pop()}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-1 flex-shrink-0">
                                {/* Move Up */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={index === 0}
                                    onClick={() => moveUp(index)}
                                    title="تحريك لأعلى"
                                >
                                    <ChevronUp className="w-4 h-4" />
                                </Button>

                                {/* Move Down */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    disabled={index === images.length - 1}
                                    onClick={() => moveDown(index)}
                                    title="تحريك لأسفل"
                                >
                                    <ChevronDown className="w-4 h-4" />
                                </Button>

                                {/* Set as Thumbnail */}
                                {!isThumbnail && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-amber-500 hover:text-amber-600 hover:bg-amber-50"
                                        onClick={() => setAsThumbnail(image)}
                                        title="تعيين كصورة رئيسية"
                                    >
                                        <Star className="w-4 h-4" />
                                    </Button>
                                )}

                                {/* Delete */}
                                {onDeleteImage && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => onDeleteImage(image)}
                                        title="حذف الصورة"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Quick Actions */}
                <div className="flex items-center gap-2 pt-4 border-t">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            if (images.length > 0 && images[0] !== thumbnail) {
                                onThumbnailChange(images[0]);
                            }
                        }}
                        className="text-xs"
                    >
                        <Check className="w-3 h-3 ml-1" />
                        تعيين الأولى كرئيسية
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
