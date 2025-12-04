import { useState, useRef } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { FishCard } from "@/components/fish/fish-card";
import { FishDetailModal } from "@/components/fish/fish-detail-modal";
import { freshwaterFish, FishSpecies } from "@/data/freshwater-fish";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  Camera,
  Image as ImageIcon,
  Sparkles,
  Info,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import { WaveScrollEffect } from "@/components/effects/wave-scroll-effect";
import { cn } from "@/lib/utils";

interface IdentificationResult {
  fish: FishSpecies;
  confidence: number;
  similarSpecies: FishSpecies[];
}

export default function FishIdentifier() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isIdentifying, setIsIdentifying] = useState(false);
  const [result, setResult] = useState<IdentificationResult | null>(null);
  const [detailFish, setDetailFish] = useState<FishSpecies | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentify = async () => {
    if (!selectedImage) return;

    setIsIdentifying(true);

    // Simulate AI identification (in production, this would call an API like Fishial.AI or Nyckel)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock result - in production this would be the API response
    const randomFish = freshwaterFish[Math.floor(Math.random() * freshwaterFish.length)];
    const confidence = 75 + Math.random() * 20; // 75-95%

    // Find similar species (by category)
    const similarSpecies = freshwaterFish
      .filter(f => f.id !== randomFish.id && f.category === randomFish.category)
      .slice(0, 3);

    setResult({
      fish: randomFish,
      confidence,
      similarSpecies,
    });
    setIsIdentifying(false);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleFishClick = (fish: FishSpecies) => {
    setDetailFish(fish);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 dark:from-purple-900 dark:via-pink-900 dark:to-rose-900 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 rounded-full mb-6">
              <Sparkles className="h-5 w-5" />
              <span className="font-bold">تقنية الذكاء الاصطناعي</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
              تعرّف على أسماكك
            </h1>
            <p className="text-xl text-purple-100">
              ارفع صورة واحصل على تحديد فوري لنوع السمكة مع معلومات شاملة عن الرعاية
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload Area */}
          <div className="space-y-6">
            <WaveScrollEffect>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    ارفع صورة السمكة
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!selectedImage ? (
                    <>
                      {/* Upload Area */}
                      <div
                        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center hover:border-primary/50 hover:bg-primary/5 transition-colors cursor-pointer group"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                        <p className="text-lg font-medium mb-2">اسحب وأفلت الصورة هنا</p>
                        <p className="text-sm text-muted-foreground mb-4">أو انقر للتصفح</p>
                        <Badge variant="secondary">JPG, PNG, WEBP حتى 10MB</Badge>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">أو</span>
                        </div>
                      </div>

                      {/* Camera Button */}
                      <Button
                        variant="outline"
                        className="w-full h-14"
                        onClick={() => cameraInputRef.current?.click()}
                      >
                        <Camera className="w-5 h-5 ml-2" />
                        التقط صورة بالكاميرا
                      </Button>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageSelect}
                      />
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleImageSelect}
                      />
                    </>
                  ) : (
                    <>
                      {/* Preview */}
                      <div className="relative rounded-lg overflow-hidden bg-muted">
                        <img
                          src={selectedImage}
                          alt="Selected fish"
                          className="w-full h-auto"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 left-2"
                          onClick={handleReset}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {!result && (
                        <Button
                          className="w-full h-14 text-lg"
                          onClick={handleIdentify}
                          disabled={isIdentifying}
                        >
                          {isIdentifying ? (
                            <>
                              <Sparkles className="w-5 h-5 ml-2 animate-spin" />
                              جاري التحليل...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5 ml-2" />
                              تحديد السمكة
                            </>
                          )}
                        </Button>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </WaveScrollEffect>

            {/* Info Card */}
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-300">
                  <Info className="w-5 h-5" />
                  نصائح للحصول على أفضل النتائج
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>التقط صورة واضحة للسمكة من الجانب</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>تأكد من الإضاءة الجيدة</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>اجعل السمكة في مركز الصورة</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>تجنب الصور المشوشة أو البعيدة جداً</span>
                </div>
              </CardContent>
            </Card>

            {/* API Integration Info */}
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertDescription className="text-sm">
                <strong>ملاحظة للمطورين:</strong> هذه نسخة تجريبية. للإنتاج، يمكنك ربط
                <a href="https://fishial.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mx-1">
                  Fishial.AI
                </a>
                أو
                <a href="https://www.nyckel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline mx-1">
                  Nyckel
                </a>
                لتحديد دقيق بالذكاء الاصطناعي.
              </AlertDescription>
            </Alert>
          </div>

          {/* Right Panel - Results */}
          <div className="space-y-6">
            {isIdentifying && (
              <WaveScrollEffect>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                      جاري التحليل...
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">تحليل الصورة</p>
                      <Progress value={33} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">مقارنة مع قاعدة البيانات</p>
                      <Progress value={66} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">التحقق من النتائج</p>
                      <Progress value={90} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </WaveScrollEffect>
            )}

            {result && (
              <>
                {/* Main Result */}
                <WaveScrollEffect>
                  <Card className="border-primary shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          تم التحديد بنجاح!
                        </span>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-lg px-4 py-1",
                            result.confidence >= 90 ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                            result.confidence >= 75 ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                            "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                          )}
                        >
                          {result.confidence.toFixed(0)}% ثقة
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="cursor-pointer"
                        onClick={() => handleFishClick(result.fish)}
                      >
                        <FishCard fish={result.fish} />
                      </div>
                      <Button
                        className="w-full mt-4"
                        variant="outline"
                        onClick={() => handleFishClick(result.fish)}
                      >
                        عرض التفاصيل الكاملة
                      </Button>
                    </CardContent>
                  </Card>
                </WaveScrollEffect>

                {/* Confidence Alert */}
                {result.confidence < 75 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      نسبة الثقة منخفضة. قد لا يكون التحديد دقيقاً. جرب صورة أوضح أو تحقق من الأنواع المشابهة أدناه.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Similar Species */}
                {result.similarSpecies.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-primary" />
                        أنواع مشابهة
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        قد تكون سمكتك واحدة من هذه الأنواع أيضاً
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {result.similarSpecies.map(fish => (
                          <div
                            key={fish.id}
                            className="cursor-pointer"
                            onClick={() => handleFishClick(fish)}
                          >
                            <FishCard fish={fish} />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {!selectedImage && !result && (
              <Card className="border-muted">
                <CardContent className="py-20 text-center">
                  <ImageIcon className="w-20 h-20 mx-auto mb-4 text-muted-foreground/20" />
                  <p className="text-lg font-medium text-muted-foreground mb-2">
                    ارفع صورة للبدء
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ستظهر النتائج هنا بعد التحليل
                  </p>
                </CardContent>
              </Card>
            )}
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
