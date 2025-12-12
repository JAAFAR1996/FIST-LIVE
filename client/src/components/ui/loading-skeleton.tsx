import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "default" | "card" | "text" | "circle";
}

export function LoadingSkeleton({ className, variant = "default" }: SkeletonProps) {
  const baseClasses = "animate-pulse bg-muted";

  const variantClasses = {
    default: "h-4 rounded",
    card: "h-64 rounded-xl",
    text: "h-3 rounded",
    circle: "rounded-full aspect-square",
  };

  return (
    <div className={cn(baseClasses, variantClasses[variant], className)} />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="border rounded-xl overflow-hidden">
      <LoadingSkeleton variant="card" className="w-full" />
      <div className="p-4 space-y-3">
        <LoadingSkeleton variant="text" className="w-3/4" />
        <LoadingSkeleton variant="text" className="w-1/2" />
        <LoadingSkeleton className="w-full h-10 rounded-lg" />
      </div>
    </div>
  );
}

export function FishCardSkeleton() {
  return (
    <div className="border rounded-2xl overflow-hidden p-6">
      <LoadingSkeleton variant="circle" className="w-24 h-24 mx-auto mb-4" />
      <LoadingSkeleton variant="text" className="w-3/4 mx-auto mb-2" />
      <LoadingSkeleton variant="text" className="w-1/2 mx-auto mb-4" />
      <div className="flex gap-2 justify-center">
        <LoadingSkeleton className="w-16 h-6 rounded-full" />
        <LoadingSkeleton className="w-16 h-6 rounded-full" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 items-center">
          <LoadingSkeleton variant="circle" className="w-12 h-12" />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton className="w-3/4" />
            <LoadingSkeleton className="w-1/2" />
          </div>
          <LoadingSkeleton className="w-24 h-8 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
