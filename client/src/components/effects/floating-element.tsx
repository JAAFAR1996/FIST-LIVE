import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FloatingElementProps {
    children: ReactNode;
    delay?: number;
    duration?: number;
    intensity?: number; // Y-axis movement range
    className?: string;
}

export function FloatingElement({
    children,
    delay = 0,
    duration = 6,
    intensity = 20,
    className = ""
}: FloatingElementProps) {
    const shouldReduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return (
        <motion.div
            animate={shouldReduceMotion ? {} : { y: [0, -intensity, 0] }}
            transition={{
                duration: duration,
                ease: "easeInOut",
                repeat: Infinity,
                delay: delay
            }}
            className={`relative ${className}`}
        >
            {children}
        </motion.div>
    );
}
