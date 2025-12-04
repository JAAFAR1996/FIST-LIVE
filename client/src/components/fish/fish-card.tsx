import { FishSpecies } from "@/data/freshwater-fish";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplets, Thermometer, Heart, Fish, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FishCardProps {
  fish: FishSpecies;
  onClick?: () => void;
  isSelected?: boolean;
  showCompatibility?: boolean;
  compatibilityStatus?: "compatible" | "warning" | "incompatible";
}

const temperamentColors = {
  peaceful: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  "semi-aggressive": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  aggressive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

const careLevelColors = {
  beginner: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  intermediate: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  advanced: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
};

const temperamentLabels = {
  peaceful: "سلمي",
  "semi-aggressive": "شبه عدواني",
  aggressive: "عدواني",
};

const careLevelLabels = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

export function FishCard({
  fish,
  onClick,
  isSelected,
  showCompatibility,
  compatibilityStatus,
}: FishCardProps) {
  return (
    <Card
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] overflow-hidden",
        isSelected && "ring-2 ring-primary shadow-lg scale-[1.02]",
        showCompatibility && compatibilityStatus === "incompatible" && "ring-2 ring-red-500 opacity-60"
      )}
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
        <img
          src={fish.image}
          alt={fish.arabicName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Corner badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {fish.schooling && (
            <Badge className="bg-blue-500/90 backdrop-blur-sm text-white border-0 shadow-lg">
              <Fish className="w-3 h-3 ml-1" />
              سرب {fish.minimumGroup}+
            </Badge>
          )}
          {showCompatibility && compatibilityStatus && (
            <Badge
              className={cn(
                "backdrop-blur-sm border-0 shadow-lg",
                compatibilityStatus === "compatible" && "bg-green-500/90 text-white",
                compatibilityStatus === "warning" && "bg-yellow-500/90 text-white",
                compatibilityStatus === "incompatible" && "bg-red-500/90 text-white"
              )}
            >
              <AlertCircle className="w-3 h-3 ml-1" />
              {compatibilityStatus === "compatible" && "متوافق"}
              {compatibilityStatus === "warning" && "تحذير"}
              {compatibilityStatus === "incompatible" && "غير متوافق"}
            </Badge>
          )}
        </div>

        {/* Size indicator */}
        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-bold">
          {fish.maxSize} سم
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Names */}
        <div>
          <h3 className="text-xl font-bold text-foreground mb-1 line-clamp-1">
            {fish.arabicName}
          </h3>
          <p className="text-sm text-muted-foreground italic line-clamp-1">
            {fish.scientificName}
          </p>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
            {fish.commonName}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {fish.description}
        </p>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1" title="درجة الحرارة">
            <Thermometer className="w-4 h-4 text-orange-500" />
            <span>{fish.waterParameters.tempMin}-{fish.waterParameters.tempMax}°س</span>
          </div>
          <div className="flex items-center gap-1" title="الحموضة">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span>pH {fish.waterParameters.phMin}-{fish.waterParameters.phMax}</span>
          </div>
          <div className="flex items-center gap-1" title="الحد الأدنى للحوض">
            <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>{fish.minTankSize}ل</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className={temperamentColors[fish.temperament]}>
            <Heart className="w-3 h-3 ml-1" />
            {temperamentLabels[fish.temperament]}
          </Badge>
          <Badge variant="outline" className={careLevelColors[fish.careLevel]}>
            {careLevelLabels[fish.careLevel]}
          </Badge>
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-lg" />
      </CardContent>
    </Card>
  );
}
