import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Package, Search, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  customerEmail?: string;
  customerName?: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  shippingAddress?: string;
  trackingNumber?: string;
  orderNumber?: string;
  shippingCost?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const ORDER_STATUSES = {
  pending: { label: "قيد الانتظار", variant: "destructive" as const, color: "bg-red-500 hover:bg-red-600" },
  confirmed: { label: "تم التأكيد", variant: "default" as const, color: "bg-blue-500 hover:bg-blue-600" },
  processing: { label: "جاري التجهيز", variant: "secondary" as const, color: "bg-yellow-500 hover:bg-yellow-600 text-black" },
  shipped: { label: "تم التسليم للنقل", variant: "secondary" as const, color: "bg-orange-500 hover:bg-orange-600 text-white" },
  delivered: { label: "تم التوصيل للزبون", variant: "default" as const, color: "bg-green-500 hover:bg-green-600" },
  cancelled: { label: "ملغي", variant: "destructive" as const, color: "bg-gray-500 hover:bg-gray-600" },
};

export function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders", {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          // Authentication or authorization failed
          console.error("Unauthorized access to orders");
          toast({
            title: "غير مصرح",
            description: "يرجى تسجيل الدخول كمدير للوصول إلى الطلبات",
            variant: "destructive",
          });
          setOrders([]);
          setLoading(false);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOrders(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "خطأ",
        description: "فشل تحميل الطلبات. يرجى التحقق من تسجيل الدخول.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast({
            title: "غير مصرح",
            description: "يرجى تسجيل الدخول كمدير",
            variant: "destructive",
          });
          return;
        }
        throw new Error("Failed to update order");
      }

      toast({
        title: "نجح",
        description: "تم تحديث حالة الطلب بنجاح",
      });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order:", error);
      toast({
        title: "خطأ",
        description: "فشل تحديث حالة الطلب",
        variant: "destructive",
      });
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status: string) => {
    return ORDER_STATUSES[status as keyof typeof ORDER_STATUSES] || ORDER_STATUSES.pending;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="ابحث عن طلب برقم الطلب أو البريد الإلكتروني..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="حالة الطلب" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الحالات</SelectItem>
            {Object.entries(ORDER_STATUSES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">رقم الطلب</TableHead>
              <TableHead className="text-right">العميل</TableHead>
              <TableHead className="text-right">المبلغ الإجمالي</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-right">التاريخ</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  جاري التحميل...
                </TableCell>
              </TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-400" />
                  <p className="text-gray-500">لا توجد طلبات</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-sm font-bold text-primary">
                      {order.orderNumber || order.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customerName || "غير محدد"}</p>
                        <p className="text-sm text-gray-500">{order.customerEmail || "غير محدد"}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {order.totalAmount?.toLocaleString()} د.ع
                    </TableCell>
                    <TableCell>
                      <Badge className={`${statusInfo.color} border-none`}>
                        {statusInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('ar-IQ')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setIsDetailOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* Process Flow Buttons */}
                        {order.status === 'pending' && (
                          <Button
                            size="sm"
                            className="bg-yellow-500 hover:bg-yellow-600 text-black"
                            onClick={() => handleStatusChange(order.id, 'processing')}
                          >
                            بدء التجهيز ⚡
                          </Button>
                        )}

                        {order.status === 'processing' && (
                          <Button
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                            onClick={() => handleStatusChange(order.id, 'shipped')}
                          >
                            تسليم للنقل 🚚
                          </Button>
                        )}

                        {order.status === 'shipped' && (
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => handleStatusChange(order.id, 'delivered')}
                          >
                            تم التوصيل ✅
                          </Button>
                        )}

                        {order.status === 'delivered' && (
                          <span className="text-green-600 font-bold px-3 py-1 border border-green-200 rounded-md bg-green-50">
                            مكتمل
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>
              تفاصيل الطلب <span className="text-primary font-mono">{selectedOrder?.orderNumber || selectedOrder?.id.slice(0, 8)}</span>
            </DialogTitle>
            <DialogDescription>
              تاريخ الطلب: {selectedOrder && new Date(selectedOrder.createdAt).toLocaleString('ar-IQ')}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">معلومات العميل</h3>
                <p>الاسم: {selectedOrder.customerName || "غير محدد"}</p>
                <p>البريد الإلكتروني: {selectedOrder.customerEmail || "غير محدد"}</p>
                {selectedOrder.shippingAddress && (
                  <p>عنوان الشحن: {selectedOrder.shippingAddress}</p>
                )}
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-2">المنتجات</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">المنتج</TableHead>
                      <TableHead className="text-right">الكمية</TableHead>
                      <TableHead className="text-right">السعر</TableHead>
                      <TableHead className="text-right">المجموع</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.price.toLocaleString()} د.ع</TableCell>
                        <TableCell className="font-semibold">
                          {(item.price * item.quantity).toLocaleString()} د.ع
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center p-4 bg-primary/10 rounded-lg">
                <span className="font-semibold">المبلغ الإجمالي:</span>
                <span className="text-2xl font-bold text-primary">
                  {selectedOrder.totalAmount?.toLocaleString()} د.ع
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
