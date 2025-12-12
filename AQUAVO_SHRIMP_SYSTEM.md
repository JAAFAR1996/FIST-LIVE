# 🦐 AQUAVO Interactive Shrimp Mascot System

> نظام روبيان متحرك وتفاعلي لزيادة تفاعل المستخدمين وخلق صورة ذهنية مميزة

## 🎯 نظرة عامة

نظام **متكامل وجاهز للإنتاج** يتضمن:
- ✨ **شخصية روبيان متحركة** تتطور حسب حالة العربة
- 🎲 **حدث Golden Shrimp نادر** (1% احتمالية) مع خصم يومي
- 🌿 **تأثير Algae Attack** عند عدم النشاط
- 📱 **متجاوب مع جميع الأجهزة**
- 🚀 **جاهز للإنتاج والـ Vercel**

---

## 📦 المكونات

### 1. **Shrimp Context** (`client/src/contexts/shrimp-context.tsx`)
إدارة حالة الروبيان المركزية

```tsx
const { stage, isGoldenActive, goldenCaught } = useShrimp();
```

### 2. **Cart Mascot** (`client/src/components/aquavo-shrimp/CartMascot.tsx`)
4 مراحل تطور للروبيان:
- **Larva** (فارغ): "أنا صغير وجائع.. 🥺"
- **Teen** (1-2): "العضلات تظهر.. 💪"
- **Boss** (3+): "جاهز للسيطرة! 😎"
- **Whale** (100K+): "توصيل مجاني! 🚚"

### 3. **Golden Shrimp** (`client/src/components/aquavo-shrimp/GoldenShrimpEvent.tsx`)
حدث نادر مثل Shiny Pokémon:
- 1% احتمالية الظهور
- خصم GOLDEN10 = 10,000 IQD
- حد يومي واحد

### 4. **Algae Attack** (`client/src/components/aquavo-shrimp/AlgaeAttack.tsx`)
تأثير Idle بعد 15 ثانية:
- طحالب تغطي الشاشة
- روبيان ينظف بـ squeegee
- يختفي عند أي نشاط

---

## 🚀 التثبيت السريع

### 1. تحديث App.tsx

```tsx
import { ShrimpProvider } from "@/contexts/shrimp-context";
import { CartMascot, GoldenShrimpEvent, AlgaeAttack } from "@/components/aquavo-shrimp";

export default function App() {
  return (
    <ShrimpProvider>
      <CartProvider>
        {/* Your existing content */}
        <CartMascot />
        <GoldenShrimpEvent />
        <AlgaeAttack enabled={true} />
      </CartProvider>
    </ShrimpProvider>
  );
}
```

### 2. لا توجد خطوات إضافية!

المكتبات المطلوبة مثبتة بالفعل:
- ✅ `framer-motion`
- ✅ `canvas-confetti`
- ✅ `react`

---

## 🎨 التخصيص

### تغيير الوقت (Algae)
```tsx
// في AlgaeAttack.tsx
const IDLE_TIMEOUT = 15000; // 15 ثانية
```

### تغيير احتمالية Golden
```tsx
// في GoldenShrimpEvent.tsx
const GOLDEN_TRIGGER_PROBABILITY = 1; // 0-100
```

### تغيير الرسائل
```tsx
// في CartMascot.tsx
const SHRIMP_MESSAGES = {
  larva: { text: "رسالتك", emoji: "🥺" },
  // ...
};
```

---

## 📊 الأداء

- ⚡ **حجم صغير**: بدون images ثقيلة
- ⚡ **سريع**: Vercel-optimized
- ⚡ **خفيف**: localStorage فقط
- ⚡ **آمن**: TypeScript + validation

---

## 🔧 استكشاف الأخطاء

### الروبيان لا يظهر؟
```javascript
// في console
localStorage.clear();
location.reload();
```

### Golden Shrimp لا يظهر؟
```javascript
localStorage.removeItem("aquavo-golden-caught");
localStorage.removeItem("aquavo-golden-date");
```

للمزيد: انظر `Troubleshooting-guide.md`

---

## 📚 الملفات التوثيقية

- **AQUAVO-Integration-Guide.md** - دليل التكامل الشامل
- **App-tsx-modification-guide.md** - كيفية تعديل App.tsx
- **Troubleshooting-guide.md** - حل المشاكل
- **FINAL-SUMMARY.md** - ملخص شامل

---

## 📁 البنية

```
client/src/
├── contexts/
│   └── shrimp-context.tsx              ✨
├── components/
│   └── aquavo-shrimp/
│       ├── CartMascot.tsx              ✨
│       ├── GoldenShrimpEvent.tsx       ✨
│       ├── AlgaeAttack.tsx             ✨
│       └── index.ts                    ✨
└── App.tsx                              (MODIFIED)
```

---

## 🎯 النتائج المتوقعة

✅ **زيادة Engagement** - المستخدمون يتفاعلون أكثر
✅ **Brand Identity** - صورة ذهنية مميزة
✅ **Viral Potential** - Golden Shrimp قابل للمشاركة
✅ **User Retention** - يعودون لرؤية ما يحدث

---

## 🚀 الخطوة التالية

```bash
# 1. عدّل App.tsx
# 2. شغّل الموقع
# 3. استمتع برؤية الروبيان! 🦐
```

---

**Made with ❤️ for AQUAVO - Aquarium Supplies E-commerce**
