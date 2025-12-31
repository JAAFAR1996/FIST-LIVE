import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Phone, MapPin, AlertCircle, Sparkles } from "lucide-react";
import { CustomerInfo, GOVERNORATES } from "./types";
import { Link } from "wouter";

interface CustomerInfoFormProps {
    customerInfo: CustomerInfo;
    setCustomerInfo: (info: CustomerInfo) => void;
    errors: Record<string, string>;
    isGuest: boolean;
}

export function CustomerInfoForm({ customerInfo, setCustomerInfo, errors, isGuest }: CustomerInfoFormProps) {
    return (
        <div className="space-y-4 mt-4">
            {/* Guest Checkout Note - Only show if not logged in */}
            {isGuest && (
                <Alert className="bg-primary/5 border-primary/20">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <AlertDescription className="text-sm">
                        <Link href="/login">
                            <span className="text-primary font-semibold hover:underline cursor-pointer">سجل دخولك</span>
                        </Link>
                        {" "}لتصبح فرداً من عائلتنا وتتمتع بمزايا الولاء، أو أكمل كضيف عزيز.
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    الاسم الكامل
                </Label>
                <Input
                    id="name"
                    placeholder="أدخل اسمك الكامل"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.name}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    رقم الهاتف
                </Label>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="07801234567"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className={errors.phone ? 'border-red-500' : ''}
                    dir="ltr"
                />
                {errors.phone && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.phone}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="governorate" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    المحافظة
                </Label>
                <Select
                    value={customerInfo.governorate}
                    onValueChange={(value) => setCustomerInfo({ ...customerInfo, governorate: value })}
                >
                    <SelectTrigger className={errors.governorate ? 'border-red-500 text-right' : 'text-right'}>
                        <SelectValue placeholder="اختر المحافظة" />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                        {GOVERNORATES.map((gov) => (
                            <SelectItem key={gov.value} value={gov.value} className="text-right">
                                {gov.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.governorate && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.governorate}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    العنوان
                </Label>
                <Input
                    id="address"
                    placeholder="المنطقة، الشارع، أقرب نقطة دالة..."
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.address}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="notes">ملاحظات إضافية (اختياري)</Label>
                <Input
                    id="notes"
                    placeholder="أي ملاحظات للتوصيل..."
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                />
            </div>
        </div>
    );
}
