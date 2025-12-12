import { cn } from "@/lib/utils";

interface WaveDividerProps {
    className?: string;
    color?: string;
    opacity?: number;
    flip?: boolean;
    variant?: 'wave' | 'wave-triple' | 'curve' | 'tilt';
}

export function WaveDivider({
    className = "",
    color = "hsl(var(--primary))",
    opacity = 0.1,
    flip = false,
    variant = 'wave'
}: WaveDividerProps) {
    const variants = {
        wave: "M0,0 L0,40 Q300,80 600,40 T1200,40 L1200,0 Z",
        'wave-triple': "M0,0 L0,40 Q200,60 400,40 T800,40 T1200,40 L1200,0 Z",
        curve: "M0,0 L0,60 Q600,20 1200,60 L1200,0 Z",
        tilt: "M0,0 L0,80 L1200,20 L1200,0 Z"
    };

    return (
        <div
            className={cn(
                "w-full overflow-hidden select-none pointer-events-none",
                flip && "rotate-180",
                className
            )}
            aria-hidden="true"
        >
            <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="w-full h-12 md:h-16 lg:h-20"
            >
                <path
                    d={variants[variant]}
                    fill={color}
                    fillOpacity={opacity}
                />
            </svg>
        </div>
    );
}

// Animated version
export function AnimatedWaveDivider({
    className = "",
    color = "hsl(var(--primary))",
    opacity = 0.1,
    flip = false
}: Omit<WaveDividerProps, 'variant'>) {
    return (
        <div
            className={cn(
                "w-full overflow-hidden select-none pointer-events-none",
                flip && "rotate-180",
                className
            )}
            aria-hidden="true"
        >
            <svg
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
                className="w-full h-12 md:h-16 lg:h-20"
            >
                <defs>
                    <linearGradient id="wave-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: color, stopOpacity: opacity }} />
                        <stop offset="50%" style={{ stopColor: color, stopOpacity: opacity * 1.5 }} />
                        <stop offset="100%" style={{ stopColor: color, stopOpacity: opacity }} />
                    </linearGradient>
                </defs>
                <path
                    d="M0,0 L0,40 Q300,80 600,40 T1200,40 L1200,0 Z"
                    fill="url(#wave-gradient)"
                    className="animate-wave"
                />
            </svg>
        </div>
    );
}
