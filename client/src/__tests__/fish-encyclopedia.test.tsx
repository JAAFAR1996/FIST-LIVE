import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

describe('Fish Encyclopedia - Search & Filter', () => {
  const mockFishData = [
    {
      id: 1,
      name: 'Betta',
      arabicName: 'سمكة البيتا',
      difficulty: 'easy',
      temperament: 'semi-aggressive',
      minTankSize: 20,
      ph: { min: 6.5, max: 7.5 },
      temperature: { min: 24, max: 28 }
    },
    {
      id: 2,
      name: 'Goldfish',
      arabicName: 'السمكة الذهبية',
      difficulty: 'easy',
      temperament: 'peaceful',
      minTankSize: 40,
      ph: { min: 7.0, max: 8.0 },
      temperature: { min: 18, max: 22 }
    },
    {
      id: 3,
      name: 'Discus',
      arabicName: 'الديسكس',
      difficulty: 'difficult',
      temperament: 'peaceful',
      minTankSize: 200,
      ph: { min: 6.0, max: 7.0 },
      temperature: { min: 28, max: 30 }
    }
  ];

  it('should filter fish by difficulty level', () => {
    const easyFish = mockFishData.filter(fish => fish.difficulty === 'easy');
    expect(easyFish).toHaveLength(2);
    expect(easyFish.every(fish => fish.difficulty === 'easy')).toBe(true);
  });

  it('should filter fish by temperament', () => {
    const peacefulFish = mockFishData.filter(fish => fish.temperament === 'peaceful');
    expect(peacefulFish).toHaveLength(2);
  });

  it('should filter fish by minimum tank size', () => {
    const smallTankFish = mockFishData.filter(fish => fish.minTankSize <= 50);
    expect(smallTankFish).toHaveLength(2);
  });

  it('should search fish by Arabic name', () => {
    const searchTerm = 'بيتا';
    const results = mockFishData.filter(fish =>
      fish.arabicName.includes(searchTerm) || fish.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(results).toHaveLength(1);
    expect(results[0].arabicName).toContain('بيتا');
  });

  it('should search fish by English name', () => {
    const searchTerm = 'betta';
    const results = mockFishData.filter(fish =>
      fish.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('Betta');
  });
});

describe('Fish Compatibility Checker', () => {
  const checkCompatibility = (fish1: any, fish2: any) => {
    // التحقق من التوافق بناءً على المعايير
    const tempOverlap = !(
      fish1.temperature.max < fish2.temperature.min ||
      fish2.temperature.max < fish1.temperature.min
    );

    const phOverlap = !(
      fish1.ph.max < fish2.ph.min ||
      fish2.ph.max < fish1.ph.min
    );

    const temperamentCompatible = !(
      (fish1.temperament === 'aggressive' && fish2.temperament === 'peaceful') ||
      (fish2.temperament === 'aggressive' && fish1.temperament === 'peaceful')
    );

    return tempOverlap && phOverlap && temperamentCompatible;
  };

  it('should detect compatible fish species', () => {
    const fish1 = {
      temperature: { min: 24, max: 28 },
      ph: { min: 6.5, max: 7.5 },
      temperament: 'peaceful'
    };

    const fish2 = {
      temperature: { min: 25, max: 27 },
      ph: { min: 6.8, max: 7.2 },
      temperament: 'peaceful'
    };

    const result = checkCompatibility(fish1, fish2);
    expect(result).toBe(true);
  });

  it('should detect incompatible temperature ranges', () => {
    const fish1 = {
      temperature: { min: 18, max: 22 }, // أسماك باردة
      ph: { min: 7.0, max: 8.0 },
      temperament: 'peaceful'
    };

    const fish2 = {
      temperature: { min: 28, max: 30 }, // أسماك استوائية
      ph: { min: 6.5, max: 7.5 },
      temperament: 'peaceful'
    };

    const result = checkCompatibility(fish1, fish2);
    expect(result).toBe(false);
  });

  it('should detect incompatible temperaments', () => {
    const fish1 = {
      temperature: { min: 24, max: 28 },
      ph: { min: 6.5, max: 7.5 },
      temperament: 'aggressive'
    };

    const fish2 = {
      temperature: { min: 24, max: 28 },
      ph: { min: 6.5, max: 7.5 },
      temperament: 'peaceful'
    };

    const result = checkCompatibility(fish1, fish2);
    expect(result).toBe(false);
  });

  it('should detect incompatible pH ranges', () => {
    const fish1 = {
      temperature: { min: 24, max: 28 },
      ph: { min: 5.0, max: 6.0 }, // حمضي
      temperament: 'peaceful'
    };

    const fish2 = {
      temperature: { min: 24, max: 28 },
      ph: { min: 8.0, max: 9.0 }, // قلوي
      temperament: 'peaceful'
    };

    const result = checkCompatibility(fish1, fish2);
    expect(result).toBe(false);
  });
});

describe('Fish Details Display', () => {
  const mockFish = {
    id: 1,
    name: 'Betta',
    arabicName: 'سمكة البيتا',
    scientificName: 'Betta splendens',
    difficulty: 'easy',
    temperament: 'semi-aggressive',
    minTankSize: 20,
    maxSize: 7,
    lifespan: '3-5',
    diet: 'Carnivore',
    ph: { min: 6.5, max: 7.5 },
    temperature: { min: 24, max: 28 },
    description: 'سمكة جميلة ذات ألوان زاهية',
    careLevel: 'Beginner'
  };

  it('should display all fish information', () => {
    render(
      <div data-testid="fish-details">
        <h1>{mockFish.arabicName}</h1>
        <p>{mockFish.scientificName}</p>
        <p>الصعوبة: {mockFish.difficulty}</p>
        <p>الحجم الأدنى للحوض: {mockFish.minTankSize} لتر</p>
        <p>درجة الحرارة: {mockFish.temperature.min}-{mockFish.temperature.max}°C</p>
        <p>pH: {mockFish.ph.min}-{mockFish.ph.max}</p>
      </div>
    );

    expect(screen.getByText(mockFish.arabicName)).toBeDefined();
    expect(screen.getByText(mockFish.scientificName)).toBeDefined();
    expect(screen.getByText(/20 لتر/i)).toBeDefined();
  });

  it('should show difficulty badge with correct color', () => {
    const getDifficultyColor = (difficulty: string) => {
      switch (difficulty) {
        case 'easy': return 'green';
        case 'moderate': return 'yellow';
        case 'difficult': return 'red';
        default: return 'gray';
      }
    };

    expect(getDifficultyColor('easy')).toBe('green');
    expect(getDifficultyColor('difficult')).toBe('red');
  });
});

describe('Fish Finder Tool', () => {
  it('should recommend fish based on tank size', () => {
    const tankSize = 50;
    const allFish = [
      { name: 'Betta', minTankSize: 20 },
      { name: 'Goldfish', minTankSize: 40 },
      { name: 'Discus', minTankSize: 200 }
    ];

    const suitable = allFish.filter(fish => fish.minTankSize <= tankSize);

    expect(suitable).toHaveLength(2);
    expect(suitable.map(f => f.name)).toContain('Betta');
    expect(suitable.map(f => f.name)).toContain('Goldfish');
    expect(suitable.map(f => f.name)).not.toContain('Discus');
  });

  it('should recommend fish based on experience level', () => {
    const experienceLevel = 'beginner';
    const allFish = [
      { name: 'Betta', difficulty: 'easy' },
      { name: 'Goldfish', difficulty: 'easy' },
      { name: 'Discus', difficulty: 'difficult' }
    ];

    const suitable = allFish.filter(fish =>
      experienceLevel === 'beginner' ? fish.difficulty === 'easy' : true
    );

    expect(suitable).toHaveLength(2);
  });
});
