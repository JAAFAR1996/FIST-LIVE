import { useRef, useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight, Boxes, Utensils, Filter, Thermometer, Lightbulb, Palette, Droplets, Wrench, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryScrollBarProps {
    categories: string[];
    selectedCategories: string[];
    onCategoryToggle: (category: string) => void;
    categoryCounts?: Map<string, number>;
}

// Organized category configuration - 2025 best practices
interface CategoryConfig {
    label: string;
    icon: React.ElementType;
    includes: string[];
    color: string;
}

const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
    "طعام": {
        label: "طعام",
        icon: Utensils,
        includes: ["fish-food", "طعام الأسماك"],
        color: "text-orange-500"
    },
    "فلترة": {
        label: "فلترة",
        icon: Filter,
        includes: ["filters", "filtration"],
        color: "text-blue-500"
    },
    "تدفئة": {
        label: "تدفئة",
        icon: Thermometer,
        includes: ["heaters", "heating"],
        color: "text-red-500"
    },
    "إضاءة": {
        label: "إضاءة",
        icon: Lightbulb,
        includes: ["lighting"],
        color: "text-yellow-500"
    },
    "ديكور": {
        label: "ديكور",
        icon: Palette,
        includes: ["decoration", "خلفيات أحواض", "صخور", "substrate"],
        color: "text-purple-500"
    },
    "رعاية المياه": {
        label: "رعاية المياه",
        icon: Droplets,
        includes: ["water-treatment", "monitoring"],
        color: "text-cyan-500"
    },
    "صيانة": {
        label: "صيانة",
        icon: Wrench,
        includes: ["maintenance", "accessories"],
        color: "text-gray-500"
    },
    "تربية": {
        label: "تربية",
        icon: Heart,
        includes: ["breeding"],
        color: "text-pink-500"
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
        <div className="relative bg-card/50 backdrop-blur-sm border-y border-border/50">
            {/* Left Arrow */}
            {showLeftArrow && (
                <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center">
                    <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-card via-card/80 to-transparent pointer-events-none" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-8 w-8 rounded-full bg-background/80 hover:bg-background shadow-md"
                        onClick={() => scroll('left')}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Right Arrow */}
            {showRightArrow && (
                <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center">
                    <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-card via-card/80 to-transparent pointer-events-none" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-8 w-8 rounded-full bg-background/80 hover:bg-background shadow-md"
                        onClick={() => scroll('right')}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Scrollable Categories */}
            <div
                ref={scrollRef}
                className="flex items-center gap-1 overflow-x-auto scrollbar-hide py-3 px-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {/* All Categories Option */}
                <button
                    onClick={() => {
                        // Clear all categories selection
                        selectedCategories.forEach(cat => onCategoryToggle(cat));
                    }}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap",
                        "border text-sm font-medium",
                        selectedCategories.length === 0
                            ? "border-primary bg-primary text-white shadow-md"
                            : "border-border bg-background hover:bg-accent text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Boxes className="w-4 h-4" />
                    <span>الكل</span>
                </button>

                {/* Divider */}
                <div className="w-px h-6 bg-border mx-2" />

                {/* Organized Category Groups */}
                {organizedCategories.map(({ key, config, rawCategories, totalCount }) => {
                    const Icon = config.icon;
                    const isSelected = isGroupSelected(rawCategories);

                    return (
                        <button
                            key={key}
                            onClick={() => toggleGroup(rawCategories)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 whitespace-nowrap",
                                "border text-sm font-medium group",
                                isSelected
                                    ? "border-primary bg-primary text-white shadow-md"
                                    : "border-border bg-background hover:bg-accent text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Icon className={cn(
                                "w-4 h-4 transition-colors",
                                isSelected ? "text-white" : config.color
                            )} />
                            <span>{config.label}</span>
                            {totalCount > 0 && (
                                <span className={cn(
                                    "text-xs px-1.5 py-0.5 rounded-full",
                                    isSelected
                                        ? "bg-white/20 text-white"
                                        : "bg-muted text-muted-foreground"
                                )}>
                                    {totalCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
