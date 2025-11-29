import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, ArrowLeft, Sparkles, Fish, Ruler, Zap, Droplets } from "lucide-react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/products/product-card";
import type { Product } from "@/types";

interface FishFinderWizardProps {
  productsList?: Product[];
}

export default function FishFinderWizard({ productsList }: FishFinderWizardProps) {
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem("fishFinderState");
    return saved ? JSON.parse(saved).step : 1;
  });
  const [answers, setAnswers] = useState(() => {
    const saved = localStorage.getItem("fishFinderState");
    return saved ? JSON.parse(saved).answers : {
      tankSize: "",
      experience: "",
      type: "",
    };
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("fishFinderState", JSON.stringify({ step, answers }));
  }, [step, answers]);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setStep(4);
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#8b5cf6', '#ec4899']
        });
      }, 1500);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const allProducts = productsList || [];
  const recommendedProducts = allProducts.slice(0, 3);

  const steps = [
    { id: 1, title: "الحجم", icon: Ruler },
    { id: 2, title: "الخبرة", icon: Zap },
    { id: 3, title: "النوع", icon: Droplets },
    { id: 4, title: "النتائج", icon: Sparkles },
  ];

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-12 flex justify-center">
        <div className="flex items-center gap-2 md:gap-4">
          {steps.map((s) => {
            const isActive = step >= s.id;
            const isCurrent = step === s.id;
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center">
                <div className={`
                  flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all duration-300
                  ${isActive ? 'bg-primary/10 border-primary text-primary' : 'border-muted text-muted-foreground'}
                  ${isCurrent ? 'ring-2 ring-primary/20 scale-105' : ''}
                `}>
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline font-medium">{s.title}</span>
                </div>
                {s.id < 4 && (
                  <div className={`w-8 h-0.5 mx-2 ${isActive ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Card className="border-2 border-primary/10 shadow-2xl backdrop-blur-sm bg-card/80 overflow-hidden min-h-[500px] flex flex-col">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex-1 flex flex-col">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold mb-2">كم حجم حوضك؟</CardTitle>
                <CardDescription className="text-lg">لنبدأ بتحديد المساحة المتاحة لديك.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center">
                <RadioGroup onValueChange={(v) => setAnswers({ ...answers, tankSize: v })} value={answers.tankSize} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { value: "small", label: "صغير", desc: "أقل من 60 لتر", icon: "💧" },
                    { value: "medium", label: "متوسط", desc: "60 - 200 لتر", icon: "🌊" },
                    { value: "large", label: "كبير", desc: "أكثر من 200 لتر", icon: "🏝️" },
                  ].map((opt) => (
                    <Label
                      key={opt.value}
                      htmlFor={opt.value}
                      className={`
                        cursor-pointer relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all duration-300
                        hover:scale-105 hover:shadow-lg
                        ${answers.tankSize === opt.value 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : 'border-muted bg-card hover:border-primary/50'}
                      `}
                    >
                      <RadioGroupItem value={opt.value} id={opt.value} className="sr-only" />
                      <span className="text-4xl mb-4">{opt.icon}</span>
                      <span className="text-xl font-bold mb-2">{opt.label}</span>
                      <span className="text-sm text-muted-foreground text-center">{opt.desc}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex-1 flex flex-col">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold mb-2">ما هو مستوى خبرتك؟</CardTitle>
                <CardDescription className="text-lg">نساعدك في اختيار المعدات المناسبة لمستواك.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center">
                <RadioGroup onValueChange={(v) => setAnswers({ ...answers, experience: v })} value={answers.experience} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { value: "beginner", label: "مبتدئ", desc: "أول حوض لي", color: "text-green-500" },
                    { value: "intermediate", label: "متوسط", desc: "لدي خبرة سابقة", color: "text-yellow-500" },
                    { value: "expert", label: "خبير", desc: "أربي الأسماك منذ سنوات", color: "text-red-500" },
                  ].map((opt) => (
                    <Label
                      key={opt.value}
                      htmlFor={opt.value}
                      className={`
                        cursor-pointer relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all duration-300
                        hover:scale-105 hover:shadow-lg
                        ${answers.experience === opt.value 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : 'border-muted bg-card hover:border-primary/50'}
                      `}
                    >
                      <RadioGroupItem value={opt.value} id={opt.value} className="sr-only" />
                      <span className={`text-xl font-bold mb-2 ${opt.color}`}>{opt.label}</span>
                      <span className="text-sm text-muted-foreground text-center">{opt.desc}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex-1 flex flex-col">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-3xl font-bold mb-2">ما نوع الأسماك المفضل؟</CardTitle>
                <CardDescription className="text-lg">لكل نوع متطلبات خاصة.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-center">
                <RadioGroup onValueChange={(v) => setAnswers({ ...answers, type: v })} value={answers.type} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { value: "tropical", label: "استوائية", desc: "تترا، جوبي، مولي", image: "🐠" },
                    { value: "goldfish", label: "جولد فيش", desc: "مياه باردة", image: "🐡" },
                    { value: "planted", label: "حوض نباتي", desc: "تركيز على النباتات", image: "🌿" },
                  ].map((opt) => (
                    <Label
                      key={opt.value}
                      htmlFor={opt.value}
                      className={`
                        cursor-pointer relative flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all duration-300
                        hover:scale-105 hover:shadow-lg
                        ${answers.type === opt.value 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : 'border-muted bg-card hover:border-primary/50'}
                      `}
                    >
                      <RadioGroupItem value={opt.value} id={opt.value} className="sr-only" />
                      <span className="text-4xl mb-4">{opt.image}</span>
                      <span className="text-xl font-bold mb-2">{opt.label}</span>
                      <span className="text-sm text-muted-foreground text-center">{opt.desc}</span>
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="flex-1 flex flex-col">
              <CardHeader className="text-center">
                <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }}
                  className="mx-auto bg-primary/10 p-6 rounded-full w-fit mb-6"
                >
                  <Sparkles className="w-10 h-10 text-primary" />
                </motion.div>
                <CardTitle className="text-3xl font-bold text-primary">تم العثور على التشكيلة المثالية!</CardTitle>
                <CardDescription className="text-lg mt-2">بناءً على إجاباتك، نقترح عليك هذه المنتجات للبدء.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendedProducts.map((product, idx) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 + 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="justify-center pb-8 pt-4">
                 <Button size="lg" className="w-full md:w-auto text-lg h-12 px-8 animate-pulse-glow bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                   إضافة المجموعة للسلة (خصم 10%)
                 </Button>
              </CardFooter>
            </motion.div>
          )}
        </AnimatePresence>

        {step < 4 && (
          <CardFooter className="flex justify-between p-8 border-t bg-muted/20">
            <Button variant="ghost" size="lg" onClick={handleBack} disabled={step === 1} className="text-lg">
              <ArrowRight className="w-5 h-5 ml-2" /> السابق
            </Button>
            <Button 
              size="lg" 
              onClick={handleNext} 
              disabled={loading || (step === 1 && !answers.tankSize) || (step === 2 && !answers.experience) || (step === 3 && !answers.type)}
              className="text-lg min-w-[140px]"
            >
              {loading ? "جاري التحليل..." : (step === 3 ? "إظهار النتائج" : "التالي")}
              {!loading && <ArrowLeft className="w-5 h-5 mr-2" />}
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
