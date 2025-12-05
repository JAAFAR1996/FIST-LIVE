import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Box,
  Ruler,
  DollarSign,
  Droplets,
  Fish,
  Trees,
  Mountain,
  Package,
  Sparkles,
  RotateCcw,
  Download
} from "lucide-react";

export default function TankBuilder3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({
    length: 100,  // cm
    width: 40,    // cm
    height: 50,   // cm
  });
  const [glassThickness, setGlassThickness] = useState(8); // mm
  const [hasLid, setHasLid] = useState(false);
  const [hasStand, setHasStand] = useState(true);

  // Calculate volume in liters
  const volume = Math.round((dimensions.length * dimensions.width * dimensions.height) / 1000);

  // Calculate costs (example prices in IQD)
  const glassPrice = 15000; // per square meter
  const glassArea = (
    2 * (dimensions.length * dimensions.height) +
    2 * (dimensions.width * dimensions.height) +
    (dimensions.length * dimensions.width)
  ) / 10000; // Convert cm² to m²

  const glassCost = Math.round(glassArea * glassPrice);
  const lidCost = hasLid ? 50000 : 0;
  const standCost = hasStand ? 150000 : 0;
  const siliconeCost = 25000;
  const totalCost = glassCost + lidCost + standCost + siliconeCost;

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw 3D-like tank using isometric projection
    const scale = Math.min(rect.width / (dimensions.length + dimensions.width), rect.height / (dimensions.height + dimensions.width)) * 0.6;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Convert dimensions to scaled pixels
    const l = dimensions.length * scale;
    const w = dimensions.width * scale * 0.5; // Isometric width
    const h = dimensions.height * scale;

    // Define tank corners
    const front = {
      bottomLeft: { x: centerX - l/2, y: centerY + h/2 },
      bottomRight: { x: centerX + l/2, y: centerY + h/2 },
      topLeft: { x: centerX - l/2, y: centerY - h/2 },
      topRight: { x: centerX + l/2, y: centerY - h/2 },
    };

    const back = {
      bottomLeft: { x: front.bottomLeft.x - w, y: front.bottomLeft.y - w },
      bottomRight: { x: front.bottomRight.x - w, y: front.bottomRight.y - w },
      topLeft: { x: front.topLeft.x - w, y: front.topLeft.y - w },
      topRight: { x: front.topRight.x - w, y: front.topRight.y - w },
    };

    // Draw back face (darkest)
    ctx.fillStyle = 'rgba(100, 150, 200, 0.3)';
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(back.bottomLeft.x, back.bottomLeft.y);
    ctx.lineTo(back.bottomRight.x, back.bottomRight.y);
    ctx.lineTo(back.topRight.x, back.topRight.y);
    ctx.lineTo(back.topLeft.x, back.topLeft.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw left face
    ctx.fillStyle = 'rgba(100, 150, 200, 0.4)';
    ctx.beginPath();
    ctx.moveTo(back.bottomLeft.x, back.bottomLeft.y);
    ctx.lineTo(front.bottomLeft.x, front.bottomLeft.y);
    ctx.lineTo(front.topLeft.x, front.topLeft.y);
    ctx.lineTo(back.topLeft.x, back.topLeft.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw front face (lightest)
    ctx.fillStyle = 'rgba(100, 150, 200, 0.5)';
    ctx.beginPath();
    ctx.moveTo(front.bottomLeft.x, front.bottomLeft.y);
    ctx.lineTo(front.bottomRight.x, front.bottomRight.y);
    ctx.lineTo(front.topRight.x, front.topRight.y);
    ctx.lineTo(front.topLeft.x, front.topLeft.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw top face
    ctx.fillStyle = 'rgba(100, 150, 200, 0.2)';
    ctx.beginPath();
    ctx.moveTo(front.topLeft.x, front.topLeft.y);
    ctx.lineTo(front.topRight.x, front.topRight.y);
    ctx.lineTo(back.topRight.x, back.topRight.y);
    ctx.lineTo(back.topLeft.x, back.topLeft.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw right face
    ctx.fillStyle = 'rgba(100, 150, 200, 0.45)';
    ctx.beginPath();
    ctx.moveTo(front.bottomRight.x, front.bottomRight.y);
    ctx.lineTo(back.bottomRight.x, back.bottomRight.y);
    ctx.lineTo(back.topRight.x, back.topRight.y);
    ctx.lineTo(front.topRight.x, front.topRight.y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Draw water inside
    const waterLevel = 0.9; // 90% filled
    const waterHeight = h * waterLevel;
    const waterY = centerY + h/2 - waterHeight;

    ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
    ctx.beginPath();
    ctx.moveTo(front.bottomLeft.x, front.bottomLeft.y);
    ctx.lineTo(front.bottomRight.x, front.bottomRight.y);
    ctx.lineTo(front.bottomRight.x, waterY);
    ctx.lineTo(front.bottomLeft.x, waterY);
    ctx.closePath();
    ctx.fill();

    // Draw bubbles
    for (let i = 0; i < 5; i++) {
      const bubbleX = front.bottomLeft.x + Math.random() * l;
      const bubbleY = waterY + Math.random() * waterHeight;
      const bubbleSize = 2 + Math.random() * 3;

      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw dimension labels
    ctx.fillStyle = '#0ea5e9';
    ctx.font = 'bold 14px Cairo, sans-serif';
    ctx.textAlign = 'center';

    // Length label
    ctx.fillText(`${dimensions.length} سم`, centerX, front.bottomRight.y + 25);

    // Height label
    ctx.save();
    ctx.translate(front.bottomLeft.x - 30, centerY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${dimensions.height} سم`, 0, 0);
    ctx.restore();

    // Width label
    ctx.fillText(`${dimensions.width} سم`, centerX - w/2, back.bottomLeft.y - 15);

  }, [dimensions, glassThickness, hasLid, hasStand]);

  const reset = () => {
    setDimensions({ length: 100, width: 40, height: 50 });
    setGlassThickness(8);
    setHasLid(false);
    setHasStand(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-6 py-2 rounded-full mb-4">
            <Box className="h-5 w-5 text-primary" />
            <span className="font-bold text-primary">أداة التصميم</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            صمم حوضك بتقنية 3D
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            اختر الأبعاد المثالية لحوضك واحسب التكلفة تلقائياً
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 3D Preview */}
          <Card className="lg:sticky lg:top-24 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                معاينة ثلاثية الأبعاد
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 rounded-xl overflow-hidden border-2">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <Droplets className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{volume}</div>
                  <div className="text-xs text-muted-foreground">لتر</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                  <Fish className="h-6 w-6 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{Math.floor(volume / 3)}</div>
                  <div className="text-xs text-muted-foreground">سمكة (تقريبي)</div>
                </div>
                <div className="text-center p-4 bg-amber-50 dark:bg-amber-950 rounded-lg">
                  <DollarSign className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-amber-600">{Math.round(totalCost / 1000)}k</div>
                  <div className="text-xs text-muted-foreground">د.ع</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="space-y-6">
            {/* Dimensions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-5 w-5" />
                  الأبعاد
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Length */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>الطول (سم)</Label>
                    <Badge variant="secondary">{dimensions.length} سم</Badge>
                  </div>
                  <Slider
                    value={[dimensions.length]}
                    onValueChange={([value]) => setDimensions(prev => ({ ...prev, length: value }))}
                    min={30}
                    max={200}
                    step={5}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>30 سم</span>
                    <span>200 سم</span>
                  </div>
                </div>

                {/* Width */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>العرض (سم)</Label>
                    <Badge variant="secondary">{dimensions.width} سم</Badge>
                  </div>
                  <Slider
                    value={[dimensions.width]}
                    onValueChange={([value]) => setDimensions(prev => ({ ...prev, width: value }))}
                    min={20}
                    max={100}
                    step={5}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>20 سم</span>
                    <span>100 سم</span>
                  </div>
                </div>

                {/* Height */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>الارتفاع (سم)</Label>
                    <Badge variant="secondary">{dimensions.height} سم</Badge>
                  </div>
                  <Slider
                    value={[dimensions.height]}
                    onValueChange={([value]) => setDimensions(prev => ({ ...prev, height: value }))}
                    min={20}
                    max={100}
                    step={5}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>20 سم</span>
                    <span>100 سم</span>
                  </div>
                </div>

                {/* Glass Thickness */}
                <div>
                  <div className="flex justify-between mb-2">
                    <Label>سماكة الزجاج (ملم)</Label>
                    <Badge variant="secondary">{glassThickness} ملم</Badge>
                  </div>
                  <Slider
                    value={[glassThickness]}
                    onValueChange={([value]) => setGlassThickness(value)}
                    min={5}
                    max={15}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    {glassThickness < 8 ? '⚠️ موصى به للأحواض الصغيرة فقط' :
                     glassThickness >= 12 ? '✅ مثالي للأحواض الكبيرة' :
                     '✅ مناسب للأحواض المتوسطة'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  الإضافات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Box className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold">غطاء زجاجي</div>
                      <div className="text-sm text-muted-foreground">يمنع القفز ويقلل التبخر</div>
                    </div>
                  </div>
                  <Button
                    variant={hasLid ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHasLid(!hasLid)}
                  >
                    {hasLid ? "مضاف" : "إضافة"}
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mountain className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-semibold">قاعدة خشبية</div>
                      <div className="text-sm text-muted-foreground">قاعدة قوية ومقاومة للماء</div>
                    </div>
                  </div>
                  <Button
                    variant={hasStand ? "default" : "outline"}
                    size="sm"
                    onClick={() => setHasStand(!hasStand)}
                  >
                    {hasStand ? "مضاف" : "إضافة"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown */}
            <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  تفصيل التكلفة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>الزجاج ({glassArea.toFixed(2)} م²)</span>
                  <span className="font-semibold">{glassCost.toLocaleString()} د.ع</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>السيليكون والمواد</span>
                  <span className="font-semibold">{siliconeCost.toLocaleString()} د.ع</span>
                </div>
                {hasLid && (
                  <div className="flex justify-between text-sm">
                    <span>الغطاء الزجاجي</span>
                    <span className="font-semibold">{lidCost.toLocaleString()} د.ع</span>
                  </div>
                )}
                {hasStand && (
                  <div className="flex justify-between text-sm">
                    <span>القاعدة الخشبية</span>
                    <span className="font-semibold">{standCost.toLocaleString()} د.ع</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>المجموع الكلي</span>
                  <span className="text-primary">{totalCost.toLocaleString()} د.ع</span>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  * الأسعار تقريبية وقد تختلف حسب نوع الزجاج والتوفر
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" onClick={reset} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                إعادة تعيين
              </Button>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                طلب عرض سعر
              </Button>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fish className="h-5 w-5 text-blue-600" />
              توصيات بناءً على التصميم
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-lg">
              <Trees className="h-8 w-8 text-green-600 mb-2" />
              <h4 className="font-bold mb-1">النباتات الموصى بها</h4>
              <p className="text-sm text-muted-foreground">
                {volume < 40 ? 'Java Moss, Anubias Nana' :
                 volume < 100 ? 'Amazon Sword, Java Fern' :
                 'Vallisneria, Cryptocoryne'}
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-lg">
              <Package className="h-8 w-8 text-amber-600 mb-2" />
              <h4 className="font-bold mb-1">الفلتر الموصى به</h4>
              <p className="text-sm text-muted-foreground">
                {volume < 50 ? 'فلتر داخلي 300 لتر/ساعة' :
                 volume < 150 ? 'فلتر خارجي 800 لتر/ساعة' :
                 'فلتر خارجي 1200 لتر/ساعة'}
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 rounded-lg">
              <Fish className="h-8 w-8 text-blue-600 mb-2" />
              <h4 className="font-bold mb-1">عدد الأسماك</h4>
              <p className="text-sm text-muted-foreground">
                حتى {Math.floor(volume / 3)} سمكة صغيرة أو {Math.floor(volume / 10)} سمكة كبيرة
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
