import { useState, useEffect } from 'react';

interface SpotlightEffectProps {
    className?: string;
}

export function SpotlightEffect({ className = "" }: SpotlightEffectProps) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if mobile (simple check)
        if (typeof window !== 'undefined') {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        }

        let throttleTimer: NodeJS.Timeout | null = null;

        const handleMouseMove = (e: MouseEvent) => {
            if (throttleTimer) return;
            throttleTimer = setTimeout(() => {
                setMousePos({ x: e.clientX, y: e.clientY });
                throttleTimer = null;
            }, 50); // Throttle to 50ms
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (throttleTimer) clearTimeout(throttleTimer);
        };
    }, []);

    if (isMobile) return null; // Disable on mobile

    return (
        <div
            className={`fixed inset-0 pointer-events-none z-[1] ${className}`}
            style={{
                background: `radial-gradient(circle 600px at ${mousePos.x}px ${mousePos.y}px, rgba(204, 255, 0, 0.08), transparent 80%)`
            }}
        />
    );
}
