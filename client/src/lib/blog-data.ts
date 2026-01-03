import { Fish, AlertTriangle, Heart, Filter, Droplets, Leaf } from "lucide-react";

export interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    readTime: string;
    author: string;
    date: string;
    image: string;
    iconName: "Fish" | "AlertTriangle" | "Heart" | "Filter" | "Droplets" | "Leaf";
    featured?: boolean;
}

export const blogPosts: BlogPost[] = [
    {
        id: "how-to-choose-first-aquarium",
        title: "كيف تختار أول حوض سمك: دليل المبتدئين الشامل 2025",
        excerpt: "دليل متكامل يساعدك على اختيار حوض السمك المثالي لبيتك. تعلم كيف تحدد الحجم المناسب والمعدات الأساسية.",
        content: `
            <h2>اختيار الحوض الأول - قرار مصيري!</h2>
            <p>الحوض الأول هو <strong>أهم قرار</strong> في رحلتك مع الأسماك. الحجم الكبير ليس ترفاً، بل ضرورة للمبتدئين!</p>
            
            <h3>لماذا الحجم الكبير أفضل؟</h3>
            <ul>
                <li><strong>استقرار بيولوجي:</strong> الماء الكثير يخفف السموم</li>
                <li><strong>استقرار حراري:</strong> لا يتأثر بتغيرات الجو</li>
                <li><strong>مساحة للأخطاء:</strong> الحوض الكبير "يسامح" المبتدئين</li>
            </ul>

            <h3>المعدات الأساسية</h3>
            <ul>
                <li><strong>فلتر:</strong> 4-6 أضعاف حجم الحوض/ساعة</li>
                <li><strong>سخان:</strong> 1 واط لكل لتر</li>
                <li><strong>إضاءة:</strong> LED 8-12 ساعة يومياً</li>
            </ul>

            <h3>الميزانية المتوقعة</h3>
            <p>للمبتدئين (حوض 60 لتر): <strong>125,000 - 250,000 د.ع</strong></p>
        `,
        category: "للمبتدئين",
        readTime: "12 دقيقة",
        author: "فريق AQUAVO",
        date: "3 يناير 2026",
        image: "/images/blog/aquarium-guide.jpg",
        iconName: "Fish",
        featured: true,
    },
    {
        id: "common-mistakes-killing-fish",
        title: "7 أخطاء قاتلة يرتكبها المبتدئون في تربية الأسماك",
        excerpt: "تعرف على الأخطاء الشائعة التي تقتل أسماك المبتدئين، وكيف تتجنبها لتحافظ على حوض صحي.",
        content: `
            <h2>توقف! لا تقتل أسماكك</h2>
            <p>معظم المبتدئين يخسرون أسماكهم بسبب أخطاء <strong>يمكن تجنبها بسهولة</strong>.</p>
            
            <h3>الخطأ الأول: إضافة الأسماك فوراً</h3>
            <p>الحوض الجديد لا يحتوي بكتيريا نافعة. <strong>انتظر 2-4 أسابيع</strong> قبل إضافة الأسماك!</p>

            <h3>الخطأ الثاني: الإفراط في التغذية</h3>
            <p>معدة السمكة بحجم عينها. <strong>كمية صغيرة مرتين يومياً</strong> كافية.</p>

            <h3>الخطأ الثالث: تغيير الماء كلياً</h3>
            <p><strong>لا تفرغ الحوض!</strong> غيّر 20-25% فقط أسبوعياً.</p>
        `,
        category: "حقائق ونصائح",
        readTime: "10 دقائق",
        author: "فريق AQUAVO",
        date: "2 يناير 2026",
        image: "/images/blog/common-mistakes.jpg",
        iconName: "AlertTriangle",
        featured: true,
    },
    {
        id: "best-beginner-fish-arab-climate",
        title: "أفضل 10 أسماك للمبتدئين تتحمل الأجواء العربية",
        excerpt: "اكتشف أفضل أنواع الأسماك التي تناسب المبتدئين وتتحمل حرارة الصيف في العراق والخليج.",
        content: `
            <h2>أسماك تتحمل حرارة الصيف</h2>
            <p>أجواءنا حارة، لكن هناك أسماك <strong>جميلة وقوية</strong> تناسبنا!</p>
            
            <h3>1. الجوبي (Guppy) ⭐</h3>
            <p>ألوان مذهلة، تتحمل 20-30°C، سعر رخيص.</p>

            <h3>2. المولي (Molly)</h3>
            <p>تحب مياهنا العسرة، تتحمل حتى 30°C.</p>

            <h3>3. زيبرا دانيو</h3>
            <p>شبه مستحيل أن تقتلها! نشيطة وممتعة.</p>

            <h3>4. الكوريدوراس</h3>
            <p>تنظف القاع، سلمية 100%، حركات طريفة.</p>
        `,
        category: "أنواع الأسماك",
        readTime: "15 دقيقة",
        author: "فريق AQUAVO",
        date: "1 يناير 2026",
        image: "/images/blog/best-fish.jpg",
        iconName: "Heart",
    },
    {
        id: "nitrogen-cycle-explained",
        title: "دورة النيتروجين: السر الذي لا يعرفه معظم المبتدئين",
        excerpt: "تعرف على دورة النيتروجين - أهم مفهوم في عالم الأحواض. فهم هذه الدورة هو الفرق بين النجاح والفشل.",
        content: `
            <h2>لماذا تموت أسماكك رغم الماء النظيف؟</h2>
            <p>السر هو <strong>دورة النيتروجين</strong> - أهم شيء يجب أن تفهمه.</p>
            
            <h3>المعادلة البسيطة</h3>
            <p><strong>أمونيا (سامة) → نيتريت (سامة) → نيترات (أقل سمية)</strong></p>

            <h3>كيف تبني الدورة؟</h3>
            <ul>
                <li>جهز الحوض بالماء والفلتر</li>
                <li>انتظر 2-4 أسابيع</li>
                <li>افحص: أمونيا = 0، نيتريت = 0</li>
                <li>الآن يمكنك إضافة الأسماك!</li>
            </ul>
        `,
        category: "العناية بالأحواض",
        readTime: "12 دقيقة",
        author: "فريق AQUAVO",
        date: "28 ديسمبر 2025",
        image: "/images/blog/nitrogen-cycle.jpg",
        iconName: "Droplets",
    },
    {
        id: "filter-guide-choosing-right-filter",
        title: "الفلاتر: كيف تختار الفلتر المناسب لحوضك",
        excerpt: "دليل شامل لأنواع الفلاتر ومميزات كل نوع. تعلم كيف تختار الفلتر الأمثل لحجم حوضك.",
        content: `
            <h2>الفلتر = قلب الحوض</h2>
            <p>بدون فلتر، الماء يتحول لسم خلال أيام!</p>
            
            <h3>أنواع الفلاتر</h3>
            <ul>
                <li><strong>إسفنجي:</strong> رخيص، للأحواض الصغيرة</li>
                <li><strong>داخلي:</strong> الكل في واحد، للمبتدئين</li>
                <li><strong>معلق (HOB):</strong> صيانة سهلة، للأحواض المتوسطة</li>
                <li><strong>خارجي:</strong> الأقوى، للأحواض الكبيرة</li>
            </ul>

            <h3>القاعدة الذهبية</h3>
            <p>الفلتر يدور <strong>4-6 أضعاف</strong> حجم الحوض/ساعة</p>
        `,
        category: "المعدات",
        readTime: "10 دقائق",
        author: "فريق AQUAVO",
        date: "25 ديسمبر 2025",
        image: "/images/blog/filter-guide.jpg",
        iconName: "Filter",
    },
    {
        id: "feeding-guide-when-how-much",
        title: "التغذية الصحيحة: متى وكم نطعم الأسماك؟",
        excerpt: "دليل شامل لتغذية أسماك الزينة. تعلم الكمية المناسبة، وأفضل أنواع الطعام، وجدول التغذية المثالي.",
        content: `
            <h2>الإفراط في التغذية = القاتل الأول!</h2>
            <p>معدة السمكة <strong>بحجم عينها</strong>. الكمية الصحيحة أقل مما تتوقع!</p>
            
            <h3>كم مرة نطعم؟</h3>
            <p><strong>مرة أو مرتين يومياً</strong> كافية. يوم صيام أسبوعي مفيد.</p>

            <h3>اختبار الدقيقتين</h3>
            <p>إذا انتهى الطعام في أقل من دقيقتين = الكمية صحيحة!</p>

            <h3>نوّع الطعام</h3>
            <ul>
                <li>رقائق وحبيبات</li>
                <li>طعام مجمد (روبيان، دود الدم)</li>
                <li>خضار أحياناً (بازلاء، كوسا)</li>
            </ul>
        `,
        category: "العناية بالأسماك",
        readTime: "8 دقائق",
        author: "فريق AQUAVO",
        date: "20 ديسمبر 2025",
        image: "/images/blog/feeding-guide.jpg",
        iconName: "Leaf",
    }
];
