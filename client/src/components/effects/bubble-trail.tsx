import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function BubbleTrail() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.9) { // Only create bubbles occasionally
        const newBubble = {
          id: Date.now(),
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 15 + 5,
        };
        setBubbles(prev => [...prev.slice(-20), newBubble]);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {bubbles.map(bubble => (
          <motion.div
            key={bubble.id}
            initial={{ opacity: 0.6, y: bubble.y, x: bubble.x, scale: 0 }}
            animate={{ 
              opacity: 0, 
              y: bubble.y - 100, 
              x: bubble.x + (Math.random() * 20 - 10),
              scale: 1 
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute rounded-full bg-primary/30 border border-primary/50 backdrop-blur-sm"
            style={{ 
              width: bubble.size, 
              height: bubble.size,
              boxShadow: "0 0 10px rgba(6, 182, 212, 0.3)"
            }}
            onAnimationComplete={() => {
              setBubbles(prev => prev.filter(b => b.id !== bubble.id));
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
