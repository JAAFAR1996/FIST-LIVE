import { useState, useMemo } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { FishCard } from "@/components/fish/fish-card";
import { FishDetailModal } from "@/components/fish/fish-detail-modal";
import { FishCompatibilityBadge } from "@/components/fish/fish-compatibility-badge";
import { freshwaterFish, FishSpecies, checkCompatibility, getWaterParameterRange } from "@/data/freshwater-fish";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Fish,
  Droplets,
  Thermometer,
  AlertTriangle,
  CheckCircle,
  ShoppingCart,
  Trash2,
  Info,
  Beaker,
  Filter,
  Gauge,
} from "lucide-react";
import { WaveScrollEffect } from "@/components/effects/wave-scroll-effect";

export default function FishFinderAdvanced() {
  const [tankSize, setTankSize] = useState<number>(100);
  const [fishCounts, setFishCounts] = useState<Record<string, number>>({});
  const [detailFish, setDetailFish] = useState<FishSpecies | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get array of selected fish IDs (with duplicates for quantities)
  const selectedFish = useMemo(() => {
    const result: string[] = [];
    Object.entries(fishCounts).forEach(([fishId, count]) => {
      for (let i = 0; i < count; i++) {
        result.push(fishId);
      }
    });
    return result;
  }, [fishCounts]);

  // Calculate compatibility and parameters
  const analysis = useMemo(() => {
    if (selectedFish.length === 0) {
      return {
        isValid: true,
        issues: [],
        waterParams: null,
        totalBioload: 0,
        stockingLevel: 0,
        equipment: [],
      };
    }

    const uniqueFishIds = Object.keys(fishCounts).filter(id => fishCounts[id] > 0);
    const fishes = uniqueFishIds.map(id => freshwaterFish.find(f => f.id === id)!).filter(Boolean);
    const issues: string[] = [];

    // Check tank size
    const maxRequiredTank = Math.max(...fishes.map(f => f.minTankSize));
    if (tankSize < maxRequiredTank) {
      issues.push(`الحوض صغير جداً! تحتاج إلى حوض ${maxRequiredTank} لتر على الأقل`);
    }

    // Check compatibility between all pairs
    for (let i = 0; i < uniqueFishIds.length; i++) {
      for (let j = i + 1; j < uniqueFishIds.length; j++) {
        const compatible = checkCompatibility(uniqueFishIds[i], uniqueFishIds[j]);
        if (!compatible) {
          const fish1 = fishes[i];
          const fish2 = fishes[j];
          issues.push(`تحذير: ${fish1.arabicName} و ${fish2.arabicName} قد لا يتوافقان`);
        }
      }
    }

    // Check schooling requirements
    fishes.forEach(fish => {
      if (fish.schooling) {
        const count = fishCounts[fish.id] || 0;
        if (count < fish.minimumGroup) {
          issues.push(`${fish.arabicName} يحتاج لمجموعة من ${fish.minimumGroup} أسماك على الأقل (لديك ${count})`);
        }
      }
    });

    // Calculate water parameters
    const waterParams = getWaterParameterRange(uniqueFishIds);
    if (waterParams.tempMin > waterParams.tempMax) {
      issues.push("تحذير: متطلبات درجة الحرارة غير متوافقة");
    }
    if (waterParams.phMin > waterParams.phMax) {
      issues.push("تحذير: متطلبات الحموضة غير متوافقة");
    }

    // Calculate bioload (simplified: sum of max sizes * count)
    const totalBioload = fishes.reduce((sum, fish) => sum + (fish.maxSize * (fishCounts[fish.id] || 0)), 0);
    const stockingLevel = (totalBioload / tankSize) * 100;

    // Equipment recommendations
    const equipment: string[] = [];
    if (tankSize > 0) {
      const filterFlow = Math.ceil(tankSize * 5); // 5x turnover rate
      equipment.push(`فلتر بتدفق ${filterFlow} لتر/ساعة`);

      const heaterWattage = Math.ceil(tankSize / 4); // 1W per 4L
      equipment.push(`سخان ${heaterWattage} واط`);

      equipment.push("مجموعة اختبار المياه (pH, NH3, NO2, NO3)");
      equipment.push("مزيل كلور (مكيف مياه)");

      if (stockingLevel > 70) {
        equipment.push("مضخة هواء إضافية للأكسجين");
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      waterParams: waterParams.tempMin <= waterParams.tempMax ? waterParams : null,
      totalBioload,
      stockingLevel,
      equipment,
    };
  }, [fishCounts, tankSize, selectedFish.length]);

  const addFish = (fishId: string) => {
    setFishCounts(prev => ({
      ...prev,
      [fishId]: (prev[fishId] || 0) + 1
    }));
  };

  const removeFish = (fishId: string) => {
    setFishCounts(prev => {
      const newCount = (prev[fishId] || 0) - 1;
      if (newCount <= 0) {
        const { [fishId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [fishId]: newCount };
    });
  };

  const handleFishClick = (fish: FishSpecies) => {
    setDetailFish(fish);
    setIsModalOpen(true);
  };

  const getTotalFishCount = () => {
    return Object.values(fishCounts).reduce((sum, count) => sum + count, 0);
  };

  const getStockingLevelColor = (level: number) => {
    if (level < 50) return "text-green-600";
    if (level < 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getStockingLevelLabel = (level: number) => {
    if (level < 50) return "مثالي";
    if (level < 80) return "مقبول";
    return "مكتظ جداً";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 rounded-full mb-6">
              <Fish className="h-5 w-5" />
              <span className="font-bold">أداة التوافق المتقدمة</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
              مخطط الحوض الذكي
            </h1>
            <p className="text-xl text-emerald-100">
              اختر أسماكك واحصل على تحليل شامل للتوافق ومتطلبات المياه والمعدات اللازمة
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Panel - Tank Setup & Results */}
          <div className="lg:col-span-1 space-y-6">
            {/* Tank Size Selector */}
            <WaveScrollEffect>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    حجم الحوض
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Select value={tankSize.toString()} onValueChange={(v) => setTankSize(parseInt(v))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="40">40 لتر (نانو)</SelectItem>
                      <SelectItem value="60">60 لتر (صغير)</SelectItem>
                      <SelectItem value="80">80 لتر</SelectItem>
                      <SelectItem value="100">100 لتر</SelectItem>
                      <SelectItem value="150">150 لتر (متوسط)</SelectItem>
                      <SelectItem value="200">200 لتر</SelectItem>
                      <SelectItem value="300">300 لتر (كبير)</SelectItem>
                      <SelectItem value="500">500 لتر (ضخم)</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-center p-6 bg-primary/10 rounded-lg">
                    <p className="text-4xl font-bold text-primary">{tankSize}</p>
                    <p className="text-sm text-muted-foreground">لتر</p>
                  </div>
                </CardContent>
              </Card>
            </WaveScrollEffect>

            {/* Selected Fish */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Fish className="w-5 h-5 text-primary" />
                    الأسماك المختارة
                  </span>
                  <Badge variant="secondary">{getTotalFishCount()} سمكة</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {Object.keys(fishCounts).length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    اختر الأسماك من القائمة أدناه
                  </p>
                ) : (
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {Object.entries(fishCounts).map(([fishId, count]) => {
                        const fish = freshwaterFish.find(f => f.id === fishId);
                        if (!fish) return null;
                        return (
                          <div
                            key={fishId}
                            className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                          >
                            <img
                              src={fish.image}
                              alt={fish.arabicName}
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{fish.arabicName}</p>
                              <p className="text-xs text-muted-foreground">
                                {fish.maxSize} سم
                                {fish.schooling && <span className="text-primary mr-2">• سرب {fish.minimumGroup}+</span>}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => removeFish(fishId)}
                              >
                                -
                              </Button>
                              <span className="w-8 text-center font-bold">{count}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => addFish(fishId)}
                              >
                                +
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {selectedFish.length > 0 && (
              <WaveScrollEffect>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gauge className="w-5 h-5 text-primary" />
                      التحليل
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Stocking Level */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">مستوى التخزين</span>
                        <span className={`text-sm font-bold ${getStockingLevelColor(analysis.stockingLevel)}`}>
                          {getStockingLevelLabel(analysis.stockingLevel)}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${analysis.stockingLevel < 50
                            ? "bg-green-500"
                            : analysis.stockingLevel < 80
                              ? "bg-yellow-500"
                              : "bg-red-500"
                            }`}
                          style={{ width: `${Math.min(analysis.stockingLevel, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {analysis.totalBioload} سم من الأسماك / {tankSize}ل
                      </p>
                    </div>

                    <Separator />

                    {/* Water Parameters */}
                    {analysis.waterParams && (
                      <div className="space-y-3">
                        <h4 className="font-bold text-sm flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-blue-500" />
                          معايير المياه المطلوبة
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Thermometer className="w-4 h-4 text-orange-500" />
                              <span className="text-xs font-medium">الحرارة</span>
                            </div>
                            <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
                              {analysis.waterParams.tempMin}°-{analysis.waterParams.tempMax}°س
                            </p>
                          </div>
                          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-1">
                              <Beaker className="w-4 h-4 text-blue-500" />
                              <span className="text-xs font-medium">pH</span>
                            </div>
                            <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                              {analysis.waterParams.phMin.toFixed(1)}-{analysis.waterParams.phMax.toFixed(1)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Issues */}
                    {analysis.issues.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-2">
                          {analysis.issues.map((issue, index) => (
                            <Alert key={index} variant="destructive">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription className="text-sm">{issue}</AlertDescription>
                            </Alert>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Success Message */}
                    {analysis.isValid && (
                      <>
                        <Separator />
                        <Alert className="border-green-200 bg-green-50 dark:bg-green-950/30">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <AlertDescription className="text-sm text-green-800 dark:text-green-400">
                            تهانينا! اختيارك متوافق تماماً
                          </AlertDescription>
                        </Alert>
                      </>
                    )}
                  </CardContent>
                </Card>
              </WaveScrollEffect>
            )}

            {/* Equipment List */}
            {selectedFish.length > 0 && analysis.equipment.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    المعدات المطلوبة
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.equipment.map((item, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Fish Selection */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-primary" />
                  اختر الأسماك لحوضك
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  انقر لإضافة سمكة. للأسماك التي تعيش في مجموعات، أضف العدد المطلوب من اليسار.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {freshwaterFish.map(fish => (
                    <div key={fish.id} className="relative">
                      <FishCard
                        fish={fish}
                        onClick={() => addFish(fish.id)}
                        isSelected={(fishCounts[fish.id] || 0) > 0}
                      />
                      {(fishCounts[fish.id] || 0) > 0 && (
                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shadow-lg">
                          {fishCounts[fish.id]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <FishDetailModal
        fish={detailFish}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      <Footer />
    </div>
  );
}
