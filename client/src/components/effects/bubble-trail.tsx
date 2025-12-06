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
    // Create automatic floating bubbles
    const createAutoBubble = () => {
      const newBubble = {
        id: Date.now() + Math.random(),
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 50, // Start from bottom
        size: Math.random() * 25 + 10,
      };
      setBubbles(prev => [...prev.slice(-60), newBubble]);
    };

    // Create bubbles automatically every 800ms
    const autoInterval = setInterval(createAutoBubble, 800);

    // Create bubbles on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.5) {
        const newBubble = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 20 + 8,
        };
        setBubbles(prev => [...prev.slice(-60), newBubble]);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(autoInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {bubbles.map(bubble => (
          <motion.div
            key={bubble.id}
            initial={{ opacity: 0.8, y: bubble.y, x: bubble.x, scale: 0 }}
            animate={{
              opacity: 0,
              y: bubble.y - 150,
              x: bubble.x + (Math.random() * 40 - 20),
              scale: 1.2
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="absolute rounded-full bg-cyan-400/40 border-2 border-cyan-300/60 backdrop-blur-sm"
            style={{
              width: bubble.size,
              height: bubble.size,
              boxShadow: "0 0 20px rgba(6, 182, 212, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.3)"
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
