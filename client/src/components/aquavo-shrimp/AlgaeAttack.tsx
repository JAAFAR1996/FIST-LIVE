import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShrimpCharacter, CLEANER_CONFIG } from './ShrimpCharacter';

interface AlgaeAttackProps {
    enabled?: boolean;
}

export const AlgaeAttack: React.FC<AlgaeAttackProps> = ({ enabled = true }) => {
    const [isIdle, setIsIdle] = useState(false);
    const [isCleaning, setIsCleaning] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>(null);

    // Consts
    const IDLE_LIMIT = 15000; // 15 seconds

    const resetTimer = () => {
        if (!enabled) return;

        if (isIdle || isCleaning) {
            // If we were idle, trigger cleaning
            if (isIdle && !isCleaning) {
                setIsIdle(false);
                setIsCleaning(true);
                setTimeout(() => setIsCleaning(false), 2000); // 2s cleaning animation
            }
            // If already cleaning, do nothing, let it finish or just cut it? 
            // Let's let it finish naturally or just hide.
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            setIsIdle(true);
        }, IDLE_LIMIT);
    };

    useEffect(() => {
        if (!enabled) return;

        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);
        window.addEventListener('scroll', resetTimer);
        window.addEventListener('click', resetTimer);
        window.addEventListener('touchstart', resetTimer);

        resetTimer(); // Start initial timer

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            window.removeEventListener('scroll', resetTimer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('touchstart', resetTimer);
        };
    }, [enabled, isIdle, isCleaning]);

    if (!enabled) return null;

    return (
        <>
            <AnimatePresence>
                {isIdle && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 2 }}
                        className="fixed inset-0 z-[40] pointer-events-none mix-blend-multiply"
                        style={{
                            backgroundImage: 'url(/shrimp_assets/effects/algae_overlay.png)',
                            backgroundSize: 'cover',
                            backgroundColor: 'rgba(0, 50, 0, 0.3)'
                        }}
                    >
                        {/* Optional floating text or particles */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-green-500/50 text-4xl font-black font-heading rotate-12">ALGAE ATTACK!</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isCleaning && (
                    <motion.div
                        className="fixed inset-0 z-[45] pointer-events-none"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* The Cleaning Shrimp wipes the screen */}
                        <motion.div
                            initial={{ x: '100vw', y: '100vh' }}
                            animate={{ x: '-100vw', y: '-100vh' }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute bottom-0 right-0 w-64 h-64"
                        >
                            <ShrimpCharacter config={CLEANER_CONFIG} size="xl" />
                        </motion.div>

                        {/* Wipe Effect (White bar or similar) */}
                        <motion.div
                            initial={{ x: '100%', skewX: -20 }}
                            animate={{ x: '-150%' }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                            className="absolute inset-0 w-[200%] h-full bg-white/20 backdrop-blur-md"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
