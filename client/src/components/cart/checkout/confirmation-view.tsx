import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { CustomerInfo, GOVERNORATES } from "./types";
import { CartItem } from "@/contexts/cart-context";
import { formatIQD } from "@/lib/utils";

interface ConfirmationViewProps {
    customerInfo: CustomerInfo;
    cartItems: CartItem[];
    cartTotal: number;
    deliveryFee: number;
    grandTotal: number;
    isFreeShipping: boolean;
    getDeliveryEstimate: () => string;
    agreed: boolean;
    setAgreed: (agreed: boolean) => void;
    isSubmitting: boolean;
    handleBack: () => void;
    handleConfirmOrder: () => void;
}

export function ConfirmationView({
    customerInfo,
    cartItems,
    cartTotal,
    deliveryFee,
    grandTotal,
    isFreeShipping,
    getDeliveryEstimate,
    agreed,
    setAgreed,
    isSubmitting,
    handleBack,
    handleConfirmOrder
}: ConfirmationViewProps) {
    return (
        <div className="space-y-4 mt-4">
            <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-4 space-y-3">
                <h4 className="font-semibold">معلومات العميل</h4>
                <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">الاسم:</span>
                        <span className="font-medium">{customerInfo.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">الهاتف:</span>
                        <span className="font-medium" dir="ltr">{customerInfo.phone}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">العنوان:</span>
                        <span className="font-medium">
                            {GOVERNORATES.find(g => g.value === customerInfo.governorate)?.label} - {customerInfo.address}
                        </span>
                    </div>
                    {customerInfo.notes && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">ملاحظات:</span>
                            <span className="font-medium">{customerInfo.notes}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <h4 className="font-semibold">المنتجات ({cartItems.length})</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center text-sm bg-muted/30 rounded p-2">
                            <span className="truncate flex-1">{item.name} × {item.quantity}</span>
                            <span className="font-medium mr-2">{formatIQD(item.price * item.quantity)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                    <span>المجموع الفرعي:</span>
                    <span>{formatIQD(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>رسوم التوصيل:</span>
                    {isFreeShipping ? (
                        <span className="text-green-600 font-bold">مجاني 🎁</span>
                    ) : (
                        <span>{formatIQD(deliveryFee)}</span>
                    )}
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                    <span>المجموع الكلي:</span>
                    <span className="text-primary">{formatIQD(grandTotal)}</span>
                </div>

                <div className="mt-2 text-center bg-blue-50 text-blue-700 py-2 rounded-md text-sm font-medium border border-blue-100">
                    💰 طريقة الدفع: الدفع عند الاستلام
                    <div className="text-xs font-normal mt-1 opacity-90">
                        ⏱️ التوصيل المتوقع: {getDeliveryEstimate()}
                    </div>
                </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                <Checkbox
                    id="agree"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked === true)}
                    className="mt-0.5"
                />
                <label htmlFor="agree" className="text-sm cursor-pointer leading-relaxed">
                    أوافق على الشروط والأحكام وأؤكد صحة رقم الهاتف المدخل للتواصل بخصوص الطلب
                </label>
            </div>

            <div className="flex gap-2">
                <Button variant="outline" onClick={handleBack} className="flex-1">
                    رجوع
                </Button>
                <Button
                    onClick={handleConfirmOrder}
                    className="flex-1"
                    size="lg"
                    disabled={!agreed || isSubmitting}
                >
                    {isSubmitting ? "جاري المعالجة..." : "تأكيد الطلب"}
                </Button>
            </div>
        </div>
    );
}
