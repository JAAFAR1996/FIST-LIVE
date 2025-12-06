import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  objectFit?: "cover" | "contain" | "fill";
  onLoad?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  objectFit = "cover",
  onLoad,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generate optimized URLs for Unsplash images
  const getOptimizedUrl = (url: string, size: string, format?: string) => {
    if (url.includes('unsplash.com')) {
      const baseUrl = url.split('?')[0];
      const formatParam = format ? `&fm=${format}` : '';
      return `${baseUrl}?w=${size}&q=80${formatParam}&fit=crop`;
    }
    return url;
  };

  // Generate srcset for responsive images (WebP)
  const webpSrcSet = src.includes('unsplash.com')
    ? `${getOptimizedUrl(src, '400', 'webp')} 400w,
       ${getOptimizedUrl(src, '800', 'webp')} 800w,
       ${getOptimizedUrl(src, '1200', 'webp')} 1200w,
       ${getOptimizedUrl(src, '1600', 'webp')} 1600w`
    : undefined;

  // Generate srcset for responsive images (JPEG fallback)
  const jpegSrcSet = src.includes('unsplash.com')
    ? `${getOptimizedUrl(src, '400', 'jpg')} 400w,
       ${getOptimizedUrl(src, '800', 'jpg')} 800w,
       ${getOptimizedUrl(src, '1200', 'jpg')} 1200w,
       ${getOptimizedUrl(src, '1600', 'jpg')} 1600w`
    : undefined;

  const sizes = "(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px";

  // Use JPEG as fallback src
  const fallbackSrc = src.includes('unsplash.com')
    ? getOptimizedUrl(src, '1200', 'jpg')
    : src;

  useEffect(() => {
    if (priority) {
      const img = new Image();
      img.src = fallbackSrc;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setError(true);
    }
  }, [fallbackSrc, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  if (error) {
    return (
      <div className={cn("bg-muted flex items-center justify-center", className)}>
        <p className="text-muted-foreground text-sm">فشل تحميل الصورة</p>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {/* Blur placeholder with shimmer effect */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%] animate-shimmer" />
      )}

      {/* Use picture element for better WebP support */}
      <picture>
        {webpSrcSet && (
          <source
            srcSet={webpSrcSet}
            sizes={sizes}
            type="image/webp"
          />
        )}
        {jpegSrcSet && (
          <source
            srcSet={jpegSrcSet}
            sizes={sizes}
            type="image/jpeg"
          />
        )}
        <img
          src={fallbackSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          onLoad={handleLoad}
          onError={() => setError(true)}
          className={cn(
            "w-full h-full transition-opacity duration-500",
            objectFit === "cover" && "object-cover",
            objectFit === "contain" && "object-contain",
            objectFit === "fill" && "object-fill",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
        />
      </picture>
    </div>
  );
}
