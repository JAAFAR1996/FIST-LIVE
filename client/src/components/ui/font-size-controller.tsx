import { useState, useEffect } from 'react';
import { Minus, Plus, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Font Size Controller Component
 * Allows users to adjust the font size for better accessibility
 * Persists user preference in localStorage
 */

export function FontSizeController() {
  const [fontSize, setFontSize] = useState(100);

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('fontSize');
    if (saved) {
      const parsedSize = parseInt(saved, 10);
      if (!isNaN(parsedSize) && parsedSize >= 80 && parsedSize <= 150) {
        setFontSize(parsedSize);
      }
    }
  }, []);

  // Apply font size changes
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 10, 150));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 10, 80));
  };

  const resetFontSize = () => {
    setFontSize(100);
  };

  return (
    <div
      className="flex items-center gap-2 p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border"
      role="group"
      aria-label="التحكم في حجم الخط"
    >
      <Button
        variant="outline"
        size="sm"
        onClick={decreaseFontSize}
        disabled={fontSize <= 80}
        aria-label="تصغير حجم الخط"
        className="h-8 w-8 p-0"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </Button>

      <span
        className="min-w-[60px] text-center text-sm font-medium"
        aria-live="polite"
        aria-atomic="true"
      >
        {fontSize}%
      </span>

      <Button
        variant="outline"
        size="sm"
        onClick={increaseFontSize}
        disabled={fontSize >= 150}
        aria-label="تكبير حجم الخط"
        className="h-8 w-8 p-0"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={resetFontSize}
        aria-label="إعادة تعيين حجم الخط"
        className="h-8 w-8 p-0"
        title="إعادة تعيين"
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

/**
 * Compact version for navbar/header
 */
export function FontSizeControllerCompact() {
  const [fontSize, setFontSize] = useState(100);

  useEffect(() => {
    const saved = localStorage.getItem('fontSize');
    if (saved) {
      const parsedSize = parseInt(saved, 10);
      if (!isNaN(parsedSize) && parsedSize >= 80 && parsedSize <= 150) {
        setFontSize(parsedSize);
      }
    }
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(prev + 10, 150));
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(prev - 10, 80));
  };

  return (
    <div
      className="flex items-center gap-1"
      role="group"
      aria-label="التحكم في حجم الخط"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={decreaseFontSize}
        disabled={fontSize <= 80}
        aria-label="تصغير حجم الخط"
        className="h-7 w-7 p-0"
      >
        <span className="text-xs font-bold" aria-hidden="true">أ</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={increaseFontSize}
        disabled={fontSize >= 150}
        aria-label="تكبير حجم الخط"
        className="h-7 w-7 p-0"
      >
        <span className="text-base font-bold" aria-hidden="true">أ</span>
      </Button>
    </div>
  );
}
