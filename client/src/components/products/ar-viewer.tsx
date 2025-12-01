import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Box, Smartphone, RefreshCw } from "lucide-react";
import "@/types/model-viewer";
import { clientEnv } from "@/lib/config/env";

const MODEL_VIEWER_SRC =
  "https://cdn.jsdelivr.net/npm/@google/model-viewer@3.4.0/dist/model-viewer.min.js";
const DEFAULT_MODEL_URL =
  "https://modelviewer.dev/shared-assets/models/Astronaut.glb";

let modelViewerLoader: Promise<void> | null = null;

function loadModelViewer(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.customElements?.get("model-viewer")) return Promise.resolve();

  if (!modelViewerLoader) {
    modelViewerLoader = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.type = "module";
      script.src = MODEL_VIEWER_SRC;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load model-viewer"));
      document.head.appendChild(script);
    });
  }
  return modelViewerLoader;
}

interface ARViewerProps {
  modelUrl?: string;
  posterUrl: string;
  className?: string;
}

export function ARViewer({ modelUrl, posterUrl, className }: ARViewerProps) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ModelViewer: any = "model-viewer";
  const effectiveModelUrl = useMemo(
    () => modelUrl || clientEnv.arModelUrl || DEFAULT_MODEL_URL,
    [modelUrl],
  );

  useEffect(() => {
    loadModelViewer()
      .then(() => setIsReady(true))
      .catch((err) => setError(err.message || "AR failed to initialize"));
  }, []);

  const overlayMessage = error
    ? "تعذر تحميل العارض ثلاثي الأبعاد"
    : "اضغط وشاهد المنتج في مساحتك";

  return (
    <div
      className={`relative group rounded-xl overflow-hidden bg-muted border border-border ${className}`}
    >
      {isReady && !error ? (
        <ModelViewer
          src={effectiveModelUrl}
          poster={posterUrl}
          ar
          ar-modes="webxr scene-viewer quick-look"
          camera-controls
          touch-action="pan-y"
          auto-rotate
          shadow-intensity="1"
          exposure="1.1"
          className="w-full h-full"
        />
      ) : (
        <img
          src={posterUrl}
          alt="AR Preview"
          className="w-full h-full object-cover opacity-90"
        />
      )}

      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm gap-3 text-white">
        <div className="px-4 py-2 rounded-full bg-black/50 border border-white/10 flex items-center gap-2 text-sm">
          <Smartphone className="w-4 h-4" />
          <span>{overlayMessage}</span>
        </div>
        {!error && (
          <Button
            variant="secondary"
            className="gap-2 shadow-lg hover:scale-105 transition-transform"
          >
            عرض في مساحتك
          </Button>
        )}
        {error && (
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={() => {
              setError(null);
              setIsReady(false);
              loadModelViewer()
                .then(() => setIsReady(true))
                .catch((err) =>
                  setError(err.message || "AR failed to initialize"),
                );
            }}
          >
            <RefreshCw className="w-4 h-4" />
            إعادة المحاولة
          </Button>
        )}
      </div>

      <div className="absolute top-2 right-2 bg-black/60 text-white p-1.5 rounded-full backdrop-blur-md">
        <Box className="w-4 h-4" />
      </div>
    </div>
  );
}
