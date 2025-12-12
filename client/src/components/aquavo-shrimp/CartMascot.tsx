import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShrimp } from '@/contexts/shrimp-context';
import { useCart } from '@/contexts/cart-context';
import {
    ShrimpCharacter,
    LARVA_CONFIG,
    TEEN_CONFIG,
    BOSS_CONFIG,
    ShrimpConfig
} from './ShrimpCharacter';
import { Link } from 'wouter';

export const CartMascot: React.FC = () => {
    const { stage } = useShrimp();
    const { totalItems } = useCart();
    const [config, setConfig] = useState<ShrimpConfig>(LARVA_CONFIG);
    const [message, setMessage] = useState('');

    // Use totalItems directly
    const itemCount = totalItems;

    useEffect(() => {
        switch (stage) {
            case 'larva':
                setConfig(LARVA_CONFIG);
                setMessage('أنا صغير وجائع.. 🥺');
                break;
            case 'teen':
                setConfig(TEEN_CONFIG);
                setMessage('العضلات تظهر.. 💪');
                break;
            case 'boss':
            case 'whale':
                setConfig(BOSS_CONFIG);
                setMessage('جاهز للسيطرة! 😎');
                break;
            default:
                setConfig(LARVA_CONFIG);
        }
    }, [stage]);

    return (
        <div className="fixed bottom-4 right-4 z-50 pointer-events-none md:pointer-events-auto">
            <Link href="/cart">
                <div className="relative group cursor-pointer pointer-events-auto">
                    {/* Bubble Message */}
                    <AnimatePresence>
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute -top-16 right-0 bg-white text-black px-4 py-2 rounded-2xl rounded-tr-sm shadow-xl border-2 border-primary text-sm font-bold whitespace-nowrap z-50"
                        >
                            {message}
                        </motion.div>
                    </AnimatePresence>

                    {/* Character */}
                    <motion.div
                        key={stage}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                    >
                        <ShrimpCharacter config={config} size="medium" />
                    </motion.div>

                    {/* Badge */}
                    <div className="absolute -top-2 -left-2 bg-destructive text-white w-8 h-8 flex items-center justify-center rounded-full border-4 border-background font-black shadow-lg">
                        {itemCount}
                    </div>
                </div>
            </Link>
        </div>
    );
};
