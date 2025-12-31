import { Separator } from "@/components/ui/separator";
import { formatIQD } from "@/lib/utils";

interface OrderSummaryProps {
    cartTotal: number;
    deliveryFee: number;
    discount: number;
    grandTotal: number;
    isFreeShipping: boolean;
    getDeliveryEstimate: () => string;
}

export function OrderSummary({ cartTotal, deliveryFee, discount, grandTotal, isFreeShipping, getDeliveryEstimate }: OrderSummaryProps) {
    return (
        <div className="bg-muted/50 rounded-lg p-4 space-y-3">
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
            {!isFreeShipping && (
                <div className="text-xs text-orange-600 font-bold mt-1 text-center bg-orange-50 p-2 rounded border border-orange-100 dark:bg-orange-950/20 dark:border-orange-900">
                    خيار ممتاز! الأسماك بانتظارك 🐠
                    <br />
                    <span className="text-muted-foreground font-normal">
                        (باقي لك {formatIQD(100000 - cartTotal)} للحصول على توصيل مجاني!)
                    </span>
                </div>
            )}
            {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                    <span>الخصم:</span>
                    <span>-{formatIQD(discount)}</span>
                </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
                <span>المجموع الكلي:</span>
                <span className="text-primary">{formatIQD(grandTotal)}</span>
            </div>

            <div className="mt-2 text-center bg-green-50 text-green-700 py-2 rounded-md text-sm font-bold border border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800">
                💰 طريقة الدفع: الدفع عند الاستلام
                <div className="text-xs font-normal mt-1 opacity-90">
                    ⏱️ التوصيل المتوقع: {getDeliveryEstimate()}
                </div>
            </div>
        </div>
    );
}
