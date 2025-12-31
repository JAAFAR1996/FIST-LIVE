import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Eye,
    Package,
    ArrowUpRight,
    ArrowDownRight,
    BarChart3,
    PieChart,
    Activity,
    Loader2,
} from "lucide-react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart as RechartsPie,
    Pie,
    Cell,
    Legend,
    AreaChart,
    Area,
} from "recharts";

interface AnalyticsData {
    summary: {
        totalRevenue: number;
        revenueChange: number;
        totalOrders: number;
        ordersChange: number;
        totalCustomers: number;
        customersChange: number;
        totalPageViews: number;
        pageViewsChange: number;
        averageOrderValue: number;
        conversionRate: number;
    };
    salesChart: { date: string; revenue: number; orders: number }[];
    topProducts: { name: string; sales: number; revenue: number }[];
    trafficSources: { source: string; visits: number; percentage: number }[];
    ordersByStatus: { status: string; count: number }[];
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function AnalyticsDashboard() {
    const [period, setPeriod] = useState<"7d" | "30d" | "90d">("30d");

    const { data, isLoading, error } = useQuery<AnalyticsData>({
        queryKey: ["admin-analytics", period],
        queryFn: async () => {
            const res = await fetch(`/api/admin/analytics?period=${period}`, {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Failed to fetch analytics");
            return res.json();
        },
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("ar-IQ", {
            style: "decimal",
            minimumFractionDigits: 0,
        }).format(value) + " د.ع";
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat("ar-IQ").format(value);
    };

    const renderChangeIndicator = (change: number) => {
        const isPositive = change >= 0;
        return (
            <span className={`flex items-center text-sm ${isPositive ? "text-green-500" : "text-red-500"}`}>
                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(change).toFixed(1)}%
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <Card>
                <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground">فشل تحميل التحليلات</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">التحليلات</h2>
                    <p className="text-muted-foreground">نظرة شاملة على أداء متجرك</p>
                </div>
                <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
                    <SelectTrigger className="w-[140px]">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7d">آخر 7 أيام</SelectItem>
                        <SelectItem value="30d">آخر 30 يوم</SelectItem>
                        <SelectItem value="90d">آخر 90 يوم</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
                                <p className="text-2xl font-bold">{formatCurrency(data.summary.totalRevenue)}</p>
                            </div>
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <div className="mt-2">
                            {renderChangeIndicator(data.summary.revenueChange)}
                            <span className="text-xs text-muted-foreground mr-1">مقارنة بالفترة السابقة</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">إجمالي الطلبات</p>
                                <p className="text-2xl font-bold">{formatNumber(data.summary.totalOrders)}</p>
                            </div>
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                <ShoppingCart className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                        <div className="mt-2">
                            {renderChangeIndicator(data.summary.ordersChange)}
                            <span className="text-xs text-muted-foreground mr-1">مقارنة بالفترة السابقة</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">العملاء</p>
                                <p className="text-2xl font-bold">{formatNumber(data.summary.totalCustomers)}</p>
                            </div>
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                                <Users className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                        <div className="mt-2">
                            {renderChangeIndicator(data.summary.customersChange)}
                            <span className="text-xs text-muted-foreground mr-1">عملاء جدد</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">مشاهدات الصفحات</p>
                                <p className="text-2xl font-bold">{formatNumber(data.summary.totalPageViews)}</p>
                            </div>
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                                <Eye className="w-6 h-6 text-amber-600" />
                            </div>
                        </div>
                        <div className="mt-2">
                            {renderChangeIndicator(data.summary.pageViewsChange)}
                            <span className="text-xs text-muted-foreground mr-1">مقارنة بالفترة السابقة</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-cyan-100 dark:bg-cyan-900/30 rounded-full">
                                <Activity className="w-6 h-6 text-cyan-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">متوسط قيمة الطلب</p>
                                <p className="text-xl font-bold">{formatCurrency(data.summary.averageOrderValue)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-rose-100 dark:bg-rose-900/30 rounded-full">
                                <TrendingUp className="w-6 h-6 text-rose-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">معدل التحويل</p>
                                <p className="text-xl font-bold">{data.summary.conversionRate.toFixed(2)}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <Tabs defaultValue="sales" dir="rtl">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="sales">
                        <BarChart3 className="w-4 h-4 ml-2" />
                        المبيعات
                    </TabsTrigger>
                    <TabsTrigger value="products">
                        <Package className="w-4 h-4 ml-2" />
                        المنتجات
                    </TabsTrigger>
                    <TabsTrigger value="traffic">
                        <PieChart className="w-4 h-4 ml-2" />
                        الزيارات
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="sales" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>الإيرادات والطلبات</CardTitle>
                            <CardDescription>تطور المبيعات خلال الفترة المحددة</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data.salesChart}>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis dataKey="date" className="text-xs" />
                                        <YAxis className="text-xs" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "hsl(var(--card))",
                                                border: "1px solid hsl(var(--border))",
                                                borderRadius: "8px",
                                            }}
                                            formatter={(value: number, name: string) => [
                                                name === "revenue" ? formatCurrency(value) : value,
                                                name === "revenue" ? "الإيرادات" : "الطلبات",
                                            ]}
                                        />
                                        <Legend formatter={(value) => (value === "revenue" ? "الإيرادات" : "الطلبات")} />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#10b981"
                                            fill="#10b98133"
                                            strokeWidth={2}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="orders"
                                            stroke="#3b82f6"
                                            fill="#3b82f633"
                                            strokeWidth={2}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="products" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>أكثر المنتجات مبيعاً</CardTitle>
                            <CardDescription>أفضل 10 منتجات حسب المبيعات</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.topProducts} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis type="number" className="text-xs" />
                                        <YAxis dataKey="name" type="category" width={150} className="text-xs" />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "hsl(var(--card))",
                                                border: "1px solid hsl(var(--border))",
                                                borderRadius: "8px",
                                            }}
                                            formatter={(value: number) => [formatNumber(value), "المبيعات"]}
                                        />
                                        <Bar dataKey="sales" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="traffic" className="mt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>مصادر الزيارات</CardTitle>
                                <CardDescription>من أين يأتي زوارك</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[250px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RechartsPie>
                                            <Pie
                                                data={data.trafficSources}
                                                dataKey="visits"
                                                nameKey="source"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label={({ source, percentage }) => `${source} (${percentage}%)`}
                                            >
                                                {data.trafficSources.map((entry, index) => (
                                                    <Cell key={entry.source} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </RechartsPie>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>حالة الطلبات</CardTitle>
                                <CardDescription>توزيع الطلبات حسب الحالة</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {data.ordersByStatus.map((item, index) => (
                                        <div key={item.status} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                />
                                                <span className="text-sm">{item.status}</span>
                                            </div>
                                            <Badge variant="secondary">{formatNumber(item.count)}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

export default AnalyticsDashboard;
