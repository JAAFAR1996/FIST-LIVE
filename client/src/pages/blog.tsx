import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { BackToTop } from "@/components/back-to-top";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    Clock,
    User,
    ArrowLeft,
    Fish,
    Droplets,
    AlertTriangle,
    Sparkles,
    Filter,
    Leaf,
    Heart
} from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
    author: string;
    date: string;
    image: string;
    icon: React.ReactNode;
    featured?: boolean;
}

const blogPosts: BlogPost[] = [
    {
        id: "beginners-guide",
        title: "دليل المبتدئين: كيف تبدأ حوضك الأول",
        excerpt: "كل ما تحتاج معرفته لبدء هوايتك الجديدة بشكل صحيح. من اختيار الحوض المناسب إلى إضافة أول أسماكك.",
        category: "للمبتدئين",
        readTime: "10 دقائق",
        author: "فريق AQUAVO",
        date: "15 نوفمبر 2024",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=400&fit=crop",
        icon: <Fish className="w-5 h-5" />,
        featured: true,
    },
    {
        id: "common-mistakes",
        title: "5 أخطاء قاتلة يرتكبها المبتدئون في تربية الأسماك",
        excerpt: "تعرف على الأخطاء الشائعة التي تؤدي لموت الأسماك وكيف تتجنبها. من التغذية الزائدة إلى عدم cycling الحوض.",
        category: "نصائح",
        readTime: "7 دقائق",
        author: "أحمد الصياد",
        date: "10 نوفمبر 2024",
        image: "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=800&h=400&fit=crop",
        icon: <AlertTriangle className="w-5 h-5" />,
    },
    {
        id: "best-fish-iraq",
        title: "أفضل 10 أسماك للمبتدئين في العراق",
        excerpt: "قائمة بأفضل الأسماك التي تتحمل مناخ العراق وسهلة الرعاية. مثالية لمن يبدأ هوايته الجديدة.",
        category: "أنواع الأسماك",
        readTime: "8 دقائق",
        author: "فريق AQUAVO",
        date: "5 نوفمبر 2024",
        image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&h=400&fit=crop",
        icon: <Heart className="w-5 h-5" />,
    },
    {
        id: "filter-guide",
        title: "كيف تختار الفلتر المناسب لحوضك",
        excerpt: "دليل شامل لاختيار الفلتر الأنسب: فلتر داخلي أم خارجي؟ قوة التدفق المطلوبة؟ وأفضل الماركات.",
        category: "المعدات",
        readTime: "12 دقيقة",
        author: "محمد التقني",
        date: "1 نوفمبر 2024",
        image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&h=400&fit=crop",
        icon: <Filter className="w-5 h-5" />,
    },
    {
        id: "water-parameters",
        title: "فهم معايير المياه: pH, GH, KH وأكثر",
        excerpt: "شرح مبسط لجميع معايير المياه المهمة وكيف تحافظ عليها مستقرة لصحة أسماكك.",
        category: "العناية",
        readTime: "15 دقيقة",
        author: "د. سارة الكيميائية",
        date: "25 أكتوبر 2024",
        image: "https://images.unsplash.com/photo-1571752726703-5e7d1f6a986d?w=800&h=400&fit=crop",
        icon: <Droplets className="w-5 h-5" />,
    },
    {
        id: "planted-tank",
        title: "الحوض النباتي: دليلك الكامل للنباتات المائية",
        excerpt: "كيف تنشئ حوضاً نباتياً خلاباً. من اختيار النباتات إلى الإضاءة والتسميد.",
        category: "النباتات",
        readTime: "20 دقيقة",
        author: "فريق AQUAVO",
        date: "20 أكتوبر 2024",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
        icon: <Leaf className="w-5 h-5" />,
    },
];

const categories = [
    { name: "الكل", count: blogPosts.length },
    { name: "للمبتدئين", count: 1 },
    { name: "نصائح", count: 1 },
    { name: "أنواع الأسماك", count: 1 },
    { name: "المعدات", count: 1 },
    { name: "العناية", count: 1 },
    { name: "النباتات", count: 1 },
];

export default function Blog() {
    const featuredPost = blogPosts.find((p) => p.featured);
    const regularPosts = blogPosts.filter((p) => !p.featured);

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 dark:from-amber-900 dark:via-orange-900 dark:to-red-900 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-light.png')] opacity-10" />
                <div className="container mx-auto px-4 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto text-center text-white"
                    >
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 rounded-full mb-6">
                            <BookOpen className="h-5 w-5" />
                            <span className="font-bold">مدونة AQUAVO</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
                            مقالات ونصائح
                        </h1>
                        <p className="text-xl text-orange-100">
                            معلومات قيمة لمساعدتك في رعاية أسماكك بشكل أفضل
                        </p>
                    </motion.div>
                </div>
            </section>

            <main className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    {/* Categories */}
                    <div className="flex flex-wrap gap-2 mb-8 justify-center">
                        {categories.map((cat) => (
                            <Button
                                key={cat.name}
                                variant={cat.name === "الكل" ? "default" : "outline"}
                                size="sm"
                                className="rounded-full"
                            >
                                {cat.name}
                                <Badge variant="secondary" className="mr-2 bg-white/20">
                                    {cat.count}
                                </Badge>
                            </Button>
                        ))}
                    </div>

                    {/* Featured Post */}
                    {featuredPost && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-12"
                        >
                            <Card className="overflow-hidden border-0 shadow-xl">
                                <div className="grid md:grid-cols-2">
                                    <div className="relative h-64 md:h-auto">
                                        <img
                                            src={featuredPost.image}
                                            alt={featuredPost.title}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover"
                                        />
                                        <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                                            <Sparkles className="w-3 h-3 ml-1" />
                                            مقال مميز
                                        </Badge>
                                    </div>
                                    <CardContent className="p-8 flex flex-col justify-center">
                                        <Badge variant="outline" className="w-fit mb-4">
                                            {featuredPost.icon}
                                            <span className="mr-1">{featuredPost.category}</span>
                                        </Badge>
                                        <h2 className="text-3xl font-bold mb-4">{featuredPost.title}</h2>
                                        <p className="text-muted-foreground mb-6 text-lg">
                                            {featuredPost.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                                            <span className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                {featuredPost.author}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {featuredPost.readTime}
                                            </span>
                                        </div>
                                        <Button className="w-fit gap-2">
                                            اقرأ المقال
                                            <ArrowLeft className="w-4 h-4" />
                                        </Button>
                                    </CardContent>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* Regular Posts Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {regularPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="overflow-hidden hover:shadow-xl transition-shadow group h-full flex flex-col">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <Badge className="absolute top-3 right-3" variant="secondary">
                                            {post.icon}
                                            <span className="mr-1">{post.category}</span>
                                        </Badge>
                                    </div>
                                    <CardContent className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                                            {post.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2 flex-1">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {post.readTime}
                                            </span>
                                            <span>{post.date}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Newsletter CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="mt-16"
                    >
                        <Card className="bg-gradient-to-br from-primary/10 to-cyan-500/10 border-0">
                            <CardContent className="p-8 text-center">
                                <h2 className="text-2xl font-bold mb-3">اشترك في نشرتنا البريدية</h2>
                                <p className="text-muted-foreground mb-6">
                                    احصل على أحدث المقالات والنصائح مباشرة في بريدك
                                </p>
                                <div className="flex gap-2 max-w-md mx-auto">
                                    <input
                                        type="email"
                                        placeholder="بريدك الإلكتروني"
                                        className="flex-1 px-4 py-2 rounded-lg border bg-background"
                                    />
                                    <Button>اشترك</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </main>

            <WhatsAppWidget />
            <BackToTop />
            <Footer />
        </div>
    );
}
