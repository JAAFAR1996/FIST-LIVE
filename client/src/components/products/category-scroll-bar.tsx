import { useRef, useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid, Fish, Waves, Heater, Sun, Gem, Droplets, Settings, Egg } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryScrollBarProps {
    categories: string[];
    selectedCategories: string[];
    onCategoryToggle: (category: string) => void;
    categoryCounts?: Map<string, number>;
}

// Organized category configuration - 2025 best practices
// Using aquarium-specific icons with professional gradient-inspired colors
interface CategoryConfig {
    label: string;
    icon: React.ElementType;
    includes: string[];
    color: string;
    hoverColor: string;
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
    "طعام": {
        label: "طعام",
        icon: Fish,
        includes: ["fish-food", "طعام الأسماك"],
        color: "text-amber-500",
        hoverColor: "group-hover:text-amber-400"
    },
    "فلترة": {
        label: "فلترة",
        icon: Waves,
        includes: ["filters", "filtration", "الفلترة والتنقية", "التهوية والأكسجين"],
        color: "text-sky-500",
        hoverColor: "group-hover:text-sky-400"
    },
    "تدفئة": {
        label: "تدفئة",
        icon: Heater,
        includes: ["heaters", "heating", "التحكم بالحرارة"],
        color: "text-rose-500",
        hoverColor: "group-hover:text-rose-400"
    },
    "إضاءة": {
        label: "إضاءة",
        icon: Sun,
        includes: ["lighting", "الإضاءة"],
        color: "text-yellow-400",
        hoverColor: "group-hover:text-yellow-300"
    },
    "ديكور": {
        label: "ديكور",
        icon: Gem,
        includes: ["decoration", "خلفيات أحواض", "صخور", "substrate", "التربة والديكور", "التربية والديكور"],
        color: "text-violet-500",
        hoverColor: "group-hover:text-violet-400"
    },
    "رعاية المياه": {
        label: "رعاية المياه",
        icon: Droplets,
        includes: ["water-treatment", "monitoring", "معالجة المياه", "الفحص والمراقبة"],
        color: "text-cyan-400",
        hoverColor: "group-hover:text-cyan-300"
    },
    "صيانة": {
        label: "صيانة",
        icon: Settings,
        includes: ["maintenance", "accessories", "الصيانة والتنظيف", "ملحقات ومستلزمات"],
        color: "text-slate-400",
        hoverColor: "group-hover:text-slate-300"
    },
    "تربية": {
        label: "تربية",
        icon: Egg,
        includes: ["breeding", "التفريخ والعزل"],
        color: "text-pink-400",
        hoverColor: "group-hover:text-pink-300"
    }
};

// Order of categories to display
const CATEGORY_ORDER = ["طعام", "فلترة", "تدفئة", "إضاءة", "ديكور", "رعاية المياه", "صيانة", "تربية"];

export function CategoryScrollBar({
    categories,
    selectedCategories,
    onCategoryToggle,
    categoryCounts,
}: CategoryScrollBarProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(false);

    // Group raw categories into organized groups
    const organizedCategories = useMemo(() => {
        const result: { key: string; config: CategoryConfig; rawCategories: string[]; totalCount: number }[] = [];

        for (const categoryKey of CATEGORY_ORDER) {
            const config = CATEGORY_CONFIG[categoryKey];
            if (!config) continue;

            // Find which raw categories from the API match this group
            const matchingRaw = categories.filter(cat =>
                config.includes.some(inc =>
                    cat.toLowerCase() === inc.toLowerCase() || cat === inc
                )
            );

            if (matchingRaw.length > 0) {
                // Calculate total count for this group
                let totalCount = 0;
                if (categoryCounts) {
                    matchingRaw.forEach(cat => {
                        totalCount += categoryCounts.get(cat) || 0;
                    });
                }

                result.push({
                    key: categoryKey,
                    config,
                    rawCategories: matchingRaw,
                    totalCount
                });
            }
        }

        return result;
    }, [categories, categoryCounts]);

    // Check if any raw category in a group is selected
    const isGroupSelected = (rawCategories: string[]) => {
        return rawCategories.some(cat => selectedCategories.includes(cat));
    };

    // Toggle all categories in a group
    const toggleGroup = (rawCategories: string[]) => {
        const anySelected = isGroupSelected(rawCategories);

        if (anySelected) {
            // Deselect all in group
            rawCategories.forEach(cat => {
                if (selectedCategories.includes(cat)) {
                    onCategoryToggle(cat);
                }
            });
        } else {
            // Select all in group
            rawCategories.forEach(cat => {
                if (!selectedCategories.includes(cat)) {
                    onCategoryToggle(cat);
                }
            });
        }
    };

    // Check scroll position
    const checkScrollPosition = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
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
        const scrollAmount = 200;
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

    if (organizedCategories.length === 0) return null;

    return (
        <div className="relative bg-gradient-to-r from-background via-card/80 to-background backdrop-blur-md border-y border-border/30 shadow-sm">
            {/* Decorative gradient line at top */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            {/* Left Arrow */}
            {showLeftArrow && (
                <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center">
                    <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background via-background/90 to-transparent pointer-events-none" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm hover:bg-primary/10 hover:scale-110 shadow-lg border border-border/50 transition-all duration-300"
                        onClick={() => scroll('left')}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Right Arrow */}
            {showRightArrow && (
                <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center">
                    <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background via-background/90 to-transparent pointer-events-none" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm hover:bg-primary/10 hover:scale-110 shadow-lg border border-border/50 transition-all duration-300"
                        onClick={() => scroll('right')}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Scrollable Categories */}
            <div
                ref={scrollRef}
                className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-4 px-6"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {/* All Categories Option - Premium Design */}
                <button
                    onClick={() => {
                        selectedCategories.forEach(cat => onCategoryToggle(cat));
                    }}
                    className={cn(
                        "relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl transition-all duration-300 whitespace-nowrap",
                        "text-sm font-semibold group overflow-hidden",
                        selectedCategories.length === 0
                            ? "bg-gradient-to-r from-primary via-cyan-500 to-primary text-white shadow-lg shadow-primary/30 scale-105"
                            : "bg-background/60 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 hover:scale-[1.02] hover:shadow-md"
                    )}
                >
                    {/* Animated gradient overlay for selected state */}
                    {selectedCategories.length === 0 && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
                    )}
                    <LayoutGrid className={cn(
                        "w-4.5 h-4.5 transition-all duration-300",
                        selectedCategories.length === 0 ? "text-white" : "text-primary group-hover:scale-110"
                    )} />
                    <span>الكل</span>
                </button>

                {/* Elegant Divider */}
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-border to-transparent mx-1" />

                {/* Organized Category Groups - Premium Cards */}
                {organizedCategories.map(({ key, config, rawCategories, totalCount }) => {
                    const Icon = config.icon;
                    const isSelected = isGroupSelected(rawCategories);

                    return (
                        <button
                            key={key}
                            onClick={() => toggleGroup(rawCategories)}
                            className={cn(
                                "relative flex items-center gap-2.5 px-4 py-2.5 rounded-2xl transition-all duration-300 whitespace-nowrap",
                                "text-sm font-medium group overflow-hidden",
                                isSelected
                                    ? "bg-gradient-to-r from-primary/90 to-cyan-500/90 text-white shadow-lg shadow-primary/25 scale-[1.03]"
                                    : "bg-background/60 backdrop-blur-sm border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-gradient-to-r hover:from-primary/5 hover:to-cyan-500/5 hover:scale-[1.02] hover:shadow-md"
                            )}
                        >
                            {/* Shimmer effect for selected */}
                            {isSelected && (
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full animate-shimmer" />
                            )}

                            {/* Icon with glow effect */}
                            <div className={cn(
                                "relative transition-all duration-300",
                                !isSelected && "group-hover:scale-110"
                            )}>
                                <Icon className={cn(
                                    "w-4 h-4 transition-all duration-300",
                                    isSelected ? "text-white drop-shadow-sm" : config.color
                                )} />
                                {/* Subtle glow behind icon */}
                                {!isSelected && (
                                    <div className={cn(
                                        "absolute inset-0 blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300",
                                        config.color
                                    )} />
                                )}
                            </div>

                            <span className="relative">{config.label}</span>

                            {/* Badge with premium styling */}
                            {totalCount > 0 && (
                                <span className={cn(
                                    "text-[10px] px-2 py-0.5 rounded-full font-medium transition-all duration-300",
                                    isSelected
                                        ? "bg-white/25 text-white backdrop-blur-sm"
                                        : "bg-muted/80 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                )}>
                                    {totalCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Decorative gradient line at bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
    );
}
