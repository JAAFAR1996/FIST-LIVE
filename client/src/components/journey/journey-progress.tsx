import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { JourneyStep } from "@/types";
import { motion } from "framer-motion";

interface JourneyProgressProps {
  steps: JourneyStep[];
  currentStepId: string;
  onStepClick: (id: string) => void;
}

export function JourneyProgress({ steps, currentStepId, onStepClick }: JourneyProgressProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStepId);

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full" />
        
        {/* Active Progress Bar */}
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full z-0"
          initial={{ width: "0%" }}
          animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Steps */}
        <div className="relative z-10 flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = step.id === currentStepId;
            
            return (
              <div 
                key={step.id}
                className={cn(
                  "flex flex-col items-center cursor-pointer group",
                  isCompleted || isCurrent ? "text-primary" : "text-muted-foreground"
                )}
                onClick={() => onStepClick(step.id)}
              >
                <motion.div 
                  className={cn(
                    "w-10 h-10 rounded-full border-4 flex items-center justify-center bg-background transition-colors duration-300",
                    isCompleted ? "border-primary bg-primary text-primary-foreground" : 
                    isCurrent ? "border-primary text-primary" : "border-muted text-muted-foreground group-hover:border-primary/50"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="font-bold text-sm">{index + 1}</span>
                  )}
                </motion.div>
                
                <div className="mt-2 text-center hidden sm:block">
                  <span className={cn(
                    "text-sm font-bold block transition-colors",
                    isCurrent ? "text-primary" : "text-foreground/70"
                  )}>
                    {step.title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
