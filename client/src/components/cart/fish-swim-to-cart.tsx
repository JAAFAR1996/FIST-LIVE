import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Fish } from 'lucide-react';

interface FishSwimToCartProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function FishSwimToCart({ trigger, onComplete }: FishSwimToCartProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
        onComplete?.();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          animate={{ 
            opacity: 0, 
            scale: 0.5, 
            x: 'calc(100vw - 100px)', // Approximate cart position (top right)
            y: '-50vh' 
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed z-50 pointer-events-none text-primary"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Fish className="w-8 h-8 fill-current" />
          <div className="absolute top-0 left-0 w-full h-full animate-ping bg-primary/30 rounded-full" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
