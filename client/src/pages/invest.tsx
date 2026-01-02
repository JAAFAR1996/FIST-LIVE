import { Link } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp,
    Target,
    Users,
    DollarSign,
    ShieldCheck,
    Truck,
    Globe,
    ChevronLeft,
    Phone,
    Mail,
    MessageCircle,
    Fish,
    Award,
    BarChart3,
    Clock,
    CheckCircle2,
    ArrowUpRight
} from "lucide-react";
import { MetaTags } from "@/components/seo/meta-tags";

export default function InvestPage() {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <MetaTags
                title="استثمر معنا | AQUAVO"
                description="انضم لنا في بناء أكبر منصة متخصصة في أحواض السمك في العراق. فرصة استثمارية واعدة مع عوائد مجزية."
            />
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-blue-500/10" />
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center max-w-4xl mx-auto">
                            <Badge className="mb-6 text-lg px-6 py-2 bg-primary/20 text-primary border-primary/30">
                                🚀 فرصة استثمارية
                            </Badge>
                            <h1 className="text-4xl md:text-6xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-cyan-400 to-blue-500">
                                استثمر في مستقبل هواية أحواض السمك في العراق
                            </h1>
                            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                                AQUAVO هي المنصة الأولى والوحيدة المتخصصة في مستلزمات أحواض الأسماك في العراق.
                                نحن نبني سوقاً جديداً بإمكانيات نمو ضخمة.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <a href="/AQUAVO_Investor_Pitch.html" target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" className="gap-2 text-lg px-8 py-6">
                                        <BarChart3 className="w-5 h-5" />
                                        عرض تقديمي كامل
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Button>
                                </a>
                                <a href="https://wa.me/9647721307847?text=مرحباً، أنا مهتم بالاستثمار في AQUAVO" target="_blank" rel="noopener noreferrer">
                                    <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6">
                                        <MessageCircle className="w-5 h-5" />
                                        تواصل معنا
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Metrics */}
                <section className="py-16 bg-gradient-to-b from-background to-muted/30">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">أرقام تتحدث عنا</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <Card className="text-center border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                                <CardContent className="pt-6">
                                    <div className="text-4xl font-black text-primary mb-2">$60M</div>
                                    <p className="text-muted-foreground">حجم السوق الكلي (TAM)</p>
                                </CardContent>
                            </Card>
                            <Card className="text-center border-green-500/20 bg-gradient-to-br from-green-500/5 to-transparent">
                                <CardContent className="pt-6">
                                    <div className="text-4xl font-black text-green-500 mb-2">500K</div>
                                    <p className="text-muted-foreground">عائلة تمتلك أحواض في العراق</p>
                                </CardContent>
                            </Card>
                            <Card className="text-center border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
                                <CardContent className="pt-6">
                                    <div className="text-4xl font-black text-amber-500 mb-2">40%</div>
                                    <p className="text-muted-foreground">هامش الربح المتوقع</p>
                                </CardContent>
                            </Card>
                            <Card className="text-center border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent">
                                <CardContent className="pt-6">
                                    <div className="text-4xl font-black text-blue-500 mb-2">18-24</div>
                                    <p className="text-muted-foreground">شهر لاسترداد الاستثمار</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Why Invest */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-4">لماذا تستثمر معنا؟</h2>
                        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
                            AQUAVO ليست مجرد متجر إلكتروني - نحن نبني علامة تجارية ومجتمع متكامل لعشاق الأحواض
                        </p>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="group hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                        <Target className="w-6 h-6 text-primary" />
                                    </div>
                                    <CardTitle>سوق بلا منافسين</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        لا يوجد متجر إلكتروني متخصص آخر في العراق. نحن الأوائل في هذا المجال.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="group hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-colors">
                                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    </div>
                                    <CardTitle>منصة جاهزة للعمل</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        الموقع مبني بالكامل بأحدث التقنيات. جاهز للإطلاق والبيع فوراً.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="group hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                                        <Award className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <CardTitle>منتجات YEE الأصلية</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        وكلاء حصريين لمنتجات YEE العالمية بجودة مضمونة وأسعار تنافسية.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="group hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                                        <Users className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <CardTitle>مجتمع نشط</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        موسوعة أسماك، حاسبات متخصصة، ومحتوى تعليمي باللهجة العراقية.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="group hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                                        <TrendingUp className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <CardTitle>نمو مستمر</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        خطة توسع واضحة: B2C ثم B2B للمتاجر المحلية في جميع المحافظات.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="group hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors">
                                        <Fish className="w-6 h-6 text-red-500" />
                                    </div>
                                    <CardTitle>شغف حقيقي</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        فريق يحب الأسماك والأحواض. نفهم السوق والعملاء من الداخل.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Investment Ask */}
                <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-center mb-12">الاستثمار المطلوب</h2>

                            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-background to-blue-500/5">
                                <CardContent className="pt-8">
                                    <div className="text-center mb-8">
                                        <div className="text-6xl font-black text-primary mb-2">$40,000</div>
                                        <p className="text-xl text-muted-foreground">دولار أمريكي</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="font-bold text-lg mb-4">توزيع الاستثمار:</h3>
                                            <div className="flex justify-between items-center p-4 bg-background/50 rounded-lg border">
                                                <span className="flex items-center gap-2">
                                                    <span className="text-xl">📦</span> توسيع المخزون
                                                </span>
                                                <span className="font-bold text-primary">$15,000</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-background/50 rounded-lg border">
                                                <span className="flex items-center gap-2">
                                                    <span className="text-xl">📢</span> التسويق (6 أشهر)
                                                </span>
                                                <span className="font-bold text-primary">$10,000</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-background/50 rounded-lg border">
                                                <span className="flex items-center gap-2">
                                                    <span className="text-xl">💻</span> تطوير المنصة
                                                </span>
                                                <span className="font-bold text-primary">$5,000</span>
                                            </div>
                                            <div className="flex justify-between items-center p-4 bg-background/50 rounded-lg border">
                                                <span className="flex items-center gap-2">
                                                    <span className="text-xl">💵</span> رأس مال عامل
                                                </span>
                                                <span className="font-bold text-primary">$10,000</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-bold text-lg mb-4">العائد المتوقع:</h3>
                                            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30">
                                                <div className="text-3xl font-bold text-green-500 mb-1">18-24 شهر</div>
                                                <p className="text-muted-foreground">فترة استرداد الاستثمار</p>
                                            </div>
                                            <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                                                <div className="text-3xl font-bold text-amber-500 mb-1">25%</div>
                                                <p className="text-muted-foreground">معدل النمو السنوي المتوقع</p>
                                            </div>
                                            <div className="p-4 bg-primary/10 rounded-lg border border-primary/30">
                                                <div className="text-3xl font-bold text-primary mb-1">40%</div>
                                                <p className="text-muted-foreground">هامش الربح المتوقع</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-r from-primary/10 via-background to-blue-500/10">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold mb-6">هل أنت مستعد للبدء؟</h2>
                        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            تواصل معنا اليوم للاطلاع على التفاصيل الكاملة ومناقشة فرصة الشراكة
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <a href="https://wa.me/9647721307847?text=مرحباً، أريد معرفة المزيد عن فرصة الاستثمار في AQUAVO" target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="gap-2 text-lg px-8 py-6 bg-green-600 hover:bg-green-700">
                                    <MessageCircle className="w-5 h-5" />
                                    واتساب: +964 772 130 7847
                                </Button>
                            </a>
                            <a href="mailto:invest@aquavo.iq">
                                <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6">
                                    <Mail className="w-5 h-5" />
                                    invest@aquavo.iq
                                </Button>
                            </a>
                        </div>

                        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                <span>معلومات سرية 100%</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>رد خلال 24 ساعة</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
