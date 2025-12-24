import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Package, ShoppingBag, Truck } from "lucide-react";
import { Order } from "@/lib/types";

// Helper for status labels
const statusLabels: Record<string, { label: string; color: string }> = {
    pending: { label: "قيد الانتظار", color: "bg-yellow-100 text-yellow-800" },
    processing: { label: "قيد المعالجة", color: "bg-blue-100 text-blue-800" },
    shipped: { label: "تم الشحن", color: "bg-purple-100 text-purple-800" },
    delivered: { label: "تم التوصيل", color: "bg-green-100 text-green-800" },
    cancelled: { label: "ملغي", color: "bg-red-100 text-red-800" },
};

interface ProfileOrdersProps {
    orders?: Order[];
    isLoading: boolean;
}

export function ProfileOrders({ orders, isLoading }: ProfileOrdersProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5" />
                    طلباتي الأخيرة
                </CardTitle>
                <CardDescription>عرض وتتبع جميع طلباتك</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                        <p className="mt-2 text-muted-foreground">جاري تحميل الطلبات...</p>
                    </div>
                ) : !orders || (Array.isArray(orders) && orders.length === 0) ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>لا توجد طلبات سابقة</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
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
                                            {new Date(order.createdAt).toLocaleDateString("en-GB")} • {order.items?.length || 0} منتجات
                                        </p>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-primary">
                                        {typeof order.total === 'number' ? order.total.toLocaleString() : parseInt(order.total).toLocaleString()} د.ع
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
    );
}
