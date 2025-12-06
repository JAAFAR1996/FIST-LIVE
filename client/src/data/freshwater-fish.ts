export interface BreedingInfo {
  difficulty: 'easy' | 'moderate' | 'difficult' | 'expert';
  method: 'egg-layer' | 'live-bearer' | 'bubble-nest' | 'mouth-brooder';
  sexualDimorphism: string;
  spawningTriggers: string[];
  breedingSetup: {
    tankSize: string;
    waterConditions: string;
    temperature: string;
    equipment: string[];
  };
  spawningBehavior: string;
  eggCare: string;
  fryInfo: {
    firstFood: string;
    growthRate: string;
    adulthoodTime: string;
  };
  tips: string[];
}

export interface FishSpecies {
  id: string;
  commonName: string;
  arabicName: string;
  scientificName: string;
  family: string;
  origin: string;
  minSize: number; // cm
  maxSize: number; // cm
  lifespan: number; // years
  temperament: 'peaceful' | 'semi-aggressive' | 'aggressive';
  careLevel: 'beginner' | 'intermediate' | 'advanced';
  minTankSize: number; // liters
  waterParameters: {
    tempMin: number; // celsius
    tempMax: number;
    phMin: number;
    phMax: number;
    hardness: 'soft' | 'medium' | 'hard';
  };
  diet: string[];
  breeding: string | BreedingInfo;
  schooling: boolean;
  minimumGroup: number;
  compatibility: {
    goodWith: string[];
    avoidWith: string[];
  };
  description: string;
  careTips: string[];
  image: string;
  category: 'community' | 'cichlid' | 'catfish' | 'tetra' | 'livebearer' | 'betta' | 'gourami' | 'goldfish' | 'other';
}

export const freshwaterFish: FishSpecies[] = [
  {
    id: 'neon-tetra',
    commonName: 'Neon Tetra',
    arabicName: 'تترا نيون',
    scientificName: 'Paracheirodon innesi',
    family: 'Characidae',
    origin: 'أمريكا الجنوبية - نهر الأمازون',
    minSize: 2.5,
    maxSize: 4,
    lifespan: 8,
    temperament: 'peaceful',
    careLevel: 'beginner',
    minTankSize: 40,
    waterParameters: {
      tempMin: 20,
      tempMax: 26,
      phMin: 6.0,
      phMax: 7.0,
      hardness: 'soft',
    },
    diet: ['Flakes', 'Micro pellets', 'Frozen bloodworms', 'Brine shrimp'],
    breeding: {
      difficulty: 'difficult',
      method: 'egg-layer',
      sexualDimorphism: 'الإناث أكثر استدارة وامتلاءً، خاصة عند الحمل بالبيض. الخط الأزرق في الإناث قد يبدو منحنياً أكثر.',
      spawningTriggers: [
        'تعتيم الحوض (يحتاج لظلام شبه تام)',
        'مياه ناعمة جداً وحمضية (pH 5.0-6.0)',
        'تغذية بالأطعمة الحية',
        'ضوء الصباح الخافت يحفز التزاوج'
      ],
      breedingSetup: {
        tankSize: '20-40 لتر (منفصل)',
        waterConditions: 'pH 5.5-6.0، ماء ناعم جداً (< 2 dGH)',
        temperature: '25-26°م',
        equipment: ['فلتر إسفنجي ضعيف', 'نباتات كثيفة (Java Moss)', 'شبكة في القاع لحماية البيض']
      },
      spawningBehavior: 'يحدث التزاوج عادة في الصباح الباكر. يسبح الزوج جنباً إلى جنب وينثران البيض فوق النباتات.',
      eggCare: 'البيض حساس جداً للضوء! يجب تغطية الحوض تماماً لمنع الضوء. يفقس بعد 24 ساعة.',
      fryInfo: {
        firstFood: 'Infusoria (إنفوزوريا) و Paramecium',
        growthRate: 'بطيء في البداية',
        adulthoodTime: '6-8 أشهر'
      },
      tips: [
        '🌑 أهم عامل هو الظلام - الضوء يقتل البيض واليرقات',
        '💧 جودة المياه يجب أن تكون مثالية',
        '🦠 جهز مزارع الإنفوزوريا قبل أسبوعين',
        '🚫 اعزل الوالدين فوراً بعد وضع البيض'
      ]
    },
    schooling: true,
    minimumGroup: 6,
    compatibility: {
      goodWith: ['Cardinal Tetra', 'Harlequin Rasbora', 'Guppy', 'Corydoras', 'Dwarf Gourami'],
      avoidWith: ['Cichlids', 'Angelfish (adults)', 'Large Barbs'],
    },
    description: 'سمكة جميلة ذات لون أزرق نيون لامع مع خط أحمر. مثالية للمبتدئين وتضيف لمسة رائعة للأحواض المزروعة.',
    careTips: [
      'تفضل العيش في مجموعات لا تقل عن 6 أسماك',
      'تحتاج إلى إضاءة خافتة ومياه نظيفة',
      'حساسة لتغيرات المياه المفاجئة',
      'تتغذى بشكل أفضل في طبقات المياه الوسطى',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Paracheirodon_innesi_by_Fayzal%2C_Jr_Deposa.jpg/1280px-Paracheirodon_innesi_by_Fayzal%2C_Jr_Deposa.jpg',
    category: 'tetra',
  },
  {
    id: 'betta-splendens',
    commonName: 'Betta Fish',
    arabicName: 'سمكة البيتا / السيامي المقاتل',
    scientificName: 'Betta splendens',
    family: 'Osphronemidae',
    origin: 'جنوب شرق آسيا - تايلاند',
    minSize: 5,
    maxSize: 7,
    lifespan: 3,
    temperament: 'aggressive',
    careLevel: 'beginner',
    minTankSize: 20,
    waterParameters: {
      tempMin: 24,
      tempMax: 28,
      phMin: 6.5,
      phMax: 7.5,
      hardness: 'soft',
    },
    diet: ['Betta pellets', 'Bloodworms', 'Brine shrimp', 'Daphnia'],
    breeding: {
      difficulty: 'moderate',
      method: 'bubble-nest',
      sexualDimorphism: 'الذكور ذو ألوان زاهية وزعانف طويلة جداً. الإناث أصغر وألوانها باهتة مع زعانف قصيرة.',
      spawningTriggers: [
        'رفع درجة الحرارة إلى 27-28°م',
        'تغذية مكثفة بالأطعمة الحية (بلودورم)',
        'خفض مستوى الماء إلى 15-20 سم',
        'إضافة نباتات طافية'
      ],
      breedingSetup: {
        tankSize: '20-40 لتر (منفصل)',
        waterConditions: 'pH 7.0، ماء ناعم، نظيف جداً',
        temperature: '27-28°م',
        equipment: ['سخان', 'نباتات طافية (Indian Almond leaves)', 'مخبأ للأنثى', 'بدون فلتر قوي']
      },
      spawningBehavior: 'الذكر يبني عش فقاعات على السطح. يحضن الذكر ويطارد الأنثى تحت العش. يلتف حولها ويضغط لإخراج البيض.',
      eggCare: 'الذكر يجمع البيض ويضعه في عش الفقاعات. احفظ الذكر مع البيض. أزل الأنثى فوراً! الذكر يحرس البيض 24-48 ساعة حتى يفقس.',
      fryInfo: {
        firstFood: 'Infusoria لمدة 3-4 أيام، ثم baby brine shrimp',
        growthRate: 'متوسط - تبدأ الألوان بعد 8-10 أسابيع',
        adulthoodTime: '3-4 أشهر للنضج الكامل'
      },
      tips: [
        '🥚 البيض يطفو في عش الفقاعات - لا تحرك الماء!',
        '👨 الذكر أب ممتاز - لا تزيله حتى تسبح الصغار بحرية (48 ساعة)',
        '👩 أزل الأنثى فوراً! الذكر قد يقتلها',
        '⚡ الصغار حساسون جداً للتيار - استخدم فلتر إسفنجي خفيف',
        '🍃 ورق اللوز الهندي يحسن الخصوبة ويمنع الفطريات'
      ]
    },
    schooling: false,
    minimumGroup: 1,
    compatibility: {
      goodWith: ['Corydoras', 'Kuhli Loach', 'Mystery Snail', 'African Dwarf Frog'],
      avoidWith: ['Other Bettas (males)', 'Guppies', 'Neon Tetras', 'Fin-nippers'],
    },
    description: 'سمكة شهيرة بألوانها الزاهية وزعانفها الطويلة الجميلة. الذكور عدوانية تجاه بعضها.',
    careTips: [
      'الذكور يجب أن يُربوا منفردين',
      'يحتاج لسطح مياه هادئ للتنفس',
      'يفضل النباتات الحية',
      'تجنب الزعانف الطويلة مع أسماك عدوانية',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Kampffisch_Betta_splendens.jpg/1280px-Kampffisch_Betta_splendens.jpg',
    category: 'betta',
  },
  {
    id: 'guppy',
    commonName: 'Guppy',
    arabicName: 'سمكة الجوبي',
    scientificName: 'Poecilia reticulata',
    family: 'Poeciliidae',
    origin: 'أمريكا الجنوبية',
    minSize: 3,
    maxSize: 6,
    lifespan: 2,
    temperament: 'peaceful',
    careLevel: 'beginner',
    minTankSize: 40,
    waterParameters: {
      tempMin: 22,
      tempMax: 28,
      phMin: 6.8,
      phMax: 7.8,
      hardness: 'medium',
    },
    diet: ['Flakes', 'Algae', 'Vegetables', 'Live foods'],
    breeding: {
      difficulty: 'easy',
      method: 'live-bearer',
      sexualDimorphism: 'الذكور أصغر حجماً وأكثر ألواناً مع زعانف طويلة. الإناث أكبر وأقل لوناً مع بطن منتفخ.',
      spawningTriggers: [
        'درجة حرارة 26-28 درجة',
        'تغذية جيدة بالأطعمة الحية',
        'نسبة 1 ذكر لكل 2-3 إناث'
      ],
      breedingSetup: {
        tankSize: '20-40 لتر للتكاثر',
        waterConditions: 'pH 7.0-7.5، ماء متوسط الصلابة',
        temperature: '26-28°م',
        equipment: ['فلتر إسفنجي', 'نباتات كثيفة (Java moss)', 'صندوق ولادة اختياري']
      },
      spawningBehavior: 'الذكر يطارد الأنثى ويحدث التخصيب داخلياً. فترة الحمل 21-30 يوم.',
      eggCare: 'لا توجد بيوض - ولادة مباشرة! الصغار يسبحون فوراً. انقل الصغار أو الأم لحمايتهم.',
      fryInfo: {
        firstFood: 'Infusoria، brine shrimp حديث الفقس، طعام سائل للصغار',
        growthRate: 'سريع - ينضجون في 3-4 أشهر',
        adulthoodTime: '3-6 أشهر حسب الظروف'
      },
      tips: [
        '⚠️ تأكل الصغار! افصلهم فوراً أو استخدم نباتات كثيفة',
        '🌱 Java moss و Guppy grass ممتازان لاختباء الصغار',
        '👶 الأنثى تلد 20-50 صغير كل شهر!',
        '🔄 تجنب التهجين الداخلي - أضف دماء جديدة كل 3-4 أجيال'
      ]
    },
    schooling: false,
    minimumGroup: 3,
    compatibility: {
      goodWith: ['Platy', 'Molly', 'Swordtail', 'Tetra', 'Corydoras'],
      avoidWith: ['Bettas', 'Large Cichlids', 'Aggressive fish'],
    },
    description: 'سمكة ملونة صغيرة سهلة التربية. مثالية للمبتدئين وتتكاثر بسرعة.',
    careTips: [
      'يتكاثر بسرعة - راقب أعداد الصغار',
      'تحتاج لنباتات كثيفة لحماية الصغار',
      'تفضل المياه الصلبة قليلاً',
      'الذكور أكثر ألواناً من الإناث',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Guppy_copance.jpg/1280px-Guppy_copance.jpg',
    category: 'livebearer',
  },
  {
    id: 'angelfish',
    commonName: 'Angelfish',
    arabicName: 'سمكة الملاك',
    scientificName: 'Pterophyllum scalare',
    family: 'Cichlidae',
    origin: 'أمريكا الجنوبية - الأمازون',
    minSize: 15,
    maxSize: 25,
    lifespan: 10,
    temperament: 'semi-aggressive',
    careLevel: 'intermediate',
    minTankSize: 200,
    waterParameters: {
      tempMin: 25,
      tempMax: 28,
      phMin: 6.5,
      phMax: 7.5,
      hardness: 'soft',
    },
    diet: ['Flakes', 'Pellets', 'Bloodworms', 'Brine shrimp', 'Vegetables'],
    breeding: {
      difficulty: 'moderate',
      method: 'egg-layer',
      sexualDimorphism: 'صعب التفريق! عند النضج: الذكور لديهم جبهة منحنية أكثر. الإناث بطن أكبر وأنبوب تناسلي أوضح عند التكاثر.',
      spawningTriggers: [
        'زوج ناضج يربط ببعضه (pair bonding)',
        'تغذية مكثفة بالديدان الحية',
        'تغيير ماء كبير (50%) بماء أبرد قليلاً',
        'إضافة سطح أملس للبيض (ورقة نبات، أنبوب PVC)'
      ],
      breedingSetup: {
        tankSize: '150-200 لتر للتكاثر',
        waterConditions: 'pH 6.5-6.9، ماء ناعم جداً (GH < 5)',
        temperature: '27-28°م',
        equipment: ['سخان', 'فلتر إسفنجي', 'سطح أملس للبيض', 'نباتات كبيرة']
      },
      spawningBehavior: 'الزوج ينظف السطح لمدة يومين. الأنثى تضع 200-400 بيضة في صفوف. الذكر يخصب البيض. كلاهما يحرس ويهوي البيض بزعانفه.',
      eggCare: 'الوالدان يحرسان البيض 60 ساعة. يزيلان البيض الأبيض (الميت). بعد الفقس، ينقلان الصغار بأفواههما لحفرة أخرى. إذا أكلا الصغار، ازرع بيض صناعي مع aerator.',
      fryInfo: {
        firstFood: 'Baby brine shrimp بعد 5 أيام من الفقس',
        growthRate: 'متوسط - يصلون 3-4 سم في 3 أشهر',
        adulthoodTime: '6-8 أشهر للنضج الجنسي'
      },
      tips: [
        '💑 دع الزوج يختار بعضه - لا تجبرهما!',
        '🥚 البيض برتقالي/بني صحي، أبيض = ميت أو غير مخصب',
        '👪 معظم الأزواج يأكلون أول 2-3 مرات - هذا طبيعي!',
        '🌿 ضع سيراميك أو ورقة Amazon Sword كسطح تبيض',
        '💡 خفف الإضاءة - Angelfish تحب الظلام عند التكاثر',
        '⚠️ افصلهما في حوض آخر - سيصبحان عدوانيين جداً!'
      ]
    },
    schooling: false,
    minimumGroup: 2,
    compatibility: {
      goodWith: ['Large Tetras', 'Corydoras', 'Pleco', 'Large Rasbora'],
      avoidWith: ['Small fish (will eat them)', 'Fin-nippers', 'Aggressive Cichlids'],
    },
    description: 'سمكة أنيقة ومميزة بشكلها المثلث. تحتاج لحوض عالي وواسع.',
    careTips: [
      'تحتاج لحوض ارتفاعه 50 سم على الأقل',
      'قد تأكل الأسماك الصغيرة',
      'تصبح إقليمية أثناء التكاثر',
      'تحتاج لتغذية متنوعة',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Pterophyllum_scalare_freshwater_angelfish_20.jpg/1280px-Pterophyllum_scalare_freshwater_angelfish_20.jpg',
    category: 'cichlid',
  },
  {
    id: 'corydoras-paleatus',
    commonName: 'Peppered Corydoras',
    arabicName: 'كوريدوراس مفلفل',
    scientificName: 'Corydoras paleatus',
    family: 'Callichthyidae',
    origin: 'أمريكا الجنوبية',
    minSize: 5,
    maxSize: 7,
    lifespan: 5,
    temperament: 'peaceful',
    careLevel: 'beginner',
    minTankSize: 60,
    waterParameters: {
      tempMin: 20,
      tempMax: 25,
      phMin: 6.5,
      phMax: 7.5,
      hardness: 'medium',
    },
    diet: ['Sinking pellets', 'Wafers', 'Bloodworms', 'Leftover food'],
    breeding: 'يضع البيض على الزجاج والنباتات. سهل نسبياً.',
    schooling: true,
    minimumGroup: 6,
    compatibility: {
      goodWith: ['Most peaceful fish', 'Tetra', 'Guppy', 'Angelfish'],
      avoidWith: ['Large aggressive Cichlids'],
    },
    description: 'سمكة قاع نشطة ولطيفة. ممتازة لتنظيف الحوض من بقايا الطعام.',
    careTips: [
      'تعيش في القاع - تحتاج لرمل ناعم',
      'تفضل العيش في مجموعات',
      'نشطة جداً وممتعة للمراقبة',
      'تحتاج لطعام يغرق للقاع',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Corydoras_paleatus_1.jpg/1280px-Corydoras_paleatus_1.jpg',
    category: 'catfish',
  },
  {
    id: 'goldfish',
    commonName: 'Goldfish',
    arabicName: 'سمكة ذهبية',
    scientificName: 'Carassius auratus',
    family: 'Cyprinidae',
    origin: 'شرق آسيا - الصين',
    minSize: 10,
    maxSize: 30,
    lifespan: 20,
    temperament: 'peaceful',
    careLevel: 'beginner',
    minTankSize: 150,
    waterParameters: {
      tempMin: 18,
      tempMax: 24,
      phMin: 7.0,
      phMax: 8.0,
      hardness: 'medium',
    },
    diet: ['Goldfish pellets', 'Vegetables', 'Bloodworms', 'Algae'],
    breeding: {
      difficulty: 'easy',
      method: 'egg-layer',
      sexualDimorphism: 'الذكور يطورون "درنات التزاوج" (نقاك بيضاء صغيرة) على أغطية الخياشيم والزعانف الصدرية. الإناث تصبح ممتلئة وغير متناظرة من الأعلى.',
      spawningTriggers: [
        'ارتفاع درجة الحرارة تدريجياً (محاكاة الربيع)',
        'تغييرات ماء كبيرة',
        'تغذية عالية البروتين',
        'إطالة فترة الإضاءة'
      ],
      breedingSetup: {
        tankSize: '100+ لتر',
        waterConditions: 'نظيف جداً، pH 7.0-7.5',
        temperature: '20-23°م',
        equipment: ['مماسح تزاوج (Spawning Mops)', 'نباتات كثيفة', 'تهوية جيدة']
      },
      spawningBehavior: 'الذكور يطاردون الإناث ويدفعون بطونهم (المطاردة). تطلق الأنثى البيض ويخصبه الذكر فوراً.',
      eggCare: 'البيض لزج ويلتصق بالنباتات. يفقس في 2-7 أيام حسب الحرارة. يجب إزالة الأبوين أو البيض.',
      fryInfo: {
        firstFood: 'صفار بيض مسلوق، طعام سائل، ارتيميا',
        growthRate: 'سريع مع التغذية الجيدة',
        adulthoodTime: '1 سنة'
      },
      tips: [
        '🍽️ السمك الذهبي يأكل بيضه بشراهة!',
        '🧹 نظافة الماء ضرورية للصغار',
        '📈 الصغار تحتاج مساحة كبيرة للنمو السليم',
        '🔍 افحص البيض وأزل الأبيض منه (الفاسد) لتجنب الفطر'
      ]
    },
    schooling: false,
    minimumGroup: 2,
    compatibility: {
      goodWith: ['Other Goldfish', 'White Cloud Mountain Minnow', 'Hillstream Loach'],
      avoidWith: ['Tropical fish', 'Small fish', 'Aggressive fish'],
    },
    description: 'سمكة تقليدية شهيرة. تحتاج لحوض كبير ومياه باردة.',
    careTips: [
      'تنتج فضلات كثيرة - تحتاج لفلتر قوي',
      'تنمو كبيرة جداً - تحتاج لأحواض 200+ لتر',
      'لا تحتاج لسخان (مياه باردة)',
      'تعيش لسنوات طويلة مع العناية الصحيحة',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Fish_-_Tekniska_museet_-_Almost_Goldfish.jpg/1280px-Fish_-_Tekniska_museet_-_Almost_Goldfish.jpg',
    category: 'goldfish',
  },
  {
    id: 'platy',
    commonName: 'Platy',
    arabicName: 'سمكة البلاتي',
    scientificName: 'Xiphophorus maculatus',
    family: 'Poeciliidae',
    origin: 'أمريكا الوسطى والجنوبية',
    minSize: 4,
    maxSize: 7,
    lifespan: 3,
    temperament: 'peaceful',
    careLevel: 'beginner',
    minTankSize: 40,
    waterParameters: {
      tempMin: 22,
      tempMax: 28,
      phMin: 7.0,
      phMax: 8.3,
      hardness: 'hard',
    },
    diet: ['Flakes', 'Pellets', 'Vegetables', 'Live foods'],
    breeding: {
      difficulty: 'easy',
      method: 'live-bearer',
      sexualDimorphism: 'الذكور أصغر وأكثر ألواناً مع زعانف طويلة. الإناث أكبر حجماً مع بطن منتفخ واضح.',
      spawningTriggers: [
        'درجة حرارة مستقرة 24-26°م',
        'تغذية جيدة بالأطعمة الحية',
        'نسبة 1 ذكر لكل 2-3 إناث',
        'جودة ماء جيدة'
      ],
      breedingSetup: {
        tankSize: '40+ لتر',
        waterConditions: 'pH 7.0-8.0، ماء متوسط إلى صلب',
        temperature: '24-26°م',
        equipment: ['فلتر إسفنجي', 'نباتات كثيفة', 'صندوق ولادة (اختياري)']
      },
      spawningBehavior: 'الذكر يطارد الأنثى. التخصيب داخلي. فترة الحمل 24-30 يوم.',
      eggCare: 'لا توجد بيوض - ولادة مباشرة! الصغار يسبحون فوراً. انقل الصغار أو الأم.',
      fryInfo: {
        firstFood: 'طعام سائل، رقائق مطحونة ناعم، baby brine shrimp',
        growthRate: 'سريع - جاهزون للبيع في 8-10 أسابيع',
        adulthoodTime: '4-5 أشهر'
      },
      tips: [
        '⚠️ تأكل الصغار - افصلهم فوراً!',
        '🌱 نباتات Java Moss تحمي الصغار',
        '👶 تلد 20-40 صغير كل شهر',
        '🎨 تتزاوج مع Swordtail - تجنب التهجين إذا أردت سلالات نقية'
      ]
    },
    schooling: false,
    minimumGroup: 3,
    compatibility: {
      goodWith: ['Guppy', 'Molly', 'Swordtail', 'Tetra', 'Corydoras'],
      avoidWith: ['Bettas', 'Large aggressive Cichlids'],
    },
    description: 'سمكة ملونة صلبة وسهلة التربية. متوفرة بألوان عديدة.',
    careTips: [
      'تحب المياه الصلبة قليلاً',
      'تتكاثر بسهولة',
      'ألوان متنوعة (أحمر، أصفر، برتقالي)',
      'نشطة وودودة',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Xiphophorus_maculatus_-_female_-_01.jpg/1280px-Xiphophorus_maculatus_-_female_-_01.jpg',
    category: 'livebearer',
  },
  {
    id: 'cardinal-tetra',
    commonName: 'Cardinal Tetra',
    arabicName: 'تترا كاردينال',
    scientificName: 'Paracheirodon axelrodi',
    family: 'Characidae',
    origin: 'أمريكا الجنوبية - الأمازون',
    minSize: 3,
    maxSize: 5,
    lifespan: 5,
    temperament: 'peaceful',
    careLevel: 'beginner',
    minTankSize: 60,
    waterParameters: {
      tempMin: 23,
      tempMax: 27,
      phMin: 5.5,
      phMax: 7.0,
      hardness: 'soft',
    },
    diet: ['Micro pellets', 'Flakes', 'Frozen foods', 'Live foods'],
    breeding: 'صعب في الأحواض المنزلية. يحتاج لمياه حمضية جداً.',
    schooling: true,
    minimumGroup: 10,
    compatibility: {
      goodWith: ['Neon Tetra', 'Harlequin Rasbora', 'Corydoras', 'Discus'],
      avoidWith: ['Large Cichlids', 'Angelfish', 'Aggressive fish'],
    },
    description: 'مشابه للنيون تترا لكن أكثر ألواناً. الخط الأحمر يمتد لكامل الجسم.',
    careTips: [
      'يحتاج لمجموعة كبيرة (10+)',
      'يفضل الماء الناعم والحمضي',
      'جميل جداً في الأحواض المزروعة',
      'حساس لجودة المياه',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Paracheirodon_axelrodi.jpg/1280px-Paracheirodon_axelrodi.jpg',
    category: 'tetra',
  },
  {
    id: 'molly',
    commonName: 'Molly',
    arabicName: 'سمكة مولي',
    scientificName: 'Poecilia sphenops',
    family: 'Poeciliidae',
    origin: 'أمريكا الوسطى والجنوبية',
    minSize: 6,
    maxSize: 12,
    lifespan: 5,
    temperament: 'peaceful',
    careLevel: 'beginner',
    minTankSize: 80,
    waterParameters: {
      tempMin: 24,
      tempMax: 28,
      phMin: 7.0,
      phMax: 8.5,
      hardness: 'hard',
    },
    diet: ['Algae', 'Vegetables', 'Flakes', 'Live foods'],
    breeding: {
      difficulty: 'easy',
      method: 'live-bearer',
      sexualDimorphism: 'الذكور أصغر مع زعنفة شرجية معدلة (gonopodium). الإناث أكبر وأكثر استدارة.',
      spawningTriggers: [
        'درجة حرارة 26-28°م',
        'إضافة ملح مائي قليل (1 ملعقة/10 لتر)',
        'تغذية بالطحالب والخضروات',
        'نسبة 1 ذكر : 2-3 إناث'
      ],
      breedingSetup: {
        tankSize: '80+ لتر',
        waterConditions: 'pH 7.5-8.5، ماء صلب، ملح اختياري',
        temperature: '26-28°م',
        equipment: ['فلتر قوي', 'نباتات طويلة', 'صندوق ولادة كبير']
      },
      spawningBehavior: 'الذكر يطارد الأنثى بنشاط. التخصيب داخلي. فترة الحمل 60-70 يوم.',
      eggCare: 'ولادة مباشرة - لا بيض! تلد حتى 100 صغير. انقلهم فوراً للحماية.',
      fryInfo: {
        firstFood: 'رقائق مطحونة، spirulina، baby brine shrimp',
        growthRate: 'متوسط - تكبر ببطء لكنها قوية',
        adulthoodTime: '5-6 أشهر'
      },
      tips: [
        '🧂 الملح يحسن الصحة لكنه اختياري',
        '🍃 تحب أكل الطحالب - مفيدة للحوض',
        '👶 تلد عدد كبير - خطط لمكان الصغار',
        '⚠️ الأهل يأكلون الصغار بكثرة!'
      ]
    },
    schooling: false,
    minimumGroup: 3,
    compatibility: {
      goodWith: ['Platy', 'Guppy', 'Swordtail', 'Larger Tetras'],
      avoidWith: ['Bettas', 'Aggressive Cichlids', 'Fin-nippers'],
    },
    description: 'سمكة قوية ونشطة. متوفرة بألوان متعددة (أسود، ذهبي، رخامي).',
    careTips: [
      'تحب أكل الطحالب والنباتات',
      'يمكن إضافة ملح مائي قليل',
      'تنمو كبيرة نسبياً',
      'تحتاج لحوض واسع',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Poecilia_sphenops.jpg/1280px-Poecilia_sphenops.jpg',
    category: 'livebearer',
  },
  {
    id: 'dwarf-gourami',
    commonName: 'Dwarf Gourami',
    arabicName: 'جورامي قزم',
    scientificName: 'Trichogaster lalius',
    family: 'Osphronemidae',
    origin: 'جنوب آسيا - الهند وبنغلاديش',
    minSize: 5,
    maxSize: 9,
    lifespan: 4,
    temperament: 'peaceful',
    careLevel: 'beginner',
    minTankSize: 40,
    waterParameters: {
      tempMin: 24,
      tempMax: 28,
      phMin: 6.0,
      phMax: 7.5,
      hardness: 'soft',
    },
    diet: ['Flakes', 'Pellets', 'Live foods', 'Frozen foods'],
    breeding: 'الذكر يبني عش فقاعات. سهل التكاثر نسبياً.',
    schooling: false,
    minimumGroup: 1,
    compatibility: {
      goodWith: ['Tetra', 'Rasbora', 'Corydoras', 'Peaceful fish'],
      avoidWith: ['Bettas', 'Aggressive fish', 'Large Cichlids'],
    },
    description: 'سمكة جميلة بألوان زاهية. هادئة ومثالية للأحواض المجتمعية.',
    careTips: [
      'يحتاج للتنفس من السطح',
      'ألوان الذكور أجمل من الإناث',
      'خجول في البداية',
      'يفضل النباتات الطافية',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Trichogaster_lalius_male.jpg/1280px-Trichogaster_lalius_male.jpg',
    category: 'gourami',
  },
  {
    id: 'black-skirt-tetra',
    commonName: 'Black Skirt Tetra',
    arabicName: 'تترا التنورة السوداء',
    scientificName: 'Gymnocorymbus ternetzi',
    family: 'Characidae',
    origin: 'أمريكا الجنوبية',
    minSize: 5,
    maxSize: 7,
    lifespan: 5,
    temperament: 'peaceful',
    careLevel: 'beginner',
    minTankSize: 60,
    waterParameters: {
      tempMin: 20,
      tempMax: 26,
      phMin: 6.0,
      phMax: 8.0,
      hardness: 'medium',
    },
    diet: ['Flakes', 'Pellets', 'Live foods', 'Frozen foods'],
    breeding: 'يضع البيض بين النباتات. متوسط الصعوبة.',
    schooling: true,
    minimumGroup: 6,
    compatibility: {
      goodWith: ['Tetra', 'Rasbora', 'Corydoras', 'Platy', 'Guppy'],
      avoidWith: ['Long-finned fish (may nip)', 'Very small fish'],
    },
    description: 'سمكة نشطة بلون أسود مميز. سهلة التربية وقوية.',
    careTips: [
      'تحب السباحة في مجموعات',
      'قد تقضم الزعانف الطويلة',
      'نشطة جداً',
      'تحتاج لمساحة سباحة',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Black_Widow_Tetra_%28Gymnocorymbus_ternetzi%29.jpg/1280px-Black_Widow_Tetra_%28Gymnocorymbus_ternetzi%29.jpg',
    category: 'tetra',
  },
  {
    id: 'swordtail',
    commonName: 'Swordtail',
    arabicName: 'سمكة السيف',
    scientificName: 'Xiphophorus hellerii',
    family: 'Poeciliidae',
    origin: 'أمريكا الوسطى والجنوبية',
    minSize: 10,
    maxSize: 15,
    lifespan: 5,
    temperament: 'peaceful',
    careLevel: 'beginner',
    minTankSize: 80,
    waterParameters: {
      tempMin: 22,
      tempMax: 28,
      phMin: 7.0,
      phMax: 8.3,
      hardness: 'hard',
    },
    diet: ['Flakes', 'Pellets', 'Vegetables', 'Live foods'],
    breeding: {
      difficulty: 'easy',
      method: 'live-bearer',
      sexualDimorphism: 'الذكور لديهم "سيف" طويل في الذيل و gonopodium. الإناث أكبر بدون سيف.',
      spawningTriggers: [
        'درجة حرارة 24-27°م',
        'تغذية جيدة ومتنوعة',
        'نباتات كثيفة للأمان',
        'نسبة 1 ذكر : 3 إناث (الذكور عدوانيون)'
      ],
      breedingSetup: {
        tankSize: '80+ لتر (حجم مهم)',
        waterConditions: 'pH 7.0-8.0، ماء متوسط إلى صلب',
        temperature: '24-27°م',
        equipment: ['فلتر جيد', 'نباتات طويلة', 'غطاء (يقفزون!)', 'صندوق ولادة']
      },
      spawningBehavior: 'الذكر يطارد الأنثى بعدوانية. التخصيب داخلي. فترة الحمل 28 يوم.',
      eggCare: 'ولادة مباشرة. تلد 20-100 صغير. الوالدان يأكلان الصغار - افصلهم!',
      fryInfo: {
        firstFood: 'رقائق مطحونة، brine shrimp، طعام سائل',
        growthRate: 'سريع - ينمو السيف في 3-4 أشهر',
        adulthoodTime: '4-6 أشهر'
      },
      tips: [
        '⚔️ السيف يظهر عند النضج فقط',
        '💪 الذكور عدوانيون - 1 ذكر أفضل',
        '🦘 يقفزون - غطي الحوض دائماً!',
        '👶 ينتجون عدد كبير - خطط مسبقاً'
      ]
    },
    schooling: false,
    minimumGroup: 2,
    compatibility: {
      goodWith: ['Platy', 'Molly', 'Guppy', 'Tetra', 'Corydoras'],
      avoidWith: ['Bettas', 'Aggressive Cichlids'],
    },
    description: 'سمكة نشطة مميزة بذيل السيف عند الذكور. متوفرة بألوان عديدة.',
    careTips: [
      'ذكور السيف طويلة ومميزة',
      'قد يكون الذكور عدوانيين قليلاً',
      'يحب القفز - غطي الحوض',
      'نشط وسهل التربية',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Xiphophorus_hellerii.jpg/1280px-Xiphophorus_hellerii.jpg',
    category: 'livebearer',
  },
  {
    id: 'zebra-danio',
    commonName: 'Zebra Danio',
    arabicName: 'دانيو زيبرا',
    scientificName: 'Danio rerio',
    family: 'Cyprinidae',
    origin: 'جنوب آسيا',
    minSize: 4,
    maxSize: 6,
    lifespan: 5,
    temperament: 'peaceful',
    careLevel: 'beginner',
    minTankSize: 40,
    waterParameters: {
      tempMin: 18,
      tempMax: 25,
      phMin: 6.5,
      phMax: 7.5,
      hardness: 'medium',
    },
    diet: ['Flakes', 'Micro pellets', 'Live foods', 'Frozen foods'],
    breeding: 'يضع البيض. سهل التكاثر.',
    schooling: true,
    minimumGroup: 6,
    compatibility: {
      goodWith: ['Tetra', 'Rasbora', 'Guppy', 'Platy', 'Corydoras'],
      avoidWith: ['Slow-moving fish', 'Long-finned fish'],
    },
    description: 'سمكة صلبة جداً وسريعة. مثالية للمبتدئين ولتدوير الحوض.',
    careTips: [
      'نشطة جداً وسريعة',
      'تحتاج لمساحة سباحة',
      'صلبة وتتحمل ظروف متنوعة',
      'مثالية لبداية الحوض',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Zebrafisch.jpg/1280px-Zebrafisch.jpg',
    category: 'other',
  },
  {
    id: 'tiger-barb',
    commonName: 'Tiger Barb',
    arabicName: 'بارب النمر',
    scientificName: 'Puntigrus tetrazona',
    family: 'Cyprinidae',
    origin: 'جنوب شرق آسيا',
    minSize: 5,
    maxSize: 7,
    lifespan: 6,
    temperament: 'semi-aggressive',
    careLevel: 'beginner',
    minTankSize: 80,
    waterParameters: {
      tempMin: 23,
      tempMax: 27,
      phMin: 6.0,
      phMax: 8.0,
      hardness: 'medium',
    },
    diet: ['Flakes', 'Pellets', 'Live foods', 'Vegetables'],
    breeding: 'يضع البيض. متوسط الصعوبة.',
    schooling: true,
    minimumGroup: 6,
    compatibility: {
      goodWith: ['Other Barbs', 'Fast swimming fish', 'Large Tetras'],
      avoidWith: ['Bettas', 'Angelfish', 'Gourami', 'Long-finned fish'],
    },
    description: 'سمكة نشطة بألوان جميلة. قد تقضم الزعانف.',
    careTips: [
      'يجب تربيتها في مجموعات كبيرة',
      'قد تقضم الزعانف الطويلة',
      'نشطة جداً',
      'تحتاج لرفقاء سريعين',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Puntius_tetrazona.jpg/1280px-Puntius_tetrazona.jpg',
    category: 'other',
  },
  {
    id: 'pearl-gourami',
    commonName: 'Pearl Gourami',
    arabicName: 'جورامي اللؤلؤ',
    scientificName: 'Trichopodus leerii',
    family: 'Osphronemidae',
    origin: 'جنوب شرق آسيا',
    minSize: 10,
    maxSize: 12,
    lifespan: 5,
    temperament: 'peaceful',
    careLevel: 'beginner',
    minTankSize: 100,
    waterParameters: {
      tempMin: 24,
      tempMax: 28,
      phMin: 6.0,
      phMax: 7.5,
      hardness: 'soft',
    },
    diet: ['Flakes', 'Pellets', 'Live foods', 'Vegetables'],
    breeding: 'يبني عش فقاعات. سهل نسبياً.',
    schooling: false,
    minimumGroup: 1,
    compatibility: {
      goodWith: ['Tetra', 'Rasbora', 'Corydoras', 'Peaceful Cichlids'],
      avoidWith: ['Aggressive fish', 'Fin-nippers'],
    },
    description: 'سمكة جميلة بنقاط لؤلؤية لامعة. هادئة ورائعة.',
    careTips: [
      'يحتاج لسطح هادئ للتنفس',
      'جميل جداً عند النضج',
      'خجول قليلاً',
      'يحب النباتات الكثيفة',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Trichopodus_leerii.jpg/1280px-Trichopodus_leerii.jpg',
    category: 'gourami',
  },
  {
    id: 'bristlenose-pleco',
    commonName: 'Bristlenose Pleco',
    arabicName: 'بليكو شوكي الأنف',
    scientificName: 'Ancistrus sp.',
    family: 'Loricariidae',
    origin: 'أمريكا الجنوبية',
    minSize: 10,
    maxSize: 15,
    lifespan: 12,
    temperament: 'peaceful',
    careLevel: 'beginner',
    minTankSize: 100,
    waterParameters: {
      tempMin: 20,
      tempMax: 28,
      phMin: 6.5,
      phMax: 7.5,
      hardness: 'medium',
    },
    diet: ['Algae wafers', 'Vegetables', 'Wood', 'Sinking pellets'],
    breeding: 'يضع البيض في الكهوف. سهل نسبياً.',
    schooling: false,
    minimumGroup: 1,
    compatibility: {
      goodWith: ['Most peaceful and semi-aggressive fish'],
      avoidWith: ['Very aggressive Cichlids'],
    },
    description: 'سمكة ممتازة لأكل الطحالب. لها شوارب مميزة.',
    careTips: [
      'يحتاج لخشب في الحوض',
      'ليلي النشاط',
      'يحتاج لكهوف ومخابئ',
      'ممتاز لتنظيف الطحالب',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Ancistrus_sp.jpg/1280px-Ancistrus_sp.jpg',
    category: 'catfish',
  },
  {
    id: 'kuhli-loach',
    commonName: 'Kuhli Loach',
    arabicName: 'كولي لوتش / ثعبان الكولي',
    scientificName: 'Pangio kuhlii',
    family: 'Cobitidae',
    origin: 'جنوب شرق آسيا',
    minSize: 8,
    maxSize: 12,
    lifespan: 10,
    temperament: 'peaceful',
    careLevel: 'beginner',
    minTankSize: 80,
    waterParameters: {
      tempMin: 24,
      tempMax: 28,
      phMin: 5.5,
      phMax: 7.0,
      hardness: 'soft',
    },
    diet: ['Sinking pellets', 'Bloodworms', 'Brine shrimp', 'Leftover food'],
    breeding: 'نادر في الأحواض. صعب.',
    schooling: true,
    minimumGroup: 5,
    compatibility: {
      goodWith: ['Peaceful fish', 'Tetra', 'Rasbora', 'Guppy'],
      avoidWith: ['Large aggressive fish'],
    },
    description: 'سمكة قاع طويلة كالثعبان. خجولة وليلية.',
    careTips: [
      'يحتاج لرمل ناعم',
      'خجول - نشط ليلاً',
      'يحب الاختباء',
      'ممتع للمراقبة',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Pangio_kuhlii.jpg/1280px-Pangio_kuhlii.jpg',
    category: 'other',
  },
  {
    id: 'harlequin-rasbora',
    commonName: 'Harlequin Rasbora',
    arabicName: 'رازبورا هارليكوين',
    scientificName: 'Trigonostigma heteromorpha',
    family: 'Cyprinidae',
    origin: 'جنوب شرق آسيا',
    minSize: 4,
    maxSize: 5,
    lifespan: 6,
    temperament: 'peaceful',
    careLevel: 'beginner',
    minTankSize: 40,
    waterParameters: {
      tempMin: 22,
      tempMax: 28,
      phMin: 6.0,
      phMax: 7.5,
      hardness: 'soft',
    },
    diet: ['Flakes', 'Micro pellets', 'Live foods', 'Frozen foods'],
    breeding: 'يضع البيض تحت الأوراق. متوسط الصعوبة.',
    schooling: true,
    minimumGroup: 8,
    compatibility: {
      goodWith: ['Tetra', 'Corydoras', 'Dwarf Gourami', 'Small peaceful fish'],
      avoidWith: ['Large aggressive fish'],
    },
    description: 'سمكة جميلة بعلامة برتقالية مثلثة. مثالية للأحواض المزروعة.',
    careTips: [
      'تحب المياه الناعمة',
      'تحتاج لمجموعة كبيرة',
      'نشطة في النهار',
      'جميلة في الأحواض المزروعة',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Trigonostigma_heteromorpha.jpg/1280px-Trigonostigma_heteromorpha.jpg',
    category: 'other',
  },
  {
    id: 'cherry-barb',
    commonName: 'Cherry Barb',
    arabicName: 'بارب الكرز',
    scientificName: 'Puntius titteya',
    family: 'Cyprinidae',
    origin: 'سري لانكا',
    minSize: 4,
    maxSize: 5,
    lifespan: 6,
    temperament: 'peaceful',
    careLevel: 'beginner',
    minTankSize: 60,
    waterParameters: {
      tempMin: 23,
      tempMax: 27,
      phMin: 6.0,
      phMax: 7.5,
      hardness: 'soft',
    },
    diet: ['Flakes', 'Pellets', 'Live foods', 'Vegetables'],
    breeding: 'يضع البيض بين النباتات. سهل نسبياً.',
    schooling: true,
    minimumGroup: 6,
    compatibility: {
      goodWith: ['Tetra', 'Rasbora', 'Corydoras', 'Dwarf Gourami', 'Platy'],
      avoidWith: ['Large aggressive fish', 'Very small fish'],
    },
    description: 'سمكة صغيرة جميلة. الذكور حمراء زاهية.',
    careTips: [
      'الذكور أكثر احمراراً',
      'هادئة ومسالمة',
      'تحب النباتات الكثيفة',
      'سهلة التربية',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Puntius_titteya.jpg/1280px-Puntius_titteya.jpg',
    category: 'other',
  },
  {
    id: 'german-blue-ram',
    commonName: 'German Blue Ram',
    arabicName: 'رام أزرق ألماني',
    scientificName: 'Mikrogeophagus ramirezi',
    family: 'Cichlidae',
    origin: 'أمريكا الجنوبية',
    minSize: 5,
    maxSize: 7,
    lifespan: 3,
    temperament: 'peaceful',
    careLevel: 'intermediate',
    minTankSize: 60,
    waterParameters: {
      tempMin: 26,
      tempMax: 30,
      phMin: 6.0,
      phMax: 7.5,
      hardness: 'soft',
    },
    diet: ['Pellets', 'Flakes', 'Live foods', 'Frozen foods'],
    breeding: 'يضع البيض على الأسطح. يحتاج لعناية.',
    schooling: false,
    minimumGroup: 2,
    compatibility: {
      goodWith: ['Tetra', 'Corydoras', 'Peaceful fish'],
      avoidWith: ['Aggressive fish', 'Large Cichlids'],
    },
    description: 'سيكلد قزم جميل جداً بألوان زرقاء وصفراء. حساس قليلاً.',
    careTips: [
      'يحتاج لمياه دافئة',
      'حساس لجودة المياه',
      'جميل جداً',
      'يحتاج لرفاق هادئين',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Mikrogeophagus_ramirezi.jpg/1280px-Mikrogeophagus_ramirezi.jpg',
    category: 'cichlid',
  },
  {
    id: 'otocinclus',
    commonName: 'Otocinclus Catfish',
    arabicName: 'أوتوسينكلوس / سمكة التنظيف القزمة',
    scientificName: 'Otocinclus sp.',
    family: 'Loricariidae',
    origin: 'أمريكا الجنوبية',
    minSize: 3,
    maxSize: 5,
    lifespan: 5,
    temperament: 'peaceful',
    careLevel: 'intermediate',
    minTankSize: 40,
    waterParameters: {
      tempMin: 22,
      tempMax: 26,
      phMin: 6.5,
      phMax: 7.5,
      hardness: 'soft',
    },
    diet: ['Algae', 'Algae wafers', 'Vegetables', 'Biofilm'],
    breeding: 'يضع البيض على الأسطح. صعب.',
    schooling: true,
    minimumGroup: 6,
    compatibility: {
      goodWith: ['Shrimp', 'Small peaceful fish', 'Tetra'],
      avoidWith: ['Large aggressive fish'],
    },
    description: 'سمكة صغيرة ممتازة لأكل الطحالب. لطيفة ونشطة.',
    careTips: [
      'يحتاج لحوض مستقر وناضج',
      'ممتاز لأكل الطحالب الخضراء',
      'حساس قليلاً',
      'يحب المجموعات',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Otocinclus_vestitus.jpg/1280px-Otocinclus_vestitus.jpg',
    category: 'catfish',
  },
  {
    id: 'discus',
    commonName: 'Discus',
    arabicName: 'سمكة الديسكس',
    scientificName: 'Symphysodon spp.',
    family: 'Cichlidae',
    origin: 'أمريكا الجنوبية - الأمازون',
    minSize: 15,
    maxSize: 25,
    lifespan: 10,
    temperament: 'peaceful',
    careLevel: 'advanced',
    minTankSize: 200,
    waterParameters: {
      tempMin: 28,
      tempMax: 31,
      phMin: 6.0,
      phMax: 7.0,
      hardness: 'soft',
    },
    diet: ['Special discus food', 'Bloodworms', 'Beef heart', 'Vegetables'],
    breeding: 'يضع البيض ويعتني بالصغار. متقدم.',
    schooling: false,
    minimumGroup: 5,
    compatibility: {
      goodWith: ['Cardinal Tetra', 'Corydoras', 'German Blue Ram'],
      avoidWith: ['Aggressive fish', 'Fast eaters', 'Cold water fish'],
    },
    description: 'ملك أحواض المياه العذبة. جميل جداً لكن يحتاج لعناية خاصة.',
    careTips: [
      'يحتاج لماء عالي الجودة',
      'درجة حرارة عالية 28-31°',
      'غالي الثمن',
      'للهواة المتقدمين فقط',
    ],
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Discus_fish_in_an_aquarium.jpg/1280px-Discus_fish_in_an_aquarium.jpg',
    category: 'cichlid',
  },
];

export function getFishById(id: string): FishSpecies | undefined {
  return freshwaterFish.find(fish => fish.id === id);
}

export function getFishByCategory(category: string): FishSpecies[] {
  return freshwaterFish.filter(fish => fish.category === category);
}

export function getFishByCareLevel(careLevel: string): FishSpecies[] {
  return freshwaterFish.filter(fish => fish.careLevel === careLevel);
}

export function checkCompatibility(fish1Id: string, fish2Id: string): boolean {
  const fish1 = getFishById(fish1Id);
  const fish2 = getFishById(fish2Id);

  if (!fish1 || !fish2) return false;

  // Check if fish2 is in fish1's avoid list
  if (fish1.compatibility.avoidWith.some(name =>
    fish2.commonName.includes(name) || fish2.scientificName.includes(name) || fish2.arabicName.includes(name)
  )) {
    return false;
  }

  // Check if fish1 is in fish2's avoid list
  if (fish2.compatibility.avoidWith.some(name =>
    fish1.commonName.includes(name) || fish1.scientificName.includes(name) || fish1.arabicName.includes(name)
  )) {
    return false;
  }

  return true;
}

export function getTankSizeForFish(fishIds: string[]): number {
  let maxTankSize = 0;

  fishIds.forEach(id => {
    const fish = getFishById(id);
    if (fish && fish.minTankSize > maxTankSize) {
      maxTankSize = fish.minTankSize;
    }
  });

  return maxTankSize;
}

export function getWaterParameterRange(fishIds: string[]): {
  tempMin: number;
  tempMax: number;
  phMin: number;
  phMax: number;
} {
  const fishes = fishIds.map(id => getFishById(id)).filter(Boolean) as FishSpecies[];

  if (fishes.length === 0) {
    return { tempMin: 24, tempMax: 26, phMin: 7, phMax: 7.5 };
  }

  return {
    tempMin: Math.max(...fishes.map(f => f.waterParameters.tempMin)),
    tempMax: Math.min(...fishes.map(f => f.waterParameters.tempMax)),
    phMin: Math.max(...fishes.map(f => f.waterParameters.phMin)),
    phMax: Math.min(...fishes.map(f => f.waterParameters.phMax)),
  };
}
