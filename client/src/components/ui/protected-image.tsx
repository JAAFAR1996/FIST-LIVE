import React, { useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ProtectedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
    className?: string;
    containerClassName?: string;
}

/**
 * ProtectedImage - An image component with download protection
 * Features:
 * - Disables right-click context menu
 * - Prevents drag and drop
 * - Adds CSS protection against selection
 * - Optional transparent overlay to block direct access
 */
export function ProtectedImage({
    src,
    alt,
    className,
    containerClassName,
    ...props
}: ProtectedImageProps) {
    // Prevent right-click context menu
    const handleContextMenu = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        return false;
    }, []);

    // Prevent drag start
    const handleDragStart = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        return false;
    }, []);

    return (
        <div
            className={cn(
                "protected-image-container relative select-none",
                containerClassName
            )}
            onContextMenu={handleContextMenu}
        >
            <img
                src={src}
                alt={alt}
                className={cn(
                    "pointer-events-none select-none",
                    className
                )}
                draggable={false}
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
                {...props}
            />
            {/* Transparent overlay to block direct image access */}
            <div
                className="absolute inset-0 z-10"
                style={{ backgroundColor: 'transparent' }}
                onContextMenu={handleContextMenu}
                onDragStart={handleDragStart}
            />
        </div>
    );
}

/**
 * Hook to add image protection to any element
 */
export function useImageProtection() {
    const protectionHandlers = {
        onContextMenu: (e: React.MouseEvent) => {
            e.preventDefault();
            return false;
        },
        onDragStart: (e: React.DragEvent) => {
            e.preventDefault();
            return false;
        },
        draggable: false,
    };

    return protectionHandlers;
}

export default ProtectedImage;
