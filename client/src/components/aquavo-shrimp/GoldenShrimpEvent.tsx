import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useShrimp } from '@/contexts/shrimp-context';
import { ShrimpCharacter, GOLDEN_CONFIG } from './ShrimpCharacter';
import { Button } from '@/components/ui/button';
import { Copy, X } from 'lucide-react';

export const GoldenShrimpEvent: React.FC = () => {
    const { isGoldenActive, catchGoldenShrimp, goldenCaught } = useShrimp();
    const [showModal, setShowModal] = useState(false);

    // If caught, show modal
    useEffect(() => {
        if (goldenCaught && !isGoldenActive) {
            // Logic to show modal only immediately after catch could be handled here
            // But for now we rely on the user clicking the shrimp to call catchGoldenShrimp, which sets goldenCaught.
            // We'll manage the modal visibility inside the catch handler.
        }
    }, [goldenCaught, isGoldenActive]);

    const handleCatch = () => {
        catchGoldenShrimp();
        setShowModal(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#FFFFFF']
        });
    };

    return (
        <>
            {/* Flying Shrimp */}
            <AnimatePresence>
                {isGoldenActive && (
                    <motion.div
                        initial={{ x: '-100vw', y: '20vh' }}
                        animate={{
                            x: '100vw',
                            y: ['20vh', '40vh', '20vh', '50vh'], // sine wave path
                            rotate: [0, 10, -10, 0]
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 15, ease: "linear" }}
                        className="fixed top-0 left-0 z-[100] cursor-pointer"
                        onClick={handleCatch}
                    >
                        <div className="relative group">
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-yellow-400 text-black px-3 py-1 rounded-full font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                اضغط علي بسرعة! 💰
                            </div>
                            <ShrimpCharacter config={GOLDEN_CONFIG} size="large" animate={true} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Prize Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[101] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-card border-2 border-yellow-500 rounded-3xl p-8 max-w-md w-full text-center relative shadow-[0_0_50px_rgba(255,215,0,0.3)]"
                        >
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                                <ShrimpCharacter config={GOLDEN_CONFIG} size="large" />
                            </div>

                            <div className="mt-16 space-y-4">
                                <h2 className="text-3xl font-black text-yellow-500 font-heading">مبروك! أمسكت به! 🎉</h2>
                                <p className="text-muted-foreground">لقد عثرت على الروبيان الذهبي النادر جداً (1% فقط!).</p>

                                <div className="bg-yellow-500/10 p-4 rounded-xl border border-yellow-500/30">
                                    <p className="text-sm font-bold text-yellow-600 mb-2">كود الخصم الخاص بك:</p>
                                    <div className="flex items-center gap-2 justify-center">
                                        <code className="text-2xl font-mono font-black tracking-widest bg-background px-4 py-2 rounded-lg border border-border">GOLDEN10</code>
                                        <Button size="icon" variant="ghost" className="hover:text-yellow-500" onClick={() => navigator.clipboard.writeText('GOLDEN10')}>
                                            <Copy className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>

                                <Button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg rounded-xl" onClick={() => setShowModal(false)}>
                                    استخدم الخصم الآن
                                </Button>
                            </div>

                            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                                <X className="w-6 h-6" />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
