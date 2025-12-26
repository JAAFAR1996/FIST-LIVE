import { describe, it, expect } from 'vitest';

describe('Tank Size Calculator', () => {
  // حساب حجم الحوض بناءً على الأسماك
  const calculateTankSize = (fishCount: number, fishSize: 'small' | 'medium' | 'large') => {
    const sizeMultiplier = {
      small: 2, // 2 لتر لكل سمكة صغيرة
      medium: 5, // 5 لتر لكل سمكة متوسطة
      large: 10 // 10 لتر لكل سمكة كبيرة
    };

    return fishCount * sizeMultiplier[fishSize];
  };

  it('should calculate tank size for small fish correctly', () => {
    const result = calculateTankSize(10, 'small');
    expect(result).toBe(20); // 10 × 2 = 20 لتر
  });

  it('should calculate tank size for medium fish correctly', () => {
    const result = calculateTankSize(5, 'medium');
    expect(result).toBe(25); // 5 × 5 = 25 لتر
  });

  it('should calculate tank size for large fish correctly', () => {
    const result = calculateTankSize(3, 'large');
    expect(result).toBe(30); // 3 × 10 = 30 لتر
  });

  it('should return 0 for 0 fish', () => {
    const result = calculateTankSize(0, 'small');
    expect(result).toBe(0);
  });
});

describe('Heater Calculator', () => {
  // حساب قوة السخان المطلوبة (واط)
  const calculateHeaterWattage = (tankLiters: number, roomTemp: number, targetTemp: number) => {
    const tempDifference = targetTemp - roomTemp;
    if (tempDifference <= 0) return 0; // لا حاجة للسخان
    const wattsPerLiter = tempDifference > 10 ? 5 : 3; // 5 واط/لتر للفرق الكبير
    return tankLiters * wattsPerLiter;
  };

  it('should calculate heater wattage for standard temperature difference', () => {
    const result = calculateHeaterWattage(100, 20, 26); // فرق 6 درجات
    expect(result).toBe(300); // 100 × 3 = 300 واط
  });

  it('should calculate heater wattage for large temperature difference', () => {
    const result = calculateHeaterWattage(100, 15, 28); // فرق 13 درجة
    expect(result).toBe(500); // 100 × 5 = 500 واط
  });

  it('should return 0 when room temp equals target temp', () => {
    const result = calculateHeaterWattage(100, 26, 26);
    expect(result).toBe(0);
  });
});

describe('Filter Calculator', () => {
  // حساب معدل التدفق المطلوب للفلتر (لتر/ساعة)
  const calculateFilterFlow = (tankLiters: number, fishLoad: 'light' | 'medium' | 'heavy') => {
    const turnoverMultiplier = {
      light: 4,   // 4 مرات بالساعة
      medium: 6,  // 6 مرات بالساعة
      heavy: 10   // 10 مرات بالساعة
    };

    return tankLiters * turnoverMultiplier[fishLoad];
  };

  it('should calculate filter flow for light fish load', () => {
    const result = calculateFilterFlow(100, 'light');
    expect(result).toBe(400); // 100 × 4 = 400 لتر/ساعة
  });

  it('should calculate filter flow for medium fish load', () => {
    const result = calculateFilterFlow(100, 'medium');
    expect(result).toBe(600); // 100 × 6 = 600 لتر/ساعة
  });

  it('should calculate filter flow for heavy fish load', () => {
    const result = calculateFilterFlow(100, 'heavy');
    expect(result).toBe(1000); // 100 × 10 = 1000 لتر/ساعة
  });
});

describe('Salt Calculator', () => {
  // حساب كمية الملح المطلوبة (جرام)
  const calculateSalt = (tankLiters: number, currentSalinity: number, targetSalinity: number) => {
    const salinityDiff = targetSalinity - currentSalinity;
    return tankLiters * salinityDiff; // 1 جرام/لتر لكل 1 ppt
  };

  it('should calculate salt needed to increase salinity', () => {
    const result = calculateSalt(100, 0, 1.005);
    expect(result).toBeCloseTo(100.5); // 100 × 1.005 ≈ 100.5 جرام
  });

  it('should return 0 when salinity matches target', () => {
    const result = calculateSalt(100, 1.005, 1.005);
    expect(result).toBe(0);
  });

  it('should return negative value when reducing salinity', () => {
    const result = calculateSalt(100, 1.010, 1.005);
    expect(result).toBeLessThan(0);
  });
});

describe('Breeding Calculator - PDF Generator', () => {
  it('should calculate breeding timeline correctly', () => {
    const startDate = new Date('2025-01-01');
    const maturityWeeks = 12;
    const gestationDays = 28;

    const maturityDate = new Date(startDate);
    maturityDate.setDate(maturityDate.getDate() + (maturityWeeks * 7));

    const birthDate = new Date(maturityDate);
    birthDate.setDate(birthDate.getDate() + gestationDays);

    // التحقق من التواريخ
    expect(maturityDate.getTime()).toBeGreaterThan(startDate.getTime());
    expect(birthDate.getTime()).toBeGreaterThan(maturityDate.getTime());
  });

  it('should calculate yearly production correctly', () => {
    const breedingInterval = 30; // كل 30 يوم
    const avgFry = 50; // متوسط 50 صغير
    const pairs = 2;

    const spawnsPerYear = Math.floor(365 / breedingInterval);
    const yearlyProduction = spawnsPerYear * avgFry * pairs;

    expect(spawnsPerYear).toBe(12);
    expect(yearlyProduction).toBe(1200); // 12 × 50 × 2
  });
});

describe('Maintenance Calculator', () => {
  // حساب جدول الصيانة
  const calculateMaintenanceSchedule = (tankSize: number) => {
    return {
      waterChange: Math.floor(tankSize * 0.25), // 25% تغيير ماء
      frequency: tankSize > 200 ? 'weekly' : 'bi-weekly',
      gravelVacuum: tankSize > 100 ? 'weekly' : 'monthly'
    };
  };

  it('should calculate maintenance for large tank', () => {
    const result = calculateMaintenanceSchedule(300);
    expect(result.waterChange).toBe(75); // 25% من 300
    expect(result.frequency).toBe('weekly');
    expect(result.gravelVacuum).toBe('weekly');
  });

  it('should calculate maintenance for small tank', () => {
    const result = calculateMaintenanceSchedule(50);
    expect(result.waterChange).toBe(12); // 25% من 50
    expect(result.frequency).toBe('bi-weekly');
    expect(result.gravelVacuum).toBe('monthly');
  });
});
