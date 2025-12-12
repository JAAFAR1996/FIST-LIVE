import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
    rating: number;
    maxRating?: number;
    size?: "sm" | "md" | "lg";
    showValue?: boolean;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
    className?: string;
}

const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-7 h-7",
};

const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
};

export function RatingStars({
    rating,
    maxRating = 5,
    size = "md",
    showValue = false,
    interactive = false,
    onRatingChange,
    className,
}: RatingStarsProps) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

    const handleClick = (starIndex: number) => {
        if (interactive && onRatingChange) {
            onRatingChange(starIndex + 1);
        }
    };

    return (
        <div className={cn("flex items-center gap-1", className)}>
            <div className="flex" dir="ltr">
                {/* Full Stars */}
                {[...Array(fullStars)].map((_, i) => (
                    <button
                        key={`full-${i}`}
                        type="button"
                        disabled={!interactive}
                        onClick={() => handleClick(i)}
                        className={cn(
                            "transition-transform",
                            interactive && "hover:scale-110 cursor-pointer"
                        )}
                    >
                        <Star
                            className={cn(
                                sizeClasses[size],
                                "fill-amber-400 text-amber-400"
                            )}
                        />
                    </button>
                ))}

                {/* Half Star */}
                {hasHalfStar && (
                    <button
                        type="button"
                        disabled={!interactive}
                        onClick={() => handleClick(fullStars)}
                        className={cn(
                            "relative transition-transform",
                            interactive && "hover:scale-110 cursor-pointer"
                        )}
                    >
                        <Star className={cn(sizeClasses[size], "text-muted-foreground")} />
                        <div className="absolute inset-0 overflow-hidden w-1/2">
                            <Star
                                className={cn(
                                    sizeClasses[size],
                                    "fill-amber-400 text-amber-400"
                                )}
                            />
                        </div>
                    </button>
                )}

                {/* Empty Stars */}
                {[...Array(Math.max(0, emptyStars))].map((_, i) => (
                    <button
                        key={`empty-${i}`}
                        type="button"
                        disabled={!interactive}
                        onClick={() => handleClick(fullStars + (hasHalfStar ? 1 : 0) + i)}
                        className={cn(
                            "transition-transform",
                            interactive && "hover:scale-110 cursor-pointer"
                        )}
                    >
                        <Star
                            className={cn(sizeClasses[size], "text-muted-foreground")}
                        />
                    </button>
                ))}
            </div>

            {showValue && (
                <span
                    className={cn(
                        "font-medium text-muted-foreground mr-1",
                        textSizeClasses[size]
                    )}
                >
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
