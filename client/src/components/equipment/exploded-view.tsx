import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ExplodedViewProps {
  imageUrl: string;
  parts: { id: string; name: string; x: number; y: number; description: string }[];
}

export function ExplodedView({ imageUrl, parts }: ExplodedViewProps) {
  const [activePart, setActivePart] = useState<string | null>(null);

  return (
    <div className="relative w-full aspect-square bg-muted/10 rounded-3xl overflow-hidden border border-white/10">
      {/* Main Image */}
      <img 
        src={imageUrl} 
        alt="Exploded View" 
        className="absolute inset-0 w-full h-full object-contain p-12 mix-blend-multiply dark:mix-blend-normal opacity-50"
      />

      {/* Interactive Hotspots */}
      {parts.map((part) => (
        <div
          key={part.id}
          className="absolute"
          style={{ left: `${part.x}%`, top: `${part.y}%` }}
        >
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActivePart(activePart === part.id ? null : part.id)}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg transition-colors z-10 relative",
              activePart === part.id 
                ? "bg-primary border-primary text-primary-foreground" 
                : "bg-background border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground"
            )}
          >
            <span className="w-2 h-2 rounded-full bg-current" />
          </motion.button>

          {/* Connecting Line */}
          <AnimatePresence>
            {activePart === part.id && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute left-10 top-0 w-64 bg-card/90 backdrop-blur-md p-4 rounded-xl border shadow-xl z-20 origin-left"
              >
                <h4 className="font-bold text-lg mb-1">{part.name}</h4>
                <p className="text-sm text-muted-foreground">{part.description}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
