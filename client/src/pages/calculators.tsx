import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { Thermometer, Droplets, Waves, Wrench, Clock, Info } from "lucide-react";

export default function Calculators() {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-slate-900">حاسبات أحواض الأسماك</h1>
            <p className="text-xl text-slate-500">أدوات دقيقة لمساعدتك في الحفاظ على بيئة مثالية لأسماكك</p>
          </div>

          <Tabs defaultValue="heater" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 bg-slate-100 rounded-xl">
              <TabsTrigger value="heater" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 text-lg rounded-lg">
                <Thermometer className="h-5 w-5 ml-2" />
                حاسبة السخان
              </TabsTrigger>
              <TabsTrigger value="filter" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 text-lg rounded-lg">
                <Droplets className="h-5 w-5 ml-2" />
                حاسبة الفلترة
              </TabsTrigger>
              <TabsTrigger value="salt" className="data-[state=active]:bg-white data-[state=active]:shadow-sm py-3 text-lg rounded-lg">
                <Waves className="h-5 w-5 ml-2" />
                حاسبة الملوحة
              </TabsTrigger>
            </TabsList>

            <TabsContent value="heater" className="mt-8">
              <HeaterCalculator />
            </TabsContent>
            <TabsContent value="filter" className="mt-8">
              <FilterCalculator />
            </TabsContent>
            <TabsContent value="salt" className="mt-8">
              <SaltCalculator />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function HeaterCalculator() {
  const [volume, setVolume] = useState("");
  const [tempDiff, setTempDiff] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const v = parseFloat(volume);
    const t = parseFloat(tempDiff);
    if (v && t) {
      // Basic rule of thumb: 1 watt per liter for up to 5C diff, more for higher
      // This is a simplified calculation
      setResult(v * (t / 5)); 
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>حاسبة قوة السخان</CardTitle>
        <CardDescription>احسب القوة المناسبة (واط) لسخان حوضك بناءً على الحجم وفرق درجة الحرارة.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>حجم الحوض (لتر)</Label>
            <Input type="number" placeholder="مثال: 100" value={volume} onChange={(e) => setVolume(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>فرق درجة الحرارة المطلوب (C°)</Label>
            <Select onValueChange={setTempDiff}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الفرق" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 درجات (غرفة دافئة)</SelectItem>
                <SelectItem value="10">10 درجات (غرفة باردة)</SelectItem>
                <SelectItem value="15">15 درجة (غرفة باردة جداً)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button onClick={calculate} className="w-full text-lg h-12">احسب النتيجة</Button>

        {result && (
          <div className="mt-6 p-6 bg-slate-50 rounded-xl text-center animate-in fade-in slide-in-from-top-2">
            <p className="text-slate-500 mb-2">القوة المقترحة</p>
            <p className="text-4xl font-bold text-primary">{Math.ceil(result / 50) * 50} واط</p>
            <p className="text-sm text-slate-400 mt-2">* نقترح استخدام سخانين بقوة {Math.ceil(result / 100) * 50} واط للأمان</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function FilterCalculator() {
  const [volume, setVolume] = useState("");
  const [fishType, setFishType] = useState("medium");
  const [result, setResult] = useState<{ min: number; max: number; recommended: number } | null>(null);

  const calculate = () => {
    const v = parseFloat(volume);
    if (v) {
      // Rule of thumb: filter should turn over 4-10x tank volume per hour
      // Depends on fish type and bioload
      let multiplier = 4;
      if (fishType === "light") multiplier = 4;
      else if (fishType === "medium") multiplier = 6;
      else if (fishType === "heavy") multiplier = 8;

      setResult({
        min: v * 4,
        max: v * 10,
        recommended: v * multiplier,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-6 w-6 text-primary" />
          حاسبة الفلترة
        </CardTitle>
        <CardDescription>احسب معدل التدفق المناسب للفلتر بناءً على حجم الحوض ونوع الأسماك</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>حجم الحوض (لتر)</Label>
            <Input
              type="number"
              placeholder="مثال: 200"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>كثافة الأسماك (Bioload)</Label>
            <Select value={fishType} onValueChange={setFishType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">خفيفة (أسماك صغيرة - نباتات كثيرة)</SelectItem>
                <SelectItem value="medium">متوسطة (حوض مجتمعي عادي)</SelectItem>
                <SelectItem value="heavy">كثيفة (أسماك كبيرة - حوض مزدحم)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Alert className="bg-blue-50 border-blue-200">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-sm text-blue-900">
            <strong>نصيحة:</strong> الفلتر الجيد يجب أن يدور الماء 4-10 مرات في الساعة.
            للأسماك الكبيرة والمنتجة للفضلات، استخدم معدل أعلى.
          </AlertDescription>
        </Alert>

        <Button onClick={calculate} className="w-full text-lg h-12">
          احسب النتيجة
        </Button>

        {result && (
          <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="p-6 bg-primary/5 rounded-xl text-center border border-primary/20">
              <p className="text-muted-foreground mb-2">معدل التدفق الموصى به</p>
              <p className="text-4xl font-bold text-primary">{result.recommended} لتر/ساعة</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">الحد الأدنى</p>
                <p className="text-2xl font-semibold">{result.min} لتر/ساعة</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-sm text-muted-foreground mb-1">الحد الأقصى</p>
                <p className="text-2xl font-semibold">{result.max} لتر/ساعة</p>
              </div>
            </div>
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                اختر فلتر بمعدل تدفق {result.recommended} لتر/ساعة أو أعلى. إذا كان حوضك يحتوي على
                أسماك حساسة للتيار، يمكنك استخدام صمام تحكم في التدفق.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SaltCalculator() {
  const [volume, setVolume] = useState("");
  const [currentSalinity, setCurrentSalinity] = useState("");
  const [targetSalinity, setTargetSalinity] = useState("");
  const [tankType, setTankType] = useState("reef");
  const [result, setResult] = useState<{ saltAmount: number; instructions: string } | null>(null);

  const calculate = () => {
    const v = parseFloat(volume);
    const current = parseFloat(currentSalinity);
    const target = parseFloat(targetSalinity);

    if (v && target !== undefined && current !== undefined) {
      // Salinity calculation: approximately 35g of salt per liter increases salinity by 1 ppt
      const difference = target - current;
      const saltNeeded = v * difference * 35; // grams

      let instructions = "";
      if (saltNeeded > 0) {
        instructions = `أضف ${Math.round(saltNeeded)} جرام من ملح البحر تدريجياً على مدى عدة ساعات. قس الملوحة بعد كل إضافة.`;
      } else if (saltNeeded < 0) {
        instructions = `الملوحة الحالية أعلى من المطلوب. قم بتغيير ${Math.abs(Math.round((difference / target) * 100))}% من الماء بماء عذب مُعالج.`;
      } else {
        instructions = "الملوحة مثالية! لا حاجة لأي تعديلات.";
      }

      setResult({
        saltAmount: Math.abs(Math.round(saltNeeded)),
        instructions,
      });
    }
  };

  const getSalinityRange = (type: string) => {
    switch (type) {
      case "reef":
        return "1.023-1.025 (35-35 ppt)";
      case "fowlr":
        return "1.020-1.025 (30-35 ppt)";
      case "brackish":
        return "1.005-1.015 (5-20 ppt)";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Waves className="h-6 w-6 text-primary" />
          حاسبة الملوحة
        </CardTitle>
        <CardDescription>احسب كمية الملح المطلوبة للوصول إلى مستوى الملوحة المناسب</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>نوع الحوض</Label>
          <Select value={tankType} onValueChange={setTankType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reef">
                Reef (شعاب مرجانية) - {getSalinityRange("reef")}
              </SelectItem>
              <SelectItem value="fowlr">
                FOWLR (أسماك فقط) - {getSalinityRange("fowlr")}
              </SelectItem>
              <SelectItem value="brackish">
                Brackish (مياه شبه مالحة) - {getSalinityRange("brackish")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>حجم الحوض (لتر)</Label>
            <Input
              type="number"
              placeholder="200"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>الملوحة الحالية (ppt)</Label>
            <Input
              type="number"
              placeholder="30"
              step="0.5"
              value={currentSalinity}
              onChange={(e) => setCurrentSalinity(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>الملوحة المطلوبة (ppt)</Label>
            <Input
              type="number"
              placeholder="35"
              step="0.5"
              value={targetSalinity}
              onChange={(e) => setTargetSalinity(e.target.value)}
            />
          </div>
        </div>

        <Alert className="bg-amber-50 border-amber-200">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-sm text-amber-900">
            <strong>مهم:</strong> استخدم مقياس ملوحة دقيق (Refractometer أو Hydrometer).
            الملوحة النموذجية: 1.025 specific gravity = 35 ppt للشعاب المرجانية.
          </AlertDescription>
        </Alert>

        <Button onClick={calculate} className="w-full text-lg h-12">
          احسب كمية الملح
        </Button>

        {result && (
          <div className="mt-6 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="p-6 bg-primary/5 rounded-xl border border-primary/20">
              <p className="text-muted-foreground mb-2 text-center">كمية الملح المطلوبة</p>
              <p className="text-4xl font-bold text-primary text-center">
                {result.saltAmount} جرام
              </p>
              <p className="text-sm text-muted-foreground text-center mt-2">
                ({(result.saltAmount / 1000).toFixed(2)} كيلوجرام)
              </p>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-900 font-semibold">إرشادات التطبيق</AlertTitle>
              <AlertDescription className="text-sm text-blue-900 mt-2">
                {result.instructions}
              </AlertDescription>
            </Alert>

            <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
              <h4 className="font-semibold">نصائح مهمة:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>أذب الملح في ماء RO/DI نظيف في حاوية منفصلة</li>
                <li>انتظر 24 ساعة قبل إضافة الماء للحوض</li>
                <li>قس الملوحة بعد إذابة الملح بالكامل</li>
                <li>غيّر الملوحة تدريجياً على عدة أيام لتجنب صدمة الأسماك</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
