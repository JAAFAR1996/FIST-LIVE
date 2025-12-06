import { useState } from "react";
import { Link } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Package,
    Heart,
    Settings,
    LogOut,
    Edit,
    Save,
    Crown,
    Gift,
    Star,
    ShoppingBag,
    Truck,
    CheckCircle
} from "lucide-react";
import { WhatsAppWidget } from "@/components/whatsapp-widget";
import { BackToTop } from "@/components/back-to-top";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

import { useAuth } from "@/contexts/auth-context";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-800" },
    processing: { label: "قيد المعالجة", color: "bg-blue-100 text-blue-800" },
    shipped: { label: "تم الشحن", color: "bg-purple-100 text-purple-800" },
    delivered: { label: "تم التوصيل", color: "bg-green-100 text-green-800" },
    cancelled: { label: "ملغي", color: "bg-red-100 text-red-800" },
};

const tierLabels: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    bronze: { label: "برونزي", color: "text-amber-700", icon: <Star className="w-4 h-4" /> },
    silver: { label: "فضي", color: "text-slate-500", icon: <Star className="w-4 h-4" /> },
    gold: { label: "ذهبي", color: "text-yellow-500", icon: <Crown className="w-4 h-4" /> },
    platinum: { label: "بلاتيني", color: "text-purple-500", icon: <Crown className="w-4 h-4" /> },
};

export default function Profile() {
    const { toast } = useToast();
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // Fetch orders
    const { data: orders, isLoading: isLoadingOrders } = useQuery({
        queryKey: ["/api/orders"],
        enabled: !!user,
    });

    // Mock extra user data that isn't in core auth yet (profile details)
    const [extraData, setExtraData] = useState({
        phone: "0770XXXXXXX",
        memberSince: "نوفمبر 2024",
        loyaltyPoints: 0,
        loyaltyTier: "bronze",
        avatar: "",
        addresses: [],
    });

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    const handleSave = () => {
        setIsEditing(false);
        toast({
            title: "تم حفظ التغييرات",
            description: "تم تحديث بياناتك بنجاح",
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    {/* Profile Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <Card className="bg-gradient-to-br from-primary/10 via-cyan-500/10 to-teal-500/10 border-0">
                            <CardContent className="p-8">
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
                                        <AvatarImage src={extraData.avatar} />
                                        <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                            {(user.fullName || user.email).charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="flex-1 text-center md:text-right">
                                        <h1 className="text-3xl font-bold mb-2">{user.fullName || "مستخدم جديد"}</h1>
                                        <p className="text-muted-foreground mb-3">عضو منذ {extraData.memberSince}</p>

                                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                            <Badge className={`${tierLabels[extraData.loyaltyTier].color} gap-1`}>
                                                {tierLabels[extraData.loyaltyTier].icon}
                                                عضو {tierLabels[extraData.loyaltyTier].label}
                                            </Badge>
                                            <Badge variant="outline" className="gap-1">
                                                <Gift className="w-3 h-3" />
                                                {extraData.loyaltyPoints} نقطة
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Settings className="w-4 h-4" />
                                            الإعدادات
                                        </Button>
                                        <Button variant="ghost" size="sm" className="gap-2 text-destructive" onClick={() => logout()}>
                                            <LogOut className="w-4 h-4" />
                                            تسجيل الخروج
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Profile Tabs */}
                    <Tabs defaultValue="info" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
                            <TabsTrigger value="info" className="py-3 gap-2">
                                <User className="w-4 h-4" />
                                <span className="hidden sm:inline">المعلومات الشخصية</span>
                            </TabsTrigger>
                            <TabsTrigger value="orders" className="py-3 gap-2">
                                <Package className="w-4 h-4" />
                                <span className="hidden sm:inline">طلباتي</span>
                            </TabsTrigger>
                            <TabsTrigger value="addresses" className="py-3 gap-2">
                                <MapPin className="w-4 h-4" />
                                <span className="hidden sm:inline">العناوين</span>
                            </TabsTrigger>
                            <TabsTrigger value="loyalty" className="py-3 gap-2">
                                <Crown className="w-4 h-4" />
                                <span className="hidden sm:inline">نقاط الولاء</span>
                            </TabsTrigger>
                        </TabsList>

                        {/* Personal Info Tab */}
                        <TabsContent value="info">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle>المعلومات الشخصية</CardTitle>
                                        <CardDescription>إدارة بياناتك الشخصية</CardDescription>
                                    </div>
                                    <Button
                                        variant={isEditing ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                                        className="gap-2"
                                    >
                                        {isEditing ? (
                                            <>
                                                <Save className="w-4 h-4" />
                                                حفظ
                                            </>
                                        ) : (
                                            <>
                                                <Edit className="w-4 h-4" />
                                                تعديل
                                            </>
                                        )}
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>الاسم الكامل</Label>
                                            <Input
                                                value={user.fullName || ""}
                                                disabled
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>البريد الإلكتروني</Label>
                                            <Input
                                                type="email"
                                                value={user.email}
                                                disabled
                                                dir="ltr"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>رقم الهاتف</Label>
                                            <Input
                                                type="tel"
                                                value={extraData.phone}
                                                onChange={(e) => setExtraData({ ...extraData, phone: e.target.value })}
                                                disabled={!isEditing}
                                                dir="ltr"
                                            />
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="pt-4 border-t">
                                            <Button variant="outline" className="text-destructive" onClick={() => setIsEditing(false)}>
                                                إلغاء
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Orders Tab */}
                        <TabsContent value="orders">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <ShoppingBag className="w-5 h-5" />
                                        طلباتي الأخيرة
                                    </CardTitle>
                                    <CardDescription>عرض وتتبع جميع طلباتك</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {isLoadingOrders ? (
                                        <div className="text-center py-8">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                            <p className="mt-2 text-muted-foreground">جاري تحميل الطلبات...</p>
                                        </div>
                                    ) : !orders || orders.length === 0 ? (
                                        <div className="text-center py-8 text-muted-foreground">
                                            <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            <p>لا توجد طلبات سابقة</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {orders.map((order: any) => (
                                                <div
                                                    key={order.id}
                                                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-sm sm:text-base">
                                                                #{order.id.slice(0, 8)}...
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {new Date(order.createdAt).toLocaleDateString("ar-IQ")} • {order.items?.length || 0} منتجات
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-left">
                                                        <p className="font-bold text-primary">
                                                            {parseInt(order.total).toLocaleString()} د.ع
                                                        </p>
                                                        <Badge className={statusLabels[order.status]?.color || "bg-gray-100"}>
                                                            {statusLabels[order.status]?.label || order.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-6 text-center">
                                        <Link href="/order-tracking">
                                            <Button variant="outline" className="gap-2">
                                                <Truck className="w-4 h-4" />
                                                تتبع طلب معين
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Addresses Tab */}
                        <TabsContent value="addresses">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5" />
                                            عناوين التوصيل
                                        </CardTitle>
                                        <CardDescription>إدارة عناوين التوصيل المحفوظة</CardDescription>
                                    </div>
                                    <Button size="sm" className="gap-2">
                                        <MapPin className="w-4 h-4" />
                                        إضافة عنوان
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {extraData.addresses.map((address: any) => (
                                            <div
                                                key={address.id}
                                                className={`p-4 rounded-lg border-2 ${address.isDefault ? "border-primary bg-primary/5" : "border-border"
                                                    }`}
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <Badge variant={address.isDefault ? "default" : "outline"}>
                                                        {address.label}
                                                    </Badge>
                                                    {address.isDefault && (
                                                        <Badge variant="secondary" className="gap-1">
                                                            <CheckCircle className="w-3 h-3" />
                                                            الافتراضي
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{address.address}</p>
                                                <div className="mt-3 flex gap-2">
                                                    <Button variant="ghost" size="sm">تعديل</Button>
                                                    <Button variant="ghost" size="sm" className="text-destructive">حذف</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Loyalty Tab */}
                        <TabsContent value="loyalty">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Crown className="w-5 h-5 text-yellow-500" />
                                        برنامج الولاء
                                    </CardTitle>
                                    <CardDescription>اجمع النقاط واحصل على خصومات حصرية</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Points Progress */}
                                    <div className="bg-gradient-to-br from-primary/10 to-cyan-500/10 rounded-xl p-6 text-center">
                                        <p className="text-sm text-muted-foreground mb-2">رصيد نقاطك</p>
                                        <p className="text-5xl font-bold text-primary mb-4">{extraData.loyaltyPoints}</p>
                                        <p className="text-sm text-muted-foreground">
                                            تحتاج <strong>50</strong> نقطة إضافية للترقية إلى المستوى الذهبي
                                        </p>
                                        <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary to-cyan-500"
                                                style={{ width: `${(extraData.loyaltyPoints / 500) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Tiers */}
                                    <div className="grid grid-cols-4 gap-4">
                                        {Object.entries(tierLabels).map(([key, tier], index) => (
                                            <div
                                                key={key}
                                                className={`text-center p-4 rounded-lg ${key === extraData.loyaltyTier
                                                    ? "bg-primary/10 border-2 border-primary"
                                                    : "bg-muted/50"
                                                    }`}
                                            >
                                                <div className={`text-2xl mb-2 ${tier.color}`}>{tier.icon}</div>
                                                <p className="font-medium text-sm">{tier.label}</p>
                                                <p className="text-xs text-muted-foreground">{(index + 1) * 250} نقطة</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* How to earn */}
                                    <div className="bg-muted/50 rounded-lg p-6">
                                        <h4 className="font-semibold mb-4">كيف تجمع النقاط؟</h4>
                                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span>كل 1,000 د.ع = 10 نقاط</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span>تقييم منتج = 5 نقاط</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span>دعوة صديق = 50 نقطة</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            <WhatsAppWidget />
            <BackToTop />
            <Footer />
        </div>
    );
}
