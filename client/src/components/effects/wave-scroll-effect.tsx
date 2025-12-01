import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface WaveScrollEffectProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export function WaveScrollEffect({ 
  children, 
  className,
  intensity = 50 
}: WaveScrollEffectProps) {
  const { scrollYProgress } = useScroll();
  
  const x = useTransform(scrollYProgress, [0, 1], [0, intensity]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 1, 0]);

  return (
    <motion.div 
      style={{ x, opacity }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
