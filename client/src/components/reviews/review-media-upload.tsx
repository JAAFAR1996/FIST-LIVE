import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X, Image as ImageIcon, Video, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ReviewMediaUploadProps {
    images: string[];
    videoUrl: string | null;
    onImagesChange: (images: string[]) => void;
    onVideoChange: (url: string | null) => void;
    maxImages?: number;
    disabled?: boolean;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export function ReviewMediaUpload({
    images,
    videoUrl,
    onImagesChange,
    onVideoChange,
    maxImages = 5,
    disabled = false,
}: ReviewMediaUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<string | null>(null);
    const { toast } = useToast();

    const uploadFile = useCallback(async (file: File, type: "image" | "video"): Promise<string | null> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        try {
            const response = await fetch("/api/upload/review-media", {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "فشل رفع الملف");
            }

            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error("Upload error:", error);
            throw error;
        }
    }, []);

    const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const remainingSlots = maxImages - images.length;
        if (remainingSlots <= 0) {
            toast({
                title: "الحد الأقصى",
                description: `يمكنك رفع ${maxImages} صور كحد أقصى`,
                variant: "destructive",
            });
            return;
        }

        const filesToUpload = Array.from(files).slice(0, remainingSlots);

        for (const file of filesToUpload) {
            if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
                toast({
                    title: "نوع غير مدعوم",
                    description: "يرجى رفع صور بصيغة JPEG, PNG, WebP أو GIF",
                    variant: "destructive",
                });
                continue;
            }

            if (file.size > MAX_IMAGE_SIZE) {
                toast({
                    title: "الملف كبير جداً",
                    description: "الحد الأقصى لحجم الصورة 5MB",
                    variant: "destructive",
                });
                continue;
            }

            setUploading(true);
            setUploadProgress(`جاري رفع ${file.name}...`);

            try {
                const url = await uploadFile(file, "image");
                if (url) {
                    onImagesChange([...images, url]);
                    toast({
                        title: "تم الرفع",
                        description: "تم رفع الصورة بنجاح",
                    });
                }
            } catch {
                toast({
                    title: "خطأ",
                    description: "فشل رفع الصورة",
                    variant: "destructive",
                });
            }
        }

        setUploading(false);
        setUploadProgress(null);
        e.target.value = "";
    }, [images, maxImages, onImagesChange, toast, uploadFile]);

    const handleVideoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (videoUrl) {
            toast({
                title: "فيديو موجود",
                description: "احذف الفيديو الحالي أولاً",
                variant: "destructive",
            });
            return;
        }

        if (!ACCEPTED_VIDEO_TYPES.includes(file.type)) {
            toast({
                title: "نوع غير مدعوم",
                description: "يرجى رفع فيديو بصيغة MP4, WebM أو MOV",
                variant: "destructive",
            });
            return;
        }

        if (file.size > MAX_VIDEO_SIZE) {
            toast({
                title: "الملف كبير جداً",
                description: "الحد الأقصى لحجم الفيديو 50MB",
                variant: "destructive",
            });
            return;
        }

        setUploading(true);
        setUploadProgress(`جاري رفع الفيديو (${(file.size / 1024 / 1024).toFixed(1)}MB)...`);

        try {
            const url = await uploadFile(file, "video");
            if (url) {
                onVideoChange(url);
                toast({
                    title: "تم الرفع",
                    description: "تم رفع الفيديو بنجاح",
                });
            }
        } catch {
            toast({
                title: "خطأ",
                description: "فشل رفع الفيديو",
                variant: "destructive",
            });
        }

        setUploading(false);
        setUploadProgress(null);
        e.target.value = "";
    }, [videoUrl, onVideoChange, toast, uploadFile]);

    const removeImage = useCallback((index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onImagesChange(newImages);
    }, [images, onImagesChange]);

    const removeVideo = useCallback(() => {
        onVideoChange(null);
    }, [onVideoChange]);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ImageIcon className="w-4 h-4" />
                <span>أضف صور أو فيديو لمراجعتك (اختياري)</span>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {images.map((url, index) => (
                    <Card key={index} className="relative aspect-square overflow-hidden group">
                        <img
                            src={url}
                            alt={`صورة ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                        <button
                            type="button"
                            onClick={() => removeImage(index)}
                            disabled={disabled}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </Card>
                ))}

                {images.length < maxImages && (
                    <label className={`aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
                        <input
                            type="file"
                            accept={ACCEPTED_IMAGE_TYPES.join(",")}
                            multiple
                            onChange={handleImageUpload}
                            disabled={disabled || uploading}
                            className="hidden"
                        />
                        {uploading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        ) : (
                            <>
                                <Upload className="w-6 h-6 text-muted-foreground mb-1" />
                                <span className="text-xs text-muted-foreground">صورة</span>
                            </>
                        )}
                    </label>
                )}
            </div>

            {/* Video Section */}
            <div className="space-y-2">
                {videoUrl ? (
                    <Card className="relative overflow-hidden">
                        <video
                            src={videoUrl}
                            controls
                            className="w-full max-h-48 object-contain bg-black"
                        />
                        <button
                            type="button"
                            onClick={removeVideo}
                            disabled={disabled}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </Card>
                ) : (
                    <label className={`flex items-center gap-3 p-4 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
                        <input
                            type="file"
                            accept={ACCEPTED_VIDEO_TYPES.join(",")}
                            onChange={handleVideoUpload}
                            disabled={disabled || uploading}
                            className="hidden"
                        />
                        {uploading && uploadProgress?.includes("فيديو") ? (
                            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        ) : (
                            <Video className="w-5 h-5 text-muted-foreground" />
                        )}
                        <div>
                            <p className="text-sm font-medium">أضف فيديو</p>
                            <p className="text-xs text-muted-foreground">MP4, WebM أو MOV (حتى 50MB)</p>
                        </div>
                    </label>
                )}
            </div>

            {/* Upload Progress */}
            {uploadProgress && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{uploadProgress}</span>
                </div>
            )}

            {/* Help Text */}
            <p className="text-xs text-muted-foreground">
                يمكنك رفع حتى {maxImages} صور وفيديو واحد. الصور: JPEG, PNG, WebP, GIF (حتى 5MB)
            </p>
        </div>
    );
}

export default ReviewMediaUpload;
