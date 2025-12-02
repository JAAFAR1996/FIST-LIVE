import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WaterRippleButton } from "@/components/effects/water-ripple-button";
import { JourneyProgress } from "@/components/journey/journey-progress";
import { JourneyStep } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

export default function Journey() {
  const [currentStepId, setCurrentStepId] = useState(() => {
    return localStorage.getItem("journeyStep") || "planning";
  });

  useEffect(() => {
    localStorage.setItem("journeyStep", currentStepId);
  }, [currentStepId]);

  const steps: JourneyStep[] = [
    {
      id: "planning",
      title: "التخطيط",
      description: "حدد حجم الحوض المناسب ومكانه ونوع الأسماك التي ترغب بتربيتها. الموقع يجب أن يكون بعيداً عن أشعة الشمس المباشرة لتجنب الطحالب.",
      completed: false,
      current: true
    },
    {
      id: "equipment",
      title: "المعدات",
      description: "اختر الفلتر والسخان والإضاءة المناسبة لحجم حوضك. الفلتر هو قلب الحوض، اختره بعناية.",
      completed: false,
      current: false
    },
    {
      id: "decor",
      title: "الديكور",
      description: "أضف الرمل والصخور والنباتات لإنشاء بيئة طبيعية. النباتات الحية تساعد في توازن الماء.",
      completed: false,
      current: false
    },
    {
      id: "cycling",
      title: "تدوير الحوض",
      description: "انتظر اكتمال الدورة البايولوجية قبل إضافة الأسماك. هذه أهم خطوة لتجنب موت الأسماك.",
      completed: false,
      current: false
    }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStepId);
  const currentStepData = steps[currentStepIndex];

  // Images for steps
  const stepImages = {
    planning: "/stock_images/planted_aquarium_tan_46df6ed7.jpg",
    equipment: "/stock_images/aquarium_canister_fi_ebe5d7af.jpg",
    decor: "/stock_images/anubias_nana_aquariu_554af5dc.jpg",
    cycling: "/stock_images/clean_river_ecosyste_f6301bd2.jpg"
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepId(steps[currentStepIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepId(steps[currentStepIndex - 1].id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans transition-colors duration-300">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold text-foreground">رحلتك لإنشاء حوض مثالي</h1>
            <p className="text-xl text-muted-foreground">دليلك خطوة بخطوة من الحوض الفارغ إلى عالم تحت الماء مفعم بالحياة</p>
          </div>

          <JourneyProgress 
            steps={steps} 
            currentStepId={currentStepId} 
            onStepClick={setCurrentStepId} 
          />

          <div className="grid md:grid-cols-2 gap-12 items-center min-h-[500px]">
             {/* Visual Side */}
             <AnimatePresence mode="wait">
               <motion.div 
                 key={currentStepId}
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 transition={{ duration: 0.5 }}
                 className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 order-2 md:order-1"
               >
                  <div className="absolute inset-0 bg-black/20 z-10" />
                  <img 
                    src={stepImages[currentStepId as keyof typeof stepImages]} 
                    alt={currentStepData.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute bottom-8 right-8 left-8 z-20 text-white">
                    <div className="text-6xl font-bold opacity-20 mb-2">0{currentStepIndex + 1}</div>
                    <h2 className="text-3xl font-bold mb-2">{currentStepData.title}</h2>
                  </div>
               </motion.div>
             </AnimatePresence>

             {/* Content Side */}
             <div className="space-y-8 order-1 md:order-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStepId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <h3 className="text-3xl font-bold text-primary">{currentStepData.title}</h3>
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {currentStepData.description}
                    </p>
                    
                    <div className="bg-muted/30 p-6 rounded-xl border border-primary/10">
                      <h4 className="font-bold mb-3 flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-xs">!</span>
                        نصيحة الخبراء:
                      </h4>
                      <p className="text-sm">
                        {currentStepIndex === 0 && "ابدأ بحوض أكبر مما تعتقد أنك تحتاجه. الأحواض الكبيرة أسهل في الحفاظ على توازن الماء."}
                        {currentStepIndex === 1 && "لا تبخل على الفلتر. هو الجهاز الوحيد الذي يعمل 24 ساعة للحفاظ على حياة أسماكك."}
                        {currentStepIndex === 2 && "استخدم ركيزة (Substrate) مغذية إذا كنت تخطط لزراعة النباتات الطبيعية."}
                        {currentStepIndex === 3 && "الصبر هو مفتاح النجاح. انتظر 4 أسابيع على الأقل قبل إضافة الأسماك."}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex gap-4 pt-8">
                   <Button 
                     variant="outline" 
                     size="lg"
                     onClick={handlePrev}
                     disabled={currentStepIndex === 0}
                     className="flex-1 text-lg"
                   >
                     <ArrowRight className="ml-2 w-5 h-5" /> السابق
                   </Button>
                   <WaterRippleButton 
                     className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-lg h-12"
                     onClick={handleNext}
                     disabled={currentStepIndex === steps.length - 1}
                   >
                     التالي <ArrowLeft className="mr-2 w-5 h-5" />
                   </WaterRippleButton>
                </div>
             </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
