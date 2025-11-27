import React, { useState, MouseEvent } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WaterRippleButtonProps extends ButtonProps {
  rippleColor?: string;
}

export function WaterRippleButton({ className, children, rippleColor = "rgba(255, 255, 255, 0.4)", ...props }: WaterRippleButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <Button
      className={cn("relative overflow-hidden transition-all duration-300 transform active:scale-95", className)}
      onClick={handleClick}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full animate-ping opacity-75"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            transform: 'translate(-50%, -50%)',
            backgroundColor: rippleColor,
          }}
        />
      ))}
    </Button>
  );
}
