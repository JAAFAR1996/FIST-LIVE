import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Fish, Waves, Leaf, Package, Image, Utensils, Sparkles, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryScrollBarProps {
    categories: string[];
    selectedCategories: string[];
    onCategoryToggle: (category: string) => void;
    categoryCounts?: Map<string, number>;
}

// Map category names to icons
const categoryIcons: Record<string, React.ElementType> = {
    "صخور": Waves,
    "معدات": Package,
    "طعام": Utensils,
    "طعام الأسماك": Fish,
    "إكسسوارات": Sparkles,
    "خلفيات أحواض": Image,
    "نباتات": Leaf,
    "أحواض": Boxes,
    "default": Package,
};

function getCategoryIcon(category: string): React.ElementType {
    return categoryIcons[category] || categoryIcons["default"];
}

export function CategoryScrollBar({
    categories,
    selectedCategories,
    onCategoryToggle,
    categoryCounts,
}: CategoryScrollBarProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    // Check scroll position
    const checkScrollPosition = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        // For RTL, scrollLeft is negative
        const isRTL = document.dir === 'rtl' || document.documentElement.dir === 'rtl';

        if (isRTL) {
            setShowRightArrow(scrollLeft < 0);
            setShowLeftArrow(scrollLeft > -(scrollWidth - clientWidth));
        } else {
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScrollPosition();
        const scrollEl = scrollRef.current;
        if (scrollEl) {
            scrollEl.addEventListener('scroll', checkScrollPosition);
            window.addEventListener('resize', checkScrollPosition);
        }
        return () => {
            if (scrollEl) {
                scrollEl.removeEventListener('scroll', checkScrollPosition);
            }
            window.removeEventListener('resize', checkScrollPosition);
        };
    }, [categories]);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = 300;
        const isRTL = document.dir === 'rtl' || document.documentElement.dir === 'rtl';

        if (isRTL) {
            scrollRef.current.scrollBy({
                left: direction === 'right' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        } else {
            scrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (categories.length === 0) return null;

    return (
        <div className="relative group">
            {/* Left Arrow */}
            {showLeftArrow && (
                <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center">
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background via-background/80 to-transparent pointer-events-none" />
                    <Button
                        variant="outline"
                        size="icon"
                        className="relative h-10 w-10 rounded-full shadow-lg border-2 bg-background hover:bg-accent transition-all hover:scale-110"
                        onClick={() => scroll('left')}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            )}

            {/* Right Arrow */}
            {showRightArrow && (
                <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center">
                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background via-background/80 to-transparent pointer-events-none" />
                    <Button
                        variant="outline"
                        size="icon"
                        className="relative h-10 w-10 rounded-full shadow-lg border-2 bg-background hover:bg-accent transition-all hover:scale-110"
                        onClick={() => scroll('right')}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                </div>
            )}

            {/* Scrollable Categories */}
            <div
                ref={scrollRef}
                className="flex gap-2 overflow-x-auto scrollbar-hide py-2 px-1 justify-start"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {/* All Categories Option */}
                <button
                    onClick={() => {
                        // Clear all categories selection
                        selectedCategories.forEach(cat => onCategoryToggle(cat));
                    }}
                    className={cn(
                        "flex flex-col items-center gap-1.5 min-w-[64px] px-3 py-2 rounded-lg transition-all duration-200",
                        "border hover:shadow-md",
                        selectedCategories.length === 0
                            ? "border-primary bg-primary/10 text-primary shadow-sm"
                            : "border-border/50 bg-card/80 hover:bg-accent text-muted-foreground hover:text-foreground"
                    )}
                >
                    <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                        selectedCategories.length === 0
                            ? "bg-primary text-white"
                            : "bg-muted"
                    )}>
                        <Boxes className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-medium whitespace-nowrap">الكل</span>
                </button>

                {categories.map((category) => {
                    const Icon = getCategoryIcon(category);
                    const isSelected = selectedCategories.includes(category);
                    const count = categoryCounts?.get(category) || 0;

                    return (
                        <button
                            key={category}
                            onClick={() => onCategoryToggle(category)}
                            className={cn(
                                "flex flex-col items-center gap-1.5 min-w-[64px] px-3 py-2 rounded-lg transition-all duration-200",
                                "border hover:shadow-md group/item",
                                isSelected
                                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                                    : "border-border/50 bg-card/80 hover:bg-accent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className={cn(
                                "relative w-10 h-10 rounded-full flex items-center justify-center transition-all",
                                "group-hover/item:scale-105",
                                isSelected
                                    ? "bg-primary text-white"
                                    : "bg-muted group-hover/item:bg-primary/20"
                            )}>
                                <Icon className="w-5 h-5" />
                                {count > 0 && (
                                    <span className={cn(
                                        "absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center",
                                        isSelected
                                            ? "bg-white text-primary"
                                            : "bg-primary text-white"
                                    )}>
                                        {count}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-medium whitespace-nowrap">{category}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
