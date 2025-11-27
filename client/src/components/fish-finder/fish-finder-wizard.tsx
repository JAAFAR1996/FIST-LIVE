import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { products } from "@/lib/mock-data";
import { ArrowRight, ArrowLeft, Sparkles, Fish } from "lucide-react";
import confetti from "canvas-confetti";

export default function FishFinderWizard() {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    tankSize: "",
    experience: "",
    type: "",
  });
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(4);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }, 1500);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const recommendedProducts = products.slice(0, 3);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>الحجم</span>
          <span>الخبرة</span>
          <span>النوع</span>
          <span>النتيجة</span>
        </div>
      </div>

      <Card className="border-2 border-primary/10 shadow-xl backdrop-blur-sm bg-card/95">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Fish className="text-primary" />
                كم حجم حوضك؟
              </CardTitle>
              <CardDescription>لنبدأ بتحديد المساحة المتاحة لديك.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup onValueChange={(v) => setAnswers({ ...answers, tankSize: v })} value={answers.tankSize} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: "small", label: "صغير", desc: "أقل من 60 لتر" },
                  { value: "medium", label: "متوسط", desc: "60 - 200 لتر" },
                  { value: "large", label: "كبير", desc: "أكثر من 200 لتر" },
                ].map((opt) => (
                  <div key={opt.value}>
                    <RadioGroupItem value={opt.value} id={opt.value} className="peer sr-only" />
                    <Label
                      htmlFor={opt.value}
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                    >
                      <span className="text-xl font-bold mb-2">{opt.label}</span>
                      <span className="text-sm text-muted-foreground text-center">{opt.desc}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">ما هو مستوى خبرتك؟</CardTitle>
              <CardDescription>نساعدك في اختيار المعدات المناسبة لمستواك.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup onValueChange={(v) => setAnswers({ ...answers, experience: v })} value={answers.experience} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: "beginner", label: "مبتدئ", desc: "أول حوض لي" },
                  { value: "intermediate", label: "متوسط", desc: "لدي خبرة سابقة" },
                  { value: "expert", label: "خبير", desc: "أربي الأسماك منذ سنوات" },
                ].map((opt) => (
                  <div key={opt.value}>
                    <RadioGroupItem value={opt.value} id={opt.value} className="peer sr-only" />
                    <Label
                      htmlFor={opt.value}
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                    >
                      <span className="text-xl font-bold mb-2">{opt.label}</span>
                      <span className="text-sm text-muted-foreground text-center">{opt.desc}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <CardHeader>
              <CardTitle className="text-2xl">ما نوع الأسماك المفضل؟</CardTitle>
              <CardDescription>لكل نوع متطلبات خاصة.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup onValueChange={(v) => setAnswers({ ...answers, type: v })} value={answers.type} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { value: "tropical", label: "استوائية", desc: "تترا، جوبي، مولي" },
                  { value: "goldfish", label: "جولد فيش", desc: "مياه باردة" },
                  { value: "planted", label: "حوض نباتي", desc: "تركيز على النباتات" },
                ].map((opt) => (
                  <div key={opt.value}>
                    <RadioGroupItem value={opt.value} id={opt.value} className="peer sr-only" />
                    <Label
                      htmlFor={opt.value}
                      className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                    >
                      <span className="text-xl font-bold mb-2">{opt.label}</span>
                      <span className="text-sm text-muted-foreground text-center">{opt.desc}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </div>
        )}

        {step === 4 && (
          <div className="animate-in zoom-in-95 duration-500">
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-3xl text-primary">تم العثور على التشكيلة المثالية!</CardTitle>
              <CardDescription>بناءً على إجاباتك، نقترح عليك هذه المنتجات للبدء.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {recommendedProducts.map(product => (
                  <div key={product.id} className="flex gap-4 items-center p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-md" />
                    <div className="flex-1">
                      <h4 className="font-bold">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    </div>
                    <div className="font-bold text-primary">{product.price.toLocaleString()} د.ع</div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="justify-center pt-6">
               <Button size="lg" className="w-full md:w-auto animate-pulse-glow">
                 إضافة الكل للسلة (خصم 10%)
               </Button>
            </CardFooter>
          </div>
        )}

        {step < 4 && (
          <CardFooter className="flex justify-between pt-6">
            <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
              <ArrowRight className="w-4 h-4 ml-2" /> السابق
            </Button>
            <Button onClick={handleNext} disabled={loading}>
              {loading ? "جاري التحليل..." : (step === 3 ? "إظهار النتائج" : "التالي")}
              {!loading && <ArrowLeft className="w-4 h-4 mr-2" />}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
