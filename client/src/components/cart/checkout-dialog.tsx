import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Phone, User, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import { formatIQD } from "@/lib/utils";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CustomerInfo {
  name: string;
  phone: string;
  address: string;
  notes: string;
}

interface CheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  cartTotal: number;
  onCheckoutComplete: (orderData: { customerInfo: CustomerInfo; items: CartItem[]; total: number }) => void;
}

export function CheckoutDialog({ open, onOpenChange, cartItems, cartTotal, onCheckoutComplete }: CheckoutDialogProps) {
  const [step, setStep] = useState<'info' | 'confirm'>('info');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validatePhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\s/g, '');
    const iraqiPhoneRegex = /^(\+964|964|0)?7[3-9]\d{8}$/;
    return iraqiPhoneRegex.test(cleanPhone);
  };

  const validateInfo = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!customerInfo.name.trim()) {
      newErrors.name = 'الاسم مطلوب';
    }
    
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!validatePhone(customerInfo.phone)) {
      newErrors.phone = 'رقم الهاتف غير صحيح (مثال: 07801234567)';
    }
    
    if (!customerInfo.address.trim()) {
      newErrors.address = 'العنوان مطلوب';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateInfo()) {
      setStep('confirm');
    }
  };

  const handleConfirmOrder = () => {
    if (!agreed) return;
    
    onCheckoutComplete({
      customerInfo,
      items: cartItems,
      total: cartTotal
    });
    
    setStep('info');
    setCustomerInfo({ name: '', phone: '', address: '', notes: '' });
    setAgreed(false);
    onOpenChange(false);
  };

  const handleBack = () => {
    setStep('info');
  };

  const deliveryFee = 5000;
  const grandTotal = cartTotal + deliveryFee;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {step === 'info' ? (
              <>
                <User className="h-5 w-5 text-primary" />
                معلومات الطلب
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                تأكيد الطلب
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === 'info' 
              ? 'يرجى إدخال معلوماتك لإتمام الطلب'
              : 'راجع طلبك ووافق على الشروط لإتمام الشراء'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'info' ? (
          <div className="space-y-4 mt-4">
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
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                العنوان
              </Label>
              <Input
                id="address"
                placeholder="المحافظة، المنطقة، الشارع..."
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

            <Separator className="my-4" />

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>المجموع الفرعي:</span>
                <span>{formatIQD(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>رسوم التوصيل:</span>
                <span>{formatIQD(deliveryFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>المجموع الكلي:</span>
                <span className="text-primary">{formatIQD(grandTotal)}</span>
              </div>
            </div>

            <Button onClick={handleContinue} className="w-full" size="lg">
              متابعة للتأكيد
            </Button>
          </div>
        ) : (
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
                  <span className="font-medium">{customerInfo.address}</span>
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
                <span>{formatIQD(deliveryFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>المجموع الكلي:</span>
                <span className="text-primary">{formatIQD(grandTotal)}</span>
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
                disabled={!agreed}
              >
                تأكيد الطلب
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
