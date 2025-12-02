import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

export function EasterEggs() {
  const [keys, setKeys] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prev) => {
        const newKeys = [...prev, e.key];
        if (newKeys.length > 10) newKeys.shift();
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const code = keys.join('');
    
    // Konami Code
    if (code.includes('ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba')) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FF69B4', '#00CED1']
      });
      toast({
        title: "🎮 تم تفعيل الكود السري!",
        description: "لقد وجدت وضع المطور السري!",
      });
      setKeys([]);
    }

    // "fish" typed
    if (code.includes('fish')) {
      toast({
        title: "🐟 بلوب بلوب!",
        description: "هناك شيء مريب يحدث هنا...",
      });
      setKeys([]);
    }
  }, [keys, toast]);

  return null;
}
