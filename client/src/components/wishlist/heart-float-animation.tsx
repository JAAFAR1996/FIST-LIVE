import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeartFloatAnimationProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function HeartFloatAnimation({ trigger, onComplete }: HeartFloatAnimationProps) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      const timer = setTimeout(() => {
        setIsActive(false);
        onComplete?.();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Main white circle that expands and fades */}
          <motion.div
            initial={{ opacity: 0.8, scale: 0 }}
            animate={{ opacity: 0, scale: 2.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div className="w-16 h-16 bg-white rounded-full" />
          </motion.div>

          {/* Secondary smaller circles for effect */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 0.6,
                scale: 0,
                x: 0,
                y: 0
              }}
              animate={{
                opacity: 0,
                scale: 1.5,
                x: Math.cos((i * 2 * Math.PI) / 5) * 60,
                y: Math.sin((i * 2 * Math.PI) / 5) * 60
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: i * 0.05
              }}
              className="fixed z-50 pointer-events-none"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="w-8 h-8 bg-white rounded-full" />
            </motion.div>
          ))}

          {/* Heart icon that floats up */}
          <motion.div
            initial={{ opacity: 1, scale: 1, y: 0 }}
            animate={{
              opacity: 0,
              scale: 0.5,
              y: -100
            }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <svg
              className="w-12 h-12 fill-red-500"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
