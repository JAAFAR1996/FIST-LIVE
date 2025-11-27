import React from 'react';
import { cn } from '@/lib/utils';

interface UnderwaterGlowImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  glowColor?: string;
  className?: string;
}

export function UnderwaterGlowImage({ 
  src, 
  alt, 
  glowColor = "var(--primary)", 
  className,
  ...props 
}: UnderwaterGlowImageProps) {
  return (
    <div className="relative group overflow-hidden rounded-xl">
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none mix-blend-screen"
        style={{
          background: `radial-gradient(circle at center, ${glowColor} 0%, transparent 70%)`,
          zIndex: 1
        }}
      />
      <img
        src={src}
        alt={alt}
        className={cn(
          "relative z-0 transition-transform duration-700 group-hover:scale-105",
          className
        )}
        {...props}
      />
      <div className="absolute inset-0 pointer-events-none ring-1 ring-white/10 rounded-xl z-10" />
    </div>
  );
}
