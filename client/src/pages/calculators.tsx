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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-6 w-6 text-primary" />
          حاسبة الفلترة
        </CardTitle>
        <CardDescription>احسب معدل التدفق المناسب للفلتر بناءً على حجم الحوض ونوع الأسماك</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <Clock className="h-5 w-5 text-orange-600" />
          <AlertTitle className="text-orange-900 dark:text-orange-100 font-bold text-lg mb-2">قيد التطوير</AlertTitle>
          <AlertDescription className="text-orange-800 dark:text-orange-200 space-y-2">
            <p>هذه الحاسبة قيد التطوير حالياً ⚡</p>
            <p className="text-sm">سنوفر لك قريباً أداة دقيقة لحساب معدل التدفق المناسب لحوضك</p>
          </AlertDescription>
        </Alert>
        <div className="mt-6 p-8 text-center space-y-4">
          <Wrench className="h-16 w-16 mx-auto text-muted-foreground opacity-30" />
          <p className="text-muted-foreground">نعمل على توفير هذه الميزة قريباً</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SaltCalculator() {
   return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Waves className="h-6 w-6 text-primary" />
          حاسبة الملوحة
        </CardTitle>
        <CardDescription>احسب كمية الملح المطلوبة للوصول إلى مستوى الملوحة المناسب</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <Clock className="h-5 w-5 text-orange-600" />
          <AlertTitle className="text-orange-900 dark:text-orange-100 font-bold text-lg mb-2">قيد التطوير</AlertTitle>
          <AlertDescription className="text-orange-800 dark:text-orange-200 space-y-2">
            <p>هذه الحاسبة قيد التطوير حالياً ⚡</p>
            <p className="text-sm">سنوفر لك قريباً أداة لحساب الملوحة بدقة لأحواض المياه المالحة</p>
          </AlertDescription>
        </Alert>
        <div className="mt-6 p-8 text-center space-y-4">
          <Wrench className="h-16 w-16 mx-auto text-muted-foreground opacity-30" />
          <p className="text-muted-foreground">نعمل على توفير هذه الميزة قريباً</p>
        </div>
      </CardContent>
    </Card>
  );
}
