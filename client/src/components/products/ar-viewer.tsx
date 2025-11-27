import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Box, Smartphone } from 'lucide-react';

interface ARViewerProps {
  modelUrl?: string; // URL to 3D model (GLB/GLTF)
  posterUrl: string; // Thumbnail
  className?: string;
}

export function ARViewer({ modelUrl, posterUrl, className }: ARViewerProps) {
  const [isARActive, setIsARActive] = useState(false);

  // This is a mock AR viewer for now. 
  // Real implementation would use <model-viewer> web component.
  
  const handleLaunchAR = () => {
    setIsARActive(true);
    // In a real app, this would trigger the AR session or open a modal with QR code
    setTimeout(() => setIsARActive(false), 3000); // Simulate AR session start
  };

  return (
    <div className={`relative group rounded-xl overflow-hidden bg-muted ${className}`}>
      <img 
        src={posterUrl} 
        alt="AR Preview" 
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
      />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
        <Button 
          onClick={handleLaunchAR} 
          variant="secondary" 
          className="gap-2 shadow-lg hover:scale-105 transition-transform"
        >
          <Smartphone className="w-4 h-4" />
          {isARActive ? "Launching AR..." : "View in your space"}
        </Button>
        <p className="text-white text-xs mt-2 font-medium drop-shadow-md">
          Augmented Reality
        </p>
      </div>
      
      <div className="absolute top-2 right-2 bg-black/50 text-white p-1.5 rounded-full backdrop-blur-md">
        <Box className="w-4 h-4" />
      </div>
    </div>
  );
}
