import { FishSpecies } from "@/data/freshwater-fish";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Thermometer,
  Droplets,
  Heart,
  Fish,
  Clock,
  Ruler,
  ShieldCheck,
  Utensils,
  Baby,
  Lightbulb,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface FishDetailModalProps {
  fish: FishSpecies | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

const categoryLabels = {
  community: "مجتمع",
  cichlid: "سيكلد",
  catfish: "سمك القراميط",
  tetra: "تترا",
  livebearer: "ولود",
  betta: "بيتا",
  gourami: "جورامي",
  goldfish: "ذهبية",
  other: "أخرى",
};

const hardnessLabels = {
  soft: "ناعمة",
  medium: "متوسطة",
  hard: "صلبة",
};

export function FishDetailModal({ fish, open, onOpenChange }: FishDetailModalProps) {
  if (!fish) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 relative" onPointerDownOutside={() => onOpenChange(false)}>
        <ScrollArea className="h-full max-h-[90vh]">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold">{fish.arabicName}</DialogTitle>
            </DialogHeader>

            {/* Hero Image */}
            <div className="relative h-80 w-full rounded-xl overflow-hidden my-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
              <img
                src={fish.image}
                alt={fish.arabicName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 right-4 flex flex-wrap gap-2">
                <Badge className="bg-primary text-white">
                  {categoryLabels[fish.category]}
                </Badge>
                {fish.schooling && (
                  <Badge className="bg-blue-500 text-white">
                    <Fish className="w-3 h-3 ml-1" />
                    سرب {fish.minimumGroup}+
                  </Badge>
                )}
              </div>
            </div>

            {/* Names Section */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground font-medium">الاسم العلمي:</span>
                <span className="text-lg italic">{fish.scientificName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground font-medium">الاسم الإنجليزي:</span>
                <span>{fish.commonName}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground font-medium">العائلة:</span>
                <span>{fish.family}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground font-medium">الموطن الأصلي:</span>
                <span>{fish.origin}</span>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Fish className="w-5 h-5 text-primary" />
                نبذة عن السمكة
              </h3>
              <p className="text-muted-foreground leading-relaxed">{fish.description}</p>
            </div>

            <Separator className="my-6" />

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card border rounded-lg p-4 text-center">
                <Ruler className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">الحجم</p>
                <p className="font-bold">{fish.minSize}-{fish.maxSize} سم</p>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <Clock className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">العمر</p>
                <p className="font-bold">{fish.lifespan} سنوات</p>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">الطباع</p>
                <p className="font-bold text-sm">{temperamentLabels[fish.temperament]}</p>
              </div>
              <div className="bg-card border rounded-lg p-4 text-center">
                <ShieldCheck className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">مستوى الرعاية</p>
                <p className="font-bold text-sm">{careLevelLabels[fish.careLevel]}</p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Water Parameters */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Droplets className="w-5 h-5 text-primary" />
                معايير المياه
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="w-5 h-5 text-orange-500" />
                    <span className="font-bold">درجة الحرارة</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {fish.waterParameters.tempMin}°س - {fish.waterParameters.tempMax}°س
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-5 h-5 text-blue-500" />
                    <span className="font-bold">الحموضة (pH)</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {fish.waterParameters.phMin} - {fish.waterParameters.phMax}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="font-bold">حجم الحوض الأدنى</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {fish.minTankSize} لتر
                  </p>
                </div>
                <div className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-950 dark:to-teal-950 border border-cyan-200 dark:border-cyan-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-5 h-5 text-cyan-500" />
                    <span className="font-bold">صلابة المياه</span>
                  </div>
                  <p className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                    {hardnessLabels[fish.waterParameters.hardness]}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Diet */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-primary" />
                النظام الغذائي
              </h3>
              <div className="flex flex-wrap gap-2">
                {fish.diet.map((food, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {food}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            {/* Breeding */}
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Baby className="w-5 h-5 text-primary" />
                التكاثر
              </h3>
              <p className="text-muted-foreground leading-relaxed">{fish.breeding}</p>
            </div>

            <Separator className="my-6" />

            {/* Compatibility */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  متوافق مع
                </h3>
                <div className="space-y-2">
                  {fish.compatibility.goodWith.map((species, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3"
                    >
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{species}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-500" />
                  تجنب مع
                </h3>
                <div className="space-y-2">
                  {fish.compatibility.avoidWith.map((species, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3"
                    >
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <span className="text-sm">{species}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Care Tips */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                نصائح العناية
              </h3>
              <div className="grid gap-3">
                {fish.careTips.map((tip, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4"
                  >
                    <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
