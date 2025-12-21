import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { X, SlidersHorizontal, Sparkles, Tag, Layers, Star, Leaf, Zap } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface FilterState {
  priceRange: [number, number];
  categories: string[];
  brands: string[];
  difficulties: string[];
  tags: string[];
}

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableCategories: string[];
  availableBrands: string[];
  maxPrice: number;
  activeFiltersCount: number;
}

// Chip component for filter options
function FilterChip({
  label,
  selected,
  onClick,
  icon: Icon,
  color = "default"
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: React.ElementType;
  color?: "default" | "green" | "blue" | "orange" | "purple";
}) {
  const colorClasses = {
    default: selected
      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
      : "bg-card hover:bg-accent border-border hover:border-primary/50",
    green: selected
      ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/25"
      : "bg-card hover:bg-emerald-50 dark:hover:bg-emerald-950/30 border-border hover:border-emerald-400",
    blue: selected
      ? "bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/25"
      : "bg-card hover:bg-blue-50 dark:hover:bg-blue-950/30 border-border hover:border-blue-400",
    orange: selected
      ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/25"
      : "bg-card hover:bg-orange-50 dark:hover:bg-orange-950/30 border-border hover:border-orange-400",
    purple: selected
      ? "bg-purple-500 text-white border-purple-500 shadow-lg shadow-purple-500/25"
      : "bg-card hover:bg-purple-50 dark:hover:bg-purple-950/30 border-border hover:border-purple-400",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-200",
        "hover:scale-105 active:scale-95",
        colorClasses[color]
      )}
    >
      {Icon && <Icon className="w-3.5 h-3.5" />}
      {label}
      {selected && <X className="w-3 h-3 ml-0.5" />}
    </button>
  );
}

// Section header
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  );
}

export function ProductFilters({
  filters,
  onFilterChange,
  availableCategories,
  availableBrands,
  maxPrice,
  activeFiltersCount,
}: ProductFiltersProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const difficulties = [
    { label: "مبتدئ", value: "مبتدئ", color: "green" as const },
    { label: "متوسط", value: "متوسط", color: "orange" as const },
    { label: "متقدم", value: "متقدم", color: "purple" as const },
  ];

  const tags = [
    { label: "جديد", value: "جديد", icon: Sparkles, color: "blue" as const },
    { label: "الأكثر مبيعاً", value: "الأكثر مبيعاً", icon: Star, color: "orange" as const },
    { label: "صديق للبيئة", value: "صديق للبيئة", icon: Leaf, color: "green" as const },
  ];

  // Handlers
  const handlePriceChange = (value: number[]) => {
    setLocalFilters(prev => ({ ...prev, priceRange: [value[0], value[1]] as [number, number] }));
  };

  const handlePriceCommit = (value: number[]) => {
    const newFilters = { ...localFilters, priceRange: [value[0], value[1]] as [number, number] };
    onFilterChange(newFilters);
  };

  const toggleFilter = (type: keyof FilterState, value: string) => {
    const current = localFilters[type] as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    const newFilters = { ...localFilters, [type]: updated };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearAll = () => {
    const clearedFilters: FilterState = {
      priceRange: [0, maxPrice],
      categories: [],
      brands: [],
      difficulties: [],
      tags: [],
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="font-bold text-primary">{activeFiltersCount} فلتر نشط</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            مسح الكل
          </Button>
        </div>
      )}

      {/* Price Range - Modern Slider */}
      <FilterSection title="💰 السعر">
        <div className="space-y-4">
          <div className="px-1">
            <Slider
              min={0}
              max={maxPrice}
              step={Math.max(1000, Math.floor(maxPrice / 100))}
              value={localFilters.priceRange}
              onValueChange={handlePriceChange}
              onValueCommit={handlePriceCommit}
              className="w-full"
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 px-4 py-2 rounded-xl">
              <span className="text-xs text-muted-foreground">من</span>
              <span className="font-bold text-primary mr-1">{localFilters.priceRange[0].toLocaleString()}</span>
              <span className="text-xs">د.ع</span>
            </div>
            <div className="h-px w-4 bg-border" />
            <div className="bg-gradient-to-l from-primary/10 to-primary/5 px-4 py-2 rounded-xl">
              <span className="text-xs text-muted-foreground">إلى</span>
              <span className="font-bold text-primary mr-1">{localFilters.priceRange[1].toLocaleString()}</span>
              <span className="text-xs">د.ع</span>
            </div>
          </div>
        </div>
      </FilterSection>

      {/* Tags - Quick Filters */}
      <FilterSection title="⚡ سريع">
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <FilterChip
              key={tag.value}
              label={tag.label}
              icon={tag.icon}
              color={tag.color}
              selected={localFilters.tags.includes(tag.value)}
              onClick={() => toggleFilter("tags", tag.value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Categories */}
      {availableCategories.length > 0 && (
        <FilterSection title="📦 الفئات">
          <div className="flex flex-wrap gap-2">
            {availableCategories.map((category) => (
              <FilterChip
                key={category}
                label={category}
                icon={Layers}
                selected={localFilters.categories.includes(category)}
                onClick={() => toggleFilter("categories", category)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Brands */}
      {availableBrands.length > 0 && (
        <FilterSection title="🏷️ العلامات التجارية">
          <div className="flex flex-wrap gap-2 max-h-[150px] overflow-y-auto custom-scrollbar p-1">
            {availableBrands.map((brand) => (
              <FilterChip
                key={brand}
                label={brand}
                icon={Tag}
                selected={localFilters.brands.includes(brand)}
                onClick={() => toggleFilter("brands", brand)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Difficulty */}
      <FilterSection title="📊 مستوى الخبرة">
        <div className="flex flex-wrap gap-2">
          {difficulties.map((diff) => (
            <FilterChip
              key={diff.value}
              label={diff.label}
              color={diff.color}
              selected={localFilters.difficulties.includes(diff.value)}
              onClick={() => toggleFilter("difficulties", diff.value)}
            />
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      {/* Desktop Filters - Clean Sidebar */}
      <div className="hidden lg:block sticky top-24">
        <div className="p-5 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <SlidersHorizontal className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-lg">تصفية المنتجات</h2>
              <p className="text-xs text-muted-foreground">اختر ما يناسبك</p>
            </div>
          </div>
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filters - Bottom Sheet */}
      <div className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              size="lg"
              className="shadow-2xl rounded-full px-6 bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
            >
              <SlidersHorizontal className="w-5 h-5 ml-2" />
              الفلاتر
              {activeFiltersCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-white text-primary border-2 border-primary">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
            <SheetHeader className="pb-4 border-b">
              <div className="flex items-center justify-between">
                <SheetTitle className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  تصفية المنتجات
                </SheetTitle>
                <SheetClose asChild>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <X className="w-5 h-5" />
                  </Button>
                </SheetClose>
              </div>
            </SheetHeader>
            <div className="mt-6 overflow-y-auto h-[calc(100%-80px)] pb-20">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
