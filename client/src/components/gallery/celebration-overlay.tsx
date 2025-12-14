import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import confetti from "canvas-confetti";
import { Copy, PartyPopper, Gift, Sparkles, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export function CelebrationOverlay() {
    const { toast } = useToast();
    const [showCelebration, setShowCelebration] = useState(false);
    const [copied, setCopied] = useState(false);

    // Check for winning submission
    const { data: winningSubmission } = useQuery({
        queryKey: ["/api/gallery/my-winning-submission"],
        queryFn: async () => {
            const res = await fetch("/api/gallery/my-winning-submission");
            if (!res.ok) return null;
            return res.json();
        }
    });

    // Acknowledge mutation
    const ackMutation = useMutation({
        mutationFn: async (id: string) => {
            await fetch(`/api/gallery/ack-celebration/${id}`, {
                method: "POST"
            });
        },
        onSuccess: () => {
            setShowCelebration(false);
        }
    });

    useEffect(() => {
        if (winningSubmission && !ackMutation.isPending && !ackMutation.isSuccess) {
            setShowCelebration(true);
            triggerCelebration();
        }
    }, [winningSubmission]);

    // Elegant celebration - not too intrusive
    const triggerCelebration = () => {
        // Phase 1: Gentle confetti from sides (3 seconds)
        const confettiColors = ["#22c55e", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

        // Initial burst from both sides
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { x: 0, y: 0.6 },
            colors: confettiColors,
            startVelocity: 25,
            ticks: 150,
            zIndex: 9999
        });

        confetti({
            particleCount: 50,
            spread: 60,
            origin: { x: 1, y: 0.6 },
            colors: confettiColors,
            startVelocity: 25,
            ticks: 150,
            zIndex: 9999
        });

        // Phase 2: Gentle falling confetti (after 500ms)
        setTimeout(() => {
            const duration = 3000;
            const animationEnd = Date.now() + duration;
            const defaults = {
                startVelocity: 15,
                spread: 180,
                ticks: 80,
                zIndex: 9999,
                colors: confettiColors,
                gravity: 0.8,
                scalar: 0.9
            };

            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();

                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }

                const particleCount = 15 * (timeLeft / duration);

                // Gentle rain from top
                confetti({
                    ...defaults,
                    particleCount,
                    origin: { x: Math.random(), y: -0.1 }
                });
            }, 300);
        }, 500);

        // Phase 3: Final celebration burst (after 2 seconds)
        setTimeout(() => {
            confetti({
                particleCount: 80,
                spread: 100,
                origin: { x: 0.5, y: 0.5 },
                colors: confettiColors,
                startVelocity: 20,
                ticks: 100,
                zIndex: 9999,
                shapes: ['circle', 'square'],
                scalar: 0.8
            });
        }, 2000);
    };

    const copyCode = () => {
        if (winningSubmission?.couponCode) {
            navigator.clipboard.writeText(winningSubmission.couponCode);
            setCopied(true);
            toast({
                title: "✅ تم نسخ الرمز!",
                description: "استخدم هذا الرمز عند الدفع للحصول على جائزتك.",
            });
            setTimeout(() => setCopied(false), 3000);
        }
    };

    const handleClose = () => {
        if (winningSubmission?.id) {
            ackMutation.mutate(winningSubmission.id);
        } else {
            setShowCelebration(false);
        }
    };

    if (!showCelebration || !winningSubmission) return null;

    return (
        <>
            {/* Floating elements - reduced count for less intrusion */}
            <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
                {/* Floating balloons - fewer and slower */}
                {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: "120vh", x: `${10 + Math.random() * 80}vw`, opacity: 0 }}
                        animate={{
                            y: "-20vh",
                            opacity: [0, 0.9, 0.9, 0],
                        }}
                        transition={{
                            duration: Math.random() * 6 + 6,
                            delay: Math.random() * 2,
                            ease: "easeOut",
                            repeat: 0 // No repeat - only once
                        }}
                        className="absolute text-4xl"
                    >
                        🎈
                    </motion.div>
                ))}

                {/* Sparkles - subtle */}
                {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                        key={`sparkle-${i}`}
                        initial={{
                            x: `${20 + Math.random() * 60}vw`,
                            y: `${20 + Math.random() * 60}vh`,
                            scale: 0,
                            opacity: 0
                        }}
                        animate={{
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0],
                        }}
                        transition={{
                            duration: 2,
                            delay: Math.random() * 3,
                            repeat: 2,
                            repeatDelay: 1
                        }}
                        className="absolute text-2xl"
                    >
                        ✨
                    </motion.div>
                ))}
            </div>

            <Dialog open={showCelebration} onOpenChange={(open) => !open && handleClose()}>
                <DialogContent className="sm:max-w-md bg-gradient-to-br from-background via-background to-primary/5 border-2 border-primary/20 shadow-2xl z-[9999]">
                    <DialogHeader className="text-center space-y-4">
                        {/* Trophy with gentle animation */}
                        <motion.div
                            className="mx-auto w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 rounded-full flex items-center justify-center"
                            animate={{
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            <TrophyIcon className="w-10 h-10 text-yellow-500 drop-shadow-md" />
                        </motion.div>

                        <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500">
                            🎉 ألف مبروك!
                        </DialogTitle>

                        <DialogDescription className="text-base text-foreground/80">
                            لقد فازت مشاركتك "<span className="font-bold text-primary">{winningSubmission.tankSize}</span>"
                            في ألبوم العائلة لشهر <span className="font-bold">{winningSubmission.winnerMonth}</span>!
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col items-center gap-4 py-4">
                        {/* Prize display */}
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">جائزتك:</p>
                            <div className="flex items-center gap-2 justify-center">
                                <Gift className="w-5 h-5 text-pink-500" />
                                <span className="text-lg font-bold text-accent">{winningSubmission.prize}</span>
                            </div>
                        </div>

                        {/* Coupon code box */}
                        <div className="w-full bg-gradient-to-r from-primary/5 to-primary/10 p-4 rounded-xl border border-primary/20 relative">
                            <p className="text-xs text-center text-muted-foreground mb-2">رمز الكوبون الخاص بك (استخدام واحد فقط)</p>
                            <div className="flex items-center justify-center gap-3">
                                <code className="text-xl font-mono font-black tracking-widest text-primary bg-background/50 px-3 py-1 rounded-lg">
                                    {winningSubmission.couponCode || "CODE-ERROR"}
                                </code>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={copyCode}
                                    className="hover:bg-primary/10 transition-colors"
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4 text-green-500" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>

                            {/* Decorative sparkle */}
                            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400" />
                        </div>

                        <p className="text-xs text-muted-foreground text-center">
                            💡 احتفظ بهذا الرمز واستخدمه عند الدفع للحصول على خصمك!
                        </p>
                    </div>

                    <DialogFooter className="sm:justify-center">
                        <Button
                            onClick={handleClose}
                            size="lg"
                            className="w-full sm:w-auto bg-gradient-to-r from-primary to-emerald-600 hover:opacity-90 transition-opacity font-bold"
                        >
                            <PartyPopper className="w-4 h-4 ml-2" />
                            شكراً! استلمت الجائزة
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function TrophyIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    )
}
