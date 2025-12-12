import { useState, useEffect, useRef } from "react";
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
  /** Custom sizes attribute for responsive images */
  sizes?: string;
  /** Aspect ratio to prevent CLS (e.g., "16/9", "1/1", "4/3") */
  aspectRatio?: string;
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
  sizes: customSizes,
  aspectRatio,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized URLs for Unsplash images
  const getOptimizedUrl = (url: string, size: string, format?: string) => {
    if (url.includes('unsplash.com')) {
      const baseUrl = url.split('?')[0];
      const formatParam = format ? `&fm=${format}` : '';
      return `${baseUrl}?w=${size}&q=80${formatParam}&fit=crop`;
    }
    return url;
  };

  // Check if local WebP version exists (for .png, .jpg, .jpeg files)
  const getLocalWebPUrl = (url: string): string | undefined => {
    if (url.includes('unsplash.com') || url.includes('data:')) return undefined;
    const ext = url.match(/\.(png|jpg|jpeg)$/i);
    if (ext) {
      return url.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    }
    return undefined;
  };

  const localWebPUrl = getLocalWebPUrl(src);

  // Generate srcset for responsive images (WebP) - Unsplash
  const webpSrcSet = src.includes('unsplash.com')
    ? `${getOptimizedUrl(src, '400', 'webp')} 400w,
       ${getOptimizedUrl(src, '800', 'webp')} 800w,
       ${getOptimizedUrl(src, '1200', 'webp')} 1200w,
       ${getOptimizedUrl(src, '1600', 'webp')} 1600w`
    : undefined;

  // Generate srcset for responsive images (JPEG fallback) - Unsplash
  const jpegSrcSet = src.includes('unsplash.com')
    ? `${getOptimizedUrl(src, '400', 'jpg')} 400w,
       ${getOptimizedUrl(src, '800', 'jpg')} 800w,
       ${getOptimizedUrl(src, '1200', 'jpg')} 1200w,
       ${getOptimizedUrl(src, '1600', 'jpg')} 1600w`
    : undefined;

  // Mobile-first sizes attribute (optimized for mobile performance)
  const sizes = customSizes || "(max-width: 360px) 360px, (max-width: 640px) 640px, (max-width: 1024px) 800px, 1200px";

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
        <img
          src="/placeholder-product.svg"
          alt={alt}
          className={cn(
            "w-full h-full max-w-[200px] max-h-[200px] opacity-50",
            objectFit === "contain" && "object-contain",
            objectFit === "cover" && "object-cover"
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn("relative overflow-hidden bg-muted", className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Blur placeholder with shimmer effect */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted via-muted-foreground/10 to-muted bg-[length:200%_100%] animate-shimmer" />
      )}

      {/* Use picture element for better WebP support */}
      <picture>
        {/* Local WebP source for non-Unsplash images */}
        {localWebPUrl && (
          <source
            srcSet={localWebPUrl}
            type="image/webp"
          />
        )}
        {/* Unsplash WebP srcset */}
        {webpSrcSet && (
          <source
            srcSet={webpSrcSet}
            sizes={sizes}
            type="image/webp"
          />
        )}
        {/* Unsplash JPEG fallback */}
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
