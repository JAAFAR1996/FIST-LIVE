import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WaterRippleButton } from "@/components/effects/water-ripple-button";

export default function Journey() {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "التخطيط",
      desc: "حدد حجم الحوض المناسب ومكانه ونوع الأسماك التي ترغب بتربيتها. الموقع يجب أن يكون بعيداً عن أشعة الشمس المباشرة لتجنب الطحالب.",
      image: "https://images.unsplash.com/photo-1520990269667-98a1d1d9d6b0?w=800&q=80"
    },
    {
      title: "المعدات",
      desc: "اختر الفلتر والسخان والإضاءة المناسبة لحجم حوضك. الفلتر هو قلب الحوض، اختره بعناية.",
      image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=800&q=80"
    },
    {
      title: "الديكور",
      desc: "أضف الرمل والصخور والنباتات لإنشاء بيئة طبيعية. النباتات الحية تساعد في توازن الماء.",
      image: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?w=800&q=80"
    },
    {
      title: "تدوير الحوض",
      desc: "انتظر اكتمال الدورة البايولوجية قبل إضافة الأسماك. هذه أهم خطوة لتجنب موت الأسماك.",
      image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=800&q=80"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans transition-colors duration-300">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl font-bold text-foreground">رحلتك لإنشاء حوض مثالي</h1>
            <p className="text-xl text-muted-foreground">دليلك خطوة بخطوة من الحوض الفارغ إلى عالم تحت الماء مفعم بالحياة</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
             {/* Visual Side */}
             <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 order-2 md:order-1">
                <div className="absolute inset-0 bg-black/20 z-10" />
                <img 
                  src={steps[currentStep].image} 
                  alt={steps[currentStep].title} 
                  className="w-full h-full object-cover transition-all duration-500 transform key={currentStep}" 
                />
                <div className="absolute bottom-8 right-8 left-8 z-20 text-white">
                  <div className="text-6xl font-bold opacity-20 mb-2">0{currentStep + 1}</div>
                  <h2 className="text-3xl font-bold mb-2">{steps[currentStep].title}</h2>
                </div>
             </div>

             {/* Content Side */}
             <div className="space-y-8 order-1 md:order-2">
                <div className="space-y-6">
                   {steps.map((step, idx) => (
                     <div 
                       key={idx} 
                       className={`flex gap-4 p-4 rounded-xl transition-all cursor-pointer ${
                         idx === currentStep 
                           ? "bg-primary/10 border-primary/20 translate-x-2" 
                           : "hover:bg-muted/50 opacity-50 hover:opacity-100"
                       }`}
                       onClick={() => setCurrentStep(idx)}
                     >
                       <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                         idx <= currentStep ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground text-muted-foreground"
                       }`}>
                         {idx < currentStep ? <CheckCircle2 className="w-5 h-5" /> : <span>{idx + 1}</span>}
                       </div>
                       <div>
                         <h3 className={`font-bold text-lg ${idx === currentStep ? "text-primary" : "text-foreground"}`}>{step.title}</h3>
                         <p className={`text-sm leading-relaxed ${idx === currentStep ? "text-foreground" : "text-muted-foreground line-clamp-1"}`}>
                           {step.desc}
                         </p>
                       </div>
                     </div>
                   ))}
                </div>

                <div className="flex gap-4 pt-4">
                   <Button 
                     variant="outline" 
                     onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                     disabled={currentStep === 0}
                     className="flex-1"
                   >
                     <ArrowRight className="ml-2 w-4 h-4" /> السابق
                   </Button>
                   <WaterRippleButton 
                     className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                     onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                     disabled={currentStep === steps.length - 1}
                   >
                     التالي <ArrowLeft className="mr-2 w-4 h-4" />
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
