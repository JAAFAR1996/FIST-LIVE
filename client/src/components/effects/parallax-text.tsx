import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ParallaxTextProps {
    children: ReactNode;
    offset?: number; // How much it moves (e.g. -100 for moving up, 100 for down)
    className?: string;
}

export function ParallaxText({ children, offset = -50, className = "" }: ParallaxTextProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [0, offset]);

    return (
        <motion.div
            ref={ref}
            style={{ y }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
