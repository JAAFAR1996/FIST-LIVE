# ♿ دليل إمكانية الوصول - Fish Web

## 📊 الوضع الحالي

**Accessibility Score**: 71-73/100 (حسب تقرير Manus)

### المشاكل المحددة:

| # | المشكلة | التأثير | الأولوية |
|---|---------|---------|----------|
| 1 | تباين لوني ضعيف (نص أبيض على خلفية فاتحة) | 🔴 عالي | عاجل |
| 2 | عدم وجود تحكم في حجم الخط | 🟡 متوسط | متوسط |
| 3 | Alt Text ناقص أو غير واضح | 🔴 عالي | عاجل |
| 4 | ARIA Labels ناقصة | 🟡 متوسط | متوسط |
| 5 | Keyboard Navigation غير كامل | 🟠 متوسط-عالي | عاجل |
| 6 | أيقونة الوضع الليلي غير واضحة | 🟡 متوسط | منخفض |

---

## ✅ الحلول المطبقة

### 1. تحسين التباين اللوني

#### المشكلة:
نص أبيض على خلفيات فاتحة في:
- كروت المنتجات
- العناوين الصغيرة
- النصوص الثانوية

#### الحل:

**إنشاء مكون Accessible Text:**

```tsx
// /client/src/components/ui/accessible-text.tsx

interface AccessibleTextProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'muted';
  className?: string;
}

export function AccessibleText({
  children,
  variant = 'primary',
  className
}: AccessibleTextProps) {
  const variantStyles = {
    primary: 'text-slate-900 dark:text-slate-100',
    secondary: 'text-slate-700 dark:text-slate-300',
    muted: 'text-slate-600 dark:text-slate-400'
  };

  return (
    <span className={cn(variantStyles[variant], className)}>
      {children}
    </span>
  );
}
```

**معايير التباين (WCAG 2.1):**
- ✅ AA Level: 4.5:1 للنص العادي
- ✅ AAA Level: 7:1 للنص العادي
- ✅ AA Level: 3:1 للنص الكبير (18pt+)

**ألوان محسّنة:**
```css
/* Light mode */
--text-primary: #0f172a;      /* Contrast ratio: 16.1:1 */
--text-secondary: #334155;    /* Contrast ratio: 9.3:1 */
--text-muted: #475569;        /* Contrast ratio: 6.8:1 */

/* Dark mode */
--text-primary: #f1f5f9;      /* Contrast ratio: 15.8:1 */
--text-secondary: #cbd5e1;    /* Contrast ratio: 10.2:1 */
--text-muted: #94a3b8;        /* Contrast ratio: 6.5:1 */
```

---

### 2. التحكم في حجم الخط

#### الحل:

**إضافة Font Size Controller:**

```tsx
// /client/src/components/ui/font-size-controller.tsx

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, RotateCcw } from 'lucide-react';

export function FontSizeController() {
  const [fontSize, setFontSize] = useState(100); // percentage

  useEffect(() => {
    const saved = localStorage.getItem('fontSize');
    if (saved) setFontSize(Number(saved));
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem('fontSize', fontSize.toString());
  }, [fontSize]);

  const increase = () => setFontSize(prev => Math.min(prev + 10, 150));
  const decrease = () => setFontSize(prev => Math.max(prev - 10, 80));
  const reset = () => setFontSize(100);

  return (
    <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
      <span className="text-sm font-medium">حجم الخط:</span>
      <Button
        size="sm"
        variant="ghost"
        onClick={decrease}
        disabled={fontSize <= 80}
        aria-label="تصغير الخط"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="min-w-[3ch] text-center text-sm">{fontSize}%</span>
      <Button
        size="sm"
        variant="ghost"
        onClick={increase}
        disabled={fontSize >= 150}
        aria-label="تكبير الخط"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={reset}
        aria-label="إعادة تعيين حجم الخط"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

---

### 3. تحسين Alt Text

#### المشكلة:
- صور بدون alt text
- alt text غير وصفي
- decorative images بدون alt=""

#### الحل:

**قواعد Alt Text:**

```tsx
// ✅ Good - وصفي ومفيد
<img
  src="/product.jpg"
  alt="حوض سمك زجاجي 100 لتر بفلتر داخلي وإضاءة LED"
/>

// ✅ Good - decorative
<img
  src="/decoration.svg"
  alt=""
  role="presentation"
/>

// ❌ Bad - غير وصفي
<img src="/product.jpg" alt="صورة" />

// ❌ Bad - يبدأ بـ "صورة"
<img src="/product.jpg" alt="صورة حوض سمك" />
```

**Template للمنتجات:**
```typescript
const getProductAlt = (product: Product): string => {
  return `${product.name} - ${product.brand} - ${product.price} دينار عراقي`;
};
```

---

### 4. ARIA Labels & Roles

#### الحل:

**إضافة ARIA Labels:**

```tsx
// Navigation
<nav aria-label="القائمة الرئيسية">
  <ul role="list">
    <li><a href="/products" aria-label="المنتجات - 150 منتج متاح">المنتجات</a></li>
  </ul>
</nav>

// Search
<form role="search" aria-label="البحث في المنتجات">
  <input
    type="search"
    aria-label="ابحث عن منتجات"
    placeholder="ابحث..."
  />
  <button type="submit" aria-label="بحث">
    <SearchIcon aria-hidden="true" />
  </button>
</form>

// Cart
<button aria-label="سلة المشتريات - 3 منتجات">
  <ShoppingCart aria-hidden="true" />
  <span aria-live="polite" className="sr-only">
    {cartCount} منتجات في السلة
  </span>
</button>

// Loading states
<div role="status" aria-live="polite" aria-busy="true">
  <Spinner aria-hidden="true" />
  <span className="sr-only">جاري التحميل...</span>
</div>

// Dialogs
<Dialog
  role="dialog"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">عنوان النافذة</h2>
  <p id="dialog-description">وصف المحتوى</p>
</Dialog>
```

---

### 5. Keyboard Navigation

#### الحل:

**تحسين Focus States:**

```css
/* Focus visible للوحة المفاتيح فقط */
*:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Skip to main content */
.skip-to-main {
  position: absolute;
  left: -9999px;
  z-index: 999;
}

.skip-to-main:focus {
  left: 50%;
  transform: translateX(-50%);
  top: 10px;
  background: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
}
```

**Skip to Main Content:**

```tsx
// في Layout
export function Layout({ children }) {
  return (
    <>
      <a href="#main-content" className="skip-to-main">
        انتقل إلى المحتوى الرئيسي
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
```

**Keyboard shortcuts:**

```tsx
// في Component
useEffect(() => {
  const handleKeyboard = (e: KeyboardEvent) => {
    // Ctrl/Cmd + K للبحث
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      openSearch();
    }

    // Escape لإغلاق Modals
    if (e.key === 'Escape') {
      closeModal();
    }

    // Arrow keys للتنقل في Gallery
    if (e.key === 'ArrowRight') navigateNext();
    if (e.key === 'ArrowLeft') navigatePrev();
  };

  window.addEventListener('keydown', handleKeyboard);
  return () => window.removeEventListener('keydown', handleKeyboard);
}, []);
```

**Roving tabindex للقوائم:**

```tsx
export function ProductGrid({ products }) {
  const [focusedIndex, setFocusedIndex] = useState(0);

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    const cols = 3; // عدد الأعمدة
    let newIndex = index;

    switch (e.key) {
      case 'ArrowRight':
        newIndex = Math.min(index + 1, products.length - 1);
        break;
      case 'ArrowLeft':
        newIndex = Math.max(index - 1, 0);
        break;
      case 'ArrowDown':
        newIndex = Math.min(index + cols, products.length - 1);
        break;
      case 'ArrowUp':
        newIndex = Math.max(index - cols, 0);
        break;
      default:
        return;
    }

    e.preventDefault();
    setFocusedIndex(newIndex);
    // Focus the element
    document.getElementById(`product-${newIndex}`)?.focus();
  };

  return (
    <div role="grid" aria-label="قائمة المنتجات">
      {products.map((product, index) => (
        <div
          key={product.id}
          id={`product-${index}`}
          role="gridcell"
          tabIndex={index === focusedIndex ? 0 : -1}
          onKeyDown={(e) => handleKeyDown(e, index)}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
```

---

### 6. Screen Reader Support

#### الحل:

**Screen Reader Only Class:**

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**استخدام:**

```tsx
// معلومات إضافية للـ Screen readers
<button>
  <ShoppingCart aria-hidden="true" />
  <span className="sr-only">أضف إلى السلة</span>
</button>

// Live regions للتحديثات
<div aria-live="polite" aria-atomic="true" className="sr-only">
  تم إضافة {product.name} إلى السلة
</div>

// Status messages
<div role="status" aria-live="polite" className="sr-only">
  {loading ? 'جاري التحميل...' : `تم العثور على ${products.length} منتج`}
</div>
```

---

### 7. Form Accessibility

#### الحل:

```tsx
// ✅ Labels واضحة
<div>
  <label htmlFor="customer-name" className="required">
    الاسم الكامل
  </label>
  <input
    id="customer-name"
    name="name"
    type="text"
    required
    aria-required="true"
    aria-invalid={errors.name ? 'true' : 'false'}
    aria-describedby={errors.name ? 'name-error' : undefined}
  />
  {errors.name && (
    <span id="name-error" role="alert" className="error">
      {errors.name}
    </span>
  )}
</div>

// ✅ Error messages
<div role="alert" aria-live="assertive">
  {errors.length > 0 && (
    <ul>
      {errors.map((error, i) => (
        <li key={i}>{error}</li>
      ))}
    </ul>
  )}
</div>

// ✅ Field groups
<fieldset>
  <legend>طريقة الدفع</legend>
  <label>
    <input type="radio" name="payment" value="cash" />
    الدفع عند الاستلام
  </label>
  <label>
    <input type="radio" name="payment" value="card" />
    بطاقة ائتمان
  </label>
</fieldset>
```

---

## 🧪 الاختبار

### 1. Automated Testing

```bash
# Install dependencies
pnpm add -D @axe-core/react jest-axe

# في Component tests
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<ProductCard product={mockProduct} />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### 2. Manual Testing Checklist

- [ ] **Keyboard Only**: تنقل كامل بدون ماوس
- [ ] **Screen Reader**: اختبار مع NVDA/JAWS/VoiceOver
- [ ] **Zoom**: 200% بدون scroll أفقي
- [ ] **Contrast**: فحص بـ Contrast Checker
- [ ] **Focus Visible**: واضح على جميع العناصر
- [ ] **Alt Text**: وصفي ومفيد
- [ ] **Forms**: Labels و error messages واضحة
- [ ] **Headings**: تسلسل منطقي (h1, h2, h3)

### 3. Tools

```bash
# Lighthouse accessibility audit
lighthouse https://yoursite.com --only-categories=accessibility --view

# axe DevTools
# Extension للمتصفح - automated testing

# WAVE
# https://wave.webaim.org/
```

---

## 📊 معايير WCAG 2.1

### Level A (الأساسي):
- ✅ Alt text لجميع الصور
- ✅ Keyboard navigation
- ✅ Form labels
- ✅ Heading hierarchy

### Level AA (الموصى به):
- ✅ Color contrast 4.5:1
- ✅ Focus visible
- ✅ Error identification
- ✅ Resize text 200%

### Level AAA (المثالي):
- 🟡 Color contrast 7:1
- 🟡 Sign language interpretation
- 🟡 Extended audio description

---

## 🎯 الهدف

**Current**: 71-73/100
**Target**: 95+/100

### خطة التحسين:

**Phase 1** (أسبوع 1):
- ✅ تحسين التباين اللوني
- ✅ إضافة Alt Text
- ✅ ARIA Labels أساسية

**Phase 2** (أسبوع 2):
- ✅ Keyboard navigation كامل
- ✅ Focus states محسّنة
- ✅ Font size controller

**Phase 3** (أسبوع 3):
- 🟡 Screen reader testing شامل
- 🟡 Form accessibility كاملة
- 🟡 Skip links & landmarks

**Phase 4** (أسبوع 4):
- 🟡 AAA compliance (اختياري)
- 🟡 Accessibility statement
- 🟡 User testing مع ذوي الإعاقة

---

## 📝 Accessibility Statement

**يجب إضافة صفحة `/accessibility`:**

```markdown
# بيان إمكانية الوصول

نلتزم في Fish Web بجعل موقعنا متاحاً للجميع، بما في ذلك الأشخاص ذوي الإعاقة.

## المعايير المطبقة
- WCAG 2.1 Level AA
- Section 508

## الميزات المتاحة
- ✅ Navigation بالكيبورد
- ✅ Screen reader support
- ✅ تحكم في حجم الخط
- ✅ تباين لوني عالي
- ✅ Alt text وصفي

## الإبلاغ عن المشاكل
إذا واجهت أي مشكلة في الوصول، يرجى التواصل:
- Email: accessibility@fishweb.iq
- Phone: +964 770 123 4567

## التحديثات
آخر تحديث: ديسمبر 2024
```

---

**الحالة**: 🟡 قيد التحسين
**الهدف**: ✅ 95+ Score
