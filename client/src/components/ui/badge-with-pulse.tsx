import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BadgeWithPulseProps {
  children: React.ReactNode;
  className?: string;
  pulseColor?: string;
}

export function BadgeWithPulse({
  children,
  className,
  pulseColor = "bg-primary",
}: BadgeWithPulseProps) {
  return (
    <div className="relative inline-flex">
      <Badge className={cn("relative", className)}>
        {children}
      </Badge>
      <span className="absolute top-0 right-0 flex h-3 w-3">
        <span
          className={cn(
            "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
            pulseColor
          )}
        />
        <span
          className={cn(
            "relative inline-flex rounded-full h-3 w-3",
            pulseColor
          )}
        />
      </span>
    </div>
  );
}
