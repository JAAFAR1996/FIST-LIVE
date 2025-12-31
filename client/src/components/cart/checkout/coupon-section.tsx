import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tag, AlertCircle, CheckCircle2 } from "lucide-react";

interface CouponSectionProps {
    couponCode: string;
    setCouponCode: (code: string) => void;
    applyCoupon: () => void;
    couponError: string;
    couponSuccess: string;
}

export function CouponSection({ couponCode, setCouponCode, applyCoupon, couponError, couponSuccess }: CouponSectionProps) {
    return (
        <div className="space-y-2 bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:via-yellow-950/30 dark:to-orange-950/30 p-4 rounded-xl border-2 border-dashed border-amber-300 dark:border-amber-700 shadow-sm">
            <Label className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold text-base">
                <span className="text-lg">🎁</span>
                <Tag className="h-4 w-4" />
                هل لديك كوبون خصم؟
            </Label>
            <div className="flex gap-2">
                <Input
                    placeholder="أدخل كود الخصم هنا..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-white dark:bg-background border-amber-200 dark:border-amber-800 focus:border-amber-400 focus:ring-amber-400"
                    dir="ltr"
                />
                <Button
                    type="button"
                    onClick={applyCoupon}
                    className="min-w-[90px] bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-md hover:shadow-lg transition-all"
                >
                    تطبيق ✨
                </Button>
            </div>
            {couponError && (
                <p className="text-sm text-red-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 bg-red-50 dark:bg-red-950/30 p-2 rounded-lg">
                    <AlertCircle className="h-3 w-3" />
                    {couponError}
                </p>
            )}
            {couponSuccess && (
                <p className="text-sm text-green-600 flex items-center gap-1 animate-in fade-in slide-in-from-top-1 bg-green-50 dark:bg-green-950/30 p-2 rounded-lg font-medium">
                    <CheckCircle2 className="h-3 w-3" />
                    {couponSuccess}
                </p>
            )}
        </div>
    );
}
